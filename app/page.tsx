"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { League_Spartan, Cinzel } from "next/font/google";
import {
  Ticket,
  MapPin,
  Star,
  Gift,
  User,
  ShieldCheck,
  Trophy,
  Briefcase,
  Clover,
  Gauge,
  ChevronDown,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const league = League_Spartan({
  subsets: ["latin"],
  variable: "--font-league",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
});

export default function PassaporteDaSorteSite() {
  const [nome, setNome] = useState("");
  const [contato, setContato] = useState("");
  const [cpf, setCpf] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [campanhas, setCampanhas] = useState<any[]>([]);
  const [campanhaBanner, setCampanhaBanner] = useState<any>(null);
  const [campanhaSelecionada, setCampanhaSelecionada] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [meusPassaportes, setMeusPassaportes] = useState<any[]>([]);
  const [saldoMilhas, setSaldoMilhas] = useState(0);
  const [loadingPix, setLoadingPix] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [menuAberto, setMenuAberto] = useState(false);
  const [loginAberto, setLoginAberto] = useState(false);

  const [emailLogin, setEmailLogin] = useState("");
  const [senhaLogin, setSenhaLogin] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [nomeCadastro, setNomeCadastro] = useState("");
  const [cpfCadastro, setCpfCadastro] = useState("");
  const [erroCadastro, setErroCadastro] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [modoLogin, setModoLogin] = useState<"entrar" | "criar">("entrar");
  const [dataNascimento, setDataNascimento] = useState("");
  const [completarCadastroAberto, setCompletarCadastroAberto] = useState(false);  
  const [cpfComplemento, setCpfComplemento] = useState("");
  const [nascimentoComplemento, setNascimentoComplemento] = useState("");
  const [celular, setCelular] = useState("");
  const [meusDadosAberto, setMeusDadosAberto] = useState(false);
  const [emailEdicao, setEmailEdicao] = useState("");
  const [celularEdicao, setCelularEdicao] = useState("");

  useEffect(() => {
    async function buscarCampanhas() {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Erro ao buscar campanhas:", error);
        return;
      }

      setCampanhas(data ?? []);
      setCampanhaBanner(data?.[0] ?? null);
      setCampanhaSelecionada(data?.[0] ?? null);
    }

    buscarCampanhas();
  }, []);

 function preencherDadosUsuario(usuario: any) {
  if (!usuario) return;

  const cpfUsuario = usuario.user_metadata?.cpf || "";
  const nascimentoUsuario = usuario.user_metadata?.data_nascimento || "";
  const celularUsuario =
  usuario.user_metadata?.celular || "";

  setNome(usuario.user_metadata?.full_name || "");
  setContato(usuario.email || "");
  setCpf(cpfUsuario);
  setDataNascimento(nascimentoUsuario);
  setCelular(celularUsuario);

  if (!cpfUsuario || !nascimentoUsuario) {
    setCpfComplemento(cpfUsuario);
    setNascimentoComplemento(nascimentoUsuario);
    setCompletarCadastroAberto(true);
  }
}

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);

      if (data.user) {
        preencherDadosUsuario(data.user);
      }
    }

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);

        if (session?.user) {
          preencherDadosUsuario(session.user);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function buscarMilhas() {
      if (!user?.id) return;

      const { data } = await supabase
        .from("user_miles")
        .select("total_milhas")
        .eq("user_id", user.id)
        .single();

      setSaldoMilhas(data?.total_milhas ?? 0);
    }

    buscarMilhas();
  }, [user]);

  useEffect(() => {
    async function buscarMeusPassaportes() {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("pass_ids")
        .select("*")
        .or(`user_id.eq.${user.id},contato.eq.${user.email}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar meus passaportes:", error);
        return;
      }

      setMeusPassaportes(data ?? []);
    }

    buscarMeusPassaportes();
  }, [user]);

  useEffect(() => {
    if (campanhas.length <= 1) return;

    const timer = setInterval(() => {
      setCampanhaBanner((prev: any) => {
        const indexAtual = campanhas.findIndex((c) => c.id === prev?.id);
        const proximo =
          indexAtual >= campanhas.length - 1 ? 0 : indexAtual + 1;

        return campanhas[proximo];
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [campanhas]);

  const valorUnitario = campanhaSelecionada?.preco ?? 3.99;
  const total = useMemo(
    () => (quantidade * valorUnitario).toFixed(2).replace(".", ","),
    [quantidade, valorUnitario]
  );

  async function loginGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          typeof window !== "undefined" ? window.location.origin : undefined,
      },
    });
  }

  async function criarConta() {
    if (!nomeCadastro.trim()) return alert("Preencha seu nome completo.");
    if (!emailLogin.trim()) return alert("Preencha seu e-mail.");
    if (!cpfCadastro.trim()) return alert("Preencha seu CPF.");
    if (!senhaLogin.trim()) return alert("Crie uma senha.");
    if (senhaLogin !== confirmarSenha) {
  setErroCadastro("As senhas não conferem.");
  return;
}


setErroCadastro("");

const { data, error } = await supabase.auth.signUp({
  email: emailLogin,
  password: senhaLogin,
  options: {
    data: {
  full_name: nomeCadastro,
  cpf: cpfCadastro,
  celular,
  data_nascimento: dataNascimento,
},
  },
});

console.log("SIGNUP DATA:", data);
console.log("SIGNUP ERROR:", error);

if (!celular.trim()) return alert("Preencha seu celular.");
if (error) {
  if (error.message.includes("User already registered")) {
    alert("Este e-mail já possui cadastro. Clique em Entrar.");
    setModoLogin("entrar");
    return;
  }

  alert(error.message);
  return;
}

const { error: loginAutomaticoError } = await supabase.auth.signInWithPassword({
  email: emailLogin,
  password: senhaLogin,
});

console.log("LOGIN APÓS CADASTRO ERROR:", loginAutomaticoError);

if (loginAutomaticoError) {
  alert("Conta criada! Agora confirme seu e-mail e faça login.");
  return;
}

alert("Conta criada e login realizado!");
setLoginAberto(false);

   await new Promise((resolve) => setTimeout(resolve, 2000));

const { error: loginError } = await supabase.auth.signInWithPassword({
  email: emailLogin,
  password: senhaLogin,
});

if (loginError) {
  alert("Conta criada! Agora confirme seu e-mail e faça login.");
  return;
}

alert("Conta criada e login realizado!");
setLoginAberto(false);
  }

async function loginEmail() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: emailLogin,
    password: senhaLogin,
  });

  console.log("LOGIN DATA:", data);
  console.log("LOGIN ERROR:", error);

  if (error) {
    alert(error.message);
    return;
  }

  setLoginAberto(false);
}
async function recuperarSenha() {
  if (!emailLogin.trim()) {
    alert("Digite seu e-mail para recuperar a senha.");
    return;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(emailLogin, {
    redirectTo:
      typeof window !== "undefined"
        ? `${window.location.origin}/redefinir-senha`
        : undefined,
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Enviamos um link de recuperação para seu e-mail.");
}

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setNome("");
    setContato("");
    setCpf("");
  }

  async function salvarCadastroComplementar() {
  if (!cpfComplemento.trim()) {
    alert("Informe seu CPF.");
    return;
  }

  if (!nascimentoComplemento.trim()) {
    alert("Informe sua data de nascimento.");
    return;
  }

  const { error } = await supabase.auth.updateUser({
    data: {
  cpf: cpfComplemento,
  data_nascimento: nascimentoComplemento,
  celular,
},
  });

  if (error) {
    alert(error.message);
    return;
  }

  setCpf(cpfComplemento);
  setDataNascimento(nascimentoComplemento);
  setCompletarCadastroAberto(false);

  alert("Cadastro atualizado com sucesso!");
}

async function salvarMeusDados() {
  const { error } = await supabase.auth.updateUser({
    email: emailEdicao,
    data: {
      celular: celularEdicao,
    },
  });

  if (error) {
    alert(error.message);
    return;
  }

  setContato(emailEdicao);
  setCelular(celularEdicao);

  setMeusDadosAberto(false);

  alert("Dados atualizados com sucesso!");
}

  async function gerarPix() {
    if (!user) {
      alert("Faça login ou crie sua conta antes de finalizar a compra.");
      return;
    }

    if (!nome.trim()) return alert("Preencha seu nome completo.");
    if (!contato.trim()) return alert("Preencha seu e-mail.");
    if (!cpf.trim()) return alert("Preencha seu CPF.");
    if (!quantidade || quantidade < 1)
      return alert("Selecione pelo menos 1 passaporte.");

    try {
      setLoadingPix(true);

      const response = await fetch("/api/asaas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          valor: valorUnitario * quantidade,
          nome,
          email: contato,
          cpf,
          campanhaId: campanhaSelecionada?.id,
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

  return (
    <main
      className={`${league.variable} ${cinzel.variable} min-h-screen bg-[#061832] text-white overflow-hidden font-[family-name:var(--font-league)]`}
    >
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(35,201,151,.28),transparent_28%),radial-gradient(circle_at_85%_10%,rgba(30,136,229,.30),transparent_30%),linear-gradient(180deg,#061832_0%,#081f42_55%,#041021_100%)]" />
      <div className="fixed inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:54px_54px]" />

      <div className="relative z-10">
       <header className="max-w-7xl mx-auto px-5 md:px-8 pt-6">
  <div className="rounded-[2rem] bg-white/10 border border-white/15 px-6 py-4 flex items-center justify-between gap-8 shadow-2xl backdrop-blur-xl overflow-x-auto">

   <div
  onClick={() => (window.location.href = "/")}
  className="flex items-center gap-4 cursor-pointer flex-shrink-0"
>
  <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center overflow-hidden flex-shrink-0">
    <img
      src="/logo.png"
      alt="Passaporte da Sorte"
      className="w-10 h-10 object-contain"
    />
  </div>

  <div className="flex flex-col whitespace-nowrap">
    <h1 className="text-2xl font-black leading-none">
      Passaporte da Sorte
    </h1>

    <p className="text-white/50 text-sm mt-1">
      Clube de viagens e experiências
    </p>
  </div>
</div>

    <nav className="flex items-center gap-6 ml-auto flex-shrink-0">
      <button
        onClick={() => (window.location.href = "/resultados")}
        className="flex items-center gap-2 rounded-full px-4 py-3 text-white/85 hover:text-white hover:bg-white/10 transition font-black"
      >
        <Trophy className="w-5 h-5 text-[#23C997]" />
        Resultados
      </button>

      <button
        onClick={() => {
          document
            .getElementById("comprar")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
        className="flex items-center gap-2 rounded-full px-4 py-3 text-white/85 hover:text-white hover:bg-white/10 transition font-black"
      >
        <Briefcase className="w-5 h-5 text-[#23C997]" />
        Campanhas
      </button>

      {user && (
        <button
          onClick={() => (window.location.href = "/painel")}
          className="flex items-center gap-2 rounded-full px-4 py-3 text-white/85 hover:text-white hover:bg-white/10 transition font-black"
        >
          <Clover className="w-5 h-5 text-[#23C997]" />
          Milhas
          <span className="rounded-full bg-white/10 px-3 py-1">
            {saldoMilhas}
          </span>
        </button>
      )}

      {user && (
        <button
          onClick={() => (window.location.href = "/painel")}
          className="flex items-center gap-2 rounded-full bg-[#23C997] px-5 py-3 font-black text-[#061832] hover:scale-105 transition"
        >
          <Gauge className="w-5 h-5" />
          Meu Painel
        </button>
      )}

      {user ? (
        <div className="relative">
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="flex items-center gap-3 rounded-full bg-white/10 border border-white/15 px-4 py-2 hover:bg-white/15 transition"
          >
            <img
              src={user.user_metadata?.avatar_url || "/logo.png"}
              alt="Usuário"
              className="w-9 h-9 rounded-full object-cover"
            />

            <span className="text-sm font-black text-white max-w-[140px] truncate">
              {user.user_metadata?.full_name || user.email}
            </span>

            <ChevronDown className="w-4 h-4 text-white/60" />
          </button>

          {menuAberto && (
            <div className="absolute right-0 mt-3 w-48 rounded-2xl bg-white text-[#061832] shadow-2xl p-2 z-50">
              <button
                type="button"
                onClick={() => {
                  setMenuAberto(false);
                  setEmailEdicao(contato);
                  setCelularEdicao(celular);
                  setMeusDadosAberto(true);
                }}
                className="w-full text-left rounded-xl px-4 py-3 font-black hover:bg-slate-100"
              >
                Meus dados
              </button>

              <button
                onClick={logout}
                className="w-full text-left rounded-xl px-4 py-3 font-black hover:bg-slate-100"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setLoginAberto(true)}
          className="rounded-full bg-[#23C997] px-6 py-3 font-black text-[#061832] hover:scale-105 transition shadow-xl shadow-emerald-500/20"
        >
          Entrar / Criar conta
        </button>
      )}
    </nav>
  </div>
</header>

        <section className="max-w-7xl mx-auto px-5 md:px-8 pt-10 pb-16 grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <button
              onClick={() => {
                document
                  .getElementById("como-funciona")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="mb-5 rounded-full bg-[#23C997] px-6 py-3 font-black text-[#061832] hover:scale-105 transition"
            >
              Como funciona
            </button>

            <h2 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tight">
              Seu próximo destino pode começar aqui.
            </h2>

            <p className="mt-6 text-lg md:text-xl text-white/70 max-w-xl leading-relaxed">
              Participe de campanhas exclusivas, receba seu <b>PASS-ID</b>{" "}
              digital e viva a experiência de transformar sorte em viagem.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  document
                    .getElementById("comprar")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-full bg-[#23C997] px-8 py-4 font-black text-[#061832] hover:scale-105 transition shadow-xl shadow-emerald-500/20"
              >
                Comprar meu passaporte
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <div className="rounded-[2.2rem] bg-white/10 border border-white/15 overflow-hidden shadow-2xl backdrop-blur-xl">
              <div className="relative overflow-hidden rounded-[2.2rem] border border-white/15 shadow-2xl cursor-pointer hover:scale-[1.01] transition">
                <img
                  src={campanhaBanner?.imagem ?? "/maceio.jpg"}
                  alt={campanhaBanner?.destino ?? "Destino"}
                  className="h-96 w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#061832] via-[#061832]/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-white/60 text-sm font-black">
                    {campanhaBanner?.titulo ?? "Destino"}
                  </p>

                  <h3 className="text-5xl font-black text-white">
                    {campanhaBanner?.destino ?? "Destino"}
                  </h3>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-[#23C997] px-4 py-2 text-sm font-black text-[#061832]">
                      R$ {campanhaBanner?.preco}
                    </span>

                    <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white">
                      +{campanhaBanner?.milhas} milhas
                    </span>

                    <button
                      onClick={() => {
                        window.location.href = `/campanha/${campanhaBanner?.id}`;
                      }}
                      className="rounded-full bg-white text-[#061832] px-5 py-2 font-black hover:scale-105 transition"
                    >
                      Ver detalhes
                    </button>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const indexAtual = campanhas.findIndex(
                      (c) => c.id === campanhaBanner?.id
                    );
                    const anterior =
                      indexAtual <= 0 ? campanhas.length - 1 : indexAtual - 1;
                    setCampanhaBanner(campanhas[anterior]);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 px-4 py-3 text-white backdrop-blur-xl hover:bg-black/50 transition"
                >
                  ‹
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const indexAtual = campanhas.findIndex(
                      (c) => c.id === campanhaBanner?.id
                    );
                    const proximo =
                      indexAtual >= campanhas.length - 1 ? 0 : indexAtual + 1;
                    setCampanhaBanner(campanhas[proximo]);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/30 px-4 py-3 text-white backdrop-blur-xl hover:bg-black/50 transition"
                >
                  ›
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 mt-4">
                {campanhas.map((campanha) => (
                  <button
                    key={campanha.id}
                    onClick={() => setCampanhaBanner(campanha)}
                    className={`h-3 w-3 rounded-full transition ${
                      campanhaBanner?.id === campanha.id
                        ? "bg-[#23C997] w-8"
                        : "bg-white/30"
                    }`}
                  />
                ))}
              </div>

              <div className="p-6 md:p-8">
                <h3 className="text-2xl md:text-3xl font-black">
                  Viagem para casal + experiência exclusiva
                </h3>

                <p className="text-white/60 mt-2">
                  Um destino para transformar sorte em memória.
                </p>

                <div className="grid grid-cols-3 gap-3 mt-6">
                  <Mini
                    icon={<Ticket />}
                    label="Passaporte"
                    value={`R$ ${campanhaSelecionada?.preco ?? 3.99}`}
                  />
                  <Mini
                    icon={<Star />}
                    label="Milhas"
                    value={`+${campanhaSelecionada?.milhas ?? 10}`}
                  />
                  <Mini
                    icon={<MapPin />}
                    label="Sorteio"
                    value={campanhaSelecionada?.data_sorteio ?? "21/06"}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section
          id="como-funciona"
          className="max-w-7xl mx-auto px-5 md:px-8 py-10 grid md:grid-cols-3 gap-5"
        >
          <Step
            n="01"
            title="Escolha a campanha"
            text="Veja o destino disponível e escolha quantos passaportes deseja."
          />
          <Step
            n="02"
            title="Receba seu PASS-ID"
            text="Cada participação gera um código exclusivo, como PSD-0004821."
          />
          <Step
            n="03"
            title="Acumule milhas"
            text="Suas participações geram pontos para futuras vantagens."
          />
        </section>

        <section id="comprar" className="max-w-7xl mx-auto px-5 md:px-8 py-14">
          <div className="rounded-[2.2rem] bg-white text-[#061832] shadow-2xl p-6 md:p-8 border-4 border-[#23C997] relative overflow-hidden max-w-3xl mx-auto">
            <div className="absolute top-0 left-0 right-0 bg-[#23C997] text-[#061832] text-center py-2 font-black text-sm">
              🔥 CAMPANHA ATIVA
            </div>

            <div className="pt-8">
              <h3 className="text-3xl font-black">Garanta seu Passaporte</h3>

              <p className="text-slate-500 mt-2 mb-6">
                {user
                  ? "Seus dados foram preenchidos automaticamente pela sua conta."
                  : "Entre ou crie sua conta para finalizar a compra."}
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
  <>
    <Input
      label="Nome completo"
      value={nome}
      onChange={setNome}
      placeholder="Seu nome"
    />

    <Input
      label="E-mail"
      value={contato}
      onChange={setContato}
      placeholder="Digite seu e-mail"
    />

    <Input
      label="CPF"
      value={cpf}
      onChange={setCpf}
      placeholder="Digite seu CPF"
    />
    <input
  value={celular}
  onChange={(e) => {
  const value = e.target.value
    .replace(/\D/g, "")
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15);

  setCelular(value);
}}
  placeholder="Celular"
  className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
/>

    <input
  value={dataNascimento}
  onChange={(e) => setDataNascimento(e.target.value)}
  placeholder="Data de nascimento"
  type="date"
  className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
/>
  </>
)}

                <div>
                  <label className="text-sm font-black">
                    Escolha a campanha
                  </label>

                  <select
                    value={campanhaSelecionada?.id ?? ""}
                    onChange={(e) => {
                      const selecionada = campanhas.find(
                        (c) => String(c.id) === e.target.value
                      );

                      setCampanhaSelecionada(selecionada);
                    }}
                    className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
                  >
                    {campanhas.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.titulo} — {c.destino} — R$ {c.preco}
                      </option>
                    ))}
                  </select>
                </div>

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

                  <p className="text-xs text-slate-400 mt-2">
                    Escolha uma sugestão ou digite a quantidade desejada.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-100 p-4 flex justify-between font-black text-lg">
                  <span>Total</span>
                  <span>R$ {total}</span>
                </div>

                <button
                  onClick={gerarPix}
                  disabled={loadingPix}
                  className="w-full rounded-2xl py-4 bg-[#061832] text-white font-black hover:bg-[#0b244a] transition disabled:opacity-50"
                >
                  {loadingPix ? "Gerando PIX..." : "Finalizar compra"}
                </button>

                <p className="text-xs text-black/40 text-center mt-3">
                  🔒 Compra protegida • PASS-ID gerado automaticamente
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-5 md:px-8 py-14">
          <div className="rounded-[2rem] bg-white/10 border border-white/15 px-6 py-4 flex items-center justify-between gap-8">
            <div
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="cursor-pointer hover:scale-105 transition"
            >
              <Feature
                icon={<Gift />}
                title="Campanhas"
                text="Destinos, experiências e vantagens exclusivas."
              />
            </div>

            <div
              onClick={() => {
                window.location.href = "/painel";
              }}
              className="cursor-pointer hover:scale-105 transition"
            >
              <Feature
                icon={<User />}
                title="Meu Painel"
                text="Histórico de PASS-IDs, milhas e campanhas."
              />
            </div>

            <div
              onClick={() => {
                window.location.href = "/regulamento";
              }}
              className="cursor-pointer hover:scale-105 transition"
            >
              <Feature
                icon={<ShieldCheck />}
                title="Transparência"
                text="Regulamento, datas e informações em um só lugar."
              />
            </div>
          </div>
        </section>

        <footer className="max-w-7xl mx-auto px-5 md:px-8 py-12 text-center text-white/45 text-sm">
          <div className="flex flex-wrap items-center justify-center gap-6 mb-4">
            <a
              href="https://instagram.com/passaporte.dasorte"
              target="_blank"
              className="hover:text-white transition"
            >
              Instagram
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              className="hover:text-white transition"
            >
              Facebook
            </a>

            <a
              href="https://wa.me/5554999304474?text=Olá,%20vim%20pelo%20Passaporte%20da%20Sorte!"
              target="_blank"
              className="hover:text-white transition"
            >
              WhatsApp
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
            <a
              href="/termos"
              className="rounded-full bg-white/10 border border-white/15 px-5 py-3 text-sm font-black text-white hover:bg-white/15 transition"
            >
              Termos de Uso
            </a>

            <a
              href="/regulamento"
              className="rounded-full bg-[#23C997] px-5 py-3 text-sm font-black text-[#061832] hover:scale-105 transition"
            >
              Política de Privacidade e Regulamento
            </a>
          </div>

          <p>© Passaporte da Sorte — Todos os direitos reservados.</p>
        </footer>
      </div>

      {loginAberto && (
        <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="w-full max-w-md rounded-[2rem] bg-[#061832] border border-white/15 p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white">
                Entrar ou criar conta
              </h3>

              <button
                onClick={() => setLoginAberto(false)}
                className="text-white/60 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <p className="text-white/60 text-sm mt-2">
              Acesse sua carteira, PASS-IDs e milhas.
            </p>

            

<div className="flex rounded-2xl bg-white/10 p-1 mt-5">
  <button
    type="button"
    onClick={() => setModoLogin("entrar")}
    className={`flex-1 rounded-xl py-3 font-black ${
      modoLogin === "entrar"
        ? "bg-[#23C997] text-[#061832]"
        : "text-white/60"
    }`}
  >
    Entrar
  </button>

  <button
    type="button"
    onClick={() => setModoLogin("criar")}
    className={`flex-1 rounded-xl py-3 font-black ${
      modoLogin === "criar"
        ? "bg-[#23C997] text-[#061832]"
        : "text-white/60"
    }`}
  >
    Criar conta
  </button>
</div>

<div className="grid gap-3 mt-5">
  {modoLogin === "criar" && (
    <>
      <input
        value={nomeCadastro}
        onChange={(e) => setNomeCadastro(e.target.value)}
        placeholder="Nome completo"
        className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
      />

      <input
        value={cpfCadastro}
        onChange={(e) => {
          const value = e.target.value
            .replace(/\D/g, "")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
            .slice(0, 14);

          setCpfCadastro(value);
        }}
        placeholder="CPF"
        className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
      />

      <input
  value={celular}
  onChange={(e) => setCelular(e.target.value)}
  placeholder="Celular"
  className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
/>
    </>
  )}

  <input
    value={emailLogin}
    onChange={(e) => setEmailLogin(e.target.value)}
    placeholder="Seu e-mail"
    type="email"
    className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
  />

  <div className="relative">
    <input
      value={senhaLogin}
      onChange={(e) => setSenhaLogin(e.target.value)}
      placeholder="Sua senha"
      type={mostrarSenha ? "text" : "password"}
      className="w-full rounded-2xl px-4 py-3 pr-16 bg-white text-[#061832]"
    />

    <button
      type="button"
      onClick={() => setMostrarSenha(!mostrarSenha)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-[#061832]/60"
    >
      {mostrarSenha ? "Ocultar" : "Ver"}
    </button>
  </div>

  {modoLogin === "criar" && (
    <>
      <div className="relative">
        <input
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          placeholder="Confirmar senha"
          type={mostrarSenha ? "text" : "password"}
          className={`w-full rounded-2xl px-4 py-3 pr-16 bg-white text-[#061832] border-2 ${
            confirmarSenha && senhaLogin === confirmarSenha
              ? "border-[#23C997]"
              : confirmarSenha && senhaLogin !== confirmarSenha
              ? "border-red-500"
              : "border-transparent"
          }`}
        />

        <button
          type="button"
          onClick={() => setMostrarSenha(!mostrarSenha)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-black text-[#061832]/60"
        >
          {mostrarSenha ? "Ocultar" : "Ver"}
        </button>
      </div>

      {confirmarSenha && senhaLogin !== confirmarSenha && (
        <p className="text-red-400 text-sm font-semibold">
          As senhas não conferem.
        </p>
      )}

      {confirmarSenha && senhaLogin === confirmarSenha && (
        <p className="text-[#23C997] text-sm font-semibold">
          ✓ Senhas conferem
        </p>
      )}
    </>
  )}

  {erroCadastro && (
    <p className="text-red-400 text-sm font-semibold">
      {erroCadastro}
    </p>
  )}

  {modoLogin === "criar" ? (
    <button
      type="button"
      onClick={criarConta}
      className="rounded-2xl bg-[#23C997] text-[#061832] font-black py-3"
    >
      Criar conta
    </button>
  ) : (
    <button
      type="button"
      onClick={loginEmail}
      className="rounded-2xl bg-white text-[#061832] font-black py-3"
    >
      Entrar com e-mail
    </button>
    
  )}

{modoLogin === "entrar" && (
  <button
    type="button"
    onClick={recuperarSenha}
    className="text-white/60 hover:text-white text-sm font-bold"
  >
    Esqueci minha senha
  </button>
)}

  <div className="flex items-center gap-3 my-2">
    <div className="h-px bg-white/20 flex-1" />
    <span className="text-white/40 text-xs font-bold">OU</span>
    <div className="h-px bg-white/20 flex-1" />
  </div>

  <button
    type="button"
    onClick={loginGoogle}
    className="rounded-2xl bg-white/10 border border-white/20 text-white font-black py-3"
  >
    Entrar com Google
  </button>
</div>
          </div>
        </div>
      )}

      {completarCadastroAberto && (
  <div className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-5">
    <div className="w-full max-w-md rounded-[2rem] bg-[#061832] border border-white/15 p-6 shadow-2xl">
      <h3 className="text-2xl font-black text-white">
        Complete seu cadastro
      </h3>

      <p className="text-white/60 text-sm mt-2">
        Para comprar seus PASS-IDs, precisamos do seu CPF e data de nascimento.
      </p>

      <div className="grid gap-3 mt-5">
        <input
          value={cpfComplemento}
          onChange={(e) => {
            const value = e.target.value
              .replace(/\D/g, "")
              .replace(/(\d{3})(\d)/, "$1.$2")
              .replace(/(\d{3})(\d)/, "$1.$2")
              .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
              .slice(0, 14);

            setCpfComplemento(value);
          }}
          placeholder="CPF"
          className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
        />

        <input
          value={nascimentoComplemento}
          onChange={(e) => setNascimentoComplemento(e.target.value)}
          type="date"
          className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
        />

        <button
          type="button"
          onClick={salvarCadastroComplementar}
          className="rounded-2xl bg-[#23C997] text-[#061832] font-black py-3"
        >
          Salvar cadastro
        </button>
      </div>
    </div>
  </div>
)}

{meusDadosAberto && (
  <div className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-5">
    <div className="w-full max-w-md rounded-[2rem] bg-[#061832] border border-white/15 p-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-black text-white">
          Meus Dados
        </h3>

        <button
          onClick={() => setMeusDadosAberto(false)}
          className="text-white/60 hover:text-white text-2xl"
        >
          ×
        </button>
      </div>

      <div className="grid gap-3 mt-5">

        <input
          value={emailEdicao}
          onChange={(e) => setEmailEdicao(e.target.value)}
          placeholder="E-mail"
          className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
        />

        <input
          value={celularEdicao}
          onChange={(e) => setCelularEdicao(e.target.value)}
          placeholder="Celular"
          className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
        />

        <input
          value={cpf}
          disabled
          className="rounded-2xl px-4 py-3 bg-slate-200 text-slate-500 cursor-not-allowed"
        />

        <input
          value={dataNascimento}
          disabled
          className="rounded-2xl px-4 py-3 bg-slate-200 text-slate-500 cursor-not-allowed"
        />

        <button
          onClick={salvarMeusDados}
          className="rounded-2xl bg-[#23C997] text-[#061832] font-black py-3"
        >
          Salvar alterações
        </button>

      </div>
    </div>
  </div>
)}
    </main>
  );
}

function Mini({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 p-3 text-center text-white">
      <div className="mx-auto w-5 h-5 mb-1 opacity-80">{icon}</div>
      <p className="text-xs text-white/55">{label}</p>
      <p className="font-black">{value}</p>
    </div>
  );
}

function Step({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="rounded-[2rem] bg-white/10 border border-white/15 p-7 backdrop-blur-xl">
      <p className="text-[#23C997] font-black text-sm font-[family-name:var(--font-cinzel)]">
        {n}
      </p>
      <h3 className="text-2xl font-black mt-2">{title}</h3>
      <p className="text-white/65 mt-3">{text}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 rounded-2xl bg-[#23C997] text-[#061832] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="text-xl font-black">{title}</h4>
        <p className="text-white/65 mt-1">{text}</p>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-black">{label}</label>
      <input
  value={value}
  onChange={(e) => onChange(e.target.value)}
  placeholder={placeholder}
  disabled={disabled}
  className={`mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ${
    disabled ? "bg-slate-100 text-slate-500 cursor-not-allowed" : ""
  }`}
/>
    </div>
  );
}