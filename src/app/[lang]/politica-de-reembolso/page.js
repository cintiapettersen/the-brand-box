import Link from 'next/link';

export const metadata = {
  title: 'Política de Reembolso e Cancelamento | The Brand Box',
  description: 'Política de Reembolso, Cancelamento e Direito de Arrependimento da plataforma The Brand Box em conformidade com o Código de Defesa do Consumidor (CDC).',
  alternates: {
    canonical: '/pt/politica-de-reembolso',
    languages: {
      'pt-BR': '/pt/politica-de-reembolso',
      'en': '/en/refund-policy',
      'x-default': '/pt/politica-de-reembolso',
    },
  },
};

export default function PoliticaDeReembolsoPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#FAFAFA', color: '#1E293B', fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif", padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto', background: '#FFFFFF', borderRadius: '24px', padding: '48px 36px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '36px', borderBottom: '1px solid #F1F5F9', paddingBottom: '24px' }}>
          <Link href="/pt" style={{ width: 'fit-content', display: 'inline-block', fontSize: '0.85rem', fontWeight: 600, color: '#1F8A80', textDecoration: 'none', marginBottom: '16px' }}>
            ← Voltar para o início
          </Link>
          <h1 style={{ fontFamily: "'Cinzel', 'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700, color: '#0F172A', margin: '8px 0 12px', letterSpacing: '-0.02em' }}>
            Política de Reembolso e Cancelamento
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
            <strong>Última atualização:</strong> Setembro de 2026 • Em conformidade com o Código de Defesa do Consumidor (Lei nº 8.078/1990)
          </p>
        </div>

        {/* Content Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', lineHeight: '1.7', fontSize: '0.95rem', color: '#334155' }}>
          
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>1. Natureza do Serviço e Conteúdo Digital</h2>
            <p>
              A <strong>The Brand Box</strong> é uma plataforma digital de direção de arte, inteligência algorítmica e criação sob medida de <strong>Sistemas de Identidade Visual, Assinaturas de Marca e Papelaria Técnica</strong> (incluindo impressos especializados para clínicas e consultórios médicos).
            </p>
            <p>
              Nossos produtos consistem na disponibilização de <strong>ativos digitais gerados de forma personalizada</strong> (Brand Boards, arquivos vetorizados em alta resolução, paletas cromáticas, estampas contínuas e gabaritos gráficos em PDF prontos para impressão).
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>2. Direito de Arrependimento (Art. 49 do CDC)</h2>
            <p>
              Em estrito cumprimento ao artigo 49 do Código de Defesa do Consumidor brasileiro, o cliente tem o direito de desistir da contratação em até <strong>7 (sete) dias corridos</strong> contados da data de confirmação do pagamento, com direito à restituição integral dos valores pagos, <strong>desde que os arquivos finais personalizados ainda não tenham sido gerados e baixados</strong>.
            </p>
            <div style={{ background: '#F0FDF4', padding: '16px 20px', borderRadius: '12px', borderLeft: '4px solid #1F8A80', fontSize: '0.92rem', color: '#16554E' }}>
              <strong>Regra de Consumo Imediato e Entrega Sob Medida:</strong><br/>
              Ao solicitar a geração final dos arquivos ou realizar o download de quaisquer PDFs de padrão gráfico, arquivos vetoriais ou materiais da marca, o cliente expressamente reconhece e concorda que o serviço sob medida foi <strong>integralmente executado e consumado</strong>, encerrando o período de desistência imotivada.
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>3. Garantia Técnica de Qualidade e Correção</h2>
            <p>
              Caso ocorra qualquer inconsistência de renderização, arquivo corrompido, erro ortográfico derivado do sistema ou incompatibilidade técnica nos gabaritos gerados:
            </p>
            <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
              <li>O cliente terá direito a <strong>suporte técnico prioritário</strong> para correção e regeneração sem qualquer custo adicional;</li>
              <li>Caso o problema técnico não seja solucionável pela nossa equipe de engenharia e design, o reembolso integral será emitido a qualquer tempo, independente do prazo de 7 dias.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>4. Procedimento para Solicitação de Reembolso</h2>
            <p>
              Para solicitar o cancelamento e reembolso dentro das condições desta política:
            </p>
            <ol style={{ paddingLeft: '20px', margin: '8px 0' }}>
              <li>Envie um e-mail para <a href="mailto:hello@thebrandbox.design" style={{ color: '#1F8A80', fontWeight: 600 }}>hello@thebrandbox.design</a> ou entre em contato pelo nosso canal oficial de suporte;</li>
              <li>Informe o <strong>e-mail cadastrado na compra</strong> e o número de identificação da transação ou CRM (para clientes parceiros da área médica);</li>
              <li>Nossa equipe responderá em até <strong>2 (dois) dias úteis</strong> com a confirmação do estorno.</li>
            </ol>
            <p>
              Os reembolsos são processados no mesmo meio de pagamento utilizado na compra (estorno na fatura do cartão de crédito ou chave PIX de origem).
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>5. Parcerias e Convênios Institucionais</h2>
            <p>
              Para profissionais conveniados a programas institucionais (como médicos e especialistas registrados no <strong>CREMESP</strong> e conselhos profissionais), aplicam-se integralmente as condições especiais de desconto e todas as garantias de conformidade com a legislação brasileira vigentes nesta política.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
