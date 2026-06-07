export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-10">

        <div className="grid md:grid-cols-3 gap-10">

          <div>
            <h3 className="text-2xl font-black text-white">
              🍀 Passaporte da Sorte
            </h3>

            <p className="text-white/60 mt-3">
              Clube de viagens e experiências.
            </p>
          </div>

          <div>
            <h4 className="font-black text-white mb-4">
              Navegação
            </h4>

            <div className="flex flex-col gap-2 text-white/60">
              <a href="/">Início</a>
              <a href="/campanhas">Campanhas</a>
              <a href="/resultados">Resultados</a>
              <a href="/faq">FAQ</a>
            </div>
          </div>

          <div>
            <h4 className="font-black text-white mb-4">
              Informações
            </h4>

            <div className="flex flex-col gap-2 text-white/60">
              <a href="/regulamento">Regulamento</a>
              <a href="/termos">Termos de Uso</a>
              <a href="/privacidade">Privacidade</a>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-white/40 text-sm">
          © {new Date().getFullYear()} Passaporte da Sorte. Todos os direitos reservados.
        </div>

      </div>
    </footer>
  );
}