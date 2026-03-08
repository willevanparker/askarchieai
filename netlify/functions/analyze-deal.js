export async function handler(event) {
  try {
    const payload = JSON.parse(event.body || "{}");
    const mode = payload.mode || payload.deal?.mode || "deal";
    const deal = payload.deal || {};
    const messages = payload.messages || [];
    const isFollowup = payload.followup === true;

    let systemPrompt = "";
    let contextPrompt = "";

    // Determine likely vehicle condition based on year
    const currentYear = new Date().getFullYear();
    const vehicleYearNum = Number(deal.year);
    const likelyUsed = !Number.isNaN(vehicleYearNum) && vehicleYearNum < currentYear;

    if (mode === "deal") {
      systemPrompt = `You are Archie, a smart, consumer-focused car buying and selling advisor. 
Be clear, practical, confident, and conversational.
Do not sound alarmist or anti-dealer.
Help the user understand how the deal works and what to ask next.

Archie follows these evaluation principles:

1. Do not assume a deal is good or bad based on a single number. A monthly payment alone is not enough information to evaluate a deal. Focus on the full deal structure including price, term, APR, and fees.

2. Compare selling price to MSRP primarily for new or current-model-year vehicles. For used vehicles, treat depreciation as normal. A price below the original MSRP alone does not indicate a strong deal.

3. Focus on total deal transparency, including fees, add-ons, financing terms, and missing details.

4. Dealer-installed add-ons are usually optional and often high-margin products. Explain that buyers can often request removal or negotiate them.

5. Dealer profit can sometimes shift. A discount in one part of the deal may be offset by higher fees elsewhere. Encourage users to look at the overall structure of the deal.

6. Dealers can manipulate various parts of the deal. They can inflate interest rates (keeping the difference as profit), reduce lease residuals (keeping the difference as profit), and more. Encourage users to verify key aspects of a deal with authoritative sources. 

7. If important details are missing (taxes, fees, trade terms, APR, etc.), explain that the deal cannot be fully evaluated yet.

8. Maintain a balanced tone. Avoid alarmist language or assuming bad intent. Focus on helping the user understand how the deal works.

9. Help the user understand what questions to ask next when evaluating the deal.

10. Prioritize clarity and practical advice over technical jargon. Explain concepts in plain English.`;

      contextPrompt = `
Here is the current deal context:

Vehicle: ${deal.year || ""} ${deal.make || ""} ${deal.model || ""}
Vehicle condition: ${likelyUsed ? "Likely used vehicle" : "Likely new vehicle"}
Current year: ${currentYear}

Deal type: ${deal.dealType || ""}
State: ${deal.state || ""}

MSRP: ${deal.msrp || ""}
Selling price: ${deal.sellingPrice || ""}
APR / Money factor: ${deal.apr || ""}
Residual: ${deal.residual || ""}
Doc fee: ${deal.docFee || ""}
Add-ons: ${deal.addons || deal.addOns || ""}

Extra notes: ${deal.notes || ""}
      `.trim();
    }

    if (mode === "service") {
      systemPrompt = `You are Archie, a smart, consumer-focused automotive service and repair advisor.
Help the user understand maintenance timing, repair recommendations, service quotes, and what questions to ask.
Be practical, calm, and specific.
Do not assume the shop is dishonest.
Do not repeat the full context in follow-ups unless needed.`;

      contextPrompt = `
Here is the current service context:

Vehicle: ${deal.year || ""} ${deal.make || ""} ${deal.model || ""}
Mileage: ${deal.mileage || ""}
Quote total: ${deal.quoteTotal || ""}
Quoted services or repairs: ${deal.serviceItems || ""}
Notes: ${deal.notes || ""}
      `.trim();
    }

    if (mode === "chat") {
      systemPrompt = `You are Archie, a smart, friendly automotive companion.
Help with general car questions about buying, ownership, maintenance, terminology, lease vs finance, repairs, and next steps.
Be conversational, concise, and useful.`;

      contextPrompt = `General car question mode.`;
    }

    let openAIMessages = [
      { role: "system", content: systemPrompt },
      { role: "system", content: contextPrompt }
    ];

    if (isFollowup && messages.length > 0) {
      openAIMessages = openAIMessages.concat(messages);
    } else {
      if (mode === "deal") {
        openAIMessages.push({
          role: "user",
          content: `Review this car deal and respond in this format:

1. Overall Take
2. What Looks Normal
3. What Looks Questionable
4. What To Ask Next

Keep it concise, useful, and buyer-friendly.`
        });
      }

      if (mode === "service") {
        openAIMessages.push({
          role: "user",
          content: `Review this service situation and respond in this format:

1. Overall Take
2. What Looks Routine or Reasonable
3. What May Be Optional or Worth Asking About
4. What To Ask Next

Keep it concise, practical, and easy to understand.`
        });
      }

      if (mode === "chat") {
        openAIMessages = openAIMessages.concat(messages);
      }
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: openAIMessages,
        temperature: 0.7,
      }),
    });

    const json = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: json.error?.message || "OpenAI request failed",
          raw: json,
        }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reply: json.choices?.[0]?.message?.content || "No reply returned.",
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message }),
    };
  }
}
