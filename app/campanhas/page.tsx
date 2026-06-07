"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Calendar, Clover, Ticket, MapPin } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function CampanhasPage() {
  const [campanhas, setCampanhas] = useState<any[]>([]);

  useEffect(() => {
    async function carregarCampanhas() {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .neq("status", "ARQUIVADA")
        .order("id", { ascending: false });

      if (error) {
        console.error("Erro ao buscar campanhas:", error);
        return;
      }

      setCampanhas(data ?? []);
    }

    carregarCampanhas();
  }, []);



  
const campanhasVisiveis = campanhas.filter(
  (campanha) => campanha.status !== "ARQUIVADA"
);

const campanhasAtivas = campanhasVisiveis.filter(
  (campanha) => campanha.status === "ATIVA"
);

const campanhasEmBreve = campanhasVisiveis.filter(
  (campanha) => campanha.status === "EM_BREVE"
);

const campanhasEncerradas = campanhasVisiveis.filter(
  (campanha) => campanha.status === "ENCERRADA"
);


function SecaoCampanhas({
  titulo,
  descricao,
  lista,
}: {
  titulo: string;
  descricao: string;
  lista: any[];
}) {
  if (lista.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="mb-6">
        <h2 className="text-4xl font-black">{titulo}</h2>
        <p className="text-white/60 mt-2">{descricao}</p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {lista.map((campanha) => (
          <article
            key={campanha.id}
            onClick={() => {
              window.location.href = `/campanha/${campanha.id}`;
            }}
           className="group w-full rounded-[2rem] bg-white/10 border border-white/15 overflow-hidden shadow-2xl cursor-pointer hover:-translate-y-1 transition duration-300"
          >
            <div className="relative h-96 overflow-hidden">
              <img
                src={campanha.imagem || "/logo.png"}
                alt={campanha.destino || campanha.titulo}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#061832] via-[#061832]/30 to-transparent" />

              <div
                className={`absolute top-4 left-4 rounded-full px-4 py-2 text-xs font-black ${
                  campanha.status === "ENCERRADA"
                    ? "bg-red-500 text-white"
                    : campanha.status === "EM_BREVE"
                    ? "bg-yellow-400 text-[#061832]"
                    : "bg-[#23C997] text-[#061832]"
                }`}
              >
                {campanha.status === "ENCERRADA"
                  ? "🏆 ENCERRADA"
                  : campanha.status === "EM_BREVE"
                  ? "⏳ EM BREVE"
                  : "🍀 CAMPANHA ATIVA"}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-white/70 text-sm font-black">
                  {campanha.destino || "Destino"}
                </p>

                <h3 className="text-4xl font-black mt-1 leading-tight">
                  {campanha.titulo}
                </h3>
              </div>
            </div>

            <div className="p-6">
              <p className="text-white/60 line-clamp-2 min-h-[48px]">
                {campanha.descricao_curta ||
                  "Uma experiência especial para transformar sorte em memória."}
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
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `/campanha/${campanha.id}`;
                }}
                className="mt-6 w-full rounded-2xl bg-[#23C997] text-[#061832] py-4 font-black hover:scale-[1.02] transition"
              >
                {campanha.status === "ENCERRADA"
                  ? "Ver resultado"
                  : campanha.status === "EM_BREVE"
                  ? "Ver detalhes"
                  : "Participar"}
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
  return (
    <main className="min-h-screen bg-[#061832] text-white px-5 py-10">
      <SiteHeader />
      <div className="max-w-7xl mx-auto">
        <a href="/" className="text-[#23C997] font-black">
          ← Voltar para o início
        </a>

        <section className="mt-10 rounded-[2.5rem] bg-white/10 border border-white/15 p-8 md:p-12 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(35,201,151,.25),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(30,136,229,.25),transparent_35%)]" />

          <div className="relative z-10 max-w-3xl">
            <p className="text-[#23C997] font-black">
              CAMPANHAS DISPONÍVEIS
            </p>

            <h1 className="text-5xl md:text-7xl font-black leading-[0.95] mt-3">
              Escolha seu próximo destino.
            </h1>

            <p className="text-white/60 mt-5 text-lg md:text-xl leading-relaxed">
              Participe das campanhas, receba seus PASS-IDs digitais,
              acumule milhas e acompanhe os resultados oficiais pela
              Loteria Federal.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-4xl font-black">
                Experiências em aberto
              </h2>

              <p className="text-white/60 mt-2">
                Veja as campanhas disponíveis e escolha onde sua sorte pode te levar.
              </p>
            </div>

            <div className="rounded-full bg-white/10 border border-white/15 px-5 py-3 font-black text-white/70">
              {campanhas.length} campanha{campanhas.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="space-y-16">
  <SecaoCampanhas
    titulo="🍀 Campanhas Ativas"
    descricao="Participe agora e garanta seus PASS-IDs."
    lista={campanhasAtivas}
  />

  <SecaoCampanhas
    titulo="⏳ Em Breve"
    descricao="Experiências que estarão disponíveis em breve."
    lista={campanhasEmBreve}
  />

  <SecaoCampanhas
    titulo="🏆 Encerradas"
    descricao="Campanhas finalizadas e resultados já apurados."
    lista={campanhasEncerradas}
  />
</div>

          {campanhas.length === 0 && (
            <div className="rounded-[2rem] bg-white/10 border border-white/15 p-8 mt-10 text-center">
              <h2 className="text-2xl font-black">
                Nenhuma campanha disponível.
              </h2>

              <p className="text-white/60 mt-2">
                Novas experiências serão publicadas em breve.
              </p>
            </div>
          )}
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}

function MiniInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
      <div className="text-[#23C997] w-5 h-5">
        {icon}
      </div>

      <p className="text-white/40 text-xs mt-3">
        {label}
      </p>

      <p className="font-black text-sm mt-1 truncate">
        {value}
      </p>
    </div>
  );
}