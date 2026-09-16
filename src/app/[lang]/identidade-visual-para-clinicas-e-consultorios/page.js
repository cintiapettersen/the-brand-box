import Link from 'next/link';
import Image from 'next/image';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const baseUrl = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://thebrandbox.design').replace(/\/$/, '');

  const title = 'Identidade Visual e Papelaria para Clínicas e Médicos | The Brand Box';
  const description = 'Crie a identidade visual completa e a papelaria técnica do seu consultório: receituários padrão e controle especial, atestados, pastas, guias de vacinação, sono e amamentação prontos para a gráfica.';

  return {
    metadataBase: new URL(baseUrl),
    title: title,
    description: description,
    keywords: [
      'identidade visual para clinicas',
      'papelaria medica personalizada',
      'receituario personalizado a4 a5',
      'atestado medico personalizado',
      'guia de vacinacao infantil',
      'identidade visual pediatra',
      'marca para consultorio medico',
      'cremesp',
      'the brand box',
    ],
    alternates: {
      canonical: '/pt/identidade-visual-para-clinicas-e-consultorios',
      languages: {
        'pt-BR': '/pt/identidade-visual-para-clinicas-e-consultorios',
        'en': '/en/visual-identity-for-clinics-and-medical-offices',
        'x-default': '/pt/identidade-visual-para-clinicas-e-consultorios',
      },
    },
    openGraph: {
      title: title,
      description: description,
      url: `${baseUrl}/pt/identidade-visual-para-clinicas-e-consultorios`,
      siteName: 'The Brand Box',
      locale: 'pt_BR',
      type: 'website',
      images: [
        {
          url: '/og-clinicas.jpg',
          width: 1200,
          height: 630,
          alt: 'Identidade Visual e Papelaria Técnica para Clínicas e Consultórios - The Brand Box',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: ['/og-clinicas.jpg'],
    },
  };
}

export default function ClinicasLandingPage() {
  const clinicPillars = [
    {
      dotColor: '#1F8A80',
      title: 'Receituários & Atestados Oficiais',
      desc: 'Receituário Padrão (formatos A4 e A5), Receituário de Controle Especial com campos regulamentares, Atestados Médicos, Recibos e Cartões de Retorno formatados com seu CRM e especialidade.',
    },
    {
      dotColor: '#C7B49F',
      title: 'Pastas, Envelopes & Prontuários',
      desc: 'Pasta A4 exclusiva com bolsa para entrega de laudos e exames, Envelope Ofício timbrado, Envelope Saco (24x34cm), Ficha de Cadastro e Prontuário Clínico padronizado.',
    },
    {
      dotColor: '#E1EDE7',
      title: 'Guias Pediátricos e de Cuidados ao Paciente',
      desc: 'Material exclusivo de orientação: Guia de Vacinação, Guia do Sono Infantil, Dicas de Introdução Alimentar e Folder de Amamentação com orientações de pega correta.',
    },
    {
      dotColor: '#8D9A87',
      title: 'Acolhimento & Experiência do Paciente',
      desc: 'Certificado de Coragem para encantar as crianças nas consultas, Tag personalizada para sacola, Cartão de Agradecimento e Caixa Gaveta Personalizada (13,5x18,5cm).',
    },
    {
      dotColor: '#9B8B9B',
      title: 'Presença Digital do Especialista',
      desc: 'Cartão Digital Interativo (com links diretos para agendamento, WhatsApp e consultório), Assinatura de E-mail elegante e Pack de Redes Sociais com sua paleta cromática.',
    },
    {
      dotColor: '#515361',
      title: 'Assinatura Visual de Marca & Selo / Submarca',
      desc: 'Composição tipográfica nobre com proporções equilibradas (horizontal, vertical e compacta) e Selo Circular perfeito para carimbos, adesivos e receituários.',
    },
  ];

  const medicalFaq = [
    {
      q: 'Os receituários e impressos seguem os padrões exigidos pelos conselhos de medicina?',
      a: 'Sim! Toda a nossa papelaria médica e clínica é diagramada respeitando as normas técnicas e proporções ideais de legibilidade, campos de prescrição, posologia, dados de contato, CRM e RQE.',
    },
    {
      q: 'Posso personalizar com meus dados, CRM, endereço e redes sociais?',
      a: 'Com certeza. Durante a criação, você insere o nome da sua clínica ou seu nome profissional, slogan, CRM/RQE, endereço do consultório, WhatsApp e Instagram. Todos os impressos são gerados automaticamente com as suas informações.',
    },
    {
      q: 'Os arquivos são entregues prontos para enviar para a gráfica?',
      a: 'Sim! Todos os materiais contam com gabaritos milimétricos (A4, A5, pastas com vinco e sangria, envelopes padrão dos Correios) em formato PDF de altíssima resolução, prontos para a produção em qualquer gráfica.',
    },
    {
      q: 'Como funciona para médicos conveniados a programas de parceria (ex: CREMESP)?',
      a: 'Médicos e especialistas conveniados têm acesso a condições especiais com desconto institucional. Basta iniciar o fluxo de criação e aplicar o cupom ou seguir pelo link do convênio.',
    },
    {
      q: 'Em quanto tempo recebo todo o material?',
      a: 'Em poucos minutos! O sistema de inteligência algorítmica e direção de arte gera o seu Brand Board, paleta, logotipo/assinatura e todos os mais de 30 arquivos da clínica em tempo real na tela.',
    },
  ];

  const clinicSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Identidade Visual e Papelaria Técnica para Clínicas e Médicos',
    provider: {
      '@type': 'Organization',
      name: 'The Brand Box',
      url: 'https://thebrandbox.design',
    },
    description: 'Sistema completo de identidade visual e mais de 30 impressos técnicos personalizados para médicos, pediatras e consultórios.',
    serviceType: 'Design e Papelaria Médica',
    offers: {
      '@type': 'Offer',
      price: '197.00',
      priceCurrency: 'BRL',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: medicalFaq.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#F8F5F1', color: '#363532', overflowX: 'hidden' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* TOP NAVBAR */}
      <header style={{ width: '100%', maxWidth: '1160px', margin: '0 auto', padding: '32px 24px 20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link href="/pt">
            <Image
              src="/the-brand-box-logo.png"
              alt="The Brand Box"
              width={160}
              height={36}
              priority
              style={{ width: 'auto', height: '28px', objectFit: 'contain', mixBlendMode: 'multiply', cursor: 'pointer' }}
            />
          </Link>
        </div>

        <nav style={{ display: 'none', md: 'flex', alignItems: 'center', gap: '28px' }} className="hidden md:flex">
          <a href="#materiais" style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5A5855', textDecoration: 'none' }}>
            Materiais Inclusos
          </a>
          <a href="#diferencial" style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5A5855', textDecoration: 'none' }}>
            Diferenciais Clínicos
          </a>
          <a href="#faq" style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5A5855', textDecoration: 'none' }}>
            Dúvidas Frequentes
          </a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <LanguageSwitcher />
          <Link
            href="/pt"
            style={{
              padding: '10px 20px',
              fontSize: '0.78rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 700,
              borderRadius: '24px',
              textDecoration: 'none',
              background: '#1F8A80',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(31, 138, 128, 0.28)',
              display: 'inline-block',
            }}
          >
            Criar Marca da Clínica
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{ width: '100%', maxWidth: '1160px', margin: '0 auto', padding: '75px 24px 60px 24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '7px 18px', borderRadius: '30px', background: '#E1EDE7', color: '#16554E', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '32px' }}>
          🩺 PARCERIAS MÉDICAS & CONVÊNIOS • PAPELARIA TÉCNICA EXCLUSIVA
        </div>

        <h1 style={{ fontFamily: "'Cinzel', 'Playfair Display', serif", fontSize: 'clamp(2.1rem, 4.5vw, 3.5rem)', fontWeight: 700, lineHeight: 1.25, color: '#363532', maxWidth: '960px', margin: '0 auto 26px auto', letterSpacing: '-0.02em' }}>
          Identidade Visual e Papelaria Técnica Completa para Clínicas e Consultórios
        </h1>

        <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.18rem)', color: '#5A5855', lineHeight: 1.75, maxWidth: '780px', margin: '0 auto 46px auto', fontWeight: 400 }}>
          Destaque seu consultório com uma assinatura de marca refinada e receba <strong>mais de 30 impressos médicos gabaritados</strong>: receituários padrão e controle especial, atestados, pastas para exames e guias pediátricos de cuidados prontos para a gráfica.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', smDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '60px' }}>
          <Link
            href="/pt"
            style={{
              padding: '16px 44px',
              fontSize: '0.92rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 700,
              borderRadius: '30px',
              textDecoration: 'none',
              background: '#1F8A80',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(31, 138, 128, 0.35)',
              display: 'inline-block',
            }}
          >
            CRIAR MARCA DO MEU CONSULTÓRIO
          </Link>
        </div>

        {/* HERO SHOWCASE CLINIC IMAGE */}
        <div style={{ width: '100%', maxWidth: '980px', margin: '0 auto', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.08)' }}>
          <Image
            src="/og-clinicas.jpg"
            alt="Showcase de Papelaria Técnica e Identidade Visual para Clínicas e Médicos"
            width={1200}
            height={630}
            priority
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </section>

      {/* SECTION: MATERIAIS INCLUSOS */}
      <section id="materiais" style={{ width: '100%', maxWidth: '1160px', margin: '60px auto', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#1F8A80', fontWeight: 700, marginBottom: '8px' }}>
            KIT CLÍNICO COMPLETO
          </p>
          <h2 style={{ fontFamily: "'Cinzel', 'Playfair Display', serif", fontSize: 'clamp(1.7rem, 3vw, 2.5rem)', color: '#363532', margin: 0 }}>
            Tudo o que seu consultório precisa para transmitir autoridade e afeto
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {clinicPillars.map((pillar, i) => (
            <div
              key={i}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '30px 26px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.03)',
                border: '1px solid #E2DDD5',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: pillar.dotColor,
                    display: 'inline-block',
                    border: '1.5px solid rgba(0, 0, 0, 0.12)',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.06)',
                  }}
                />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#363532' }}>
                  {pillar.title}
                </h3>
              </div>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.65, color: '#5A5855', margin: 0 }}>
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: DIFERENCIAIS CLÍNICOS */}
      <section id="diferencial" style={{ width: '100%', maxWidth: '1160px', margin: '60px auto', padding: '40px 24px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #203830 0%, #16554E 100%)',
            borderRadius: '28px',
            padding: '54px 38px',
            color: '#ffffff',
            boxShadow: '0 16px 36px rgba(22, 85, 78, 0.28)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '36px',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: '20px', background: 'rgba(255,255,255,0.15)', color: '#E1EDE7', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '16px' }}>
              🌟 O ÚNICO DO MERCADO
            </div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.6rem, 2.8vw, 2.3rem)', margin: '0 0 16px 0', lineHeight: 1.3 }}>
              Chega de impressos genéricos de bloco de papelaria padrão
            </h2>
            <p style={{ fontSize: '0.96rem', lineHeight: 1.7, color: '#E1EDE7', margin: '0 0 28px 0', opacity: 0.95 }}>
              O paciente avalia o cuidado da sua clínica desde o primeiro contato. Com o The Brand Box, seu consultório entrega uma experiência sensorial de alto padrão com receituários elegantes, pastas profissionais e guias que as famílias guardam com carinho por anos.
            </p>
            <Link
              href="/pt"
              style={{
                padding: '14px 32px',
                fontSize: '0.85rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 700,
                borderRadius: '24px',
                textDecoration: 'none',
                background: '#ffffff',
                color: '#16554E',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                display: 'inline-block',
              }}
            >
              COMEÇAR AGORA EM 3 MINUTOS
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            {[
              'Receituário A4 e A5 Padrão',
              'Controle Especial (Duas Vias)',
              'Atestados e Prontuários',
              'Guia de Vacinas e Desenvolvimento',
              'Guia do Sono e Alimentação',
              'Pasta A4 de Exames com Bolsa',
              'Certificado de Coragem Infantil',
              'Caixa Gaveta Personalizada',
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.16)',
                  borderRadius: '16px',
                  padding: '16px 16px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#ffffff',
                }}
              >
                <span style={{ color: '#A7F3D0', fontWeight: 'bold' }}>✓</span> {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: FAQ MÉDICO */}
      <section id="faq" style={{ width: '100%', maxWidth: '860px', margin: '60px auto', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#1F8A80', fontWeight: 700, marginBottom: '8px' }}>
            DÚVIDAS FREQUENTES DE MÉDICOS & GESTORES
          </p>
          <h2 style={{ fontFamily: "'Cinzel', 'Playfair Display', serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#363532', margin: 0 }}>
            Perguntas Frequentes sobre a Papelaria Clínica
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {medicalFaq.map((item, index) => (
            <div
              key={index}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #E2DDD5',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                padding: '22px 24px',
              }}
            >
              <h3 style={{ fontSize: '1.02rem', fontWeight: 700, margin: '0 0 10px 0', color: '#363532' }}>
                {item.q}
              </h3>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.65, color: '#5A5855', margin: 0 }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ width: '100%', maxWidth: '1160px', margin: '40px auto 80px auto', padding: '0 24px' }}>
        <div
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #E2DDD5',
            padding: '54px 30px',
            textAlign: 'center',
            boxShadow: '0 12px 32px rgba(0,0,0,0.06)',
          }}
        >
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', margin: '0 0 16px 0', color: '#363532' }}>
            Pronto para transformar a identidade do seu consultório?
          </h2>
          <p style={{ fontSize: '1rem', color: '#5A5855', maxWidth: '640px', margin: '0 auto 30px auto', lineHeight: 1.65 }}>
            Inicie seu diagnóstico guiado agora e receba o Brand Board completo da sua clínica com todos os impressos médicos prontos para uso.
          </p>
          <Link
            href="/pt"
            style={{
              padding: '16px 44px',
              fontSize: '0.92rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 700,
              borderRadius: '30px',
              textDecoration: 'none',
              background: '#1F8A80',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(31, 138, 128, 0.35)',
              display: 'inline-block',
            }}
          >
            CRIAR IDENTIDADE DA MINHA CLÍNICA
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ width: '100%', borderTop: '1px solid #E2DDD5', background: '#ffffff', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: '1160px', margin: '0 auto', display: 'flex', flexDirection: 'column', mdDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Image
              src="/the-brand-box-logo.png"
              alt="The Brand Box"
              width={140}
              height={32}
              style={{ width: 'auto', height: '24px', objectFit: 'contain', mixBlendMode: 'multiply' }}
            />
          </div>

          <div style={{ fontSize: '0.82rem', color: '#5A5855', textAlign: 'center' }}>
            © {new Date().getFullYear()} The Brand Box. Todos os direitos reservados.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            <Link href="/pt/politica-de-privacidade" style={{ fontSize: '0.82rem', color: '#5A5855', textDecoration: 'none' }}>
              Privacidade
            </Link>
            <span style={{ color: '#E2DDD5' }}>•</span>
            <Link href="/pt/politica-de-reembolso" style={{ fontSize: '0.82rem', color: '#94A3B8', textDecoration: 'none' }}>
              Termos & Suporte
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
