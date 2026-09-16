export default function JsonLdSchema({ lang = 'pt' }) {
  const isEn = (lang || '').startsWith('en');
  const baseUrl = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://thebrandbox.design').replace(/\/$/, '');

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The Brand Box',
    url: baseUrl,
    logo: `${baseUrl}/the-brand-box-logo.png`,
    description: isEn
      ? 'Intelligent platform for complete visual identity creation with AI and art direction.'
      : 'Plataforma inteligente para criação de identidade visual completa com direção de arte e inteligência artificial.',
    sameAs: [
      'https://www.instagram.com/thebrandbox.design',
    ],
  };

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: isEn ? 'The Brand Box - Complete Visual Identity Generator' : 'The Brand Box - Criador de Identidade Visual Completa',
    applicationCategory: 'DesignApplication',
    operatingSystem: 'All',
    url: `${baseUrl}/${isEn ? 'en' : 'pt'}`,
    description: isEn
      ? 'Build a complete, professional visual identity in minutes. Includes Logo System, Submark Seal, Color Palette, Seamless Pattern, Typography Guidelines and Clinic Stationery.'
      : 'Crie sua identidade visual completa e profissional em minutos. Inclui Assinatura Visual de Marca, Submarca/Selo, Paleta Cromática, Estampa Exclusiva, Tipografia e Papelaria Técnica para Clínicas e Empresas.',
    offers: {
      '@type': 'Offer',
      price: '197.00',
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
      url: `${baseUrl}/${isEn ? 'en' : 'pt'}`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '128',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: isEn
      ? [
          {
            '@type': 'Question',
            name: 'What is the Brand Visual Signature (Logo System)?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'It is a sophisticated typographic composition with balanced hierarchy and proportions, delivered with variations (horizontal, vertical, and compact) for versatile applications across digital and physical media.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do I need design skills or special software installed?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. The entire process is guided step-by-step through our intuitive visual diagnosis. You receive ready-to-use vector files and templates.',
            },
          },
          {
            '@type': 'Question',
            name: 'How quickly will my visual identity be ready?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Your brand board, visual signature, color palette, custom pattern and stationery templates are generated in minutes, fully previewable in real time.',
            },
          },
          {
            '@type': 'Question',
            name: 'Are the files ready for high-resolution printing?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! All stationery items and patterns are formatted with standard graphic dimensions, bleed margins and high-resolution outputs ready for professional printers.',
            },
          },
          {
            '@type': 'Question',
            name: 'What clinic and medical materials are included?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'We provide specialized medical stationery including standard prescription pads (A4 & A5), special control prescriptions, medical certificates, medical records, vaccination guides, sleep guides, and infant care cards.',
            },
          },
        ]
      : [
          {
            '@type': 'Question',
            name: 'O que é a Assinatura Visual de Marca (Logo System)?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'É uma composição tipográfica sofisticada com hierarquia e proporções equilibradas, entregue com variações (horizontal, vertical e compacta) para aplicações versáteis em meios digitais e físicos.',
            },
          },
          {
            '@type': 'Question',
            name: 'Preciso ter experiência em design ou programas instalados?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Não! Todo o processo é guiado passo a passo através de um diagnóstico visual intuitivo. Você recebe arquivos em alta resolução e gabaritos prontos para uso.',
            },
          },
          {
            '@type': 'Question',
            name: 'Em quanto tempo minha marca fica pronta?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Seu Brand Board, Assinatura Visual, Paleta Cromática, Estampa Exclusiva e itens de Papelaria são gerados em minutos, com visualização em tempo real.',
            },
          },
          {
            '@type': 'Question',
            name: 'Os arquivos vêm prontos para mandar para a gráfica?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Sim! Todos os materiais de papelaria vêm com medidas padrão de mercado, margens de segurança e formatos em alta qualidade prontos para impressão gráfica.',
            },
          },
          {
            '@type': 'Question',
            name: 'Quais materiais para clínicas e consultórios estão inclusos?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Disponibilizamos receituários padrão (A4 e A5), receituário de controle especial, atestados médicos, prontuários, guia de vacinação, guia do sono, dicas de introdução alimentar, guia de amamentação e certificado de coragem.',
            },
          },
        ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
