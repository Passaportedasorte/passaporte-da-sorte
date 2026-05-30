"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RedefinirSenhaPage() {
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function salvarNovaSenha() {
    if (!senha.trim()) {
      alert("Digite sua nova senha.");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não conferem.");
      return;
    }

    try {
      setLoading(true);

      const { error } = await supabase.auth.updateUser({
        password: senha,
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert("Senha redefinida com sucesso!");
      window.location.href = "/";
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#061832] text-white flex items-center justify-center px-5">
      <div className="w-full max-w-md rounded-[2rem] bg-white/10 border border-white/15 p-8 shadow-2xl">
        <div className="flex justify-center mb-6">
          <img
            src="/logo.png"
            alt="Passaporte da Sorte"
            className="w-20 h-20 object-contain"
          />
        </div>

        <h1 className="text-3xl font-black text-center">
          Redefinir senha
        </h1>

        <p className="text-white/60 text-center mt-3">
          Digite sua nova senha para acessar sua conta.
        </p>

        <div className="grid gap-3 mt-6">
          <input
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            type="password"
            placeholder="Nova senha"
            className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
          />

          <input
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            type="password"
            placeholder="Confirmar nova senha"
            className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
          />

          <button
            onClick={salvarNovaSenha}
            disabled={loading}
            className="rounded-2xl bg-[#23C997] text-[#061832] font-black py-3 disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar nova senha"}
          </button>
        </div>

        <button
          onClick={() => {
            window.location.href = "/";
          }}
          className="w-full mt-4 text-white/50 hover:text-white text-sm font-bold"
        >
          Voltar para o início
        </button>
      </div>
    </main>
  );
}