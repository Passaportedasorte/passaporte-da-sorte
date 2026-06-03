import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é Jade, assistente virtual do Passaporte da Sorte. Responda em português, com clareza, simpatia e sem inventar informações.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return Response.json({
      answer: response.choices[0]?.message?.content || "Não consegui responder.",
    });
  } catch (error: any) {
  console.error("ERRO OPENAI:", error);

  return Response.json(
    {
      answer: `Erro da Jade: ${error?.message || "erro desconhecido"}`,
    },
    { status: 200 }
  );
}
}