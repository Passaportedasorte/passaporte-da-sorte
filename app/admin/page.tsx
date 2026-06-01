"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import * as XLSX from "xlsx";

const ADMIN_EMAIL = "petrikovskibruno@gmail.com";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [campanhas, setCampanhas] = useState<any[]>([]);
  const [compras, setCompras] = useState<any[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [buscaCompra, setBuscaCompra] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [compraSelecionada, setCompraSelecionada] = useState<any>(null);
  const [passIdsCompra, setPassIdsCompra] = useState<any[]>([]);  
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<any>(null);
  const [comprasUsuario, setComprasUsuario] = useState<any[]>([]);
  const [passIdsUsuario, setPassIdsUsuario] = useState<any[]>([]);
  const [campanhaResultado, setCampanhaResultado] = useState(""); 
  const [numeroFederal, setNumeroFederal] = useState("");
  const [resultadoEncontrado, setResultadoEncontrado] = useState<any>(null);
  const [resultados, setResultados] = useState<any[]>([]);

  const [nomeVencedor, setNomeVencedor] = useState("");
const [cidadeVencedor, setCidadeVencedor] = useState("");
  const [resumo, setResumo] = useState({
  campanhas: 0,
  compras: 0,
  passIds: 0,
  arrecadado: 0,
  usuarios: 0,
  milhas: 0,
  comprasPagas: 0,
  comprasPendentes: 0,
});
  const [form, setForm] = useState({
  titulo: "",
  destino: "",
  preco: "",
  milhas: "",
  data_sorteio: "",
  imagem: "",
  sobre_destino: "",
  roteiro: "",
  incluso: "",
  imagens_roteiro: [],
  status: "ATIVA",
  pass_id_vencedor: "",
numero_federal: "",
});

const [editForm, setEditForm] = useState({
  titulo: "",
  destino: "",
  preco: "",
  milhas: "",
  data_sorteio: "",
  imagem: "",
  sobre_destino: "",
  roteiro: "",
  incluso: "",
  imagens_roteiro: [],
  status: "ATIVA",
  pass_id_vencedor: "",
numero_federal: "",
});



useEffect(() => {
  async function carregar() {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);

    if (data.user?.email === ADMIN_EMAIL) {
      buscarCampanhas();
      buscarResumo();
      buscarCompras();
      buscarUsuarios();
      buscarResultados();
      

      async function buscarCompras() {
  const { data, error } = await supabase
    .from("compras")
    .select(`
      *,
      campaigns (
        titulo,
        destino
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar compras:", error);
    alert(error.message);


    return;
  }

  setCompras(data ?? []);
}
    }
  }

  carregar();
}, []);
async function buscarUsuarios() {
  const { data: comprasData, error } = await supabase
    .from("compras")
    .select("*")
    .not("user_id", "is", null);

  if (error) {
    console.error("Erro ao buscar usuários:", error);
    return;
  }

  const usuariosUnicos = Array.from(
    new Map(
      (comprasData || []).map((compra) => [
        compra.user_id,
        compra,
      ])
    ).values()
  );

  const usuariosComDados = await Promise.all(
    usuariosUnicos.map(async (usuario) => {
      const { count: totalCompras } = await supabase
        .from("compras")
        .select("*", { count: "exact", head: true })
        .eq("user_id", usuario.user_id);

      const { count: totalPassIds } = await supabase
        .from("pass_ids")
        .select("*", { count: "exact", head: true })
        .eq("user_id", usuario.user_id);

      const { data: milhas } = await supabase
        .from("user_miles")
        .select("total_milhas")
        .eq("user_id", usuario.user_id)
        .single();

      return {
        user_id: usuario.user_id,
        nome: usuario.nome,
        email: usuario.email,
        cpf: usuario.cpf,
        celular: usuario.celular || "—",
        compras: totalCompras || 0,
        passIds: totalPassIds || 0,
        milhas: milhas?.total_milhas || 0,
      };
    })
  );

  setUsuarios(usuariosComDados);
}

async function abrirDetalhesUsuario(usuario: any) {
  setUsuarioSelecionado(usuario);

  const { data: comprasData } = await supabase
    .from("compras")
    .select(`
      *,
      campaigns (
        titulo,
        destino
      )
    `)
    .eq("user_id", usuario.user_id)
    .order("created_at", { ascending: false });

  const { data: passIdsData } = await supabase
    .from("pass_ids")
    .select("*")
    .eq("user_id", usuario.user_id)
    .order("created_at", { ascending: false });

  setComprasUsuario(comprasData ?? []);
  setPassIdsUsuario(passIdsData ?? []);
}

async function encontrarVencedorFederal() {
  if (!campanhaResultado) {
    alert("Selecione uma campanha.");
    return;
  }

  if (!numeroFederal.trim()) {
    alert("Informe o número sorteado.");
    return;
  }

  const numeroAlvo = Number(numeroFederal.padStart(5, "0"));
  const passIdExato = `PSD-${numeroFederal.padStart(5, "0")}`;

  const { data: todosPassIds, error } = await supabase
    .from("pass_ids")
    .select("*")
    .eq("campaign_id", campanhaResultado);

  if (error || !todosPassIds || todosPassIds.length === 0) {
    alert("Nenhum PASS-ID encontrado nesta campanha.");
    return;
  }

  const vencedor =
    todosPassIds.find((item) => item.pass_id === passIdExato) ||
    todosPassIds.reduce((maisProximo, atual) => {
      const numeroAtual = Number(String(atual.pass_id).replace("PSD-", ""));
      const numeroMaisProximo = Number(
        String(maisProximo.pass_id).replace("PSD-", "")
      );

      const distanciaAtual = Math.abs(numeroAtual - numeroAlvo);
      const distanciaMaisProximo = Math.abs(numeroMaisProximo - numeroAlvo);

      return distanciaAtual < distanciaMaisProximo ? atual : maisProximo;
    });

  await buscarResultados();

  const tipoResultado =
  vencedor.pass_id === passIdExato ? "EXATO" : "MAIS_PROXIMO";
  

const { error: resultadoError } = await supabase
  .from("resultados_federal")
  .insert({
    campaign_id: campanhaResultado,
    numero_sorteado: numeroFederal.padStart(5, "0"),
    pass_id_vencedor: vencedor.pass_id,
    user_id_vencedor: vencedor.user_id,
    compra_id_vencedora: vencedor.compra_id,
    tipo_resultado: tipoResultado,
    nome_vencedor: nomeVencedor,
cidade_vencedor: cidadeVencedor,
  });

if (resultadoError) {
  console.error("Erro ao salvar resultado:", resultadoError);
  alert(resultadoError.message);
  return;
}

await buscarResultados();

  setResultadoEncontrado(vencedor);

  alert(
    vencedor.pass_id === passIdExato
      ? "Vencedor exato encontrado!"
      : "Vencedor mais próximo encontrado!"
  );
}

async function abrirDetalhesCompra(compra: any) {
  setCompraSelecionada(compra);

  const { data } = await supabase
    .from("pass_ids")
    .select("*")
    .eq("compra_id", compra.id)
    .order("id");

  setPassIdsCompra(data ?? []);
}

function exportarComprasExcel() {
  const dados = comprasFiltradas.map((compra) => ({
    Nome: compra.nome,
    Email: compra.email,
    CPF: compra.cpf,
    Quantidade: compra.quantidade,
    Valor: compra.valor,
    Status: compra.status,
    Campanha: compra.campaigns?.titulo || "",
    Destino: compra.campaigns?.destino || "",
    Data: compra.created_at
      ? new Date(compra.created_at).toLocaleString("pt-BR")
      : "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(dados);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Compras"
  );

  XLSX.writeFile(
    workbook,
    `compras-${new Date().toISOString().slice(0, 10)}.xlsx`
  );
}

  async function loginGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/admin`
            : undefined,
      },
    });
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
  }

 async function buscarResumo() {
  const { count: campanhasCount } = await supabase
    .from("campaigns")
    .select("*", { count: "exact", head: true });

  const { count: comprasCount, data: compras } = await supabase
    .from("compras")
    .select("valor,status,user_id", { count: "exact" });

  const { count: passIdsCount } = await supabase
    .from("pass_ids")
    .select("*", { count: "exact", head: true });

  const { count: usuariosCount } = await supabase
    .from("user_miles")
    .select("*", { count: "exact", head: true });

  const { data: milhasData } = await supabase
    .from("user_miles")
    .select("total_milhas");

  const arrecadado =
    compras
      ?.filter(
        (c) =>
          c.status === "PAYMENT_RECEIVED" ||
          c.status === "PAYMENT_CONFIRMED"
      )
      .reduce(
        (total, item) => total + Number(item.valor || 0),
        0
      ) ?? 0;

  const comprasPagas =
    compras?.filter(
      (c) =>
        c.status === "PAYMENT_RECEIVED" ||
        c.status === "PAYMENT_CONFIRMED"
    ).length ?? 0;

  const comprasPendentes =
    compras?.filter(
      (c) =>
        c.status === "PENDING" ||
        c.status === "AWAITING_PAYMENT"
    ).length ?? 0;

  const milhas =
    milhasData?.reduce(
      (total, item) =>
        total + Number(item.total_milhas || 0),
      0
    ) ?? 0;

  setResumo({
    campanhas: campanhasCount ?? 0,
    compras: comprasCount ?? 0,
    passIds: passIdsCount ?? 0,
    arrecadado,
    usuarios: usuariosCount ?? 0,
    milhas,
    comprasPagas,
    comprasPendentes,
  });
}

async function buscarResultados() {
  const { data, error } = await supabase
    .from("resultados_federal")
    .select(`
      *,
      campaigns (
        titulo,
        destino
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar resultados:", error);
    alert(error.message);
    return;
  }

  setResultados(data ?? []);
}

  async function buscarCampanhas() {
    const { data, error } = await supabase
      .from("campaigns")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      alert("Erro ao buscar campanhas");
      return;
    }

    setCampanhas(data ?? []);
  }
async function uploadImagem(
  file: File,
  tipo: "nova" | "editar"
) {
  const extensao = file.name.split(".").pop();

  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${extensao}`;

  const { error } = await supabase.storage
    .from("campanhas")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("ERRO UPLOAD IMAGEM:", error);
    alert(error.message);
    return;
  }

  const { data } = supabase.storage
    .from("campanhas")
    .getPublicUrl(fileName);

  if (tipo === "nova") {
    setForm((prev) => ({
      ...prev,
      imagem: data.publicUrl,
    }));
  } else {
    setEditForm((prev) => ({
      ...prev,
      imagem: data.publicUrl,
    }));
  }

  alert("Imagem enviada com sucesso!");
}

async function uploadImagemRoteiro(file: File, tipo: "nova" | "editar") {
  const extensao = file.name.split(".").pop();

  const fileName = `roteiro-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2)}.${extensao}`;

  const { error } = await supabase.storage
    .from("campanhas")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("ERRO UPLOAD ROTEIRO:", error);
    alert(error.message);
    return;
  }

  const { data } = supabase.storage
    .from("campanhas")
    .getPublicUrl(fileName);
    

  const novaUrl = data.publicUrl;

  


  if (tipo === "nova") {
    setForm((prev: any) => ({
      ...prev,
      imagens_roteiro: [...(prev.imagens_roteiro || []), novaUrl],
    }));

    alert("Imagem do roteiro enviada!");
    return;
  }

  if (!editandoId) {
    alert("Nenhuma campanha em edição.");
    return;
  }

  const { data: campanhaAtual, error: buscaError } = await supabase
    .from("campaigns")
    .select("imagens_roteiro")
    .eq("id", editandoId)
    .single();

  if (buscaError) {
    console.error("ERRO AO BUSCAR IMAGENS ATUAIS:", buscaError);
    alert(buscaError.message);
    return;
  }

  const imagensAtuais = Array.isArray(campanhaAtual?.imagens_roteiro)
    ? campanhaAtual.imagens_roteiro
    : [];

  const novasImagens = [...imagensAtuais, novaUrl];



  const { error: updateError } = await supabase
  
    .from("campaigns")
    .update({
      imagens_roteiro: novasImagens,
    })
    .eq("id", editandoId);
  if (updateError) {
    console.error("ERRO AO SALVAR IMAGENS ROTEIRO:", updateError);
    alert(updateError.message);
    return;
  }

  setEditForm((prev: any) => ({
    ...prev,
    imagens_roteiro: novasImagens,
  }));

  await buscarCampanhas();

  alert("Imagem do roteiro enviada e salva!");
}

  async function criarCampanha() {
    if (!form.titulo || !form.destino || !form.preco) {
      alert("Preencha título, destino e preço.");
      return;
    }


    const { error } = await supabase.from("campaigns").insert({
      titulo: form.titulo,
      destino: form.destino,
      preco: Number(form.preco),
      milhas: Number(form.milhas || 0),
      data_sorteio: form.data_sorteio,
      imagem: form.imagem,
      sobre_destino: form.sobre_destino,
roteiro: form.roteiro,
incluso: form.incluso,
pass_id_vencedor: form.pass_id_vencedor,
numero_federal: form.numero_federal,
    });

    if (error) {
      alert("Erro ao criar campanha.");
      return;
    }

    setForm({
  titulo: "",
  destino: "",
  preco: "",
  milhas: "",
  data_sorteio: "",
  imagem: "",
  sobre_destino: "",
  roteiro: "",
  incluso: "",
  imagens_roteiro: [],
  status: "ATIVA",
  pass_id_vencedor: "",
numero_federal: "",
  
});
    await buscarCampanhas();
    await buscarResumo();

    alert("Campanha criada com sucesso!");
  }

  function iniciarEdicao(campanha: any) {
    setEditandoId(campanha.id);
    setEditForm({
      titulo: campanha.titulo || "",
      destino: campanha.destino || "",
      preco: String(campanha.preco || ""),
      milhas: String(campanha.milhas || ""),
      data_sorteio: campanha.data_sorteio || "",
      imagem: campanha.imagem || "",
      sobre_destino: campanha.sobre_destino || "",
roteiro: campanha.roteiro || "",
incluso: campanha.incluso || "",
imagens_roteiro: campanha.imagens_roteiro || [],
status: campanha.status || "ATIVA",
pass_id_vencedor: campanha.pass_id_vencedor || "",
numero_federal: campanha.numero_federal || "",
    });
  }

  <select
  value={editForm.status || "ATIVA"}
  onChange={(e) =>
    setEditForm({
      ...editForm,
      status: e.target.value,
    })
    
  }

  
  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
>
  <option value="ATIVA">Ativa</option>
  <option value="ENCERRADA">Encerrada</option>
  <option value="EM_BREVE">Em breve</option>
</select>



  function cancelarEdicao() {
    setEditandoId(null);
    setEditForm({
      titulo: "",
      destino: "",
      preco: "",
      milhas: "",
      data_sorteio: "",
      imagem: "",
      sobre_destino: "",
      roteiro: "",
      incluso: "",
      imagens_roteiro: [],
      status: "ATIVA",
      pass_id_vencedor: editForm.pass_id_vencedor,
numero_federal: editForm.numero_federal,
    });
  }

  async function salvarEdicao(id: number) {

{editForm.status === "ENCERRADA" && (
  <>
    <AdminInput
      placeholder="PASS-ID vencedor"
      value={editForm.pass_id_vencedor || ""}
      onChange={(v) =>
        setEditForm({ ...editForm, pass_id_vencedor: v })
      }
    />

    <AdminInput
      placeholder="Número Federal"
      value={editForm.numero_federal || ""}
      onChange={(v) =>
        setEditForm({ ...editForm, numero_federal: v })
      }

      
    />
  </>
)}



    const { error } = await supabase
    
      .from("campaigns")
      .update({
  titulo: editForm.titulo,
  destino: editForm.destino,
  preco: Number(editForm.preco),
  milhas: Number(editForm.milhas || 0),
  data_sorteio: editForm.data_sorteio,
  imagem: editForm.imagem,
  imagens_roteiro: editForm.imagens_roteiro || [],
  sobre_destino: editForm.sobre_destino,
  roteiro: editForm.roteiro,
  incluso: editForm.incluso,
  status: editForm.status,
  pass_id_vencedor: editForm.pass_id_vencedor,
  numero_federal: editForm.numero_federal,
  
  
})
      .eq("id", id);

   if (error) {
  console.error("ERRO AO SALVAR CAMPANHA:", error);
  alert(error.message);
  return;
}

    cancelarEdicao();
    await buscarCampanhas();
    await buscarResumo();

    alert("Campanha atualizada!");
  }

  async function excluirCampanha(id: number) {
    const confirmar = confirm("Deseja realmente excluir esta campanha?");
    if (!confirmar) return;

    const { error } = await supabase.from("campaigns").delete().eq("id", id);

    if (error) {
      alert("Erro ao excluir campanha.");
      return;
    }

    await buscarCampanhas();
    await buscarResumo();

    alert("Campanha excluída!");
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#061832] text-white flex items-center justify-center px-5">
        <div className="rounded-[2rem] bg-white/10 border border-white/15 p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-black">Área Admin</h1>

          <p className="text-white/60 mt-3">
            Faça login para acessar o painel administrativo.
          </p>

          <button
            onClick={loginGoogle}
            className="mt-6 w-full rounded-2xl bg-[#23C997] text-[#061832] py-4 font-black"
          >
            Entrar com Google
          </button>
        </div>
      </main>
    );
  }

  if (user.email !== ADMIN_EMAIL) {
    return (
      <main className="min-h-screen bg-[#061832] text-white flex items-center justify-center px-5">
        <div className="rounded-[2rem] bg-white/10 border border-white/15 p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-black">Acesso negado</h1>

          <p className="text-white/60 mt-3">
            Este painel é restrito ao administrador.
          </p>

          <button
            onClick={logout}
            className="mt-6 w-full rounded-2xl bg-white/10 border border-white/15 py-4 font-black"
          >
            Sair
          </button>
        </div>
      </main>
    );
  }
