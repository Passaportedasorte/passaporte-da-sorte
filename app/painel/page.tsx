"use client";

import React, { useEffect, useState } from "react";
import { QrCode } from "lucide-react";
import { supabase } from "@/lib/supabase";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function Painel() {
  const [user, setUser] = useState<any>(null);
  const [meusPassaportes, setMeusPassaportes] = useState<any[]>([]);
  const [minhasCompras, setMinhasCompras] = useState<any[]>([]);
  const [saldoMilhas, setSaldoMilhas] = useState(0);
const [milhasHistorico, setMilhasHistorico] = useState(0);
const [assinanteClube, setAssinanteClube] = useState(false);
const [modalConquistasAberto, setModalConquistasAberto] = useState(false);
  const [campanhasAtivas, setCampanhasAtivas] = useState(0);

  useEffect(() => {
    async function carregar() {
      
      const { count } = await supabase
  .from("campaigns")
  .select("*", { count: "exact", head: true });

setCampanhasAtivas(count ?? 0);

        const { data } = await supabase.auth.getUser();
      setUser(data.user);

      if (!data.user) return;

      const { data: passaportes } = await supabase
  .from("pass_ids")
  .select(`
  *,
  campaigns (
    destino
  )
`)
  .or(`user_id.eq.${data.user.id},contato.eq.${data.user.email}`)
  .order("created_at", { ascending: false });

setMeusPassaportes(passaportes ?? []);

const { data: compras } = await supabase
  .from("compras")
  .select(`
    *,
    campaigns (
      titulo,
      destino
    )
  `)
  .or(`user_id.eq.${data.user.id},email.eq.${data.user.email}`)
  .order("created_at", { ascending: false });

setMinhasCompras(compras ?? []);


const { data: milhas } = await supabase
  .from("user_miles")
  .select("total_milhas, milhas_historico, assinante_clube")
  .eq("user_id", data.user.id)
  .single();

setSaldoMilhas(milhas?.total_milhas ?? 0);
setMilhasHistorico(milhas?.milhas_historico ?? 0);
setAssinanteClube(milhas?.assinante_clube === true);
    }

    carregar();
  }, []);
const niveis = [
  {
    nome: "Iniciante",
    minimo: 0,
    proximo: 100,
    beneficio: "Comece a acumular milhas e participar das campanhas.",
  },
  {
    nome: "Aventureiro",
    minimo: 100,
    proximo: 500,
    beneficio: "Acesso a benefícios e vantagens promocionais.",
  },
  {
    nome: "Viajante",
    minimo: 500,
    proximo: 1000,
    beneficio: "Cupons exclusivos e vantagens em campanhas selecionadas.",
  },
  {
    nome: "Elite",
    minimo: 1000,
    proximo: 2500,
    beneficio: "Prioridade em ofertas e possíveis PASS-IDs bônus.",
  },
  {
    nome: "Diamante",
    minimo: 2500,
    proximo: null,
    beneficio: "Benefícios especiais e experiências exclusivas.",
  },
];

const nivelAtual =
  niveis
    .slice()
    .reverse()
    .find((nivel) => saldoMilhas >= nivel.minimo) || niveis[0];

const proximoNivel = niveis.find(
  (nivel) => nivel.minimo === nivelAtual.proximo
);

const faltamMilhas = proximoNivel
  ? Math.max(proximoNivel.minimo - saldoMilhas, 0)
  : 0;

const progressoNivel = proximoNivel
  ? ((saldoMilhas - nivelAtual.minimo) /
      (proximoNivel.minimo - nivelAtual.minimo)) *
    100
  : 100;
const [campanhaAberta, setCampanhaAberta] = useState<string | null>(null);   
const [comprasAbertas, setComprasAbertas] = useState(false); 

const passaportesPorCampanha = meusPassaportes.reduce((acc: any, item) => {
  const destino = item.campaigns?.destino || "Campanha";

  if (!acc[destino]) {
    acc[destino] = [];
  }

  acc[destino].push(item);

  return acc;
}, {});

const totalPassIds = meusPassaportes.length;
const totalCampanhas = Object.keys(passaportesPorCampanha).length;

const conquistas = [
  {
    categoria: "Níveis",
    itens: [
      { nome: "Iniciante", emoji: "🌱", atual: milhasHistorico, meta: 0 },
      { nome: "Aventureiro", emoji: "🍀", atual: milhasHistorico, meta: 100 },
      { nome: "Viajante", emoji: "✈️", atual: milhasHistorico, meta: 500 },
      { nome: "Elite", emoji: "👑", atual: milhasHistorico, meta: 1000 },
      { nome: "Diamante", emoji: "💠", atual: milhasHistorico, meta: 2500 },
    ],
  },
  {
    categoria: "PASS-IDs",
    itens: [
      { nome: "Primeiro Embarque", emoji: "🥉", atual: totalPassIds, meta: 1 },
      { nome: "Explorador", emoji: "🥈", atual: totalPassIds, meta: 50 },
      { nome: "Viajante Frequente", emoji: "🥇", atual: totalPassIds, meta: 250 },
      { nome: "Colecionador", emoji: "💎", atual: totalPassIds, meta: 1000 },
      { nome: "Lenda do Passaporte", emoji: "👑", atual: totalPassIds, meta: 5000 },
    ],
  },
  {
    categoria: "Milhas Históricas",
    itens: [
      { nome: "Primeiras Milhas", emoji: "🍀", atual: milhasHistorico, meta: 500 },
      { nome: "Caçador de Destinos", emoji: "🎯", atual: milhasHistorico, meta: 2500 },
      { nome: "Mestre das Milhas", emoji: "🏆", atual: milhasHistorico, meta: 10000 },
      { nome: "Lenda das Milhas", emoji: "👑", atual: milhasHistorico, meta: 50000 },
    ],
  },
  {
  categoria: "Clube",
  itens: [
    {
      nome: "Passaporte Premium",
      emoji: "💚",
      atual: assinanteClube ? 1 : 0,
      meta: 1,
    },
    {
      nome: "Cliente Fiel",
      emoji: "⭐",
      atual: 0,
      meta: 6,
    },
    {
      nome: "Embaixador",
      emoji: "🌟",
      atual: 0,
      meta: 12,
    },
  ],
},
  {
    categoria: "Campanhas",
    itens: [
      { nome: "Explorador do Brasil", emoji: "🔥", atual: totalCampanhas, meta: 5 },
      { nome: "Volta ao Mundo", emoji: "✈️", atual: totalCampanhas, meta: 15 },
      { nome: "Cidadão do Mundo", emoji: "🌍", atual: totalCampanhas, meta: 30 },
    ],
  },
];

const totalConquistas = conquistas.reduce(
  (total, grupo) => total + grupo.itens.length,
  0
);

const conquistasConcluidas = conquistas.reduce(
  (total, grupo) =>
    total + grupo.itens.filter((item) => item.atual >= item.meta).length,
  0
);

  return (
    <main className="min-h-screen bg-[#061832] text-white px-5 md:px-10 py-10">
      <SiteHeader />
      <div className="max-w-7xl mx-auto">
        <a href="/" className="text-white/60 hover:text-white">
          ← Voltar
        </a>

        <h1 className="text-4xl font-black mt-8">Meu Painel</h1>

        <p className="text-white/60 mt-2">
          Acompanhe seus PASS-IDs, milhas e campanhas.
        </p>
        {user && (
  <div className="relative mt-8 rounded-[2rem] bg-[#061832] border border-white/15 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">

    <div className="flex items-center gap-4">
      <img
        src={user.user_metadata?.avatar_url || "/logo.png"}
        alt="Usuário"
        className="w-20 h-20 rounded-2xl object-cover border border-white/20"
      />

      <div>
        <p className="text-white/50 text-sm font-black">Bem-vindo de volta</p>

        <h2 className="text-3xl font-black">
          {user.user_metadata?.full_name}
        </h2>

        <p className="text-white/60 mt-1">
          Viajante Passaporte da Sorte
        </p>
        <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#23C997]/15 px-3 py-1 text-sm font-black text-[#23C997]">
  🍀 Nível {nivelAtual.nome}
</div>
      </div>
    </div>

    <div className="grid md:grid-cols-4 gap-4 mt-6">

  <div
  onClick={() => {
  window.location.href = "/minhas-milhas";
}}
  className="rounded-2xl bg-white/10 border border-white/15 p-4 cursor-pointer hover:scale-105 transition"
>
  <p className="text-xs font-black text-white/50">
    Milhas
  </p>

  <h3 className="text-2xl font-black">
  {saldoMilhas} 🍀
</h3>

<div className="mt-3">
  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
    <div
      className="h-full bg-[#23C997]"
      style={{
        width: `${Math.min(progressoNivel, 100)}%`,
      }}
    />
  </div>

  <p className="text-xs text-white/50 mt-2">
    {proximoNivel
  ? `Faltam ${faltamMilhas} milhas para ${proximoNivel.nome}`
  : "Você chegou ao nível máximo"}
  </p>
</div>
</div>

  <div className="rounded-2xl bg-white/10 border border-white/15 text-white p-5">
    <p className="text-sm font-black text-white/60">
      Meus passaportes
    </p>

    <h2 className="text-3xl font-black mt-1">
      {meusPassaportes.length} 🎟️
    </h2>
  </div>


  <div
  onClick={() => setComprasAbertas(!comprasAbertas)}
  className="rounded-2xl bg-white/10 border border-white/15 text-white p-5 cursor-pointer hover:scale-105 transition"
>
  <p className="text-sm font-black text-white/60">
    Minhas compras
  </p>

  <h2 className="text-3xl font-black mt-1">
    {minhasCompras.length} 🛒
  </h2>

  <p className="text-xs text-white/50 mt-3">
    Clique para ver detalhes
  </p>
</div>
 

   <div
  onClick={() => setModalConquistasAberto(true)}
  className="rounded-2xl bg-white/10 border border-white/15 text-white p-5 cursor-pointer hover:scale-105 transition"
>
  <p className="text-sm font-black text-white/60">
    Conquistas
  </p>

  <h2 className="text-3xl font-black mt-1">
    {conquistasConcluidas}/{totalConquistas} 🏅
  </h2>

  <p className="text-xs text-white/50 mt-3">
    Nível atual: {nivelAtual.nome}
  </p>
</div>

</div>
  </div>
)}

{comprasAbertas && (
    <div className="grid gap-4 mt-6">
      {minhasCompras.map((compra) => (
        <div
          key={compra.id}
          className="rounded-2xl bg-white/5 border border-white/10 p-4"
        >
          <p className="font-black">
            {compra.campaigns?.titulo || "Compra"}
          </p>

          <p className="text-white/60">
            {compra.quantidade} PASS-IDs
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-2">
  <p className="text-[#23C997] font-black">
    R$ {Number(compra.valor_final || compra.valor || 0)
      .toFixed(2)
      .replace(".", ",")}
  </p>

  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black">
    {compra.status === "PAYMENT_RECEIVED" ||
    compra.status === "PAYMENT_CONFIRMED"
      ? "✅ Pago"
      : compra.status === "PENDING" ||
        compra.status === "AWAITING_PAYMENT"
      ? "⏳ Pendente"
      : "❌ Cancelado"}
  </span>
</div>
        </div>
      ))}
    </div>
  )}

        <div className="mt-10">
  <h2 className="text-3xl font-black">
    Minhas Campanhas
  </h2>

  <p className="text-white/60 mt-2">
    Veja suas campanhas e abra para consultar seus PASS-IDs.
  </p>

  <div className="grid gap-4 mt-6">
    {Object.entries(passaportesPorCampanha).map(([destino, passaportes]: any) => (
      <div
        key={destino}
        className="rounded-[2rem] bg-white/10 border border-white/15 p-6"
      >
        <div
          onClick={() =>
            setCampanhaAberta(campanhaAberta === destino ? null : destino)
          }
          className="cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <p className="text-[#23C997] font-black text-sm">
              CAMPANHA
            </p>

            <h3 className="text-2xl font-black mt-1">
              ✈️ {destino}
            </h3>

            <p className="text-white/60 mt-1">
              {passaportes.length} PASS-IDs nesta campanha
            </p>
          </div>

          <button className="rounded-2xl bg-[#23C997] text-[#061832] px-5 py-3 font-black">
            {campanhaAberta === destino ? "Fechar" : "Ver PASS-IDs"}
          </button>
        </div>

        {campanhaAberta === destino && (
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {passaportes.map((item: any) => (
              <div
                key={item.id}
                className="rounded-[2rem] bg-gradient-to-br from-white to-slate-100 text-[#061832] p-6 flex items-center justify-between gap-4 shadow-2xl border border-white/50"
              >
                <div>
                  <p className="text-xs font-black text-slate-400">
                    PASSAPORTE DIGITAL
                  </p>

                  <h4 className="text-2xl font-black">
                    {item.pass_id}
                  </h4>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#23C997]/15 px-3 py-1 text-xs font-black text-[#0c7a5b]">
                      🍀 {item.milhas} milhas
                    </span>
                  </div>

                  <p className="text-sm text-slate-400 mt-3">
                    Emitido para {item.nome}
                  </p>
                </div>

                <QrCode className="w-8 h-8 text-[#061832]" />
              </div>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
</div>
</div>

{modalConquistasAberto && (
  <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-5">
    <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[2rem] bg-[#061832] border border-white/15 p-6 shadow-2xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black">
            🏅 Minhas Conquistas
          </h2>

          <p className="text-white/60 mt-2">
            {conquistasConcluidas} de {totalConquistas} conquistas desbloqueadas.
          </p>
        </div>

        <button
          onClick={() => setModalConquistasAberto(false)}
          className="text-white/60 hover:text-white text-3xl"
        >
          ×
        </button>
      </div>

      <div className="mt-6 h-3 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-[#23C997]"
          style={{
            width: `${(conquistasConcluidas / totalConquistas) * 100}%`,
          }}
        />
      </div>

      <div className="grid gap-8 mt-8">
        {conquistas.map((grupo) => (
          <div key={grupo.categoria}>
            <h3 className="text-2xl font-black mb-4">
              {grupo.categoria}
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              {grupo.itens.map((item) => {
                const concluida = item.atual >= item.meta;
                const progresso =
                  item.meta === 0
                    ? 100
                    : Math.min((item.atual / item.meta) * 100, 100);

                return (
                  <div
                    key={item.nome}
                    className={`rounded-2xl border p-5 ${
                      concluida
                        ? "bg-[#23C997]/10 border-[#23C997]/30"
                        : "bg-white/5 border-white/10 opacity-70"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-3xl">
                        {item.emoji}
                      </div>

                      <span className="text-xs font-black">
                        {concluida ? "✅ Desbloqueada" : "🔒 Bloqueada"}
                      </span>
                    </div>

                    <h4 className="text-xl font-black mt-4">
                      {item.nome}
                    </h4>

                    <p className="text-white/50 text-sm mt-2">
                      {item.meta === 0
                        ? "Conquista inicial"
                        : `${item.atual} / ${item.meta}`}
                    </p>

                    <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-[#23C997]"
                        style={{
                          width: `${progresso}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)}
      <SiteFooter />
    </main>
  );
}
