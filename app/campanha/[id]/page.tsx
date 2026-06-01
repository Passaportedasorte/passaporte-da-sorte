"use client";

import React, { use, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Calendar, Clover, ShieldCheck, Ticket } from "lucide-react";

export default function CampanhaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [campanha, setCampanha] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
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
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erro ao carregar campanha:", error);
      }

      setCampanha(data);
      setCarregando(false);
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

  if (carregando) {
    return (
      <main className="min-h-screen bg-[#061832] text-white flex items-center justify-center">
        <p className="text-white/60 font-black">Carregando campanha...</p>
      </main>
    );
  }

  if (!campanha) {
    return (
      <main className="min-h-screen bg-[#061832] text-white flex items-center justify-center px-5">
        <div className="max-w-md text-center rounded-[2rem] bg-white/10 border border-white/15 p-8">
          <h1 className="text-3xl font-black">Campanha não encontrada</h1>
          <p className="text-white/60 mt-3">
            Essa campanha pode ter sido removida ou estar indisponível.
          </p>

          <button
            onClick={() => (window.location.href = "/campanhas")}
            className="mt-6 rounded-2xl bg-[#23C997] px-6 py-4 font-black text-[#061832]"
          >
            Ver campanhas
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#061832] text-white">
      <section className="relative min-h-[78vh] overflow-hidden">
        <img
          src={campanha.imagem || "/logo.png"}
          alt={campanha.destino || "Campanha"}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#061832] via-[#061832]/70 to-[#061832]/20" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 min-h-[78vh] flex items-end pb-14">
          <div className="max-w-4xl">
            <a href="/campanhas" className="text-[#23C997] font-black">
              ← Voltar para campanhas
            </a>

            <p className="text-white/70 font-black mt-8">
              {campanha.titulo}
            </p>

            <h1 className="text-5xl md:text-7xl font-black leading-[0.95] mt-3">
              {campanha.destino}
            </h1>

            <p className="text-white/70 text-lg md:text-xl mt-6 max-w-2xl leading-relaxed">
              {campanha.descricao_curta ||
                `Viva uma experiência inesquecível em ${campanha.destino}.`}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Badge icon={<Ticket />} text={`R$ ${campanha.preco}`} green />
              <Badge icon={<Clover />} text={`+${campanha.milhas} milhas`} />
              <Badge
                icon={<Calendar />}
                text={`Sorteio ${campanha.data_sorteio || "em breve"}`}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-8 py-12 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-[2rem] bg-white/10 border border-white/15 p-6 md:p-8">
            <h2 className="text-3xl font-black">Sobre esta experiência</h2>

            <p className="text-white/70 mt-4 leading-relaxed text-lg">
              {campanha.descricao_curta ||
                `Esta campanha foi criada para transformar sorte em memória, conectando você a destinos especiais por meio do Passaporte da Sorte.`}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <InfoCard
              title="PASS-ID digital"
              text="Após a confirmação do pagamento, seus números são gerados automaticamente."
            />

            <InfoCard
              title="Resultado Federal"
              text="A apuração é vinculada ao primeiro prêmio da Loteria Federal."
            />

            <InfoCard
              title="Milhas acumuladas"
              text="Cada participação soma milhas na sua carteira para futuras experiências."
            />
          </div>

          <div className="rounded-[2rem] bg-white/10 border border-white/15 p-6 md:p-8">
            <h2 className="text-3xl font-black">Como funciona</h2>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <Step number="1" text="Escolha a quantidade de PASS-IDs." />
              <Step number="2" text="Finalize o pagamento com segurança." />
              <Step number="3" text="Receba seus PASS-IDs no painel." />
              <Step number="4" text="Acompanhe o resultado oficial." />
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] bg-white text-[#061832] p-6 shadow-2xl h-fit lg:sticky lg:top-6">
          <h3 className="text-2xl font-black">Comprar PASS-IDs</h3>

          <p className="text-slate-500 mt-2 mb-6">
            Escolha a quantidade e garanta sua participação nesta campanha.
          </p>

          <div className="space-y-4">
            {user ? (
              <div className="rounded-2xl bg-[#061832] text-white p-5 border border-[#23C997]/40">
                <p className="text-[#23C997] text-sm font-black">
                  ✓ Você está comprando com sua conta
                </p>

                <h4 className="text-2xl font-black mt-2">{nome}</h4>
                <p className="text-white/60 mt-1">{contato}</p>
                <p className="text-white/60 mt-1">CPF: {cpf}</p>
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-100 p-5">
                <p className="font-black">Entre para comprar</p>
                <p className="text-slate-500 text-sm mt-1">
                  Faça login ou crie sua conta antes de finalizar a compra.
                </p>

                <a
                  href="/"
                  className="mt-4 block text-center rounded-2xl bg-[#23C997] px-6 py-4 font-black text-[#061832]"
                >
                  Entrar ou criar conta
                </a>
              </div>
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
                onChange={(e) =>
                  setQuantidade(Math.max(1, Number(e.target.value || 1)))
                }
                placeholder="Digite a quantidade"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
              />
            </div>

            <div className="rounded-2xl bg-slate-100 p-4">
              <div className="flex justify-between font-black text-lg">
                <span>Total</span>
                <span>R$ {total}</span>
              </div>

              <p className="text-slate-500 text-sm mt-1">
                {quantidade} PASS-IDs • +{quantidade * Number(campanha.milhas || 0)} milhas
              </p>
            </div>

            <button
              onClick={gerarPix}
              disabled={loadingPix || !user}
              className="w-full rounded-2xl py-4 bg-[#061832] text-white font-black hover:bg-[#0b244a] transition disabled:opacity-50"
            >
              {loadingPix ? "Gerando pagamento..." : "Finalizar compra"}
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

function Badge({
  icon,
  text,
  green = false,
}: {
  icon: React.ReactNode;
  text: string;
  green?: boolean;
}) {
  return (
    <span
      className={`rounded-full px-4 py-2 font-black flex items-center gap-2 ${
        green
          ? "bg-[#23C997] text-[#061832]"
          : "bg-white/15 text-white backdrop-blur-xl"
      }`}
    >
      <span className="w-4 h-4">{icon}</span>
      {text}
    </span>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[2rem] bg-white/10 border border-white/15 p-5">
      <ShieldCheck className="w-8 h-8 text-[#23C997]" />
      <h3 className="text-xl font-black mt-4">{title}</h3>
      <p className="text-white/60 mt-2">{text}</p>
    </div>
  );
}

function Step({ number, text }: { number: string; text: string }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 p-4 flex gap-4">
      <div className="w-10 h-10 rounded-xl bg-[#23C997] text-[#061832] flex items-center justify-center font-black">
        {number}
      </div>

      <p className="text-white/70 font-bold">{text}</p>
    </div>
  );
}