const comprasFiltradas = compras.filter((compra) => {
  const busca = buscaCompra.toLowerCase();

  const passouBusca =
    compra.nome?.toLowerCase().includes(busca) ||
    compra.email?.toLowerCase().includes(busca) ||
    compra.cpf?.includes(busca);

  const passouStatus =
    filtroStatus === "todos"
      ? true
      : compra.status === filtroStatus;

  return passouBusca && passouStatus;
});
  return (
    <main className="min-h-screen bg-[#061832] text-white px-5 md:px-8 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4">
          <div>
            <a href="/" className="text-[#23C997] font-black hover:underline">
              ← Voltar para o site
            </a>

            <h1 className="text-5xl font-black mt-6">Admin</h1>

            <p className="text-white/60 mt-2">
              Gerencie o Passaporte da Sorte.
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-full bg-white/10 border border-white/15 px-5 py-3 font-black"
          >
            Sair
          </button>
        </div>

        <section className="mt-10 rounded-[2rem] bg-white/10 border border-white/15 p-5">
  <h2 className="text-3xl font-black mb-5">
    Resultado Federal
  </h2>

  <section className="mt-10 rounded-[2rem] bg-white/10 border border-white/15 p-5">
  <h2 className="text-3xl font-black mb-5">
    Resultados
  </h2>

  <div className="overflow-x-auto">
    <table className="w-full text-left min-w-[800px]">
      <thead>
        <tr className="text-white/50 text-sm border-b border-white/10">
          <th className="py-3">Campanha</th>
          <th className="py-3">Número Federal</th>
          <th className="py-3">PASS-ID Vencedor</th>
          <th className="py-3">Data</th>
          <th className="py-3">Tipo</th>

        </tr>

      
      </thead>



      <tbody>
        {resultados.map((resultado) => (
          <tr
            key={resultado.id}
            className="border-b border-white/10"
          >
            <td className="py-4">
              <p className="font-black">
                {resultado.campaigns?.titulo || "—"}
              </p>
              <p className="text-white/50 text-sm">
                {resultado.campaigns?.destino || "—"}
              </p>
            </td>

            <td className="py-4 font-black">
              {resultado.numero_sorteado}
            </td>

            <td className="py-4 text-[#23C997] font-black">
              {resultado.pass_id_vencedor}
            </td>

            
            
            <td className="py-4">
  {resultado.tipo_resultado === "EXATO" ? (
    <span className="text-green-400 font-black">
      🎯 Exato
    </span>
  ) : (
    <span className="text-yellow-400 font-black">
      📍 Mais próximo
    </span>
  )}
</td>

            <td className="py-4 text-white/50">
              {resultado.created_at
                ? new Date(resultado.created_at).toLocaleString("pt-BR")
                : "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {resultados.length === 0 && (
      <p className="text-white/50 py-5">
        Nenhum resultado cadastrado.
      </p>
    )}
  </div>
</section>

  <div className="grid md:grid-cols-3 gap-3">
    <select
      value={campanhaResultado}
      onChange={(e) => setCampanhaResultado(e.target.value)}
      className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
    >
      <option value="">
        Selecione uma campanha
      </option>

      {campanhas.map((campanha) => (
        <option
          key={campanha.id}
          value={campanha.id}
        >
          {campanha.titulo}
        </option>
      ))}
    </select>

    <input
      value={numeroFederal}
      onChange={(e) =>
        setNumeroFederal(
          e.target.value.replace(/\D/g, "").slice(0, 5)
        )
      }
      placeholder="Últimos 5 números"
      className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
    />

      <input
  value={nomeVencedor}
  onChange={(e) => setNomeVencedor(e.target.value)}
  placeholder="Nome do vencedor"
  className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
/>

<input
  value={cidadeVencedor}
  onChange={(e) => setCidadeVencedor(e.target.value)}
  placeholder="Cidade do vencedor"
  className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
/>

    <button
      onClick={encontrarVencedorFederal}
      className="rounded-2xl bg-[#23C997] text-[#061832] font-black"
    >
      Encontrar vencedor
    </button>
  </div>

  {resultadoEncontrado && (
    <div className="mt-6 rounded-2xl bg-[#23C997]/10 border border-[#23C997]/30 p-5">
      <h3 className="text-xl font-black text-[#23C997]">
        🎉 Vencedor encontrado
      </h3>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-white/50 text-sm">
            PASS-ID
          </p>
          <p className="font-black">
            {resultadoEncontrado.pass_id}
          </p>
        </div>

        <div>
          <p className="text-white/50 text-sm">
            Compra
          </p>
          <p className="font-black">
            #{resultadoEncontrado.compra_id}
          </p>
        </div>

        <div>
          <p className="text-white/50 text-sm">
            Milhas
          </p>
          <p className="font-black">
            {resultadoEncontrado.milhas}
          </p>
        </div>

        <div>
          <p className="text-white/50 text-sm">
            User ID
          </p>
          <p className="font-black text-xs break-all">
            {resultadoEncontrado.user_id}
          </p>
        </div>
      </div>
    </div>
  )}
</section>

        <section className="grid md:grid-cols-4 lg:grid-cols-8 gap-4 mt-10">
          <ResumoCard titulo="Campanhas" valor={resumo.campanhas} />
          <ResumoCard titulo="Compras" valor={resumo.compras} />
          <ResumoCard titulo="PASS-IDs" valor={resumo.passIds} />
          <ResumoCard
            titulo="Arrecadado"
            valor={`R$ ${resumo.arrecadado.toFixed(2).replace(".", ",")}`}
          />
          <ResumoCard
  titulo="Usuários"
  valor={resumo.usuarios}
/>

<ResumoCard
  titulo="Milhas Distribuídas"
  valor={resumo.milhas}
/>

<ResumoCard
  titulo="Compras Pagas"
  valor={resumo.comprasPagas}
/>

<ResumoCard
  titulo="Pendentes"
  valor={resumo.comprasPendentes}
/>
        </section>


        <section className="mt-10 rounded-[2rem] bg-white/10 border border-white/15 p-5">
  <div className="flex items-center justify-between gap-4 mb-5">

<div className="flex flex-col md:flex-row gap-3 mb-5">
  <input
    value={buscaCompra}
    onChange={(e) => setBuscaCompra(e.target.value)}
    placeholder="Buscar por nome, e-mail ou CPF"
    className="flex-1 rounded-2xl px-4 py-3 bg-white text-[#061832]"
  />

  <select
    value={filtroStatus}
    onChange={(e) => setFiltroStatus(e.target.value)}
    className="rounded-2xl px-4 py-3 bg-white text-[#061832]"
  >
    <option value="todos">Todos</option>
    <option value="PAYMENT_RECEIVED">Pago</option>
    <option value="PAYMENT_CONFIRMED">Confirmado</option>
    <option value="PENDING">Pendente</option>
  </select>
</div>

    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
  <h2 className="text-3xl font-black">
    Compras
  </h2>

  <button
    onClick={exportarComprasExcel}
    className="rounded-xl bg-[#23C997] text-[#061832] px-4 py-3 font-black"
  >
    📤 Exportar Excel
  </button>
</div>
      <p className="text-white/50 text-sm">
        Acompanhe as compras realizadas no Passaporte da Sorte.
      </p>
    </div>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full text-left min-w-[900px]">
      <thead>
        <tr className="text-white/50 text-sm border-b border-white/10">
          <th className="py-3">Cliente</th>
          <th className="py-3">Campanha</th>
          <th className="py-3">Qtd</th>
          <th className="py-3">Valor</th>
          <th className="py-3">Status</th>
          <th className="py-3">Data</th>
          <th className="py-3">Ações</th>
        </tr>
      </thead>

      <tbody>
        {comprasFiltradas.map((compra) => (
          <tr
            key={compra.id}
            className="border-b border-white/10 text-sm"
          >
            <td className="py-4">
              <p className="font-black">{compra.nome}</p>
              <p className="text-white/50">{compra.email}</p>
              <p className="text-white/40">{compra.cpf}</p>
            </td>

            <td className="py-4">
              <p className="font-black">
                {compra.campaigns?.titulo || "—"}
              </p>
              <p className="text-white/50">
                {compra.campaigns?.destino || "—"}
              </p>
            </td>

            <td className="py-4 font-black">
              {compra.quantidade}
            </td>

            <td className="py-4 font-black">
              R$ {Number(compra.valor || 0).toFixed(2).replace(".", ",")}
            </td>

            <td className="py-4">
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black">
               {
  compra.status === "PAYMENT_RECEIVED" ||
  compra.status === "PAYMENT_CONFIRMED"
    ? "✅ Pago"
    : compra.status === "PENDING"
    ? "⏳ Pendente"
    : "❌ Cancelado"
}
              </span>
            </td>

            <td className="py-4 text-white/50">
              {compra.created_at
                ? new Date(compra.created_at).toLocaleString("pt-BR")
                : "—"}
            </td>

            <td className="py-4">
  <button
    onClick={() => abrirDetalhesCompra(compra)}
    className="rounded-xl bg-[#23C997] text-[#061832] px-3 py-2 text-xs font-black"
  >
    Ver detalhes
  </button>
</td>
          </tr>
        ))}
      </tbody>
    </table>

    {compras.length === 0 && (
      <p className="text-white/50 py-6">
        Nenhuma compra encontrada.
      </p>
    )}
  </div>
</section>

<section className="mt-10 rounded-[2rem] bg-white/10 border border-white/15 p-5">
  <h2 className="text-3xl font-black mb-5">
    Usuários
  </h2>

  <div className="overflow-x-auto">
    <table className="w-full text-left min-w-[1000px]">
      <thead>
        <tr className="border-b border-white/10 text-white/50 text-sm">
          <th className="py-3">Nome</th>
          <th className="py-3">Email</th>
          <th className="py-3">CPF</th>
          <th className="py-3">Celular</th>
          <th className="py-3">Milhas</th>
          <th className="py-3">Compras</th>
          <th className="py-3">PASS IDs</th>
          <th className="py-3">Ações</th>
        </tr>
      </thead>

      <tbody>
        {usuarios.map((usuario) => (
          <tr
            key={usuario.user_id}
            className="border-b border-white/10"
          >
            <td className="py-4 font-black">
              {usuario.nome || "—"}
            </td>

            <td className="py-4">
              {usuario.email || "—"}
            </td>

            <td className="py-4">
              {usuario.cpf || "—"}
            </td>

            <td className="py-4">
              {usuario.celular || "—"}
            </td>

            <td className="py-4 font-black text-[#23C997]">
              {usuario.milhas}
            </td>

            <td className="py-4">
              {usuario.compras}
            </td>

            <td className="py-4">
              {usuario.passIds}
            </td>

          <td className="py-4">
  <button
    onClick={() => abrirDetalhesUsuario(usuario)}
    className="rounded-xl bg-[#23C997] text-[#061832] px-3 py-2 text-xs font-black"
  >
    Ver usuário
  </button>
</td>
          </tr>
        ))}
      </tbody>
    </table>

    {usuarios.length === 0 && (
      <p className="text-white/50 py-5">
        Nenhum usuário encontrado.
      </p>
    )}
  </div>
</section>

        <section className="grid lg:grid-cols-3 gap-8 mt-10">
          <div className="lg:col-span-1 rounded-[2rem] bg-white text-[#061832] p-6 shadow-2xl h-fit">
            <h2 className="text-2xl font-black">Nova campanha</h2>

            <div className="grid gap-3 mt-5">
              <AdminInput
                placeholder="Título"
                value={form.titulo}
                onChange={(v) => setForm({ ...form, titulo: v })}
              />

              <AdminInput
                placeholder="Destino"
                value={form.destino}
                onChange={(v) => setForm({ ...form, destino: v })}
              />

              <AdminInput
                placeholder="Preço"
                value={form.preco}
                onChange={(v) => setForm({ ...form, preco: v })}
              />

              <AdminInput
                placeholder="Milhas"
                value={form.milhas}
                onChange={(v) => setForm({ ...form, milhas: v })}
              />

              <AdminInput
                placeholder="Data do sorteio"
                value={form.data_sorteio}
                onChange={(v) => setForm({ ...form, data_sorteio: v })}

                
                
              />

              <textarea
  placeholder="Sobre o destino"
  value={editForm.sobre_destino || ""}
  onChange={(e) =>
    setEditForm({
      ...editForm,
      sobre_destino: e.target.value,
    })
  }
  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none min-h-[120px]"
/>

<textarea
  placeholder="Roteiro da experiência"
  value={editForm.roteiro || ""}
  onChange={(e) =>
    setEditForm({
      ...editForm,
      roteiro: e.target.value,
    })
  }
  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none min-h-[160px]"
/>

<textarea
  placeholder="O que está incluso"
  value={editForm.incluso || ""}
  onChange={(e) =>
    setEditForm({
      ...editForm,
      incluso: e.target.value,
    })
  }
  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none min-h-[120px]"
  />



{editForm.imagem && (
  <img
    src={editForm.imagem}
    alt="Prévia"
    className="w-full h-40 object-cover rounded-2xl"
  />
)}

              <button
                onClick={criarCampanha}
                className="rounded-2xl bg-[#23C997] text-[#061832] py-4 font-black"
              >
                Criar campanha
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-3xl font-black mb-5">Campanhas</h2>

            <div className="grid gap-5">
              {campanhas.map((campanha) => (
                <div
                  key={campanha.id}
                  className="rounded-[2rem] bg-white/10 border border-white/15 p-5"
                >
                  {editandoId === campanha.id ? (
                    <div className="grid gap-3">
                      <AdminInput
                        placeholder="Título"
                        value={editForm.titulo}
                        onChange={(v) =>
                          setEditForm({ ...editForm, titulo: v })
                        }
                      />

                      <AdminInput
                        placeholder="Destino"
                        value={editForm.destino}
                        onChange={(v) =>
                          setEditForm({ ...editForm, destino: v })
                        }
                      />

                      <AdminInput
                        placeholder="Preço"
                        value={editForm.preco}
                        onChange={(v) =>
                          setEditForm({ ...editForm, preco: v })
                        }
                      />

                      <AdminInput
                        placeholder="Milhas"
                        value={editForm.milhas}
                        onChange={(v) =>
                          setEditForm({ ...editForm, milhas: v })
                        }
                      />

                      <AdminInput
                        placeholder="Data do sorteio"
                        value={editForm.data_sorteio}
                        onChange={(v) =>
                          setEditForm({ ...editForm, data_sorteio: v })
                        }


                        
                      />
<select
  value={editForm.status || "ATIVA"}
  onChange={(e) =>
    setEditForm({
      ...editForm,
      status: e.target.value,
    })
  }
  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
>
  <option value="ATIVA">Ativa</option>
  <option value="ENCERRADA">Encerrada</option>
  <option value="EM_BREVE">Em breve</option>
</select>
                      <textarea
  placeholder="Sobre o destino"
  value={editForm.sobre_destino || ""}
  onChange={(e) =>
    setEditForm({
      ...editForm,
      sobre_destino: e.target.value,
    })
  }
  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none min-h-[120px]"
/>

<p className="font-black text-sm mt-4">
  Imagem principal da campanha
</p>

<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) uploadImagem(file, "editar");
  }}
  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
/>

{editForm.imagem && (
  <img
    src={editForm.imagem}
    alt="Prévia"
    className="w-full h-40 object-cover rounded-2xl"
  />
)}

<p className="font-black text-sm mt-4">
  Imagens do roteiro
</p>

<input
  type="file"
  accept="image/*"
  multiple
  onChange={(e) => {
    

    const files = Array.from(e.target.files || []);

  

    files.forEach((file) => uploadImagemRoteiro(file, "editar"));
  }}
  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
/>

{editForm.imagens_roteiro?.map((img: string, index: number) => (
  <div key={index} className="relative">
    <img
      src={img}
      alt={`Roteiro ${index + 1}`}
      className="w-full h-24 object-cover rounded-xl"
    />

    <button
      type="button"
      onClick={() => {
        const novasImagens = editForm.imagens_roteiro.filter(
          (_: string, i: number) => i !== index
        );

        setEditForm({
          ...editForm,
          imagens_roteiro: novasImagens,
        });
      }}
      className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full font-black"
    >
      ×
    </button>
  </div>
))}

<textarea
  placeholder="Roteiro da experiência"
  value={editForm.roteiro || ""}
  onChange={(e) =>
    setEditForm({
      ...editForm,
      roteiro: e.target.value,
    })
  }
  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none min-h-[160px]"
/>

                    <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) uploadImagem(file, "editar");
  }}
  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
/>

<textarea
  placeholder="O que está incluso"
  value={editForm.incluso || ""}
  onChange={(e) =>
    setEditForm({
      ...editForm,
      incluso: e.target.value,
    })
  }
  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none min-h-[120px]"
/>

                      <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) uploadImagem(file, "editar");
  }}
  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
