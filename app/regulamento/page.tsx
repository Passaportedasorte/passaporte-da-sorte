import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
export default function RegulamentoPage() {
  return (
    <main className="min-h-screen bg-[#061832] text-white px-5 md:px-8 py-12">
      <SiteHeader />
      <div className="max-w-5xl mx-auto">
        <a href="/" className="text-[#23C997] font-black hover:underline">
          ← Voltar
        </a>

        <h1 className="text-5xl font-black mt-8">
          Regulamento Geral das Campanhas
        </h1>

        <p className="text-white/60 mt-3 text-lg">
          Regras gerais de funcionamento das campanhas, PASS-IDs, apuração,
          premiação e divulgação de resultados do Passaporte da Sorte.
        </p>

        <div className="mt-10 space-y-8">
          <Section title="Bem-vindo ao Passaporte da Sorte">
            <p>
              Este Regulamento estabelece as regras gerais de funcionamento das
              campanhas promovidas pelo Passaporte da Sorte.
            </p>

            <p>
              Ao participar de qualquer campanha disponibilizada na plataforma, o
              participante declara ter lido, compreendido e aceitado integralmente
              este Regulamento e os Termos de Uso da plataforma.
            </p>
          </Section>

          <Section title="1. Objetivo das Campanhas">
            <p>
              As campanhas promovidas pelo Passaporte da Sorte têm como objetivo
              proporcionar aos participantes a oportunidade de concorrer a viagens,
              experiências, hospedagens, serviços, produtos, benefícios ou
              premiações divulgadas na respectiva campanha.
            </p>

            <p>
              Cada campanha poderá possuir características, datas, prazos,
              quantidades de PASS-IDs e premiações específicas.
            </p>
          </Section>

          <Section title="2. Elegibilidade para Participação">
            <p>
              Poderão participar das campanhas pessoas físicas maiores de 18 anos
              que realizarem cadastro válido na plataforma e adquirirem um ou mais
              PASS-IDs conforme as condições da campanha escolhida.
            </p>

            <p>
              O Passaporte da Sorte poderá solicitar informações e documentos para
              validação cadastral sempre que considerar necessário.
            </p>
          </Section>

          <Section title="3. PASS-ID e Participação">
            <p>
              Cada PASS-ID representa uma participação válida na campanha
              correspondente.
            </p>

            <p>
              Os PASS-IDs são únicos e gerados automaticamente pelo sistema.
            </p>

            <p>
              A quantidade de PASS-IDs recebida pelo participante dependerá das
              regras e condições divulgadas na campanha.
            </p>

            <p>
              Após a confirmação do pagamento, os PASS-IDs ficarão disponíveis
              para consulta na área do participante.
            </p>
          </Section>

          <Section title="4. Funcionamento das Campanhas">
            <p>
              Cada campanha possui prazo de participação, data de encerramento,
              critérios de apuração e premiação próprios.
            </p>

            <p>
              As informações específicas estarão sempre disponíveis na página
              oficial da campanha.
            </p>

            <p>
              O Passaporte da Sorte poderá alterar datas, cronogramas ou
              procedimentos por motivos operacionais, técnicos, legais ou de força
              maior, comunicando os participantes pelos canais oficiais da
              plataforma.
            </p>
          </Section>

          <Section title="5. Apuração dos Resultados">
            <p>
              A apuração dos resultados poderá ocorrer com base nos resultados
              oficiais da Loteria Federal do Brasil, conforme definido na campanha
              correspondente.
            </p>

            <p>
              Quando a campanha utilizar a Loteria Federal como critério de
              apuração, será considerado inicialmente o PASS-ID correspondente ao
              número sorteado.
            </p>

            <p>
              Caso não exista um PASS-ID exatamente igual ao número sorteado, a
              busca seguirá de forma progressiva, iniciando pelo número
              imediatamente superior ao resultado oficial.
            </p>

            <p>
              Não sendo encontrado participante, será verificado o número
              imediatamente inferior.
            </p>

            <p>
              O processo continuará alternando entre números superiores e
              inferiores, em ordem crescente de proximidade, até que seja
              encontrado um PASS-ID válido participante da campanha.
            </p>

            <p>
              A participação implica concordância com este método de apuração.
            </p>
          </Section>

          <Section title="6. Premiação">
            <p>
              A premiação será aquela divulgada oficialmente na campanha
              correspondente.
            </p>

            <p>
              O prêmio poderá incluir viagens, hospedagens, experiências,
              produtos, serviços, créditos ou benefícios específicos.
            </p>

            <p>
              Despesas não previstas expressamente na descrição da campanha
              poderão ser de responsabilidade do participante contemplado.
            </p>

            <p>
              O prêmio não poderá ser convertido em dinheiro, salvo quando
              expressamente previsto pela campanha ou exigido por legislação
              aplicável.
            </p>
          </Section>

          <Section title="7. Contato com o Ganhador">
            <p>
              O participante contemplado será contatado pelos dados informados em
              seu cadastro, incluindo telefone, WhatsApp e e-mail.
            </p>

            <p>
              É responsabilidade exclusiva do participante manter seus dados
              atualizados.
            </p>

            <p>
              O Passaporte da Sorte não se responsabiliza por falhas decorrentes
              de informações incorretas, incompletas ou desatualizadas.
            </p>
          </Section>

          <Section title="8. Divulgação dos Resultados">
            <p>
              Os resultados poderão ser divulgados nos canais oficiais do
              Passaporte da Sorte.
            </p>

            <p>A divulgação poderá incluir:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Nome do ganhador;</li>
              <li>Cidade do ganhador;</li>
              <li>PASS-ID vencedor;</li>
              <li>Número utilizado na apuração;</li>
              <li>Fotos;</li>
              <li>Vídeos;</li>
              <li>Registros da entrega da premiação;</li>
              <li>Outros conteúdos relacionados à campanha.</li>
            </ul>

            <p>
              A divulgação respeitará a legislação vigente e os direitos dos
              participantes.
            </p>
          </Section>

          <Section title="9. Regras Específicas das Campanhas">
            <p>Cada campanha poderá possuir regras complementares relacionadas a:</p>

            <ul className="list-disc pl-6 space-y-2">
              <li>Quantidade de PASS-IDs;</li>
              <li>Datas de encerramento;</li>
              <li>Critérios de participação;</li>
              <li>Critérios de premiação;</li>
              <li>Restrições específicas;</li>
              <li>Benefícios adicionais;</li>
              <li>Acúmulo de milhas promocionais.</li>
            </ul>

            <p>
              As regras específicas da campanha prevalecerão sobre este
              Regulamento quando tratarem de condições particulares daquela
              campanha.
            </p>
          </Section>

          <Section title="10. Disposições Finais">
            <p>
              O Passaporte da Sorte poderá atualizar este Regulamento sempre que
              necessário para adequação operacional, comercial, tecnológica ou
              legal.
            </p>

            <p>
              A versão mais recente estará sempre disponível na plataforma.
            </p>

            <p>
              Dúvidas relacionadas às campanhas, premiações, apuração ou
              resultados poderão ser esclarecidas pelos canais oficiais do
              Passaporte da Sorte.
            </p>

            <p>Última atualização: 02/06/2026.</p>
          </Section>

          <section className="rounded-[2rem] bg-[#23C997] text-[#061832] p-8">
            <h2 className="text-3xl font-black">
              Transparência em primeiro lugar.
            </h2>

            <p className="mt-4 font-medium leading-relaxed">
              O Passaporte da Sorte busca oferecer campanhas claras, seguras e
              transparentes, com regras acessíveis e resultados publicados nos
              canais oficiais da plataforma.
            </p>
          </section>

          <div className="flex flex-col md:flex-row gap-4">
            <a
              href="/termos"
              className="flex-1 text-center rounded-2xl bg-white/10 border border-white/15 px-6 py-4 font-black hover:bg-white/15 transition"
            >
              Termos de Uso
            </a>

            <a
              href="/"
              className="flex-1 text-center rounded-2xl bg-[#23C997] text-[#061832] px-6 py-4 font-black hover:scale-[1.02] transition"
            >
              Voltar ao site
            </a>
          </div>
        </div>
      </div>
      <SiteFooter />
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