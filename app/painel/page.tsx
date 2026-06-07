"use client";

import React, { useEffect, useState } from "react";
import { QrCode } from "lucide-react";
import { supabase } from "@/lib/supabase";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function Painel() {
  const [user, setUser] = useState<any>(null);
  const [meusPassaportes, setMeusPassaportes] = useState<any[]>([]);
  const [saldoMilhas, setSaldoMilhas] = useState(0);
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


const { data: milhas } = await supabase
  .from("user_miles")
  .select("total_milhas")
  .eq("user_id", data.user.id)
  .single();

setSaldoMilhas(milhas?.total_milhas ?? 0);
    }

    carregar();
  }, []);
const nivel =
  saldoMilhas >= 1000
    ? "Elite"
    : saldoMilhas >= 500
    ? "Viajante"
    : saldoMilhas >= 100
    ? "Aventureiro"
    : "Iniciante";

const [campanhaAberta, setCampanhaAberta] = useState<string | null>(null);    

const passaportesPorCampanha = meusPassaportes.reduce((acc: any, item) => {
  const destino = item.campaigns?.destino || "Campanha";

  if (!acc[destino]) {
    acc[destino] = [];
  }

  acc[destino].push(item);

  return acc;
}, {});

  return (
    <main className="min-h-screen bg-[#061832] text-white px-5 md:px-10 py-10">
      <SiteHeader />
      <div className="max-w-7xl mx-auto">
        <a href="/" className="text-white/60 hover:text-white">
          ← Voltar
        </a>

        <h1 className="text-4xl font-black mt-8">Minha Carteira</h1>

        <p className="text-white/60 mt-2">
          Seus passaportes digitais e saldo de milhas.
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
  🍀 Nível {nivel}
</div>
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-4 mt-6">

  <div
  onClick={() => {
    alert("Em breve: histórico completo de milhas.");
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
        width: `${Math.min((saldoMilhas / 1000) * 100, 100)}%`,
      }}
    />
  </div>

  <p className="text-xs text-white/50 mt-2">
    Meta Elite: 1000 milhas
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

   <div className="rounded-2xl bg-white/10 border border-white/15 text-white p-5">
  <p className="text-sm font-black text-white/60">
    Nível Atual
  </p>

  <h2 className="text-3xl font-black mt-1">
    {nivel} ✈️
  </h2>
</div>

</div>
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
      <SiteFooter />
    </main>
  );
}