/>

{editForm.imagem && (
  <img
    src={editForm.imagem}
    alt="Prévia"
    className="w-full h-40 object-cover rounded-2xl"
  />
)}

                      <div className="flex gap-3">
                        <button
                          onClick={() => salvarEdicao(campanha.id)}
                          className="rounded-xl bg-[#23C997] text-[#061832] px-4 py-3 font-black"
                        >
                          Salvar
                        </button>

                        <button
                          onClick={cancelarEdicao}
                          className="rounded-xl bg-white/10 border border-white/15 px-4 py-3 font-black"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row gap-5">
                      <img
                        src={campanha.imagem || "/logo.png"}
                        alt={campanha.destino}
                        className="w-full md:w-48 h-36 object-cover rounded-2xl"
                      />

                      <div className="flex-1">
                        <h3 className="text-2xl font-black">
                          {campanha.titulo}
                        </h3>

                        <p className="text-white/60 mt-1">
                          {campanha.destino}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-4">
                          <span className="rounded-full bg-[#23C997] text-[#061832] px-4 py-2 text-sm font-black">
                            R$ {campanha.preco}
                          </span>

                          <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-black">
                            {campanha.milhas} milhas
                          </span>

                          <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-black">
                            Sorteio: {campanha.data_sorteio || "—"}
                          </span>
                        </div>

                        <div className="flex gap-3 mt-5">
                          <button
                            onClick={() => iniciarEdicao(campanha)}
                            className="rounded-xl bg-white text-[#061832] px-4 py-3 font-black"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => excluirCampanha(campanha.id)}
                            className="rounded-xl bg-red-500 text-white px-4 py-3 font-black"
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {campanhas.length === 0 && (
                <p className="text-white/50">Nenhuma campanha cadastrada.</p>
              )}
            </div>
          </div>
        </section>
      </div>

      {compraSelecionada && (
  <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-5">
    <div className="w-full max-w-2xl rounded-[2rem] bg-[#061832] border border-white/15 p-6 shadow-2xl">

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-white">
          Detalhes da Compra
        </h2>

        <button
          onClick={() => {
            setCompraSelecionada(null);
            setPassIdsCompra([]);
          }}
          className="text-white/60 hover:text-white text-2xl"
        >
          ×
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6 text-white">

        <div>
          <p className="text-white/50 text-sm">Nome</p>
          <p className="font-black">{compraSelecionada.nome}</p>
        </div>

        <div>
          <p className="text-white/50 text-sm">Email</p>
          <p className="font-black">{compraSelecionada.email}</p>
        </div>

        <div>
          <p className="text-white/50 text-sm">CPF</p>
          <p className="font-black">{compraSelecionada.cpf}</p>
        </div>

        <div>
          <p className="text-white/50 text-sm">Valor</p>
          <p className="font-black">
            R$ {Number(compraSelecionada.valor || 0)
              .toFixed(2)
              .replace(".", ",")}
          </p>
        </div>

        <div>
          <p className="text-white/50 text-sm">Quantidade</p>
          <p className="font-black">
            {compraSelecionada.quantidade}
          </p>
        </div>

        <div>
          <p className="text-white/50 text-sm">Status</p>
          <p className="font-black">
            {compraSelecionada.status}
          </p>
        </div>

      </div>

      <div className="mt-8">
        <h3 className="text-xl font-black text-white mb-4">
          PASS IDs
        </h3>

        <div className="grid md:grid-cols-3 gap-3">
          {passIdsCompra.map((item) => (
            <div
              key={item.id}
              className="rounded-xl bg-white/10 border border-white/10 p-3 text-center"
            >
              <p className="font-black text-[#23C997]">
                {item.pass_id}
              </p>

              <p className="text-xs text-white/50 mt-1">
                {item.milhas} milhas
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
)}

{usuarioSelecionado && (
  <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-5">
    <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] bg-[#061832] border border-white/15 p-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-white">
          Detalhes do Usuário
        </h2>

        <button
          onClick={() => {
            setUsuarioSelecionado(null);
            setComprasUsuario([]);
            setPassIdsUsuario([]);
          }}
          className="text-white/60 hover:text-white text-2xl"
        >
          ×
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <Info label="Nome" value={usuarioSelecionado.nome} />
        <Info label="E-mail" value={usuarioSelecionado.email} />
        <Info label="CPF" value={usuarioSelecionado.cpf} />
        <Info label="Celular" value={usuarioSelecionado.celular} />
        <Info label="Milhas" value={`${usuarioSelecionado.milhas} 🍀`} />
        <Info label="PASS IDs" value={usuarioSelecionado.passIds} />
        <Info label="Compras" value={usuarioSelecionado.compras} />
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-black mb-4">Compras do usuário</h3>

        <div className="grid gap-3">
          {comprasUsuario.map((compra) => (
            <div
              key={compra.id}
              className="rounded-2xl bg-white/10 border border-white/10 p-4"
            >
              <p className="font-black">
                {compra.campaigns?.titulo || "Campanha"}
              </p>
              <p className="text-white/50 text-sm">
                {compra.campaigns?.destino || "Destino"} • R$ {Number(compra.valor || 0).toFixed(2).replace(".", ",")} • {compra.status}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-black mb-4">PASS IDs do usuário</h3>

        <div className="grid md:grid-cols-4 gap-3">
          {passIdsUsuario.map((item) => (
            <div
              key={item.id}
              className="rounded-xl bg-white/10 border border-white/10 p-3 text-center"
            >
              <p className="font-black text-[#23C997]">{item.pass_id}</p>
              <p className="text-xs text-white/50 mt-1">
                {item.milhas} milhas
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)}

    </main>
  );
}

function ResumoCard({ titulo, valor }: { titulo: string; valor: any }) {
  return (
    <div className="rounded-[2rem] bg-white/10 border border-white/15 p-5">
      <p className="text-white/50 text-sm font-black">{titulo}</p>
      <h2 className="text-3xl font-black mt-2">{valor}</h2>
    </div>
  );
}

function AdminInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
    />
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
      <p className="text-white/50 text-sm">{label}</p>
      <p className="font-black mt-1">{value || "—"}</p>
    </div>
  );
}