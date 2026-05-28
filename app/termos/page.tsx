export default function TermosPage() {
  return (
    <main className="min-h-screen bg-[#061832] text-white px-5 md:px-8 py-12">
      <div className="max-w-5xl mx-auto">
        <a href="/" className="text-[#23C997] font-black hover:underline">
          ← Voltar
        </a>

        <h1 className="text-5xl font-black mt-8">Termos de Uso</h1>

        <p className="text-white/60 mt-3 text-lg">
          Termos, condições, regras de participação, resgates, sorteios,
          premiações e uso da plataforma Passaporte da Sorte.
        </p>

        <div className="mt-10 space-y-8">
          <Section title="Olá, Viajante!">
            <p>
              Nós somos o Passaporte da Sorte e nossa missão é aproximar você
              de viagens, experiências e benefícios exclusivos por meio de
              campanhas, PASS-IDs digitais, milhas promocionais e oportunidades
              vinculadas ao universo de viagens.
            </p>

            <p>
              Ao utilizar nossos serviços, você concorda com as regras,
              diretrizes e disposições destes Termos de Uso.
            </p>
          </Section>

          <Section title="1. Políticas do site">
            <p>
              O Passaporte da Sorte se reserva o direito de alterar estes termos
              a qualquer tempo, sem aviso prévio, visando melhorias operacionais,
              comerciais, tecnológicas ou adequações legais.
            </p>

            <p>
              A continuidade na utilização da plataforma após alterações implica
              plena ciência e aceitação das novas condições.
            </p>
          </Section>

          <Section title="2. Participação nas campanhas">
            <p>
              Cada PASS-ID adquirido representa uma participação válida na
              campanha selecionada, conforme valor, data, regras e condições
              divulgadas na própria plataforma.
            </p>

            <p>
              O participante deve fornecer informações verdadeiras, completas e
              atualizadas. Informações falsas, incompletas ou indícios de fraude
              poderão resultar no cancelamento da participação.
            </p>
          </Section>

          <Section title="3. Resgates, viagens e experiências">
            <p>
              Resgates, viagens, hospedagens, serviços ou experiências estão
              sujeitos à disponibilidade dos fornecedores, datas, tarifas,
              categorias e condições vigentes no momento da solicitação.
            </p>

            <p>
              Valores, disponibilidade e condições podem sofrer alterações sem
              aviso prévio por decisão de hotéis, companhias aéreas, parceiros,
              agências, plataformas terceiras ou fornecedores envolvidos.
            </p>

            <p>
              O Passaporte da Sorte poderá atuar como intermediador entre o
              participante e fornecedores, não se responsabilizando por políticas
              internas, alterações, cancelamentos ou indisponibilidades de
              terceiros.
            </p>
          </Section>

          <Section title="4. Pagamentos">
            <p>
              Os pagamentos poderão ser realizados por PIX, cartão de crédito,
              boleto ou outros meios disponibilizados no checkout.
            </p>

            <p>
              A participação somente será considerada válida após confirmação do
              pagamento pelo sistema ou instituição financeira responsável.
            </p>
          </Section>

          <Section title="5. Milhas, pontos e créditos">
            <p>
              As milhas, pontos ou créditos disponibilizados pelo Passaporte da
              Sorte possuem caráter exclusivamente promocional.
            </p>

            <p>
              Esses benefícios não representam saldo financeiro, não são
              reembolsáveis, não podem ser convertidos em dinheiro e são válidos
              apenas dentro das regras e campanhas da plataforma.
            </p>

            <p>
              O Passaporte da Sorte poderá alterar, suspender, limitar ou
              encerrar benefícios promocionais conforme critérios internos,
              campanhas vigentes ou necessidades operacionais.
            </p>
          </Section>

          <Section title="6. Regras dos sorteios">
            <p>
              Poderá participar das campanhas a pessoa física maior de 18 anos
              que realizar a aquisição válida de PASS-IDs, conforme as regras da
              campanha vigente.
            </p>

            <p>
              Os sorteios, quando realizados, seguirão as regras divulgadas na
              página oficial da campanha, podendo utilizar critérios públicos de
              apuração, como a Loteria Federal, quando aplicável.
            </p>

            <p>
              Caso o número sorteado não esteja vinculado a um participante
              válido, poderá ser aplicada regra de aproximação, considerando o
              número imediatamente superior ou inferior, conforme regulamento da
              campanha.
            </p>

            <p>
              O resultado poderá ser divulgado nos canais oficiais do
              Passaporte da Sorte.
            </p>
          </Section>

          <Section title="7. Premiação">
            <p>
              O ganhador receberá as informações necessárias para usufruir da
              premiação, sendo responsável por cumprir prazos, datas,
              documentação, regras de fornecedores, hotéis, companhias aéreas,
              transportadoras e demais prestadores de serviço.
            </p>

            <p>
              Custos não descritos expressamente na campanha, como deslocamentos
              extras, bagagens, consumos, multas, upgrades, taxas adicionais ou
              despesas pessoais, serão de responsabilidade do ganhador.
            </p>
          </Section>

          <Section title="8. Uso de imagem">
            <p>
              Ao participar, o usuário autoriza o Passaporte da Sorte a utilizar
              sua imagem, nome, voz, fotos e vídeos relacionados à campanha,
              apuração, entrega de prêmio ou experiência, para fins de
              divulgação institucional e promocional.
            </p>
          </Section>

          <Section title="9. Proibições">
            <p>
              É vedada a utilização da plataforma para fins fraudulentos,
              ofensivos, ilegais, difamatórios, discriminatórios ou que causem
              prejuízo à empresa, usuários, parceiros ou terceiros.
            </p>

            <p>
              Também é proibida qualquer tentativa de burlar o sistema, gerar
              participações indevidas, contestar pagamentos de forma abusiva ou
              explorar falhas técnicas.
            </p>
          </Section>

          <Section title="10. Política de estorno">
            <p>
              Solicitações de estorno poderão ser analisadas conforme o status
              da compra, prazo, campanha e regras do meio de pagamento.
            </p>

            <p>
              Após a realização da premiação ou encerramento da campanha, poderá
              não ser possível realizar estornos, salvo hipóteses legais
              aplicáveis.
            </p>
          </Section>

          <Section title="11. Bloqueio de usuários">
            <p>
              O Passaporte da Sorte poderá suspender, limitar ou bloquear contas
              que apresentem comportamento suspeito, fraude, uso indevido,
              contestações recorrentes, ofensas, abuso da plataforma ou violação
              destes termos.
            </p>
          </Section>

          <Section title="12. Privacidade e dados">
            <p>
              O tratamento de dados pessoais será realizado conforme a Lei Geral
              de Proteção de Dados, Lei nº 13.709/2018.
            </p>

            <p>
              Dados como nome, e-mail, telefone, login, histórico de compras,
              PASS-IDs, milhas e informações de uso poderão ser utilizados para
              operação da plataforma, segurança, comunicação, pagamentos e
              melhoria da experiência.
            </p>

            <p>
              O Passaporte da Sorte não comercializa dados pessoais dos
              usuários.
            </p>
          </Section>

          <section className="rounded-[2rem] bg-[#23C997] text-[#061832] p-8">
            <h2 className="text-3xl font-black">Conte sempre conosco.</h2>
            <p className="mt-4 font-medium leading-relaxed">
              Equipe Passaporte da Sorte.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] bg-white/10 border border-white/15 p-8">
      <h2 className="text-3xl font-black">{title}</h2>

      <div className="text-white/70 mt-5 leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  );
}