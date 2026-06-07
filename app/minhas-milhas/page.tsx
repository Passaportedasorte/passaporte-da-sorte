"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";





export default function MinhasMilhasPage() {
  const [user, setUser] = useState<any>(null);
  const [saldoMilhas, setSaldoMilhas] = useState(0);

  const [recompensas, setRecompensas] = useState<any[]>([]);



  useEffect(() => {
    async function carregar() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      if (!data.user) return;
      

      const { data: milhas } = await supabase
        .from("user_miles")
        .select("total_milhas")
        .eq("user_id", data.user.id)
        .single();

      setSaldoMilhas(milhas?.total_milhas ?? 0);

      const { data: rewards } = await supabase
  .from("rewards")
  .select("*")
  .eq("ativo", true)
  .order("milhas", { ascending: true });

  setRecompensas(rewards ?? []);
    }

    

    carregar();
  }, []);

  

  const nivel =
    saldoMilhas >= 2500
      ? "Diamante"
      : saldoMilhas >= 1000
      ? "Elite"
      : saldoMilhas >= 500
      ? "Viajante"
      : saldoMilhas >= 100
      ? "Aventureiro"
      : "Iniciante";

  return (
    <main className="min-h-screen bg-[#061832] text-white px-5 md:px-8 py-10">
      <SiteHeader />

      <div className="max-w-7xl mx-auto mt-10">
        <a href="/painel" className="text-white/60 hover:text-white">
          ← Voltar ao painel
        </a>

        <section className="rounded-[2rem] bg-white/10 border border-white/15 p-6 md:p-8 mt-8">
          <p className="text-[#23C997] font-black">🍀 CLUBE DE BENEFÍCIOS</p>

          <h1 className="text-4xl md:text-5xl font-black mt-2">
            Central de Recompensas
          </h1>

          <p className="text-white/60 mt-3 max-w-2xl text-lg">
            Use suas milhas para desbloquear benefícios, cupons, experiências e
            novas participações.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <InfoCard label="Saldo atual" value={`${saldoMilhas} 🍀`} />
            <InfoCard label="Nível atual" value={`${nivel} ✈️`} />
            <InfoCard
              label="Próximo marco"
              value={
                saldoMilhas >= 2500
                  ? "Nível máximo"
                  : saldoMilhas >= 1000
                  ? `${2500 - saldoMilhas} para Diamante`
                  : saldoMilhas >= 500
                  ? `${1000 - saldoMilhas} para Elite`
                  : saldoMilhas >= 100
                  ? `${500 - saldoMilhas} para Viajante`
                  : `${100 - saldoMilhas} para Aventureiro`
              }
            />
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-3xl font-black">Loja de Recompensas</h2>

          <p className="text-white/60 mt-2">
            Escolha benefícios para resgatar com suas milhas.
          </p>

          <div className="grid md:grid-cols-3 gap-5 mt-6">
            {recompensas.map((item) => {
              const podeResgatar = saldoMilhas >= item.milhas;

              return (

                
                <div
                  key={item.id}
                  className="rounded-[2rem] bg-white/10 border border-white/15 p-6"
                >
                 <div className="w-14 h-14 rounded-2xl bg-[#23C997]/15 text-[#23C997] flex items-center justify-center text-2xl">
  {item.categoria === "PASS-IDs" ? "🎟️" :
   item.categoria === "Cupons" ? "🏷️" :
   item.categoria === "Benefícios" ? "⭐" :
   item.categoria === "Experiências" ? "☕" :
   "🍀"}
</div>

                  <p className="text-[#23C997] font-black text-sm mt-5">
                    {item.categoria}
                  </p>

                  <h3 className="text-2xl font-black mt-1">{item.titulo}</h3>

                  <p className="text-white/60 mt-3">{item.descricao}</p>

                  <div className="mt-5 rounded-2xl bg-[#061832] border border-white/10 p-4">
                    <p className="text-white/50 text-sm">Custo</p>
                    <p className="text-2xl font-black">{item.milhas} milhas</p>
                  </div>

                  <button
                    onClick={() =>
                      alert(
                        podeResgatar
                          ? "Em breve você poderá resgatar este benefício."
                          : "Você ainda não possui milhas suficientes."
                      )
                    }
                    className={`mt-5 w-full rounded-2xl px-5 py-4 font-black transition ${
                      podeResgatar
                        ? "bg-[#23C997] text-[#061832] hover:scale-[1.02]"
                        : "bg-white/10 text-white/40 cursor-not-allowed"
                    }`}
                  >
                    {podeResgatar ? "Resgatar" : "Milhas insuficientes"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 p-5">
      <p className="text-white/50 text-sm font-black">{label}</p>
      <h3 className="text-2xl font-black mt-1">{value}</h3>
    </div>
  );
}