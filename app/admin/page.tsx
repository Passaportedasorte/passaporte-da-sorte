"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = "petrikovskibruno@gmail.com";

export default function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [campanhas, setCampanhas] = useState<any[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
const [editForm, setEditForm] = useState({
  titulo: "",
  destino: "",
  preco: "",
  milhas: "",
  data_sorteio: "",
  imagem: "",
});
  const [form, setForm] = useState({
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
      }
    }

    carregar();
  }, []);

  async function loginGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/admin",
      },
    });
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
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
      console.error(error);
      alert("Erro ao criar campanha.");
      return;
    }

    alert("Campanha criada com sucesso!");

    setForm({
      titulo: "",
      destino: "",
      preco: "",
      milhas: "",
      data_sorteio: "",
      imagem: "",
    });

    buscarCampanhas();
  }

  async function excluirCampanha(id: number) {
    const confirmar = confirm("Deseja realmente excluir esta campanha?");

    if (!confirmar) return;

    const { error } = await supabase
      .from("campaigns")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Erro ao excluir campanha.");
      return;
    }

    alert("Campanha excluída!");
    buscarCampanhas();
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
    console.error(error);
    alert("Erro ao salvar alterações.");
    return;
  }

  alert("Campanha atualizada!");
  cancelarEdicao();
  buscarCampanhas();
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
              Gerencie campanhas do Passaporte da Sorte.
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-full bg-white/10 border border-white/15 px-5 py-3 font-black"
          >
            Sair
          </button>
        </div>

        <section className="grid lg:grid-cols-3 gap-8 mt-10">
          <div className="lg:col-span-1 rounded-[2rem] bg-white text-[#061832] p-6 shadow-2xl h-fit">
            <h2 className="text-2xl font-black">Nova campanha</h2>

            <div className="mt-6 space-y-4">
              <Input
                label="Título"
                value={form.titulo}
                onChange={(v) => setForm({ ...form, titulo: v })}
              />

              <Input
                label="Destino"
                value={form.destino}
                onChange={(v) => setForm({ ...form, destino: v })}
              />

              <Input
                label="Preço"
                value={form.preco}
                onChange={(v) => setForm({ ...form, preco: v })}
              />

              <Input
                label="Milhas"
                value={form.milhas}
                onChange={(v) => setForm({ ...form, milhas: v })}
              />

              <Input
                label="Data do sorteio"
                value={form.data_sorteio}
                onChange={(v) => setForm({ ...form, data_sorteio: v })}
              />

              <Input
                label="Imagem"
                value={form.imagem}
                onChange={(v) => setForm({ ...form, imagem: v })}
              />

              <button
                onClick={criarCampanha}
                className="w-full rounded-2xl bg-[#23C997] py-4 font-black text-[#061832]"
              >
                Criar campanha
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="text-3xl font-black mb-5">
              Campanhas cadastradas
            </h2>

            {campanhas.length === 0 ? (
              <div className="rounded-[2rem] bg-white/10 border border-white/15 p-8 text-center text-white/60">
                Nenhuma campanha cadastrada ainda.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {campanhas.map((campanha) => (
                  <div
                    key={campanha.id}
                    className="rounded-[2rem] bg-white/10 border border-white/15 overflow-hidden shadow-2xl"
                  >
                    <img
                      src={campanha.imagem || "/logo.png"}
                      alt={campanha.destino}
                      className="h-44 w-full object-cover"
                    />

                    <div className="p-5">
                      <p className="text-white/50 text-sm font-black">
                        {campanha.titulo}
                      </p>

                      <h3 className="text-2xl font-black">
                        {campanha.destino}
                      </h3>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#23C997] px-3 py-1 text-xs font-black text-[#061832]">
                          R$ {campanha.preco}
                        </span>

                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black">
                          🍀 {campanha.milhas} milhas
                        </span>

                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black">
                          {campanha.data_sorteio}
                        </span>
                      </div>

                      <div className="mt-5 flex gap-3">
                        {editandoId === campanha.id && (
  <div className="mt-5 space-y-3 rounded-2xl bg-white p-4 text-[#061832]">
    <Input
      label="Título"
      value={editForm.titulo}
      onChange={(v) => setEditForm({ ...editForm, titulo: v })}
    />

    <Input
      label="Destino"
      value={editForm.destino}
      onChange={(v) => setEditForm({ ...editForm, destino: v })}
    />

    <Input
      label="Preço"
      value={editForm.preco}
      onChange={(v) => setEditForm({ ...editForm, preco: v })}
    />

    <Input
      label="Milhas"
      value={editForm.milhas}
      onChange={(v) => setEditForm({ ...editForm, milhas: v })}
    />

    <Input
      label="Data do sorteio"
      value={editForm.data_sorteio}
      onChange={(v) => setEditForm({ ...editForm, data_sorteio: v })}
    />

    <Input
      label="Imagem"
      value={editForm.imagem}
      onChange={(v) => setEditForm({ ...editForm, imagem: v })}
    />

    <div className="flex gap-3">
      <button
        onClick={() => salvarEdicao(campanha.id)}
        className="flex-1 rounded-xl bg-[#23C997] py-3 font-black text-[#061832]"
      >
        Salvar
      </button>

      <button
        onClick={cancelarEdicao}
        className="flex-1 rounded-xl bg-slate-200 py-3 font-black text-[#061832]"
      >
        Cancelar
      </button>
    </div>
  </div>
)}
                       <button
  onClick={() => iniciarEdicao(campanha)}
  className="flex-1 rounded-xl bg-white/10 border border-white/15 py-3 font-black text-white"
>
  Editar
</button>

                        <button
                          onClick={() => excluirCampanha(campanha.id)}
                          className="flex-1 rounded-xl bg-red-500 py-3 font-black text-white"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-black">{label}</label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
      />
    </div>
  );
}