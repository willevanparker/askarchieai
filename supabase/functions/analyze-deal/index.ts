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
            content: `You are Archie — a friendly, knowledgeable automotive AI assistant trained to analyze car purchase and lease deals using real industry logic and transparent consumer advocacy.

Your goal is to help users understand the fairness and structure of their car deal by referencing the "Immutable Laws of Car Buying."

LEASE DEAL STRUCTURE — 5 Categories:
1. **Selling Price (Agreed-Upon Value)**: Should be ≤ MSRP. Lower is better. Flag if > MSRP.
2. **Capitalized Cost Reduction (Down Payment, Trade Equity, Rebates)**: Explain sources. Warn that large down payments on leases are risky.
3. **Residual Value**: Set by bank, cannot be negotiated. Higher residual = lower payment. Flag if unusually low.
4. **Money Factor (Interest Rate Equivalent)**: Convert to APR by multiplying by 2400. Flag inflated rates beyond buy rate.
5. **Add-ons / Roll-ins**: Review for unnecessary or overpriced extras (paint protection, nitrogen, etching, gap insurance, prepaid maintenance).

PURCHASE DEAL STRUCTURE — 4 Categories:
1. **Selling Price**: Should be ≤ MSRP. Flag if > MSRP.
2. **Cash Down / Trade Equity / Incentives**: Review all sources. Confirm rebates are properly applied.
3. **Interest Rate / APR**: Explain if competitive for credit tier. Flag inflated dealer financing.
4. **Add-ons / Extras**: Evaluate for necessity and value (see list above). Remind most can be declined.

TRADE-IN VALUE:
- Always instruct to verify independently via KBB, TrueCar, Edmunds, or CarGurus
- Explain dealers often reduce trade value to hide profit elsewhere
- Encourage comparing vs. private sale or third-party offers (CarMax, Carvana)

OUTPUT STRUCTURE:
1. Deal Type: "lease" or "purchase"
2. An INTEGER rating out of 10 (no decimals)
3. A verdict using this mapping:
   - Poor Deal (1-4)
   - Fair Deal (5-6)
   - Good Deal (7-8)
   - Excellent Deal (9-10)
4. Categories: For each category, provide clear, concise commentary noting what looks normal, what's questionable, and what action the customer should take
5. Trade-in detection: If you detect any trade-in related terms, include a trade-in note
6. A specific negotiation tip (one actionable recommendation)

CRITICAL TONE GUIDELINES:
- Never use assertive or confrontational language
- Avoid words like "demand," "insist," or "refuse"
- Instead, use calm, advisory phrasing such as "ask if," "consider requesting," or "you might try"
- Sound like a friendly, wise auto advisor — confident but approachable
- Always explain reasoning briefly, and focus on clarity over authority

Be practical and consumer-focused.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this car dealership quote. First determine if it's a LEASE or PURCHASE deal, then provide category-based analysis according to the structure defined in your instructions."
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
              description: "Provide structured category-based analysis of a car deal",
              parameters: {
                type: "object",
                properties: {
                  deal_type: { type: "string", enum: ["lease", "purchase"], description: "Type of deal" },
                  rating: { type: "number", description: "INTEGER rating out of 10 (e.g., 8)" },
                  verdict: { type: "string", description: "Verdict mapped to rating: 'Poor Deal' (1-4), 'Fair Deal' (5-6), 'Good Deal' (7-8), 'Excellent Deal' (9-10)" },
                  categories: {
                    type: "array",
                    description: "Category-based breakdown. 5 for lease (Selling Price, Cap Cost Reduction, Residual Value, Money Factor, Add-ons), 4 for purchase (Selling Price, Cash Down/Trade/Incentives, Interest Rate, Add-ons)",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Category name" },
                        analysis: { type: "string", description: "Analysis for this category" }
                      },
                      required: ["name", "analysis"]
                    }
                  },
                  negotiation_tip: { type: "string", description: "One specific, actionable negotiation tip" },
                  trade_in_note: { type: "string", description: "If trade-in is detected, include the recommendation; otherwise null" }
                },
                required: ["deal_type", "rating", "verdict", "categories", "negotiation_tip"],
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
        const dealTypeMatch = raw.match(/deal_type\s*=\s*'(lease|purchase)'/i);
        const tipMatch = raw.match(/negotiation_tip\s*=\s*'([\s\S]*?)'/i);
        const tradeMatch = raw.match(/trade_in_note\s*=\s*'([\s\S]*?)'/i);
        const rating = ratingMatch ? parseFloat(ratingMatch[1]) : undefined;
        if (rating === undefined || !verdictMatch || !dealTypeMatch || !tipMatch) return null as any;
        return {
          deal_type: dealTypeMatch[1],
          rating,
          verdict: verdictMatch[1],
          categories: [],
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
                "Return ONLY valid JSON matching this shape: { deal_type: 'lease'|'purchase', rating: number (integer 0-10), verdict: string, categories: [{name: string, analysis: string}], negotiation_tip: string, trade_in_note?: string|null }. No prose, no code fences.",
            },
            {
              role: "user",
              content: [
                { type: "text", text: "Analyze this car dealership quote. Determine if it's a LEASE or PURCHASE, then provide category-based analysis as JSON with integer rating (no decimals)." },
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
        deal_type: analysis.deal_type || "purchase",
        rating: analysis.rating,
        verdict: analysis.verdict,
        categories: JSON.stringify(analysis.categories || []),
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
        deal_type: analysis.deal_type || "purchase",
        rating: analysis.rating,
        verdict: analysis.verdict,
        categories: analysis.categories || [],
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
