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

          <p className="text-slate-500 mt-2">
            Garanta sua participação nesta campanha.
          </p>

          <a
            href={`/?campanha=${campanha.id}#comprar`}
            className="mt-6 block text-center rounded-2xl bg-[#23C997] px-6 py-4 font-black text-[#061832]"
          >
            Comprar agora
          </a>

        </div>

      </section>
    </main>
  );
}