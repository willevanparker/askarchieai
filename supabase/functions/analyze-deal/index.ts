import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { filePath, sessionId } = await req.json();
    console.log("Analyzing deal for file:", filePath);

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get the file from storage
    const { data: fileData, error: fileError } = await supabaseClient
      .storage
      .from("deal-documents")
      .download(filePath);

    if (fileError) {
      console.error("Error downloading file:", fileError);
      throw new Error("Failed to download file");
    }

    // Convert file to base64 - handle large files properly
    const arrayBuffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Convert to base64 in chunks to avoid stack overflow
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    const base64File = btoa(binary);
    
    // Determine mime type
    const mimeType = filePath.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 
                     filePath.toLowerCase().endsWith('.png') ? 'image/png' :
                     'image/jpeg';

    console.log("Calling Lovable AI for analysis...");

    // Call Lovable AI with vision capabilities
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content: `You are Archie, a friendly and wise car deal advisor. Analyze dealership quotes and provide:
1. A numerical rating out of 10 (e.g., 8.4)
2. A short verdict (e.g., "Good Deal", "Fair Deal", "Overpriced")
3. A summary (2-3 sentences about the deal quality, pricing, fees, discounts)
4. A specific negotiation tip (one actionable recommendation to improve the deal)

CRITICAL TONE GUIDELINES:
- Never use assertive or confrontational language
- Avoid words like "demand," "insist," or "refuse"
- Instead, use calm, advisory phrasing such as "ask if," "consider requesting," or "you might try"
- Sound like a friendly, wise auto advisor — confident but approachable
- Always explain reasoning briefly, and focus on clarity over authority

Be practical and consumer-focused. Focus on fees, add-ons, and pricing compared to market averages.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this car dealership quote and provide a rating, verdict, summary, and negotiation tip."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${base64File}`
                }
              }
            ]
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_deal_analysis",
              description: "Provide structured analysis of a car deal",
              parameters: {
                type: "object",
                properties: {
                  rating: {
                    type: "number",
                    description: "Numerical rating out of 10 (e.g., 8.4)"
                  },
                  verdict: {
                    type: "string",
                    description: "Short verdict like 'Good Deal', 'Fair Deal', 'Overpriced'"
                  },
                  summary: {
                    type: "string",
                    description: "2-3 sentence summary of the deal quality"
                  },
                  negotiation_tip: {
                    type: "string",
                    description: "One specific, actionable negotiation tip"
                  }
                },
                required: ["rating", "verdict", "summary", "negotiation_tip"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "provide_deal_analysis" } }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error("AI analysis failed");
    }

    const aiData = await aiResponse.json();
    console.log("AI response received:", JSON.stringify(aiData));

    // Extract the tool call result
    const toolCall = aiData.choices[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No analysis returned from AI");
    }

    const analysis = JSON.parse(toolCall.function.arguments);
    console.log("Parsed analysis:", analysis);

    // Save analysis to database
    const { data: savedAnalysis, error: dbError } = await supabaseClient
      .from("deal_analyses")
      .insert({
        session_id: sessionId,
        file_path: filePath,
        rating: analysis.rating,
        verdict: analysis.verdict,
        summary: analysis.summary,
        negotiation_tip: analysis.negotiation_tip,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to save analysis");
    }

    console.log("Analysis saved successfully");

    return new Response(
      JSON.stringify({
        analysisId: savedAnalysis.id,
        rating: analysis.rating,
        verdict: analysis.verdict,
        summary: analysis.summary,
        negotiation_tip: analysis.negotiation_tip,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-deal:", error);
    const errorMessage = error instanceof Error ? error.message : "Analysis failed";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
