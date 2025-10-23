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

    // Deterministic seed derived from file bytes (FNV-1a 32-bit)
    const computeSeed = (bytes: Uint8Array) => {
      let hash = 2166136261 >>> 0;
      for (let i = 0; i < bytes.length; i++) {
        hash ^= bytes[i];
        hash = Math.imul(hash, 16777619) >>> 0;
      }
        return hash;
    };
    const seed = computeSeed(uint8Array);

    console.log("Calling Lovable AI for analysis with seed:", seed);

    // Call Lovable AI with vision capabilities
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        temperature: 0,
        seed,
        messages: [
          {
            role: "system",
            content: `You are Archie, a friendly and wise car deal advisor. Analyze dealership quotes and provide:
1. An INTEGER rating out of 10 (no decimals)
2. A verdict using this mapping:
   - Poor Deal (1-4)
   - Fair Deal (5-6)
   - Good Deal (7-8)
   - Excellent Deal (9-10)
3. A summary (2-3 sentences about the deal quality, pricing, fees, discounts)
4. A specific negotiation tip (one actionable recommendation to improve the deal)
5. Trade-in detection: If you detect any trade-in related terms (e.g., "trade-in," "trade allowance," "trade-in value," "trade-in amount," "vehicle allowance"), include a trade-in note

CRITICAL TONE GUIDELINES:
- Never use assertive or confrontational language
- Avoid words like "demand," "insist," or "refuse"
- Instead, use calm, advisory phrasing such as "ask if," "consider requesting," or "you might try"
- Sound like a friendly, wise auto advisor — confident but approachable
- Always explain reasoning briefly, and focus on clarity over authority

IMPORTANT PRICING FLAGS:
- If you see "Market Value Selling Price" (MVSP), flag this prominently in your analysis
- MVSP is a dealer-created estimate of what they think the car is worth in today's market
- It's often higher than MSRP and can include mark-ups or add-ons
- The MSRP (Manufacturer's Suggested Retail Price) is set by the manufacturer and is what customers should request to pay
- Suggest the customer review this carefully and consider asking for MSRP-based pricing instead

TRADE-IN DETECTION:
- If you detect any mention of trade-in or related variations (trade allowance, trade-in value, trade-in amount, vehicle allowance), populate the trade_in_note field with: "Recommendation: Verify the trade-in value with a trusted source like Kelley Blue Book (KBB.com) or a third-party appraisal to ensure it's fair."
- If no trade-in is detected, leave trade_in_note as null

Be practical and consumer-focused. Focus on fees, add-ons, and pricing compared to market averages.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this car dealership quote and provide a rating (integer), verdict, summary, and negotiation tip."
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
                  rating: { type: "number", description: "INTEGER rating out of 10 (e.g., 8)" },
                  verdict: { type: "string", description: "Verdict mapped to rating: 'Poor Deal' (1-4), 'Fair Deal' (5-6), 'Good Deal' (7-8), 'Excellent Deal' (9-10)" },
                  summary: { type: "string", description: "2-3 sentence summary of the deal quality" },
                  negotiation_tip: { type: "string", description: "One specific, actionable negotiation tip" },
                  trade_in_note: { type: "string", description: "If trade-in is detected, include the recommendation; otherwise null" }
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

    // Helper to parse malformed provider raw function-call strings
    const parseFromRaw = (raw?: string) => {
      if (!raw) return null as any;
      try {
        const ratingMatch = raw.match(/rating\s*=\s*([0-9]+(?:\.[0-9]+)?)/i);
        const verdictMatch = raw.match(/verdict\s*=\s*'([^']+)'/i);
        const summaryMatch = raw.match(/summary\s*=\s*"([\s\S]*?)"/i);
        const tipMatch = raw.match(/negotiation_tip\s*=\s*'([\s\S]*?)'/i);
        const tradeMatch = raw.match(/trade_in_note\s*=\s*'([\s\S]*?)'/i);
        const rating = ratingMatch ? parseFloat(ratingMatch[1]) : undefined;
        if (rating === undefined || !verdictMatch || !summaryMatch || !tipMatch) return null as any;
        return {
          rating,
          verdict: verdictMatch[1],
          summary: summaryMatch[1],
          negotiation_tip: tipMatch[1],
          trade_in_note: tradeMatch ? tradeMatch[1] : null,
        };
      } catch (_) { return null as any; }
    };

    // Attempt 1: parse tool call output
    let analysis: any | null = null;
    const choice = aiData.choices?.[0];

    if (choice?.message?.tool_calls?.[0]?.function?.arguments) {
      try {
        analysis = JSON.parse(choice.message.tool_calls[0].function.arguments);
      } catch (e) {
        console.warn("Failed to parse tool call arguments, will try fallbacks.", e);
      }
    }

    // Attempt 1b: if provider returned an error, try to salvage from raw
    if (!analysis && choice?.error) {
      console.error("AI provider error:", choice.error);
      const raw = (choice.error as any)?.metadata?.raw as string | undefined;
      const parsed = parseFromRaw(raw);
      if (parsed) {
        console.log("Recovered analysis from provider raw output.");
        analysis = parsed;
      }
    }

    // Attempt 2: Retry without tools, force pure JSON response
    if (!analysis) {
      console.log("Retrying AI analysis without tools using JSON-only prompt...");
      const fallbackRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          temperature: 0,
          seed,
          messages: [
            {
              role: "system",
              content:
                "Return ONLY valid JSON matching this shape: { rating: number (integer 0-10), verdict: string, summary: string, negotiation_tip: string, trade_in_note?: string|null }. No prose, no code fences.",
            },
            {
              role: "user",
              content: [
                { type: "text", text: "Analyze this car dealership quote and output strictly the JSON with integer rating (no decimals)." },
                { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64File}` } },
              ],
            },
          ],
        }),
      });

      if (fallbackRes.ok) {
        const fb = await fallbackRes.json();
        const fbChoice = fb.choices?.[0];
        let text = fbChoice?.message?.content ?? "";
        if (typeof text !== "string") text = JSON.stringify(text ?? "");
        const cleaned = text.replace(/```json|```/g, "").trim();
        try {
          analysis = JSON.parse(cleaned);
        } catch (e) {
          console.error("Fallback JSON parse failed:", cleaned);
        }
      } else {
        console.error("Fallback request failed: ", await fallbackRes.text());
      }
    }

    if (!analysis) {
      throw new Error("AI analysis failed: Provider returned error");
    }

    // Normalize rating to deterministic integer and map verdict
    const ratingInt = Math.max(0, Math.min(10, Math.round(Number(analysis.rating))));
    const verdictFromRating = ratingInt <= 4 ? "Poor Deal"
      : ratingInt <= 6 ? "Fair Deal"
      : ratingInt <= 8 ? "Good Deal"
      : "Excellent Deal";
    analysis.rating = ratingInt;
    analysis.verdict = verdictFromRating;

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
        trade_in_note: analysis.trade_in_note || null,
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
        trade_in_note: analysis.trade_in_note || null,
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
