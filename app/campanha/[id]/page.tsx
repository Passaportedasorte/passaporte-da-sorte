"use client";

import React, { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CampanhaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [campanha, setCampanha] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
const [nome, setNome] = useState("");
const [contato, setContato] = useState("");
const [cpf, setCpf] = useState("");
const [celular, setCelular] = useState("");
const [dataNascimento, setDataNascimento] = useState("");
const [quantidade, setQuantidade] = useState(5);
const [loadingPix, setLoadingPix] = useState(false);

  useEffect(() => {
    async function carregarCampanha() {
      const { data } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", id)
        .single();

      setCampanha(data);
    }

    carregarCampanha();
  }, [id]);

  useEffect(() => {
  async function carregarUsuario() {
    const { data } = await supabase.auth.getUser();

    setUser(data.user);

    if (data.user) {
      setNome(data.user.user_metadata?.full_name || "");
      setContato(data.user.email || "");
      setCpf(data.user.user_metadata?.cpf || "");
      setCelular(data.user.user_metadata?.celular || "");
      setDataNascimento(data.user.user_metadata?.data_nascimento || "");
    }
  }

  carregarUsuario();
}, []);

const total = (quantidade * Number(campanha?.preco || 0))
  .toFixed(2)
  .replace(".", ",");

async function gerarPix() {
  if (!user) {
    alert("Faça login ou crie sua conta antes de finalizar a compra.");
    return;
  }

  if (!nome.trim()) return alert("Preencha seu nome completo.");
  if (!contato.trim()) return alert("Preencha seu e-mail.");
  if (!cpf.trim()) return alert("Preencha seu CPF.");
  if (!celular.trim()) return alert("Preencha seu celular.");
  if (!dataNascimento.trim()) return alert("Preencha sua data de nascimento.");

  try {
    setLoadingPix(true);

    const response = await fetch("/api/asaas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        valor: Number(campanha.preco) * quantidade,
        nome,
        email: contato,
        cpf,
        celular,
        campanhaId: campanha.id,
        quantidade,
        userId: user?.id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(
        data?.details ||
          data?.errors?.[0]?.description ||
          data?.error ||
          "Erro ao gerar pagamento"
      );
      return;
    }

    if (data.invoiceUrl) {
      window.location.href = data.invoiceUrl;
      return;
    }

    if (data.bankSlipUrl) {
      window.location.href = data.bankSlipUrl;
      return;
    }

    alert("Cobrança criada, mas não veio link de pagamento.");
  } catch (error) {
    console.error(error);
    alert("Erro ao gerar pagamento");
  } finally {
    setLoadingPix(false);
  }
}

  if (!campanha) {
    return (
      <main className="min-h-screen bg-[#061832] text-white p-10">
        Carregando campanha...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#061832] text-white">
      <section className="relative h-[70vh] overflow-hidden">
        <img
          src={campanha.imagem}
          alt={campanha.destino}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#061832] via-[#061832]/50 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 h-full flex items-end pb-12">
          <div>
            <p className="text-white/70 font-black">
              {campanha.titulo}
            </p>

            <h1 className="text-5xl md:text-7xl font-black">
              {campanha.destino}
            </h1>

            <div className="mt-5 flex flex-wrap gap-3">

              <span className="rounded-full bg-[#23C997] text-[#061832] px-4 py-2 font-black">
                💳 R$ {campanha.preco}
              </span>

              <span className="rounded-full bg-white/15 px-4 py-2 font-black backdrop-blur-xl">
                🍀 +{campanha.milhas} milhas
              </span>

              <span className="rounded-full bg-white/15 px-4 py-2 font-black backdrop-blur-xl">
                📅 Sorteio {campanha.data_sorteio}
              </span>

            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-12 grid lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2">

          <h2 className="text-3xl font-black">
            Sobre esta experiência
          </h2>

          <p className="text-white/70 mt-4 leading-relaxed text-lg">
            Viva uma experiência inesquecível em {campanha.destino}.
            Esta campanha foi criada para transformar sorte em memória,
            conectando você a destinos especiais por meio do
            Passaporte da Sorte.
          </p>

        </div>

      <div className="rounded-[2rem] bg-white text-[#061832] p-6 shadow-2xl h-fit sticky top-6">
  <h3 className="text-2xl font-black">
    Comprar Passaporte
  </h3>

  <p className="text-slate-500 mt-2 mb-6">
    {user
      ? "Seus dados foram preenchidos automaticamente pela sua conta."
      : "Entre ou crie sua conta na página inicial antes de comprar."}
  </p>

  <div className="space-y-4">
    {user ? (
      <div className="rounded-2xl bg-[#061832] text-white p-5 border border-[#23C997]/40">
        <p className="text-[#23C997] text-sm font-black">
          ✓ Você está comprando com sua conta
        </p>

        <h4 className="text-2xl font-black mt-2">
          {nome}
        </h4>

        <p className="text-white/60 mt-1">
          {contato}
        </p>

        <p className="text-white/60 mt-1">
          CPF: {cpf}
        </p>
      </div>
    ) : (
      <a
        href="/"
        className="block text-center rounded-2xl bg-[#23C997] px-6 py-4 font-black text-[#061832]"
      >
        Entrar ou criar conta
      </a>
    )}

    <div>
      <label className="text-sm font-black">Quantidade</label>

      <div className="grid grid-cols-4 gap-2 mt-2 mb-3">
        {[5, 10, 25, 50].map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => setQuantidade(q)}
            className={`rounded-xl px-3 py-2 font-black border transition ${
              quantidade === q
                ? "bg-[#23C997] text-[#061832] border-[#23C997]"
                : "bg-white border-slate-200 text-[#061832]"
            }`}
          >
            {q}
          </button>
        ))}
      </div>

      <input
        type="number"
        min="1"
        value={quantidade}
        onChange={(e) => setQuantidade(Number(e.target.value))}
        placeholder="Digite a quantidade"
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
      />
    </div>

    <div className="rounded-2xl bg-slate-100 p-4 flex justify-between font-black text-lg">
      <span>Total</span>
      <span>R$ {total}</span>
    </div>

    <button
      onClick={gerarPix}
      disabled={loadingPix || !user}
      className="w-full rounded-2xl py-4 bg-[#061832] text-white font-black hover:bg-[#0b244a] transition disabled:opacity-50"
    >
      {loadingPix ? "Gerando PIX..." : "Finalizar compra"}
    </button>

    <p className="text-xs text-black/40 text-center mt-3">
      🔒 Compra protegida • PASS-ID gerado automaticamente
    </p>
  </div>
</div>
      </section>
    </main>
  );
}