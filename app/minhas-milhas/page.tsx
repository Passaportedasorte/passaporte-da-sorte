"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";





export default function MinhasMilhasPage() {
  const [user, setUser] = useState<any>(null);
  const [saldoMilhas, setSaldoMilhas] = useState(0);

  const [recompensas, setRecompensas] = useState<any[]>([]);
  const [assinanteClube, setAssinanteClube] = useState(false);
  const [meusResgates, setMeusResgates] = useState<any[]>([]);
  const [resgatesAbertos, setResgatesAbertos] = useState(false);
  const [milhasHistorico, setMilhasHistorico] = useState(0);



  useEffect(() => {
    async function carregar() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      if (!data.user) return;
      

      const { data: milhas } = await supabase
        .from("user_miles")
        .select("total_milhas, milhas_historico")
        .eq("user_id", data.user.id)
        .single();

      setSaldoMilhas(milhas?.total_milhas ?? 0);
      setMilhasHistorico(milhas?.milhas_historico ?? milhas?.total_milhas ?? 0);

      const { data: resgates } = await supabase
  .from("reward_redemptions")
  .select("*")
  .eq("user_id", data.user.id)
  .order("created_at", { ascending: false });

setMeusResgates(resgates ?? []);
      

      const { data: assinatura } = await supabase
  .from("clube_assinaturas")
  .select("status")
  .eq("user_id", data.user.id)
  .in("status", ["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED"])
  .maybeSingle();

setAssinanteClube(!!assinatura);

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
  milhasHistorico >= 2500
      ? "Diamante"
      : saldoMilhas >= 1000
      ? "Elite"
      : saldoMilhas >= 500
      ? "Viajante"
      : saldoMilhas >= 100
      ? "Aventureiro"
      : "Iniciante";

      async function resgatarRecompensa(item: any) {
  if (!user?.id) {
    alert("Faça login para resgatar.");
    return;
  }

  if (!assinanteClube) {
    window.location.href = "/clube";
    return;
  }

  if (saldoMilhas < item.milhas) {
    alert("Você ainda não possui milhas suficientes.");
    return;
  }

  const confirmar = confirm(
    `Deseja resgatar "${item.titulo}" por ${item.milhas} milhas?`
  );

  if (!confirmar) return;

  const response = await fetch("/api/resgatar-recompensa", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: user.id,
      rewardId: item.id,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    alert(data.error || "Erro ao resgatar recompensa.");
    return;
  }

  setSaldoMilhas(data.novoSaldo);

  alert(
    `Resgate realizado com sucesso! Código: ${data.resgate.codigo}`
  );
}

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

{!assinanteClube && (
  <div className="mt-6 rounded-2xl bg-[#23C997]/10 border border-[#23C997]/30 p-5">
    <p className="text-[#23C997] font-black">
      🍀 Resgate exclusivo para assinantes
    </p>

    <p className="text-white/70 mt-2">
      Você pode conhecer todos os benefícios disponíveis, mas o uso das milhas para resgate é exclusivo para membros do Clube Passaporte da Sorte.
    </p>

    <a
      href="/clube"
      className="inline-block mt-4 rounded-2xl bg-[#23C997] text-[#061832] px-5 py-3 font-black"
    >
      Conhecer o Clube
    </a>
  </div>
)}

        <section className="mt-10">
          <h2 className="text-3xl font-black">Loja de Recompensas</h2>

          <p className="text-white/60 mt-2">
            Escolha benefícios para resgatar com suas milhas.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {recompensas.map((item) => {
              const podeResgatar = saldoMilhas >= item.milhas;

              

              return (

                
                <div
  key={item.id}
  className="w-full rounded-[2rem] bg-white/10 border border-white/15 p-5 md:p-6"
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
  <p className="text-white/50 text-sm">
    {assinanteClube ? "Custo" : "Custo exclusivo"}
  </p>

  <p className="text-2xl font-black">
    {assinanteClube ? `${item.milhas} milhas` : "Disponível para assinantes"}
  </p>
</div>

                <button
  onClick={() => resgatarRecompensa(item)}
  className={`mt-5 w-full rounded-2xl px-4 py-4 font-black text-sm md:text-base transition ${
    assinanteClube && podeResgatar
      ? "bg-[#23C997] text-[#061832] hover:scale-[1.02]"
      : "bg-white/10 text-white/60"
  }`}
>
  {!assinanteClube
    ? "Entrar no Clube"
    : podeResgatar
    ? "Resgatar"
    : "Milhas insuficientes"}
</button>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {assinanteClube && (
  <section className="mt-12">
    <div
      onClick={() => setResgatesAbertos(!resgatesAbertos)}
      className="rounded-[2rem] bg-white/10 border border-white/15 p-6 md:p-8 cursor-pointer hover:bg-white/15 transition"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black">
            🎁 Meus Resgates
          </h2>

          <p className="text-white/60 mt-2">
            {meusResgates.length} resgate(s) realizado(s)
          </p>
        </div>

        <div className="text-3xl font-black text-[#23C997]">
          {resgatesAbertos ? "−" : "+"}
        </div>
      </div>
    </div>

    {resgatesAbertos && (
      <div className="mt-4">
        {meusResgates.length === 0 ? (
          <div className="rounded-2xl bg-[#061832] border border-white/10 p-5 text-white/60">
            Você ainda não realizou nenhum resgate.
          </div>
        ) : (
          <div className="grid gap-4">
            {meusResgates.map((resgate) => (
              <div
                key={resgate.id}
                className="rounded-2xl bg-[#061832] border border-white/10 p-5"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="text-[#23C997] font-black text-lg">
                      {resgate.titulo}
                    </p>

                    <p className="text-white/60 text-sm mt-1">
                      Código:{" "}
                      <span className="text-white font-black">
                        {resgate.codigo}
                      </span>
                    </p>

                    <p className="text-white/40 text-sm mt-1">
                      {new Date(resgate.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-white font-black">
                      {resgate.milhas_usadas} milhas
                    </p>

                    <p className="inline-block mt-2 rounded-full bg-[#23C997]/15 text-[#23C997] px-3 py-1 text-xs font-black uppercase">
                      {resgate.status || "ativo"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )}
  </section>
)}

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