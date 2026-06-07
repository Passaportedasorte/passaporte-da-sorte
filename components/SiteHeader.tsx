"use client";

import { Briefcase, CircleHelp, Home, Trophy, Sparkles, User } from "lucide-react";

export default function SiteHeader() {
  return (
    <header className="sticky top-4 z-[9999] px-5 md:px-8">
      <div className="max-w-7xl mx-auto rounded-[2rem] bg-white/10 border border-white/15 px-4 md:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 shadow-2xl backdrop-blur-xl">
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
            onClick={() => (window.location.href = "/")}
            className="flex items-center justify-center gap-2 rounded-full px-3 py-3 text-white/85 hover:text-white hover:bg-white/10 transition font-black"
          >
            <Home className="w-5 h-5 text-[#23C997]" />
            Início
          </button>

          <button
            onClick={() => (window.location.href = "/campanhas")}
            className="flex items-center justify-center gap-2 rounded-full px-3 py-3 text-white/85 hover:text-white hover:bg-white/10 transition font-black"
          >
            <Briefcase className="w-5 h-5 text-[#23C997]" />
            Campanhas
          </button>

          <button
            onClick={() => (window.location.href = "/resultados")}
            className="flex items-center justify-center gap-2 rounded-full px-3 py-3 text-white/85 hover:text-white hover:bg-white/10 transition font-black"
          >
            <Trophy className="w-5 h-5 text-[#23C997]" />
            Resultados
          </button>

          <button
            onClick={() => (window.location.href = "/faq")}
            className="flex items-center justify-center gap-2 rounded-full px-3 py-3 text-white/85 hover:text-white hover:bg-white/10 transition font-black"
          >
            <CircleHelp className="w-5 h-5 text-[#23C997]" />
            FAQ
          </button>

          <button
  onClick={() => (window.location.href = "/minhas-milhas")}
  className="flex items-center justify-center gap-2 rounded-full px-3 py-3 text-white/85 hover:text-white hover:bg-white/10 transition font-black"
>
  <Sparkles className="w-5 h-5 text-[#23C997]" />
  Benefícios
</button>

          <button
            onClick={() => (window.location.href = "/painel")}
            className="col-span-2 md:col-span-1 flex items-center justify-center gap-2 rounded-full bg-[#23C997] px-5 py-3 font-black text-[#061832] hover:scale-105 transition shadow-xl shadow-emerald-500/20"
          >
            <User className="w-5 h-5" />
            Meu Painel
          </button>
        </nav>
      </div>
    </header>
  );
}