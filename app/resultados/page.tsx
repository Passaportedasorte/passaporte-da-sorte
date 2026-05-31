"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ResultadosPage() {
  const [resultados, setResultados] = useState<any[]>([]);

  useEffect(() => {
    async function carregarResultados() {
      const { data, error } = await supabase
        .from("resultados_federal")
        .select(`
          *,
          campaigns (
            titulo,
            destino
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar resultados:", error);
        return;
      }

      setResultados(data ?? []);
    }

    carregarResultados();
  }, []);

  return (
    <main className="min-h-screen bg-[#061832] text-white px-5 py-10">
      <div className="max-w-6xl mx-auto">
        <a href="/" className="text-[#23C997] font-black">
          ← Voltar
        </a>

        <h1 className="text-5xl font-black mt-8">
          Resultados Oficiais
        </h1>

        <p className="text-white/60 mt-3">
          Confira os resultados apurados com base na Loteria Federal.
        </p>

        <div className="grid md:grid-cols-2 gap-5 mt-10">
          {resultados.map((resultado) => (
            <div
              key={resultado.id}
              className="rounded-[2rem] bg-white/10 border border-white/15 p-6"
            >
              <p className="text-[#23C997] font-black text-sm">
                🏆 Resultado oficial
              </p>

              <h2 className="text-3xl font-black mt-2">
                {resultado.campaigns?.titulo || "Campanha"}
              </h2>

              <p className="text-white/60 mt-1">
                {resultado.campaigns?.destino || "Destino"}
              </p>

              <div className="grid gap-3 mt-6">
                <Info
                  label="Número Federal"
                  value={resultado.numero_sorteado}
                />

                <Info
                  label="PASS-ID vencedor"
                  value={resultado.pass_id_vencedor}
                />

                <Info
                  label="Tipo"
                  value={
                    resultado.tipo_resultado === "EXATO"
                      ? "🎯 Exato"
                      : "📍 Mais próximo"
                  }
                />

                <Info
                  label="Data"
                  value={
                    resultado.created_at
                      ? new Date(resultado.created_at).toLocaleString("pt-BR")
                      : "—"
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {resultados.length === 0 && (
          <div className="rounded-[2rem] bg-white/10 border border-white/15 p-8 mt-10 text-center">
            <h2 className="text-2xl font-black">
              Nenhum resultado publicado ainda.
            </h2>

            <p className="text-white/60 mt-2">
              Assim que uma campanha for apurada, o resultado aparecerá aqui.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
      <p className="text-white/50 text-sm">{label}</p>
      <p className="font-black mt-1">{value}</p>
    </div>
  );
}