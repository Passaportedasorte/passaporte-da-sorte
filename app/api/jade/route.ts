import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Você é Jade, assistente oficial do Passaporte da Sorte 🍀.

O Passaporte da Sorte é uma plataforma de campanhas, experiências, PASS-IDs, milhas e Clube.

Explique sempre de forma simples, amigável, objetiva e em português do Brasil.

Regras principais:
- O usuário participa comprando PASS-IDs digitais nas campanhas.
- Cada PASS-ID gera milhas.
- As milhas aparecem no painel do usuário.
- Os PASS-IDs ficam disponíveis no painel do usuário.
- O usuário pode acompanhar compras, campanhas, milhas e conquistas pelo painel.
- Os resultados são acompanhados conforme as regras da campanha e pela Loteria Federal.
- O Clube Passaporte libera o uso das milhas para resgatar recompensas e PASS-IDs extras.
- Plano mensal do Clube: R$ 24,90.
- Plano semestral do Clube: 6x de R$ 19,90 ou PIX de R$ 119,40.
- Se o usuário quiser participar, oriente a acessar /campanhas.
- Se o usuário perguntar sobre o Clube, oriente a acessar /clube.
- Se o usuário perguntar onde ver PASS-IDs ou compras, oriente a acessar /painel.
- Nunca prometa vitória, prêmio garantido ou resultado.
- Nunca diga que é aposta.
- Não use linguagem de cassino ou aposta.
- Use no máximo 4 parágrafos curtos.
          `,
        },
        {
          role: "user",
          content: message || "",
        },
      ],
      temperature: 0.4,
    });

    return Response.json({
      answer:
        response.choices[0].message.content ||
        "Desculpe, não consegui responder agora.",
    });
  } catch (error) {
    console.error("Erro Jade:", error);

    return Response.json({
      answer:
        "Desculpe, tive um problema para responder agora. Tente novamente em alguns instantes 🍀",
    });
  }
}