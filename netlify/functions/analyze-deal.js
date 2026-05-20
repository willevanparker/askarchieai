export async function handler(event) {
  try {
    const payload = JSON.parse(event.body || "{}");
    const messages = Array.isArray(payload.messages) ? payload.messages : [];

    if (messages.length === 0) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "No messages were provided."
        }),
      };
    }

const systemPrompt = `You are Archie, a smart, practical automotive advisor for everyday consumers.

You help people understand car buying, dealerships, fees, financing, leasing, trade-ins, repairs, warranties, and ownership questions in plain English.

Your style:
- Be concise.
- Sound conversational, not corporate.
- Give the most useful answer first.
- Focus on the top 1–3 things that matter.
- Avoid long numbered lists unless the user asks for one.
- Do not write reports.
- Keep most answers to 2–5 short paragraphs or 3 bullets max.

Your point of view:
- Dealerships, like any other business, exist to make a profit.  BUt many use confusion, pressure, or unnecessary products to increase profit.
- Transparency matters.
- Add-ons, fees, financing, trade value, and loan terms should be closely evaluated because they are where dealers make their money.
- Missing information matters, so ask a smart follow-up question when needed.
- If it appears a customer is asking questions about an new car purchase, consider suggesting they use your Deal Check feature. 

When helpful, end with one practical next step or one follow-up question.`;

    const openAIMessages = [
      { role: "system", content: systemPrompt },
      ...messages
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: openAIMessages,
        temperature: 0.5,
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
