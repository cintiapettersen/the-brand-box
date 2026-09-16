import Link from 'next/link';
import Image from 'next/image';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const baseUrl = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://thebrandbox.design').replace(/\/$/, '');

  const title = 'Identidade Visual e Embalagens para Pequenos Negócios | The Brand Box';
  const description = 'Crie a identidade visual completa e o kit de papelaria e embalagens do seu negócio: assinatura de marca, selo, tags de sacola, cartões de agradecimento, caixas e etiquetas de envio.';

  return {
    metadataBase: new URL(baseUrl),
    title: title,
    description: description,
    keywords: [
      'identidade visual para pequenos negocios',
      'branding para pequenas empresas',
      'papelaria institucional completa',
      'identidade visual para loja online',
      'tags para sacolas',
      'embalagens personalizadas',
      'cartao de agradecimento unboxing',
      'the brand box',
    ],
    alternates: {
      canonical: '/pt/identidade-visual-para-pequenos-negocios',
      languages: {
        'pt-BR': '/pt/identidade-visual-para-pequenos-negocios',
        'en': '/en/visual-identity-for-small-businesses',
        'x-default': '/pt/identidade-visual-para-pequenos-negocios',
      },
    },
    openGraph: {
      title: title,
      description: description,
      url: `${baseUrl}/pt/identidade-visual-para-pequenos-negocios`,
      siteName: 'The Brand Box',
      locale: 'pt_BR',
      type: 'website',
      images: [
        {
          url: '/og-pequenos-negocios.jpg',
          width: 1200,
          height: 630,
          alt: 'Identidade Visual e Embalagens para Pequenos Negócios - The Brand Box',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: ['/og-pequenos-negocios.jpg'],
    },
  };
}

export default function PequenosNegociosPage() {
  const businessPillars = [
    {
      dotColor: '#C7B49F',
      title: 'Assinatura Visual de Marca (Logo System)',
      desc: 'Composição tipográfica elegante e hierarquizada com variações coordenadas (horizontal para site, vertical para tags e compacta para redes sociais).',
    },
    {
      dotColor: '#1F8A80',
      title: 'Submarca & Selo Circular',
      desc: 'O selo de autenticidade perfeito para adesivos de fechamento de sacola, foto de perfil do Instagram, carimbos e lacres de embalagens.',
    },
    {
      dotColor: '#E1EDE7',
      title: 'Estampa Exclusiva (Seamless Pattern)',
      desc: 'Padrão contínuo sem emendas em altíssima resolução com as cores da sua marca para papel de seda, caixas de envio, sacolas e tecidos.',
    },
    {
      dotColor: '#9B8B9B',
      title: 'Kit de Embalagem & Unboxing Inesquecível',
      desc: 'Tag para sacolas e produtos, Cartão de Agradecimento (10x15cm) para encantar na abertura do pacote e Etiqueta padrão dos Correios/Envios.',
    },
    {
      dotColor: '#8D9A87',
      title: 'Papelaria Institucional & Propostas Comerciais',
      desc: 'Cartão de Visita e Fidelidade, Pasta A4 com bolsa para contratos e orçamentos, Papel Timbrado, Envelopes e Recibo Comercial.',
    },
    {
      dotColor: '#515361',
      title: 'Presença Digital & Redes Sociais',
      desc: 'Cartão Digital Interativo (com botões diretos para WhatsApp, Loja Online e PIX) e Assinatura de E-mail profissional.',
    },
  ];

  const businessFaq = [
    {
      q: 'O The Brand Box serve para lojas online (e-commerce) e lojas físicas?',
      a: 'Sim! Os entregáveis cobrem tanto o universo digital (cartão interativo com links, avatar para Instagram e assinatura de e-mail) quanto o físico (tags para produtos, cartões de agradecimento de unboxing, sacolas, etiquetas de envio e caixas gaveta).',
    },
    {
      q: 'Como posso usar a Estampa Exclusiva nas minhas embalagens?',
      a: 'A estampa é entregue como um padrão de repetição infinita (seamless pattern) em altíssima resolução. Você pode enviá-la para gráficas ou fabricantes de papel de seda, caixas de papelão, sacolas e fitas adesivas personalizadas.',
    },
    {
      q: 'Os arquivos vêm prontos para mandar para a gráfica?',
      a: 'Sim! Todos os materiais contam com gabaritos milimétricos com margens de sangria e cortes corretos em formato PDF de alta resolução, aceitos por qualquer gráfica local ou online (como Printi, 360imprimir, etc.).',
    },
    {
      q: 'É pagamento único ou tem mensalidade?',
      a: 'É pagamento único! Você não fica presa a assinaturas mensais. Após a criação, todos os arquivos finais e o Brand Board completo são seus para sempre.',
    },
    {
      q: 'Em quanto tempo minha marca fica pronta?',
      a: 'Em poucos minutos! Você responde ao diagnóstico visual guiado e o sistema de direção de arte e inteligência artificial gera todo o seu universo de marca em tempo real.',
    },
  ];

  const businessSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Identidade Visual e Embalagens para Pequenos Negócios',
    provider: {
      '@type': 'Organization',
      name: 'The Brand Box',
      url: 'https://thebrandbox.design',
    },
    description: 'Criação de identidade visual completa, logotipo, selo, paleta cromática, estampa exclusiva e kit de embalagens para pequenas empresas e lojas.',
    serviceType: 'Branding e Design de Embalagens',
    offers: {
      '@type': 'Offer',
      price: '197.00',
      priceCurrency: 'BRL',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: businessFaq.map(item => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
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
          <a href="#entregas" style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5A5855', textDecoration: 'none' }}>
            O Que Você Recebe
          </a>
          <a href="#unboxing" style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5A5855', textDecoration: 'none' }}>
            Embalagem & Unboxing
          </a>
          <a href="#faq" style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5A5855', textDecoration: 'none' }}>
            FAQ
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
            Criar Minha Marca
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{ width: '100%', maxWidth: '1160px', margin: '0 auto', padding: '75px 24px 60px 24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '7px 18px', borderRadius: '30px', background: '#E1EDE7', color: '#16554E', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '32px' }}>
          🛍️ BRANDING PARA LOJAS, MARCAS AUTORAIS & PEQUENOS NEGÓCIOS
        </div>

        <h1 style={{ fontFamily: "'Cinzel', 'Playfair Display', serif", fontSize: 'clamp(2.1rem, 4.5vw, 3.5rem)', fontWeight: 700, lineHeight: 1.25, color: '#363532', maxWidth: '960px', margin: '0 auto 26px auto', letterSpacing: '-0.02em' }}>
          Identidade Visual Completa e Embalagens que Valorizam seu Produto
        </h1>

        <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.18rem)', color: '#5A5855', lineHeight: 1.75, maxWidth: '780px', margin: '0 auto 46px auto', fontWeight: 400 }}>
          Transforme sua loja ou serviço em uma marca memorável em minutos. Receba <strong>Assinatura Visual de Marca, Selo, Estampa Exclusiva, Tags para Sacola, Cartões de Unboxing e Caixas</strong> prontos para a gráfica.
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
            COMEÇAR A CRIAR MEU BRANDING
          </Link>
        </div>

        {/* HERO SHOWCASE IMAGE */}
        <div style={{ width: '100%', maxWidth: '980px', margin: '0 auto', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.08)' }}>
          <Image
            src="/og-pequenos-negocios.jpg"
            alt="Identidade Visual e Embalagens para Pequenos Negócios - The Brand Box"
            width={1200}
            height={630}
            priority
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </section>

      {/* SECTION: O QUE VOCÊ RECEBE */}
      <section id="entregas" style={{ width: '100%', maxWidth: '1160px', margin: '60px auto', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#1F8A80', fontWeight: 700, marginBottom: '8px' }}>
            KIT COMPLETO DE MARCA
          </p>
          <h2 style={{ fontFamily: "'Cinzel', 'Playfair Display', serif", fontSize: 'clamp(1.7rem, 3vw, 2.5rem)', color: '#363532', margin: 0 }}>
            Tudo o que seu negócio precisa para se posicionar com alto valor
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {businessPillars.map((pillar, i) => (
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

      {/* SECTION: EMBALAGEM & UNBOXING */}
      <section id="unboxing" style={{ width: '100%', maxWidth: '1160px', margin: '60px auto', padding: '40px 24px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #363532 0%, #1A1A1A 100%)',
            borderRadius: '28px',
            padding: '54px 38px',
            color: '#ffffff',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.25)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '36px',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: '20px', background: 'rgba(255,255,255,0.15)', color: '#F4E8DC', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '16px' }}>
              📦 EXPERIÊNCIA DO CLIENTE
            </div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.6rem, 2.8vw, 2.3rem)', margin: '0 0 16px 0', lineHeight: 1.3 }}>
              Transforme a abertura do seu pacote em um momento inesquecível
            </h2>
            <p style={{ fontSize: '0.96rem', lineHeight: 1.7, color: '#E2DDD5', margin: '0 0 28px 0', opacity: 0.95 }}>
              Mais de 70% dos clientes compartilham vídeos de unboxing nas redes sociais quando a embalagem é caprichada. O The Brand Box entrega todos os itens diagramados com harmonia visual para transformar cada venda em uma recomendação espontânea.
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
                background: '#1F8A80',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(31, 138, 128, 0.35)',
                display: 'inline-block',
              }}
            >
              CRIAR MINHAS EMBALAGENS
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
            {[
              'Tag para Sacolas e Roupas',
              'Cartão de Agradecimento (10x15)',
              'Etiqueta dos Correios / Envios',
              'Selo Circular para Lacres e Fitas',
              'Estampa para Papel de Seda',
              'Caixa Gaveta Personalizada',
              'Pasta A4 de Propostas Comerciais',
              'Cartão de Visita e Fidelidade',
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
                <span style={{ color: '#F4E8DC', fontWeight: 'bold' }}>✓</span> {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: FAQ */}
      <section id="faq" style={{ width: '100%', maxWidth: '860px', margin: '60px auto', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#1F8A80', fontWeight: 700, marginBottom: '8px' }}>
            PERGUNTAS FREQUENTES
          </p>
          <h2 style={{ fontFamily: "'Cinzel', 'Playfair Display', serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#363532', margin: 0 }}>
            Tudo o que você precisa saber
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {businessFaq.map((item, index) => (
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
            Pronta para dar à sua marca a presença que ela merece?
          </h2>
          <p style={{ fontSize: '1rem', color: '#5A5855', maxWidth: '640px', margin: '0 auto 30px auto', lineHeight: 1.65 }}>
            Inicie seu diagnóstico guiado agora e receba seu Brand Board completo com todos os arquivos prontos para encantar seus clientes.
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
            CRIAR MINHA MARCA AGORA
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
