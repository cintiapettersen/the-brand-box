import Link from 'next/link';

export const metadata = {
  title: 'Política de Privacidade | The Brand Box',
  description: 'Política de Privacidade e Proteção de Dados da plataforma The Brand Box.',
  alternates: {
    canonical: '/pt/politica-de-privacidade',
    languages: {
      'pt-BR': '/pt/politica-de-privacidade',
      'en': '/en/privacy-policy',
      'x-default': '/pt/politica-de-privacidade',
    },
  },
};

export default function PoliticaDePrivacidadePage() {
  return (
    <main style={{ minHeight: '100vh', background: '#FAFAFA', color: '#1E293B', fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif", padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto', background: '#FFFFFF', borderRadius: '24px', padding: '48px 36px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '36px', borderBottom: '1px solid #F1F5F9', paddingBottom: '24px' }}>
          <Link href="/" style={{ width: 'fit-content', display: 'inline-block', fontSize: '0.85rem', fontWeight: 600, color: '#2A897F', textDecoration: 'none', marginBottom: '16px' }}>
            ← Voltar para o início
          </Link>
          <h1 style={{ fontFamily: "'Cinzel', 'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700, color: '#0F172A', margin: '8px 0 12px', letterSpacing: '-0.02em' }}>
            Política de Privacidade
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
            <strong>Última atualização:</strong> 04 de Agosto de 2026
          </p>
        </div>

        {/* Content Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', lineHeight: '1.7', fontSize: '0.95rem', color: '#334155' }}>
          
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>1. Quem somos e quem é o controlador dos dados</h2>
            <p>
              A <strong>The Brand Box</strong> é uma plataforma interativa de criação e auxílio no desenvolvimento de identidades visuais e papelaria digital, operada pela empresa <strong>PETTERSEN LUNT DESIGN</strong>.
            </p>
            <p style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid #2A897F', fontSize: '0.9rem' }}>
              <strong>Nome legal:</strong> PETTERSEN LUNT DESIGN, responsável pela marca The Brand Box<br/>
              <strong>Organization number:</strong> 932 370 956<br/>
              <strong>Contato para assuntos de privacidade:</strong> <a href="mailto:thebrandbox@sonhodepapel.com" style={{ color: '#2A897F', textDecoration: 'underline' }}>thebrandbox@sonhodepapel.com</a>
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>2. Dados que coletamos</h2>
            <p>Coletamos apenas os dados estritamente necessários para operar a experiência do briefing e a entrega dos materiais:</p>
            <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
              <li><strong>Dados de identificação e contato:</strong> Nome/apelido e endereço de e-mail.</li>
              <li><strong>Dados do projeto e marca:</strong> Nome da marca, área de atuação, preferências visuais, seleções de tom de voz, cores e estampas escolhidas.</li>
              <li><strong>Dados de consentimento:</strong> Registro de opt-in voluntário para comunicações de marketing e novidades, com timestamp e versão do termo.</li>
              <li><strong>Dados de transação e compras:</strong> Histórico do plano escolhido (ex: Pro, Avulso) e identificadores de sessão de pagamento do Stripe (não armazenamos dados de cartão de crédito em nossos servidores).</li>
              <li><strong>Dados técnicos de navegação:</strong> Endereço IP, tipo de navegador, sistema operacional e registros de acesso (logs) necessários para segurança do serviço.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>3. Como coletamos os dados</h2>
            <p>Os dados são coletados diretamente quando você os preenche na etapa inicial (&quot;Antes de começarmos&quot;), ao avançar pelas perguntas interativas do briefing e ao finalizar a contratação no checkout.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>4. Para que usamos os dados</h2>
            <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
              <li>Salvar o progresso do seu projeto e permitir a retomada posterior da sessão.</li>
              <li>Gerar os gabaritos, arquivos PDF de impressão e materiais digitais da sua marca.</li>
              <li>Enviar e-mails transacionais essenciais (link permanente de acesso ao projeto e atualizações de nome da marca).</li>
              <li>Enviar novidades, conteúdos e ofertas exclusivas da The Brand Box (apenas mediante seu consentimento explícito e opcional).</li>
              <li>Prevenir fraudes e garantir a segurança cibernética da aplicação.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>5. Bases legais do tratamento (LGPD & GDPR)</h2>
            <p>Tratamos seus dados pessoais com base nas seguintes hipóteses legais:</p>
            <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
              <li><strong>Execução de contrato ou procedimentos preliminares (Art. 7º, V da LGPD):</strong> envio de e-mails de acesso e disponibilização do projeto.</li>
              <li><strong>Consentimento (Art. 7º, I da LGPD):</strong> envio de newsletters e novidades promocionais (opcional).</li>
              <li><strong>Legítimo interesse (Art. 7º, IX da LGPD):</strong> melhoria da experiência na plataforma e suporte.</li>
              <li><strong>Cumprimento de obrigação legal ou regulatória (Art. 7º, II da LGPD):</strong> guarda de logs de acesso conforme o Marco Civil da Internet (Lei 12.965/2014).</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>6. Como usamos inteligência artificial</h2>
            <p>
              Utilizamos modelos de inteligência artificial da <strong>OpenAI e Google (incluindo Gemini e Imagen)</strong> exclusivamente para processar as preferências criativas do seu briefing, gerar sugestões de taglines, diagnósticos de marca e estampas.
            </p>
            <p style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid #2A897F', fontSize: '0.9rem' }}>
              <strong>Processamento seguro via API:</strong> Os dados e respostas do seu briefing são transmitidos de forma segura via API técnica exclusiva para a geração imediata do seu diagnóstico e artes, sem compartilhamento não autorizado.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>7. Serviços e fornecedores que recebem dados</h2>
            <p>Compartilhamos dados exclusivamente com fornecedores de infraestrutura e tecnologia essenciais para o funcionamento do produto:</p>
            <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
              <li><strong>Supabase Inc.:</strong> armazenamento de banco de dados e registros de leads.</li>
              <li><strong>Vercel Inc.:</strong> hospedagem de aplicação web e servidores edge.</li>
              <li><strong>InMotion Hosting (SMTP):</strong> disparo de e-mails transacionais e de entrega de projeto.</li>
              <li><strong>OpenAI & Google LLC (Gemini e Imagen):</strong> processamento de inteligência artificial criativa.</li>
              <li><strong>Stripe Inc.:</strong> processamento seguro de pagamentos e checkout.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>8. Pagamentos e Stripe</h2>
            <p>
              Todas as transações financeiras são processadas diretamente pela infraestrutura segura da <strong>Stripe</strong>. A The Brand Box não armazena nem tem acesso a números completos de cartão de crédito ou dados bancários sensíveis.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>9. E-mails essenciais e marketing opcional</h2>
            <p>
              Distinguimos rigorosamente nossas comunicações:
            </p>
            <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
              <li><strong>E-mails essenciais (transacionais):</strong> enviados para disponibilizar o link do seu projeto e confirmações de compra. Não exigem opt-in promocional.</li>
              <li><strong>Marketing opcional:</strong> enviado apenas se você marcar ativamente a caixa no formulário. Você pode revogar essa autorização a qualquer momento através do link de descadastro nos e-mails.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>10. Cookies, logs e analytics</h2>
            <p>
              Utilizamos armazenamento local (`localStorage`) no seu navegador para manter a continuidade do projeto (`brandbox_session`). Não utilizamos cookies invasivos de rastreamento de terceiros sem aviso prévio.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>11. Transferências internacionais</h2>
            <p>
              Como nossos provedores de tecnologia (Supabase, Vercel, Stripe, Google, OpenAI) possuem servidores globais, seus dados podem ser transferidos e processados internacionalmente sob garantias adequadas de proteção de dados.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>12. Períodos de retenção</h2>
            <p>
              Mantemos seus dados pessoais e arquivos do projeto pelo período necessário para cumprir as finalidades desta política ou conforme exigido por obrigações legais:
            </p>
            <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
              <li><strong>Projetos não concluídos:</strong> mantidos por até 12 meses após a última atividade.</li>
              <li><strong>Projetos comprados e materiais gerados:</strong> mantidos por até 24 meses após a entrega.</li>
              <li><strong>Registros fiscais, contábeis e de pagamento:</strong> mantidos durante o prazo legal aplicável, normalmente 5 anos.</li>
              <li><strong>Dados de marketing:</strong> mantidos até a retirada do consentimento (descadastro).</li>
            </ul>
            <p style={{ marginTop: '8px', fontSize: '0.9rem', color: '#64748B' }}>
              * Pedidos de exclusão serão atendidos antes desses prazos quando não existir obrigação legal de conservação.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>13. Segurança dos dados</h2>
            <p>
              Empregamos criptografia SSL/TLS em todas as conexões, controle de acesso restrito no banco de dados e chaves de API protegidas no servidor para garantir a integridade dos seus dados.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>14. Direitos do usuário (LGPD & GDPR)</h2>
            <p>Você tem o direito de solicitar a qualquer momento:</p>
            <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
              <li>Confirmação da existência de tratamento e acesso aos dados.</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos.</li>
              <li>Portabilidade dos dados a outro fornecedor.</li>
              <li>Eliminação dos dados pessoais tratados com o consentimento.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>15. Como revogar o consentimento</h2>
            <p>
              Você pode cancelar o recebimento de e-mails de marketing clicando em &quot;Unsubscribe&quot; / &quot;Cancelar inscrição&quot; no rodapé de qualquer e-mail promocional ou enviando uma solicitação direta para o nosso contato para assuntos de privacidade: <a href="mailto:thebrandbox@sonhodepapel.com" style={{ color: '#2A897F', textDecoration: 'underline' }}>thebrandbox@sonhodepapel.com</a>.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>16. Exclusão e portabilidade dos dados</h2>
            <p>
              Para solicitar a exclusão definitiva dos seus dados de nossa base de leads, entre em contato através do e-mail <a href="mailto:thebrandbox@sonhodepapel.com" style={{ color: '#2A897F', textDecoration: 'underline' }}>thebrandbox@sonhodepapel.com</a>.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>17. Privacidade de menores</h2>
            <p>
              Nossa plataforma é destinada a maiores de 18 anos ou profissionais com emancipação legal. Não coletamos intencionalmente dados de crianças ou adolescentes sem consentimento prévio dos responsáveis.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>18. Alterações nesta política</h2>
            <p>
              Reservamo-nos o direito de atualizar esta Política de Privacidade a qualquer momento. Quaisquer alterações significativas serão informadas nesta página com a data de atualização revisada.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>19. Contato</h2>
            <p>
              Para dúvidas, solicitações ou exercício de direitos de privacidade:
            </p>
            <p>
              <strong>Nome legal:</strong> PETTERSEN LUNT DESIGN<br/>
              <strong>Contato para assuntos de privacidade:</strong> <a href="mailto:thebrandbox@sonhodepapel.com" style={{ color: '#2A897F', textDecoration: 'underline' }}>thebrandbox@sonhodepapel.com</a><br/>
              <strong>Marca:</strong> The Brand Box
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>20. Direito de apresentar reclamação</h2>
            <p style={{ marginBottom: '10px' }}>
              Se você tiver alguma dúvida ou preocupação sobre o tratamento dos seus dados pessoais, recomendamos que primeiro entre em contato conosco pelo e-mail <a href="mailto:thebrandbox@sonhodepapel.com" style={{ color: '#2A897F', textDecoration: 'underline' }}>thebrandbox@sonhodepapel.com</a>, para que possamos analisar e tentar resolver a questão.
            </p>
            <p>
              Você também tem o direito de apresentar uma reclamação à <strong>Datatilsynet</strong>, autoridade norueguesa de proteção de dados, ou a outra autoridade supervisora competente, quando aplicável. Mais informações estão disponíveis no site da <a href="https://www.datatilsynet.no/en/" target="_blank" rel="noopener noreferrer" style={{ color: '#2A897F', textDecoration: 'underline' }}>Datatilsynet</a>.
            </p>
          </section>

        </div>

        {/* Footer */}
        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #E2E8F0', textAlign: 'center', fontSize: '0.85rem', color: '#94A3B8' }}>
          © 2026 The Brand Box · Todos os direitos reservados.
        </div>
      </div>
    </main>
  );
}
