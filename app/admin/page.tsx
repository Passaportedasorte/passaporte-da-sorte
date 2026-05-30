"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = "petrikovskibruno@gmail.com";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [campanhas, setCampanhas] = useState<any[]>([]);
  const [compras, setCompras] = useState<any[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);

  const [resumo, setResumo] = useState({
    campanhas: 0,
    compras: 0,
    passIds: 0,
    arrecadado: 0,
  });

  const [form, setForm] = useState({
    titulo: "",
    destino: "",
    preco: "",
    milhas: "",
    data_sorteio: "",
    imagem: "",
  });

  const [editForm, setEditForm] = useState({
    titulo: "",
    destino: "",
    preco: "",
    milhas: "",
    data_sorteio: "",
    imagem: "",
  });

useEffect(() => {
  async function carregar() {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);

    if (data.user?.email === ADMIN_EMAIL) {
      buscarCampanhas();
      buscarResumo();
      buscarCompras();

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
      .select("valor,status", { count: "exact" });

    const { count: passIdsCount } = await supabase
      .from("pass_ids")
      .select("*", { count: "exact", head: true });

    const arrecadado =
      compras
        ?.filter(
          (c) =>
            c.status === "PAYMENT_RECEIVED" ||
            c.status === "PAYMENT_CONFIRMED"
        )
        .reduce((total, item) => total + Number(item.valor || 0), 0) ?? 0;

    setResumo({
      campanhas: campanhasCount ?? 0,
      compras: comprasCount ?? 0,
      passIds: passIdsCount ?? 0,
      arrecadado,
    });
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
  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("campanhas")
    .upload(fileName, file);

  if (error) {
    alert("Erro ao enviar imagem.");
    return;
  }

  const { data } = supabase.storage
    .from("campanhas")
    .getPublicUrl(fileName);

  if (tipo === "nova") {
    setForm({ ...form, imagem: data.publicUrl });
  } else {
    setEditForm({ ...editForm, imagem: data.publicUrl });
  }
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
    });
  }

  function cancelarEdicao() {
    setEditandoId(null);
    setEditForm({
      titulo: "",
      destino: "",
      preco: "",
      milhas: "",
      data_sorteio: "",
      imagem: "",
    });
  }

  async function salvarEdicao(id: number) {
    const { error } = await supabase
      .from("campaigns")
      .update({
        titulo: editForm.titulo,
        destino: editForm.destino,
        preco: Number(editForm.preco),
        milhas: Number(editForm.milhas || 0),
        data_sorteio: editForm.data_sorteio,
        imagem: editForm.imagem,
      })
      .eq("id", id);

    if (error) {
      alert("Erro ao salvar alterações.");
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

        <section className="grid md:grid-cols-4 gap-4 mt-10">
          <ResumoCard titulo="Campanhas" valor={resumo.campanhas} />
          <ResumoCard titulo="Compras" valor={resumo.compras} />
          <ResumoCard titulo="PASS-IDs" valor={resumo.passIds} />
          <ResumoCard
            titulo="Arrecadado"
            valor={`R$ ${resumo.arrecadado.toFixed(2).replace(".", ",")}`}
          />
        </section>


        <section className="mt-10 rounded-[2rem] bg-white/10 border border-white/15 p-5">
  <div className="flex items-center justify-between gap-4 mb-5">
    <div>
      <h2 className="text-3xl font-black">Compras</h2>
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
        </tr>
      </thead>

      <tbody>
        {compras.map((compra) => (
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
                {compra.status}
              </span>
            </td>

            <td className="py-4 text-white/50">
              {compra.created_at
                ? new Date(compra.created_at).toLocaleString("pt-BR")
                : "—"}
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

              <input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (file) uploadImagem(file, "nova");
  }}
  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
/>

{form.imagem && (
  <img
    src={form.imagem}
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