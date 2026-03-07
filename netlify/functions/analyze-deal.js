export async function handler(event) {
  try {
    const payload = JSON.parse(event.body || "{}");
    const deal = payload.deal || payload;

    const prompt = `
You are Archie, a consumer-focused car deal advisor.

Review this car deal and explain it in plain English.

Vehicle:
${deal.year || ""} ${deal.make || ""} ${deal.model || ""}

Deal type: ${deal.dealType || ""}
MSRP: ${deal.msrp || ""}
Selling price: ${deal.sellingPrice || ""}
APR / Money factor: ${deal.apr || ""}
Residual: ${deal.residual || ""}
Doc fee: ${deal.docFee || ""}
Add-ons: ${deal.addons || ""}
Extra notes: ${deal.notes || ""}

Please format your answer with:
1. Overall Take
2. What Looks Normal
3. What Looks Questionable
4. What To Ask Next

Keep it concise, useful, and buyer-friendly.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are Archie, a helpful expert on car deals.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    const json = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
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