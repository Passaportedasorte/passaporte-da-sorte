const faqs = [
  {
    pergunta: "O que é o Passaporte da Sorte?",
    resposta:
      "É uma plataforma que conecta pessoas a experiências e viagens através de campanhas exclusivas.",
  },
  {
    pergunta: "O que é um PASS-ID?",
    resposta:
      "É o número individual vinculado à sua participação em uma campanha. Cada PASS-ID é único.",
  },
  {
    pergunta: "Como participo de uma campanha?",
    resposta:
      "Escolha a campanha, preencha seus dados, conclua o pagamento e aguarde a confirmação. Depois disso, seus PASS-IDs são gerados automaticamente.",
  },
  {
    pergunta: "Onde vejo meus PASS-IDs?",
    resposta:
      "Eles ficam disponíveis no seu painel de usuário após a confirmação do pagamento.",
  },
  {
    pergunta: "Como acumulo milhas?",
    resposta:
      "Cada campanha informa quantas milhas serão creditadas. Após a confirmação do pagamento, elas aparecem no seu painel.",
  },
  {
    pergunta: "Como acompanho os resultados?",
    resposta:
      "Os resultados são publicados na página Resultados do site.",
  },
  {
    pergunta: "Posso comprar mais de uma participação?",
    resposta:
      "Sim. Você pode adquirir quantas participações desejar, respeitando as regras de cada campanha.",
  },
  {
    pergunta: "Posso usar cupom de desconto?",
    resposta:
      "Sim. Quando disponível, o cupom pode ser informado na compra e o desconto será aplicado automaticamente.",
  },
  {
    pergunta: "Como entro em contato com o suporte?",
    resposta:
      "Pelos canais oficiais informados no site e nas redes sociais do Passaporte da Sorte.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-[#061832] text-white px-5 md:px-8 py-12">
      <div className="max-w-5xl mx-auto">
        <a href="/" className="text-[#23C997] font-black hover:underline">
          ← Voltar
        </a>

        <h1 className="text-5xl font-black mt-8">Perguntas Frequentes</h1>

        <p className="text-white/60 mt-3 text-lg">
          Tire suas dúvidas sobre campanhas, PASS-IDs, milhas e participação.
        </p>

        <div className="mt-10 space-y-4">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="rounded-[2rem] bg-white/10 border border-white/15 p-6"
            >
              <h2 className="text-2xl font-black">{item.pergunta}</h2>
              <p className="text-white/70 mt-3 leading-relaxed">
                {item.resposta}
              </p>
            </div>
          ))}
        </div>

        <section className="rounded-[2rem] bg-[#23C997] text-[#061832] p-8 mt-10">
          <h2 className="text-3xl font-black">
            Pronto para viver sua próxima experiência?
          </h2>

         <a
  href="/campanhas"
  className="inline-block mt-6 rounded-2xl bg-[#061832] text-white px-6 py-4 font-black"
>
  Ver Campanhas
</a>
        </section>
      </div>
    </main>
  );
}