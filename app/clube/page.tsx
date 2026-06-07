"use client";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ClubePage() {

    const [loadingPlano, setLoadingPlano] = useState<string | null>(null);

    async function assinarClube(plano: "mensal" | "semestral") {
  try {
    setLoadingPlano(plano);

    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      alert("Faça login antes de assinar o clube.");
      window.location.href = "/";
      return;
    }

    const nome =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email ||
      "Assinante";

    const email = user.email;

   const { data: perfil } = await supabase
  .from("user_profiles")
  .select("cpf, nome")
  .eq("user_id", user.id)
  .single();

const cpf = perfil?.cpf;

if (!cpf) {
  alert("CPF não encontrado no cadastro. Atualize seus dados antes de assinar.");
  return;
}

    const response = await fetch("/api/asaas-clube", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        plano,
        userId: user.id,
        nome,
        email,
        cpf,
      }),
    });

    const dataApi = await response.json();

    if (!response.ok) {
      alert(dataApi?.errors?.[0]?.description || dataApi?.error || "Erro ao gerar pagamento.");
      return;
    }

    if (dataApi.invoiceUrl) {
      window.location.href = dataApi.invoiceUrl;
      return;
    }

    if (dataApi.bankSlipUrl) {
      window.location.href = dataApi.bankSlipUrl;
      return;
    }

    alert("Pagamento criado, mas não veio link.");
  } catch (error) {
    console.error(error);
    alert("Erro ao assinar clube.");
  } finally {
    setLoadingPlano(null);
  }
}
  return (
    <main className="min-h-screen bg-[#061832] text-white px-5 md:px-8 py-10">
      <SiteHeader />

      <div className="max-w-7xl mx-auto mt-10">
        <a href="/" className="text-[#23C997] font-black hover:underline">
          ← Voltar
        </a>

        <section className="rounded-[2.5rem] bg-white/10 border border-white/15 p-8 md:p-12 mt-8 text-center">
          <p className="text-[#23C997] font-black">
            🍀 CLUBE PASSAPORTE DA SORTE
          </p>

          <h1 className="text-4xl md:text-6xl font-black mt-3">
            Transforme suas milhas em vantagens reais.
          </h1>

          <p className="text-white/60 mt-5 text-lg max-w-3xl mx-auto">
           Membros do Clube Passaporte da Sorte podem utilizar suas milhas para resgatar benefícios, participações, descontos e recompensas exclusivas.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-6 mt-10">
          <PlanoCard
  nome="Mensal"
  preco="R$ 24,90"
  descricao="Ideal para conhecer e aproveitar os benefícios do clube."
  detalhes={[
    "Acesso à Central de Recompensas",
    "Uso das milhas para resgates",
    "Benefícios e cupons exclusivos",
    "Cancelamento conforme regras do plano",
  ]}
  destaque={false}
  botao={loadingPlano === "mensal" ? "Gerando pagamento..." : "Assinar mensal"}
  onClick={() => assinarClube("mensal")}
/>

          <PlanoCard
  nome="Semestral"
  preco="6x R$ 19,90"
  descricao="Melhor opção para aproveitar mais benefícios."
  detalhes={[
    "Acesso à Central de Recompensas",
    "Uso das milhas para resgates",
    "Benefícios e cupons exclusivos",
    "Economia em relação ao plano mensal",
    "Também disponível no PIX por R$ 119,40",
  ]}
  destaque
  botao={loadingPlano === "semestral" ? "Gerando pagamento..." : "Assinar semestral"}
  onClick={() => assinarClube("semestral")}
/>
        </section>

        <section className="rounded-[2rem] bg-white/10 border border-white/15 p-8 mt-10">
          <h2 className="text-3xl font-black">
            O que você desbloqueia no clube?
          </h2>

          <div className="grid md:grid-cols-4 gap-4 mt-6">
            <Beneficio emoji="🍀" titulo="Uso das milhas" texto="Use suas milhas para resgatar benefícios." />
            <Beneficio emoji="🎟️" titulo="PASS-IDs" texto="Resgates de participações conforme disponibilidade." />
            <Beneficio emoji="🏷️" titulo="Cupons" texto="Acesso a descontos e vantagens exclusivas." />
            <Beneficio emoji="🎁" titulo="Recompensas" texto="Benefícios especiais para membros do clube." />
          </div>
        </section>

        <section className="rounded-[2rem] bg-[#23C997] text-[#061832] p-8 mt-10 text-center">
          <h2 className="text-3xl md:text-4xl font-black">
            Pronto para entrar no clube?
          </h2>

          <p className="mt-3 font-medium">
            Em breve a assinatura estará disponível diretamente pela plataforma.
          </p>
        </section>
      </div>

      <SiteFooter />
    </main>
  );
}

function PlanoCard({
  nome,
  preco,
  descricao,
  detalhes,
  destaque,
  botao,
  onClick,
}: {
  nome: string;
  preco: string;
  descricao: string;
  detalhes: string[];
  destaque: boolean;
  botao: string;
  onClick: () => void;
}) {
  return (
    <div
      className={`rounded-[2rem] border p-8 ${
        destaque
          ? "bg-[#23C997] text-[#061832] border-[#23C997]"
          : "bg-white/10 text-white border-white/15"
      }`}
    >
      {destaque && (
        <p className="inline-block rounded-full bg-[#061832] text-white px-4 py-2 text-sm font-black mb-4">
          MAIS ESCOLHIDO
        </p>
      )}

      <h2 className="text-3xl font-black">{nome}</h2>

      <p className="text-5xl font-black mt-4">{preco}</p>

      <p className={`mt-3 ${destaque ? "opacity-80" : "text-white/60"}`}>
        {descricao}
      </p>

      <ul className="space-y-3 mt-6">
        {detalhes.map((item) => (
          <li key={item} className="font-bold">
            ✓ {item}
          </li>
        ))}
      </ul>

      <button
  onClick={onClick}
  className={`w-full mt-8 rounded-2xl px-6 py-4 font-black ${
    destaque
      ? "bg-[#061832] text-white"
      : "bg-[#23C997] text-[#061832]"
  }`}
>
  {botao}
</button>
    </div>
  );
}

function Beneficio({
  emoji,
  titulo,
  texto,
}: {
  emoji: string;
  titulo: string;
  texto: string;

}) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 p-5">
      <div className="text-3xl">{emoji}</div>
      <h3 className="font-black text-xl mt-3">{titulo}</h3>
      <p className="text-white/60 mt-2">{texto}</p>
    </div>
  );
}