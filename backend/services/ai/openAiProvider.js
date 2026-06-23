const extractText = (response) => {
  if (response.output_text) return response.output_text;
  return response.output
    ?.flatMap((item) => item.content || [])
    .find((item) => item.type === "output_text")?.text;
};

// The provider boundary keeps controllers independent from OpenAI so another
// provider can be introduced without changing product routes or persistence.
export const generateAiJson = async ({ system, input }) => {
  if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_MODEL) {
    const error = new Error("AI service is not configured");
    error.status = 503;
    throw error;
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL,
      instructions: `${system}\nReturn valid JSON only, without markdown fences.`,
      input,
    }),
  });

  if (!response.ok) {
    const error = new Error("AI provider request failed");
    error.status = response.status >= 500 ? 503 : 400;
    throw error;
  }

  const payload = await response.json();
  const text = extractText(payload);
  if (!text) throw new Error("AI provider returned an empty response");
  return {
    output: JSON.parse(text),
    provider: "openai",
    model: process.env.OPENAI_MODEL,
  };
};
