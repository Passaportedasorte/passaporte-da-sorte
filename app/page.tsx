"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { League_Spartan, Cinzel } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";


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
  CircleHelp,
  Sparkles,
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

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  if (params.get("login") === "1") {
    setLoginAberto(true);
  }
}, []);

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
  const [cepCadastro, setCepCadastro] = useState("");
const [ruaCadastro, setRuaCadastro] = useState("");
const [numeroCadastro, setNumeroCadastro] = useState("");
const [complementoCadastro, setComplementoCadastro] = useState("");
const [bairroCadastro, setBairroCadastro] = useState("");
const [cidadeCadastro, setCidadeCadastro] = useState("");
const [ufCadastro, setUfCadastro] = useState("");
  const [meusDadosAberto, setMeusDadosAberto] = useState(false);
  const [cepEdicao, setCepEdicao] = useState("");
const [logradouroEdicao, setLogradouroEdicao] = useState("");
const [numeroEdicao, setNumeroEdicao] = useState("");
const [bairroEdicao, setBairroEdicao] = useState("");
const [cidadeEdicao, setCidadeEdicao] = useState("");
const [estadoEdicao, setEstadoEdicao] = useState("");
  const [emailEdicao, setEmailEdicao] = useState("");
  const [celularEdicao, setCelularEdicao] = useState("");
  const [ultimosResultados, setUltimosResultados] = useState<any[]>([]);

  useEffect(() => {
    async function buscarCampanhas() {
      const { data } = await supabase
  .from("campaigns")
  .select("*")
  .eq("status", "ATIVA")
  .order("id", { ascending: false });

      

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



async function buscarCepCadastro(cep: string) {
  const cepLimpo = cep.replace(/\D/g, "");

  if (cepLimpo.length !== 8) return;

  const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  const dados = await resposta.json();

  if (dados.erro) {
    alert("CEP não encontrado.");
    return;
  }

  setRuaCadastro(dados.logradouro || "");
  setBairroCadastro(dados.bairro || "");
  setCidadeCadastro(dados.localidade || "");
  setUfCadastro(dados.uf || "");
}

async function buscarCep(cepDigitado: string) {
  const cepLimpo = cepDigitado.replace(/\D/g, "");

  setCepCadastro(cepLimpo);

  if (cepLimpo.length !== 8) return;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await response.json();

    if (data?.erro) {
      alert("CEP não encontrado.");
      return;
    }

    setCidadeCadastro(data.localidade || "");
    setUfCadastro(data.uf || "");
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    alert("Não foi possível buscar o CEP.");
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
  async function carregarUltimosResultados() {
    const { data, error } = await supabase
      .from("resultados_federal")
      .select(`
        *,
        campaigns (
          titulo,
          destino
        )
      `)
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Erro ao buscar últimos resultados:", error);
      return;
    }

    setUltimosResultados(data ?? []);
  }

  carregarUltimosResultados();
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

function validarCPF(cpf: string) {
  const numeros = cpf.replace(/\D/g, "");

  if (numeros.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(numeros)) return false;

  let soma = 0;

  for (let i = 0; i < 9; i++) {
    soma += Number(numeros[i]) * (10 - i);
  }

  let digito1 = 11 - (soma % 11);
  if (digito1 >= 10) digito1 = 0;

  if (digito1 !== Number(numeros[9])) return false;

  soma = 0;

  for (let i = 0; i < 10; i++) {
    soma += Number(numeros[i]) * (11 - i);
  }

  let digito2 = 11 - (soma % 11);
  if (digito2 >= 10) digito2 = 0;

  return digito2 === Number(numeros[10]);
}

function maiorDe18Anos(data: string) {
  if (!data) return false;

  const nascimento = new Date(data);
  const hoje = new Date();

  let idade = hoje.getFullYear() - nascimento.getFullYear();

  const mesAtual = hoje.getMonth();
  const diaAtual = hoje.getDate();

  const mesNascimento = nascimento.getMonth();
  const diaNascimento = nascimento.getDate();

  if (
    mesAtual < mesNascimento ||
    (mesAtual === mesNascimento && diaAtual < diaNascimento)
  ) {
    idade--;
  }

  return idade >= 18;
}

async function criarConta() {
  if (!nomeCadastro.trim()) return alert("Preencha seu nome completo.");
  if (!emailLogin.trim()) return alert("Preencha seu e-mail.");
  if (!cpfCadastro.trim()) return alert("Preencha seu CPF.");

  if (!validarCPF(cpfCadastro)) {
    alert("CPF inválido. Verifique os números e tente novamente.");
    return;
  }

  if (!celular.trim()) return alert("Preencha seu celular.");
  if (!dataNascimento.trim()) return alert("Preencha sua data de nascimento.");
  if (!maiorDe18Anos(dataNascimento)) {
  return alert("É necessário ter 18 anos ou mais para participar.");
}
  if (!cepCadastro.trim()) return alert("Preencha seu CEP.");
  if (!ruaCadastro.trim()) return alert("Preencha sua rua.");
  if (!numeroCadastro.trim()) return alert("Preencha o número.");
  if (!bairroCadastro.trim()) return alert("Preencha seu bairro.");
  if (!cidadeCadastro.trim()) return alert("Informe sua cidade.");
  if (!ufCadastro.trim()) return alert("Informe seu estado.");
  if (!senhaLogin.trim()) return alert("Crie uma senha.");

  if (senhaLogin !== confirmarSenha) {
    setErroCadastro("As senhas não conferem.");
    return;
  }

  setErroCadastro("");

  const { data: cpfExistente } = await supabase
  .from("user_profiles")
  .select("id")
  .eq("cpf", cpfCadastro)
  .maybeSingle();

if (cpfExistente) {
  alert("Este CPF já está cadastrado.");
  return;
}


  const { data, error } = await supabase.auth.signUp({
    email: emailLogin,
    password: senhaLogin,
    options: {
      data: {
        full_name: nomeCadastro,
        cpf: cpfCadastro,
        celular,
        data_nascimento: dataNascimento,
        cep: cepCadastro,
        rua: ruaCadastro,
        numero: numeroCadastro,
        complemento: complementoCadastro,
        bairro: bairroCadastro,
        cidade: cidadeCadastro,
        uf: ufCadastro,
      },
    },
  });

  if (error) {
    if (error.message.includes("User already registered")) {
      alert("Este e-mail já possui cadastro. Clique em Entrar.");
      setModoLogin("entrar");
      return;
    }

    alert(error.message);
    return;
  }

  if (data.user) {
    const { error: profileError } = await supabase
      .from("user_profiles")
      .upsert({
        user_id: data.user.id,
        nome: nomeCadastro,
        email: emailLogin,
        cpf: cpfCadastro,
        celular,
        data_nascimento: dataNascimento,
        cep: cepCadastro,
        rua: ruaCadastro,
        numero: numeroCadastro,
        complemento: complementoCadastro,
        bairro: bairroCadastro,
        cidade: cidadeCadastro,
        uf: ufCadastro,
      });

    if (profileError) {
      console.error("Erro ao salvar perfil:", profileError);
    }
  }

  const { error: loginAutomaticoError } =
    await supabase.auth.signInWithPassword({
      email: emailLogin,
      password: senhaLogin,
    });

  if (loginAutomaticoError) {
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
  const { data: userData } = await supabase.auth.getUser();
  const usuarioAtual = userData.user;

  if (!usuarioAtual?.id) {
    alert("Usuário não encontrado.");
    return;
  }

  if (!cpfComplemento.trim()) return alert("Informe seu CPF.");
  if (!nascimentoComplemento.trim()) return alert("Informe sua data de nascimento.");
  if (!maiorDe18Anos(nascimentoComplemento)) {
  return alert("É necessário ter 18 anos ou mais para participar.");
}
  if (!celular.trim()) return alert("Informe seu celular.");
  if (!cepCadastro.trim()) return alert("Informe seu CEP.");
  if (!ruaCadastro.trim()) return alert("Informe sua rua.");
  if (!numeroCadastro.trim()) return alert("Informe o número.");
  if (!bairroCadastro.trim()) return alert("Informe seu bairro.");
  if (!cidadeCadastro.trim()) return alert("Informe sua cidade.");
  if (!ufCadastro.trim()) return alert("Informe seu estado.");

  const { data: cpfExistente } = await supabase
  .from("user_profiles")
  .select("id")
  .eq("cpf", cpfComplemento)
  .neq("user_id", usuarioAtual.id)
  .maybeSingle();

if (cpfExistente) {
  alert("Este CPF já está cadastrado.");
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

  const { error: profileError } = await supabase
    .from("user_profiles")
    .upsert(
      {
        user_id: usuarioAtual.id,
        nome: usuarioAtual.user_metadata?.full_name || nome || "",
        email: usuarioAtual.email || contato || "",
        cpf: cpfComplemento,
        celular,
        data_nascimento: nascimentoComplemento,
        cep: cepCadastro,
        rua: ruaCadastro,
        numero: numeroCadastro,
        complemento: complementoCadastro,
        bairro: bairroCadastro,
        cidade: cidadeCadastro,
        uf: ufCadastro,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id",
      }
    );

  if (profileError) {
    alert(profileError.message);
    return;
  }

  setCpf(cpfComplemento);
  setDataNascimento(nascimentoComplemento);
  setCompletarCadastroAberto(false);

  alert("Cadastro atualizado com sucesso!");
}

async function salvarMeusDados() {
  const { data: authData, error } = await supabase.auth.updateUser({
    email: emailEdicao,
    data: {
      celular: celularEdicao,
    },
  });

  if (error) {
    alert(error.message);
    return;
  }

  const userId = authData.user?.id;

  if (!userId) {
    alert("Usuário não encontrado.");
    return;
  }

  const { error: erroPerfil } = await supabase
    .from("user_profiles")
    .update({
      email: emailEdicao,
      celular: celularEdicao,
      cep: cepEdicao,
      rua: logradouroEdicao,
      numero: numeroEdicao,
      bairro: bairroEdicao,
      cidade: cidadeEdicao,
      uf: estadoEdicao,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (erroPerfil) {
    alert(erroPerfil.message);
    return;
  }

  setContato(emailEdicao);
  setCelular(celularEdicao);

  setMeusDadosAberto(false);

  alert("Dados atualizados com sucesso!");
}

async function abrirMeusDados() {
  const { data: userData } = await supabase.auth.getUser();
  const usuarioAtual = userData.user;

  if (!usuarioAtual?.id) {
    alert("Usuário não encontrado.");
    return;
  }

  let { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", usuarioAtual.id)
    .maybeSingle();

  if (!data && usuarioAtual.email) {
    const resultado = await supabase
      .from("user_profiles")
      .select("*")
      .eq("email", usuarioAtual.email)
      .maybeSingle();

    data = resultado.data;
    error = resultado.error;
  }

  if (error) {
    alert(error.message);
    return;
  }

  if (!data) {
    alert("Perfil não encontrado.");
    return;
  }

  setEmailEdicao(data.email || usuarioAtual.email || "");
  setCelularEdicao(data.celular || "");
  setCpf(data.cpf || "");
  setDataNascimento(data.data_nascimento || "");

  setCepEdicao(data.cep || "");
  setLogradouroEdicao(data.rua || "");
  setNumeroEdicao(data.numero || "");
  setBairroEdicao(data.bairro || "");
  setCidadeEdicao(data.cidade || "");
  setEstadoEdicao(data.uf || "");

  setMeusDadosAberto(true);
}
async function buscarCepEdicao(cep: string) {
  const cepLimpo = cep.replace(/\D/g, "");

  if (cepLimpo.length !== 8) return;

  const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  const dados = await resposta.json();

  if (dados.erro) {
    alert("CEP não encontrado.");
    return;
  }

  setLogradouroEdicao(dados.logradouro || "");
  setBairroEdicao(dados.bairro || "");
  setCidadeEdicao(dados.localidade || "");
  setEstadoEdicao(dados.uf || "");
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

  const imagensHero = [
  "/malta-hero.jpg",
  "/malta-2.jpg",
  "/malta-3.jpg",
  "/italia-1.jpg",
];

const [imagemAtual, setImagemAtual] = useState(0);

useEffect(() => {
  const intervalo = setInterval(() => {
    setImagemAtual((prev) => (prev + 1) % imagensHero.length);
  }, 4000);

  return () => clearInterval(intervalo);
}, []);

  return (
    <main
      className={`${league.variable} ${cinzel.variable} min-h-screen bg-[#061832] text-white overflow-hidden pb-24 font-[family-name:var(--font-league)]`}
    >
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(35,201,151,.28),transparent_28%),radial-gradient(circle_at_85%_10%,rgba(30,136,229,.30),transparent_30%),linear-gradient(180deg,#061832_0%,#081f42_55%,#041021_100%)]" />
      <div className="fixed inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:54px_54px]" />

      <div className="relative z-10">
       <header className="sticky top-4 z-[9999]">


  <div className="rounded-[2rem] bg-white/10 border border-white/15 px-4 md:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 shadow-2xl backdrop-blur-xl relative">

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

    <nav className="w-full md:w-auto grid grid-cols-2 md:flex md:items-center gap-3 md:gap-4 md:ml-auto min-w-0">
      <button
        onClick={() => (window.location.href = "/resultados")}
        className="flex items-center gap-2 rounded-full px-3 py-3 text-white/85 hover:text-white hover:bg-white/10 transition font-black"
      >
        <Trophy className="w-5 h-5 text-[#23C997]" />
        Resultados
      </button>

   <button
  onClick={() => (window.location.href = "/campanhas")}
  className="flex items-center gap-2 rounded-full px-3 py-3 text-white/85 hover:text-white hover:bg-white/10 transition font-black"
>
  <Briefcase className="w-5 h-5 text-[#23C997]" />
  Campanhas
</button>

      {user && (
        <button
          onClick={() => (window.location.href = "/minhas-milhas")}
          className="flex items-center gap-2 rounded-full px-3 py-3 text-white/85 hover:text-white hover:bg-white/10 transition font-black"
        >
          <Clover className="w-5 h-5 text-[#23C997]" />
          Milhas
          <span className="rounded-full bg-white/10 px-3 py-1">
            {saldoMilhas}
          </span>
        </button>
      )}

       <button
  onClick={() => (window.location.href = "/minhas-milhas")}
  className="flex items-center justify-center gap-2 rounded-full px-3 py-3 text-white/85 hover:text-white hover:bg-white/10 transition font-black"
>
  <Sparkles className="w-5 h-5 text-[#23C997]" />
  Clube Passaporte
</button>

      {user && (
        <button
          onClick={() => (window.location.href = "/painel")}
          className="flex items-center gap-2 rounded-full bg-[#23C997] px-3 py-3 font-black text-[#061832] hover:scale-105 transition"
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

            <span className="text-sm font-black text-white max-w-[110px] truncate">
              {user.user_metadata?.full_name || user.email}
            </span>

            <ChevronDown className="w-4 h-4 text-white/60" />
          </button>

          {menuAberto && (
            <div className="absolute right-0 top-full mt-3 w-48 rounded-2xl bg-white text-[#061832] shadow-2xl p-2 z-[9999]">
              <button
  type="button"
  onClick={() => {
    setMenuAberto(false);
    abrirMeusDados();
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
          className="col-span-2 md:col-span-1 rounded-full bg-[#23C997] px-5 py-3 font-black text-[#061832] hover:scale-105 transition shadow-xl shadow-emerald-500/20"
        >
          Entrar / Criar conta
        </button>
      )}
    </nav>
  </div>
</header>

     <section className="relative max-w-7xl mx-auto px-5 md:px-8 py-32 rounded-[3rem] overflow-hidden mt-8">
  <div className="absolute inset-0">
    <img
  src={imagensHero[imagemAtual]}
  alt="Destino"
  className="w-full h-full object-cover transition-all duration-1000"
/>

    <div className="absolute inset-0 bg-[#061832]/50" />
  </div>

  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    className="relative z-10 text-center max-w-4xl mx-auto"
  >
    <h2 className="text-5xl md:text-7xl font-black leading-[0.95] tracking-tight">
  Seu próximo carimbo no passaporte pode estar mais perto do que você imagina.
</h2>

    <p className="mt-6 text-lg md:text-2xl text-white/90 max-w-2xl mx-auto text-center leading-relaxed">
  Garanta seus PASS-IDs, acumule milhas e participe da campanha para viver uma experiência internacional inesquecível. 🍀✈️🌍
</p>
    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
      <button
        onClick={() => (window.location.href = "/campanha/1")}
        className="rounded-full bg-[#23C997] px-8 py-4 font-black text-[#061832] hover:scale-105 transition shadow-xl shadow-emerald-500/20"
      >
        🍀 Participar da Campanha
      </button>

      <button
  onClick={() => (window.location.href = "/campanha/1")}
  className="rounded-full border border-white/20 bg-white/10 px-6 py-4 font-black hover:bg-white/15 transition"
>
  Ver detalhes da campanha
</button>
    </div>
  </motion.div>
</section>

{campanhaBanner?.video_url && (
  <section className="max-w-7xl mx-auto px-5 md:px-8 py-12">
    <div className="text-center mb-8">
      <p className="text-[#23C997] font-black">
        CONHEÇA A EXPERIÊNCIA
      </p>

      <h2 className="text-4xl md:text-5xl font-black mt-2">
        Veja o que te espera nessa campanha
      </h2>
    </div>

    <div className="w-full max-w-[360px] mx-auto aspect-[9/16] rounded-[2rem] overflow-hidden border border-white/15 bg-black shadow-2xl">
      <video
        src={campanhaBanner.video_url}
        controls
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  </section>
)}
<section className="max-w-7xl mx-auto px-5 md:px-8 py-8">
  <div className="grid md:grid-cols-3 gap-4">

    <div className="rounded-[2rem] bg-white/10 border border-white/15 p-6 backdrop-blur-xl">
      <div className="text-3xl mb-3">🍀</div>

      <h3 className="text-xl font-black">
        PASS-IDs digitais
      </h3>

      <p className="text-white/60 mt-2">
        Todos os PASS-IDs são gerados automaticamente e ficam disponíveis no seu painel.
      </p>
    </div>

    <div className="rounded-[2rem] bg-white/10 border border-white/15 p-6 backdrop-blur-xl">
      <div className="text-3xl mb-3">🏆</div>

      <h3 className="text-xl font-black">
        Resultado oficial
      </h3>

      <p className="text-white/60 mt-2">
        Os sorteios são vinculados aos números da Loteria Federal para total transparência.
      </p>
    </div>

    <div className="rounded-[2rem] bg-white/10 border border-white/15 p-6 backdrop-blur-xl">
      <div className="text-3xl mb-3">✈️</div>

      <h3 className="text-xl font-black">
        Acumule milhas
      </h3>

      <p className="text-white/60 mt-2">
        Cada participação gera milhas que poderão ser utilizadas em futuras experiências.
      </p>
    </div>

  </div>
</section>

<section className="max-w-7xl mx-auto px-5 md:px-8 py-12">
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
    <div>
      <p className="text-[#23C997] font-black">
        CAMPANHA EM DESTAQUE
      </p>

      <h2 className="text-4xl md:text-5xl font-black mt-2">
        Escolha sua próxima experiência
      </h2>
    </div>

    <button
      onClick={() => (window.location.href = "/campanhas")}
      className="rounded-2xl bg-white/10 border border-white/15 px-6 py-4 font-black hover:bg-white/15 transition"
    >
      Ver todas
    </button>
  </div>

  <motion.div
    initial={{ opacity: 0, scale: 0.94 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.7, delay: 0.1 }}
    className="max-w-5xl mx-auto"
  >
    <div className="rounded-[2.2rem] bg-white/10 border border-white/15 overflow-hidden shadow-2xl backdrop-blur-xl">
      <div className="relative overflow-hidden rounded-[2.2rem] border border-white/15 shadow-2xl cursor-pointer hover:scale-[1.01] transition">
        <img
          src={campanhaBanner?.imagem || "/logo.png"}
          alt={campanhaBanner?.destino ?? "Destino"}
          className="h-[460px] w-full object-cover"
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
        <h3>
  {campanhaBanner?.titulo}
</h3>

<p>
  {campanhaBanner?.descricao_curta}
</p>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <Mini
            icon={<Ticket />}
            label="Passaporte"
            value={`R$ ${campanhaBanner?.preco ?? "—"}`}
          />
          <Mini
            icon={<Star />}
            label="Milhas"
            value={`+${campanhaBanner?.milhas ?? 10}`}
          />
          <Mini
            icon={<MapPin />}
            label="Sorteio"
            value={campanhaBanner?.data_sorteio ?? "Em breve"}
          />
        </div>
      </div>
    </div>
  </motion.div>
</section>

        

        <section id="como-funciona" className="max-w-7xl mx-auto px-5 md:px-8 py-16">
  <div className="text-center">
    <p className="text-[#23C997] font-black">
      COMO FUNCIONA
    </p>

    <h2 className="text-4xl md:text-5xl font-black mt-2">
      Simples, transparente e emocionante.
    </h2>

    <p className="text-white/60 max-w-2xl mx-auto mt-4 text-lg">
      Você escolhe uma campanha, compra seus PASS-IDs, acumula milhas e acompanha o resultado oficial pela Loteria Federal.
    </p>
  </div>

  <div className="grid md:grid-cols-5 gap-4 mt-10">
    {[
      ["1", "Escolha uma campanha", "Veja os destinos disponíveis e escolha sua experiência."],
      ["2", "Compre PASS-IDs", "Cada PASS-ID aumenta sua participação na campanha."],
      ["3", "Acumule milhas", "A cada compra você soma milhas na sua carteira."],
      ["4", "Aguarde a Federal", "O resultado é definido pelos últimos algarismos dos cinco primeiros prêmios da Loteria Federal."],
      ["5", "Confira o resultado", "Veja o PASS-ID vencedor e acompanhe tudo com transparência."],
    ].map((item) => (
      <div
        key={item[0]}
        className="rounded-[2rem] bg-white/10 border border-white/15 p-5 text-center backdrop-blur-xl"
      >
        <div className="mx-auto w-12 h-12 rounded-2xl bg-[#23C997] text-[#061832] flex items-center justify-center font-black text-xl">
          {item[0]}
        </div>

        <h3 className="text-xl font-black mt-4">
          {item[1]}
        </h3>

        <p className="text-white/60 text-sm mt-2">
          {item[2]}
        </p>
      </div>
    ))}
  </div>
</section>

<section className="max-w-7xl mx-auto px-5 md:px-8 py-14">
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
    <div>
      <p className="text-[#23C997] font-black">
        AVALIAÇÕES
      </p>

      <h2 className="text-4xl md:text-5xl font-black mt-2">
        O que nossos participantes estão dizendo
      </h2>

      <p className="text-white/60 mt-3 max-w-2xl text-lg">
        Quem já comprou PASS-IDs compartilha a experiência com a plataforma.
      </p>
    </div>
  </div>

  <div className="grid md:grid-cols-3 gap-6 mt-8">
    <DepoimentoCard
      nome="Juliana M."
      cidade="Paranavaí/PR"
      texto="Entrei só pra conhecer a plataforma e acabei gostando bastante, É tudo bem simples, espero ganhar kkkk."
    />

    <DepoimentoCard
      nome="Rafael P."
      cidade="Carapicuiba/SP"
      texto="Achei interessante a ideia das milhas. Fiz meu cadastro espero ganhar, uma vez a sorte vem."
    />

    <DepoimentoCard
      nome="Camila S."
      cidade="São Paulo/SP"
      texto="O que mais gostei foi a área do cliente, Dá para acompanhar todos os números por lá."
    />
  </div>
</section>

      <section className="relative max-w-7xl mx-auto px-5 md:px-8 py-20 rounded-[3rem] overflow-hidden">
<div className="absolute inset-0">
  {imagensHero.map((imagem, index) => (
    <img
      key={imagem}
      src={imagem}
      alt="Destino"
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
        index === imagemAtual ? "opacity-100" : "opacity-0"
      }`}
    />
  ))}

  <div className="absolute inset-0 bg-black/45" />
</div>

  <div className="rounded-[2.5rem] bg-white/10 border border-white/15 p-10 text-center backdrop-blur-xl">

    <h2 className="text-4xl md:text-5xl font-black">
      Pronto para viajar?
    </h2>

    <p className="text-white/60 max-w-2xl mx-auto mt-4 text-lg">
      Escolha uma campanha, acumule milhas e participe dos sorteios
      oficiais vinculados à Loteria Federal.
    </p>

    <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">

      <button
        onClick={() => (window.location.href = "/campanhas")}
        className="rounded-2xl bg-[#23C997] text-[#061832] px-8 py-4 font-black hover:scale-105 transition"
      >
        Ver Destino
      </button>

      <button
        onClick={() => (window.location.href = "/resultados")}
        className="rounded-2xl bg-white/10 border border-white/15 px-8 py-4 font-black hover:bg-white/15 transition"
      >
        Ver Resultados
      </button>

    </div>
  </div>
</section>

<section className="max-w-7xl mx-auto px-5 md:px-8 py-12">
  <div className="rounded-[2rem] bg-[#23C997] text-[#061832] p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div>
      <p className="font-black opacity-70">
        🍀 CLUBE DE BENEFÍCIOS
      </p>

      <h2 className="text-3xl md:text-5xl font-black mt-2">
        Acumule milhas e troque por recompensas.
      </h2>

      <p className="mt-3 text-lg opacity-80 max-w-2xl">
        Participe das campanhas, acumule milhas e use na Central de
        Recompensas para resgatar PASS-IDs, cupons e benefícios especiais.
      </p>
    </div>

    <a
      href="/minhas-milhas"
      className="rounded-2xl bg-[#061832] text-white px-6 py-4 font-black text-center hover:scale-[1.02] transition"
    >
      Conhecer Benefícios
    </a>
  </div>
</section>

        <section className="max-w-7xl mx-auto px-5 md:px-8 py-14">
          <div className="rounded-[2rem] bg-white/10 border border-white/15 p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="cursor-pointer hover:scale-[1.02] transition rounded-2xl bg-white/5 border border-white/10 p-4"
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
              className="cursor-pointer hover:scale-[1.02] transition rounded-2xl bg-white/5 border border-white/10 p-4"
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
              className="cursor-pointer hover:scale-[1.02] transition rounded-2xl bg-white/5 border border-white/10 p-4"
            >
              <Feature
                icon={<ShieldCheck />}
                title="Transparência"
                text="Regulamento, datas e informações em um só lugar."
              />
            </div>

             <div
  onClick={() => {
    window.location.href = "/faq";
  }}
  className="cursor-pointer hover:scale-[1.02] transition rounded-2xl bg-white/5 border border-white/10 p-4"
>
  <Feature
    icon={<CircleHelp />}
    title="FAQ"
    text="Tire dúvidas sobre PASS-IDs, milhas e participação."
  />
</div>
          </div>
        </section>



        <SiteFooter />
      </div>

      {loginAberto && (
        <div className="fixed inset-0 z-[999] bg-[#061832]/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-10 px-5">
          <div className="rounded-[2rem] bg-[#061832] w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
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

<input
  value={dataNascimento}
  onChange={(e) => setDataNascimento(e.target.value)}
  placeholder="Data de nascimento (DD/MM/AAAA)"
  className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
/>

 <input
  value={cepCadastro}
  onChange={(e) => {
  let valor = e.target.value.replace(/\D/g, "");

  valor = valor.slice(0, 8);

  if (valor.length > 5) {
    valor = valor.replace(/^(\d{5})(\d+)/, "$1-$2");
  }

  buscarCep(valor);
}}
  placeholder="CEP"
  className="rounded-2xl bg-white text-[#061832] px-4 py-3 outline-none"
/>

<div className="grid grid-cols-2 gap-3">
  <input
    value={cidadeCadastro}
    readOnly
    placeholder="Cidade"
    className="rounded-2xl bg-white/80 text-[#061832] px-4 py-3 outline-none"
  />

  <input
    value={ufCadastro}
    readOnly
    placeholder="UF"
    className="rounded-2xl bg-white/80 text-[#061832] px-4 py-3 outline-none"
  />
</div>

<input
  value={ruaCadastro}
  onChange={(e) => setRuaCadastro(e.target.value)}
  placeholder="Rua"
  className="rounded-2xl bg-white text-[#061832] px-4 py-3 outline-none"
/>

<input
  value={numeroCadastro}
  inputMode="numeric"
  maxLength={6}
  onChange={(e) => {
  const valor = e.target.value.replace(/\D/g, "");
  setNumeroCadastro(valor);
}}

  placeholder="Número"
  className="rounded-2xl bg-white text-[#061832] px-4 py-3 outline-none"
/>

<input
  value={bairroCadastro}
  onChange={(e) => setBairroCadastro(e.target.value)}
  placeholder="Bairro"
  className="rounded-2xl bg-white text-[#061832] px-4 py-3 outline-none"
/>

<input
  value={complementoCadastro}
  onChange={(e) => setComplementoCadastro(e.target.value)}
  placeholder="Complemento (opcional)"
  className="rounded-2xl bg-white text-[#061832] px-4 py-3 outline-none"
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
  <div className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
  <div className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-[2rem] bg-[#061832] border border-white/15 p-6 shadow-2xl">
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

        <input
  value={celular}
  onChange={(e) => setCelular(e.target.value.replace(/\D/g, ""))}
  placeholder="Celular"
  inputMode="numeric"
  className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
/>

<input
  value={cepCadastro}
  onChange={(e) => {
    let valor = e.target.value.replace(/\D/g, "");

    valor = valor.slice(0, 8);

    if (valor.length > 5) {
      valor = valor.replace(/^(\d{5})(\d+)/, "$1-$2");
    }

    setCepCadastro(valor);

    if (valor.replace(/\D/g, "").length === 8) {
      buscarCepCadastro(valor);
    }
  }}
  placeholder="CEP"
  maxLength={9}
  className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
/>

<input
  value={ruaCadastro}
  onChange={(e) => setRuaCadastro(e.target.value)}
  placeholder="Rua / Avenida"
  className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
/>

<input
  value={numeroCadastro}
  onChange={(e) => setNumeroCadastro(e.target.value.replace(/\D/g, ""))}
  placeholder="Número"
  inputMode="numeric"
  maxLength={6}
  className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
/>

<input
  value={complementoCadastro}
  onChange={(e) => setComplementoCadastro(e.target.value)}
  placeholder="Complemento"
  className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
/>

<input
  value={bairroCadastro}
  onChange={(e) => setBairroCadastro(e.target.value)}
  placeholder="Bairro"
  className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
/>

<input
  value={cidadeCadastro}
  onChange={(e) => setCidadeCadastro(e.target.value)}
  placeholder="Cidade"
  className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
/>

<input
  value={ufCadastro}
  onChange={(e) =>
    setUfCadastro(e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase())
  }
  placeholder="UF"
  maxLength={2}
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
  <div className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
  <div className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-[2rem] bg-[#061832] border border-white/15 p-6 shadow-2xl">
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

        <input
  value={cepEdicao}
  onChange={(e) => {
    let valor = e.target.value.replace(/\D/g, "");

    valor = valor.slice(0, 8);

    if (valor.length > 5) {
      valor = valor.replace(/^(\d{5})(\d+)/, "$1-$2");
    }

    setCepEdicao(valor);

    if (valor.replace(/\D/g, "").length === 8) {
      buscarCepEdicao(valor);
    }
  }}
  placeholder="CEP"
  maxLength={9}
  className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
/>

<input
  value={logradouroEdicao}
  onChange={(e) => setLogradouroEdicao(e.target.value)}
  placeholder="Rua / Avenida"
  className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
/>

<input
  value={numeroEdicao}
  onChange={(e) =>
    setNumeroEdicao(e.target.value.replace(/\D/g, ""))
  }
  placeholder="Número"
  inputMode="numeric"
  maxLength={6}
  className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
/>

<input
  value={bairroEdicao}
  onChange={(e) => setBairroEdicao(e.target.value)}
  placeholder="Bairro"
  className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
/>

<input
  value={cidadeEdicao}
  onChange={(e) => setCidadeEdicao(e.target.value)}
  placeholder="Cidade"
  className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
/>

<input
  value={estadoEdicao}
  onChange={(e) =>
    setEstadoEdicao(
      e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase()
    )
  }
  placeholder="UF"
  maxLength={2}
  className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
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

function DepoimentoCard({
  nome,
  cidade,
  texto,
}: {
  nome: string;
  cidade: string;
  texto: string;
}) {
  return (
    <div className="rounded-[2rem] bg-white/10 border border-white/15 p-6 shadow-2xl">
      <div className="text-[#23C997] text-xl">
        ★★★★★
      </div>

      <p className="text-white/80 mt-5 leading-relaxed text-lg">
        “{texto}”
      </p>

      <div className="mt-6 pt-5 border-t border-white/10">
        <p className="font-black text-xl">
          {nome}
        </p>

        <p className="text-white/50 mt-1">
          {cidade}
        </p>
      </div>
    </div>
  );
}