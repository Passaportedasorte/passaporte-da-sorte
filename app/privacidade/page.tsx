import SiteHeader from "@/app/components/SiteHeader";
import SiteFooter from "@/app/components/SiteFooter";

export default function PrivacidadePage() {
  return (
    <main className="min-h-screen bg-[#061832] text-white px-5 md:px-8 py-12">
      <SiteHeader />

      <div className="max-w-5xl mx-auto mt-10">
        <a href="/" className="text-[#23C997] font-black hover:underline">
          ← Voltar
        </a>

        <h1 className="text-5xl font-black mt-8">
          Política de Privacidade
        </h1>

        <p className="text-white/60 mt-3 text-lg">
          Saiba como o Passaporte da Sorte coleta, utiliza e protege seus dados.
        </p>

        <div className="mt-10 space-y-8">
          <Section title="1. Dados que coletamos">
            <p>
              Podemos coletar informações como nome, e-mail, CPF, celular, data
              de nascimento, histórico de compras, PASS-IDs, milhas e dados de
              participação em campanhas.
            </p>
          </Section>

          <Section title="2. Como usamos seus dados">
            <p>
              Utilizamos seus dados para identificar participantes, processar
              pagamentos, gerar PASS-IDs, creditar milhas, comunicar informações
              sobre campanhas, publicar resultados e cumprir obrigações legais.
            </p>
          </Section>

          <Section title="3. Compartilhamento de informações">
            <p>
              O Passaporte da Sorte não comercializa dados pessoais dos usuários.
              As informações poderão ser compartilhadas apenas com parceiros
              necessários para operação da plataforma, processamento de pagamentos,
              segurança, atendimento ou cumprimento de obrigações legais.
            </p>
          </Section>

          <Section title="4. Segurança dos dados">
            <p>
              Adotamos medidas técnicas e organizacionais para proteger os dados
              dos usuários contra acesso não autorizado, perda, alteração ou uso
              indevido.
            </p>
          </Section>

          <Section title="5. Direitos do usuário">
            <p>
              O usuário poderá solicitar atualização, correção, confirmação de
              tratamento ou exclusão de seus dados pessoais, observadas as
              obrigações legais e regulatórias aplicáveis.
            </p>
          </Section>

          <Section title="6. Uso de imagem e resultados">
            <p>
              Quando autorizado ou previsto nos Termos de Uso e Regulamento, o
              Passaporte da Sorte poderá divulgar nome, cidade, fotos, vídeos e
              informações relacionadas aos resultados das campanhas.
            </p>
          </Section>

          <Section title="7. Cookies e tecnologias">
            <p>
              A plataforma poderá utilizar cookies e tecnologias semelhantes para
              melhorar a experiência do usuário, analisar acessos e garantir o
              funcionamento adequado do site.
            </p>
          </Section>

          <Section title="8. Contato">
            <p>
              Para dúvidas relacionadas à privacidade e proteção de dados, entre
              em contato pelos canais oficiais do Passaporte da Sorte.
            </p>
          </Section>

          <Section title="9. Atualizações desta política">
            <p>
              Esta Política de Privacidade poderá ser atualizada sempre que
              necessário. A versão mais recente estará disponível nesta página.
            </p>

            <p>Última atualização: 02/06/2026.</p>
          </Section>
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