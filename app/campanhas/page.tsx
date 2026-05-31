"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CampanhasPage() {
  const [campanhas, setCampanhas] = useState<any[]>([]);

  useEffect(() => {
    async function carregarCampanhas() {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Erro ao buscar campanhas:", error);
        return;
      }

      setCampanhas(data ?? []);
    }

    carregarCampanhas();
  }, []);

  return (
    <main className="min-h-screen bg-[#061832] text-white px-5 py-10">
      <div className="max-w-7xl mx-auto">
        <a href="/" className="text-[#23C997] font-black">
          ← Voltar
        </a>

        <h1 className="text-5xl font-black mt-8">
          Campanhas
        </h1>

        <p className="text-white/60 mt-3">
          Escolha uma campanha e garanta seus PASS-IDs.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {campanhas.map((campanha) => (
            <div
              key={campanha.id}
              className="rounded-[2rem] bg-white/10 border border-white/15 overflow-hidden shadow-2xl"
            >
              <img
                src={campanha.imagem || "/logo.png"}
                alt={campanha.destino}
                className="w-full h-60 object-cover"
              />

              <div className="p-6">
                <p className="text-[#23C997] font-black text-sm">
                  CAMPANHA DISPONÍVEL
                </p>

                <h2 className="text-3xl font-black mt-2">
                  {campanha.titulo}
                </h2>

                <p className="text-white/60 mt-1">
                  {campanha.destino}
                </p>

                <div className="flex flex-wrap gap-2 mt-5">
                  <span className="rounded-full bg-[#23C997] text-[#061832] px-4 py-2 text-sm font-black">
                    R$ {campanha.preco}
                  </span>

                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-black">
                    🍀 {campanha.milhas} milhas
                  </span>

                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-black">
                    📅 {campanha.data_sorteio || "Em breve"}
                  </span>
                </div>

                <button
                  onClick={() => {
                    window.location.href = `/campanha/${campanha.id}`;
                  }}
                  className="mt-6 w-full rounded-2xl bg-[#23C997] text-[#061832] py-4 font-black hover:scale-[1.02] transition"
                >
                  Ver campanha
                </button>
              </div>
            </div>
          ))}
        </div>

        {campanhas.length === 0 && (
          <div className="rounded-[2rem] bg-white/10 border border-white/15 p-8 mt-10 text-center">
            <h2 className="text-2xl font-black">
              Nenhuma campanha disponível.
            </h2>
          </div>
        )}
      </div>
    </main>
  );
}