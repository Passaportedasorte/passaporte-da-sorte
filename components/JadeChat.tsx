"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export default function JadeChat() {
  const [aberto, setAberto] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mensagens, setMensagens] = useState([
  {
    role: "jade",
    text: `🍀 Olá! Eu sou a Jade.

Posso ajudar com:

✈️ Campanhas
🎟️ PASS-IDs
🍀 Milhas
💚 Clube Passaporte
📋 Compras e painel

Como posso ajudar?`,
  },
]);

  async function enviarMensagem() {
    if (!mensagem.trim()) return;

    const textoUsuario = mensagem;

    setMensagens((prev) => [
      ...prev,
      { role: "user", text: textoUsuario },
    ]);

    setMensagem("");
    setCarregando(true);

    try {
      const res = await fetch("/api/jade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: textoUsuario,
        }),
      });

      const data = await res.json();

      setMensagens((prev) => [
        ...prev,
        {
          role: "jade",
          text: data.answer || "Não consegui responder agora.",
        },
      ]);
    } catch {
      setMensagens((prev) => [
        ...prev,
        {
          role: "jade",
          text: "Tive um problema para responder. Tente novamente em instantes.",
        },
      ]);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setAberto(true)}
        className="fixed bottom-5 right-5 z-[9999] rounded-full bg-[#23C997] text-[#061832] w-16 h-16 flex items-center justify-center shadow-2xl hover:scale-105 transition"
      >
        <MessageCircle className="w-8 h-8" />
      </button>

      {aberto && (
        <div className="fixed bottom-24 right-5 z-[9999] w-[calc(100vw-2.5rem)] max-w-md rounded-[2rem] bg-[#061832] border border-white/15 shadow-2xl overflow-hidden">
          <div className="bg-[#23C997] text-[#061832] p-5 flex items-center justify-between">
            <div>
              <h2 className="font-black text-xl">🍀 Jade</h2>
              <p className="text-sm font-bold opacity-80">
                Assistente do Passaporte da Sorte
              </p>
            </div>

            <button onClick={() => setAberto(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="h-96 overflow-y-auto p-5 space-y-4">
            {mensagens.map((msg, index) => (
              <div
                key={index}
                className={`rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#23C997] text-[#061832] ml-10"
                    : "bg-white/10 text-white mr-10"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {carregando && (
              <div className="rounded-2xl p-4 text-sm bg-white/10 text-white mr-10">
                Jade está digitando...
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10 flex gap-3">
            <input
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") enviarMensagem();
              }}
              placeholder="Digite sua dúvida..."
              className="flex-1 rounded-2xl bg-white text-[#061832] px-4 py-3 outline-none"
            />

            <button
              onClick={enviarMensagem}
              disabled={carregando}
              className="rounded-2xl bg-[#23C997] text-[#061832] px-4 font-black disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}