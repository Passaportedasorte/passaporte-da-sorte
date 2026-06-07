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

      <section className="rounded-[2.5rem] bg-white/10 border border-white/15 p-8 md:p-14 mt-8 text-center">
        <p className="text-[#23C997] font-black">
          🍀 CLUBE PASSAPORTE DA SORTE
        </p>

        <h1 className="text-4xl md:text-6xl font-black mt-3 leading-tight">
          Suas milhas podem virar PASS-IDs, descontos e benefícios exclusivos.
        </h1>

        <p className="text-white/70 mt-5 text-lg max-w-3xl mx-auto">
          Assine o Clube Passaporte da Sorte e transforme suas compras em mais chances de ganhar.
        </p>

        <div className="grid md:grid-cols-4 gap-4 mt-8">
          <MiniCard texto="Use suas milhas" />
          <MiniCard texto="Ganhe PASS-IDs extras" />
          <MiniCard texto="Resgate recompensas" />
          <MiniCard texto="Benefícios exclusivos" />
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6 mt-10">
        <Comparativo
          titulo="Sem Clube"
          itens={[
            "Acumula milhas",
            "Não pode resgatar benefícios",
            "Não troca milhas por PASS-IDs",
            "Menos vantagens nas campanhas",
          ]}
          negativo
        />

        <Comparativo
          titulo="Com Clube"
          itens={[
            "Usa milhas para resgates",
            "Troca por PASS-IDs extras",
            "Acessa cupons e benefícios",
            "Aumenta suas chances de ganhar",
          ]}
        />
      </section>

      <section className="rounded-[2rem] bg-[#23C997] text-[#061832] p-8 md:p-10 mt-10 text-center">
        <p className="font-black">🎟️ PRINCIPAL BENEFÍCIO</p>

        <h2 className="text-3xl md:text-5xl font-black mt-2">
          Troque milhas por PASS-IDs extras.
        </h2>

        <p className="mt-4 text-lg font-medium max-w-3xl mx-auto">
          Mais participações. Mais chances. Mais sorte.
        </p>
      </section>

      <section className="rounded-[2rem] bg-white/10 border border-white/15 p-8 mt-10">
        <h2 className="text-3xl font-black">
          Como funciona na prática?
        </h2>

        <div className="grid md:grid-cols-4 gap-4 mt-6">
          <Beneficio emoji="🛒" titulo="1. Compre" texto="Você compra PASS-IDs nas campanhas." />
          <Beneficio emoji="🍀" titulo="2. Ganhe milhas" texto="Cada compra gera milhas para sua conta." />
          <Beneficio emoji="🎁" titulo="3. Resgate" texto="Assinantes usam milhas em recompensas." />
          <Beneficio emoji="🎟️" titulo="4. Participe mais" texto="Resgate PASS-IDs extras e aumente suas chances." />
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6 mt-10">
        <PlanoCard
          nome="Mensal"
          preco="R$ 24,90"
          descricao="Ideal para conhecer e começar a usar suas milhas."
          detalhes={[
            "Acesso à Central de Recompensas",
            "Uso das milhas para resgates",
            "Troca por PASS-IDs extras",
            "Benefícios e cupons exclusivos",
          ]}
          destaque={false}
          botao={loadingPlano === "mensal" ? "Gerando pagamento..." : "Assinar mensal"}
          onClick={() => assinarClube("mensal")}
        />

        <PlanoCard
          nome="Semestral"
          preco="6x R$ 19,90"
          descricao="Melhor opção para aproveitar mais e economizar."
          detalhes={[
            "Tudo do plano mensal",
            "Uso das milhas para PASS-IDs extras",
            "Economia em relação ao mensal",
            "Também disponível no PIX por R$ 119,40",
            "Mais tempo aproveitando benefícios",
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
          <Beneficio emoji="🍀" titulo="Uso das milhas" texto="Transforme milhas acumuladas em recompensas." />
          <Beneficio emoji="🎟️" titulo="PASS-IDs extras" texto="Resgate novas participações em campanhas." />
          <Beneficio emoji="🏷️" titulo="Cupons" texto="Tenha acesso a descontos e vantagens." />
          <Beneficio emoji="🎁" titulo="Recompensas" texto="Benefícios especiais para assinantes." />
        </div>
      </section>

      <section className="rounded-[2rem] bg-[#23C997] text-[#061832] p-8 md:p-10 mt-10 text-center">
        <h2 className="text-3xl md:text-5xl font-black">
          Comece a transformar suas milhas em recompensas hoje.
        </h2>

        <p className="mt-3 font-medium">
          Entre para o Clube Passaporte da Sorte e aproveite mais cada participação.
        </p>

        <button
          onClick={() => assinarClube("semestral")}
          className="mt-6 rounded-2xl bg-[#061832] text-white px-8 py-4 font-black"
        >
          🍀 Quero entrar para o Clube
        </button>
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


function MiniCard({ texto }: { texto: string }) {
  return (
    <div className="rounded-2xl bg-[#061832] border border-white/10 p-4 font-black text-sm">
      ✓ {texto}
    </div>
  );
}

function Comparativo({
  titulo,
  itens,
  negativo,
}: {
  titulo: string;
  itens: string[];
  negativo?: boolean;
}) {
  return (
    <div className="rounded-[2rem] bg-white/10 border border-white/15 p-6 md:p-8">
      <h2 className="text-3xl font-black">{titulo}</h2>

      <ul className="space-y-3 mt-6">
        {itens.map((item) => (
          <li key={item} className="font-bold text-white/80">
            {negativo ? "❌" : "✅"} {item}
          </li>
        ))}
      </ul>
    </div>
  );
}