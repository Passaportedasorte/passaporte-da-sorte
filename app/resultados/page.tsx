"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Calendar, Trophy, Ticket, Target } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

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
            destino,
            imagem
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
      <SiteHeader />
      <div className="max-w-7xl mx-auto">
        <a href="/" className="text-[#23C997] font-black">
          ← Voltar para o início
        </a>

        <section className="mt-10 rounded-[2.5rem] bg-white/10 border border-white/15 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(35,201,151,.25),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(30,136,229,.25),transparent_35%)]" />

          <div className="relative z-10 max-w-4xl">
            <p className="text-[#23C997] font-black">
              RESULTADOS OFICIAIS
            </p>

            <h1 className="text-5xl md:text-7xl font-black leading-[0.95] mt-3">
              Transparência em cada sorteio.
            </h1>

            <p className="text-white/60 mt-5 text-lg md:text-xl leading-relaxed">
              Confira os resultados apurados com base nos números da Loteria Federal
              e acompanhe os PASS-IDs vencedores de cada campanha.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-4xl font-black">
                Histórico de resultados
              </h2>

              <p className="text-white/60 mt-2">
                Todos os resultados publicados ficam registrados para consulta.
              </p>
            </div>

            <div className="rounded-full bg-white/10 border border-white/15 px-5 py-3 font-black text-white/70">
              {resultados.length} resultado{resultados.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            {resultados.map((resultado) => (
              <article
                key={resultado.id}
                className="rounded-[2rem] bg-white/10 border border-white/15 overflow-hidden shadow-2xl"
              >
                {resultado.campaigns?.imagem && (
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={resultado.campaigns.imagem}
                      alt={resultado.campaigns?.destino || "Campanha"}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#061832] via-[#061832]/40 to-transparent" />

                    <div className="absolute top-4 left-4 rounded-full bg-[#23C997] text-[#061832] px-4 py-2 text-xs font-black">
                      🏆 RESULTADO OFICIAL
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-white/70 font-black text-sm">
                        {resultado.campaigns?.titulo || "Campanha"}
                      </p>

                      <h2 className="text-4xl font-black">
                        {resultado.campaigns?.destino || "Destino"}
                      </h2>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {!resultado.campaigns?.imagem && (
                    <>
                      <p className="text-[#23C997] font-black text-sm">
                        🏆 Resultado oficial
                      </p>

                      <h2 className="text-3xl font-black mt-2">
                        {resultado.campaigns?.titulo || "Campanha"}
                      </h2>

                      <p className="text-white/60 mt-1">
                        {resultado.campaigns?.destino || "Destino"}
                      </p>
                    </>
                  )}

                  {resultado.nome_vencedor && (
  <div className="rounded-[2rem] bg-[#23C997] text-[#061832] p-6 mt-4">
    <p className="text-sm font-black opacity-70">
      🏆 VENCEDOR
    </p>

    <h2 className="text-4xl font-black">
      {resultado.nome_vencedor}
    </h2>

    <p className="text-lg opacity-80">
      {resultado.cidade_vencedor}
    </p>
  </div>
)}

                  <div className="grid md:grid-cols-2 gap-3 mt-6">
                    <Info
                      icon={<Target />}
                      label="Número Federal"
                      value={resultado.numero_sorteado}
                    />


                  
                    <Info
                      icon={<Ticket />}
                      label="PASS-ID vencedor"
                      value={resultado.pass_id_vencedor}
                      destaque
                    />

                    <Info
                      icon={<Trophy />}
                      label="Tipo"
                      value={
                        resultado.tipo_resultado === "EXATO"
                          ? "🎯 Exato"
                          : "📍 Mais próximo"
                      }
                    />

                    <Info
                      icon={<Calendar />}
                      label="Data"
                      value={
                        resultado.created_at
                          ? new Date(resultado.created_at).toLocaleString("pt-BR")
                          : "—"
                      }
                    />
                  </div>
                </div>
              </article>
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
        </section>
      </div>
    </main>
  );
}

function Info({
  icon,
  label,
  value,
  destaque = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: any;
  destaque?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        destaque
          ? "bg-[#23C997] text-[#061832] border-[#23C997]"
          : "bg-white/10 border-white/10"
      }`}
    >
      <div className={destaque ? "text-[#061832]" : "text-[#23C997]"}>
        {icon}
      </div>

      <p className={`text-sm mt-3 ${destaque ? "text-[#061832]/70" : "text-white/50"}`}>
        {label}
      </p>

      <p className="font-black mt-1 text-lg">
        {value || "—"}
      </p>
    </div>
  );
}