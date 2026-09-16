import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "O Que Deve Conter um Manual de Identidade Visual Completo | The Brand Box",
  description: "Entenda a estrutura de um Brand Book profissional. Descubra os 7 pilares indispensáveis que compõem o manual de marca de empresas e clínicas conceituadas.",
  keywords: [
    "o que deve conter manual de identidade visual",
    "manual de marca o que e",
    "brand book como fazer",
    "estrutura manual de identidade visual",
    "guia de estilo de marca",
    "diferenca logotipo e identidade visual",
    "manual de aplicacao de marca"
  ],
  alternates: {
    canonical: "https://thebrandbox.sonhodepapel.com/pt/guia/o-que-deve-conter-um-manual-de-identidade-visual",
    languages: {
      "pt-BR": "https://thebrandbox.sonhodepapel.com/pt/guia/o-que-deve-conter-um-manual-de-identidade-visual",
      "en-US": "https://thebrandbox.sonhodepapel.com/en/guide/what-a-brand-style-guide-must-include",
    },
  },
  openGraph: {
    title: "O Que Deve Conter um Manual de Identidade Visual Completo | The Brand Box",
    description: "Por que ter apenas um logo avulso não basta. Os 7 pilares essenciais de um Brand Book de alto padrão.",
    url: "https://thebrandbox.sonhodepapel.com/pt/guia/o-que-deve-conter-um-manual-de-identidade-visual",
    images: [
      {
        url: "https://thebrandbox.sonhodepapel.com/og-guia-manual-marca.jpg",
        width: 1200,
        height: 630,
        alt: "Manual de Identidade Visual The Brand Box",
      },
    ],
  },
};

export default function GuiaManualMarcaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "O Que Deve Conter um Manual de Identidade Visual Completo: Guia Prático",
        description: "Descubra a anatomia de um manual de marca profissional e os 7 elementos indispensáveis para garantir coerência visual em todos os pontos de contato.",
        image: "https://thebrandbox.sonhodepapel.com/og-guia-manual-marca.jpg",
        datePublished: "2026-09-16T14:00:00+02:00",
        dateModified: "2026-09-16T18:00:00+02:00",
        author: {
          "@type": "Organization",
          name: "The Brand Box",
          url: "https://thebrandbox.sonhodepapel.com",
        },
        publisher: {
          "@type": "Organization",
          name: "The Brand Box",
          logo: {
            "@type": "ImageObject",
            url: "https://thebrandbox.sonhodepapel.com/the-brand-box-logo.png",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": "https://thebrandbox.sonhodepapel.com/pt/guia/o-que-deve-conter-um-manual-de-identidade-visual",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Qual é a diferença entre logotipo e manual de identidade visual?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "O logotipo é apenas o símbolo gráfico ou assinatura da marca. O manual de identidade visual (Brand Book) é o documento orientador que reúne as regras de uso, paleta cromática (HEX/CMYK), tipografia, proporções, estampas e orientações para que qualquer gráfica ou fornecedor reproduza a marca com perfeição.",
            },
          },
          {
            "@type": "Question",
            name: "Por que uma pequena empresa ou consultório precisa de um manual de marca?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sem um manual, cada fornecedor (gráfica, social media, arquiteto de fachada) usará fontes e cores aleatórias, descaracterizando o negócio. O manual protege seu investimento e garante que seu posicionamento pareça profissional e coeso em qualquer escala.",
            },
          },
          {
            "@type": "Question",
            name: "Quantas páginas costuma ter um manual de marca completo?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Um manual completo e prático costuma ter entre 20 e 35 páginas, cobrindo introdução conceitual, assinaturas de marca, paleta cromática detalhada, fontes, estampas, unboxing e regras de aplicação.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div style={{ backgroundColor: "#F8F5F1", color: "#2A2A2A", minHeight: "100vh", fontFamily: "'Montserrat', sans-serif" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header style={{
        padding: "24px 24px",
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Link href="/pt" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            fontSize: "1.25rem",
            letterSpacing: "0.15em",
            color: "#2A2A2A"
          }}>
            THE BRAND BOX
          </span>
        </Link>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <Link
            href="/en/guide/what-a-brand-style-guide-must-include"
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: "#8D9A87",
              textDecoration: "none"
            }}
          >
            EN
          </Link>
          <Link
            href="/pt"
            style={{
              padding: "10px 20px",
              borderRadius: "20px",
              background: "#1F8A80",
              color: "#FFFFFF",
              textDecoration: "none",
              fontSize: "0.82rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              boxShadow: "0 4px 14px rgba(31, 138, 128, 0.25)"
            }}
          >
            Criar Minha Marca
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px 80px 24px" }}>
        
        {/* Breadcrumbs */}
        <div style={{ fontSize: "0.82rem", color: "#8D9A87", marginBottom: "20px" }}>
          <Link href="/pt" style={{ color: "#8D9A87", textDecoration: "none" }}>Início</Link>
          {" › "}
          <Link href="/pt/precos" style={{ color: "#8D9A87", textDecoration: "none" }}>Guias</Link>
          {" › "}
          <span>Manual de Identidade Visual</span>
        </div>

        {/* Category Tag */}
        <div style={{
          display: "inline-block",
          padding: "6px 16px",
          borderRadius: "30px",
          backgroundColor: "#E1EDE7",
          color: "#1F8A80",
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "20px"
        }}>
          Guia de Branding & Gestão de Marca
        </div>

        <h1 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "clamp(2.1rem, 4.2vw, 3rem)",
          fontWeight: 600,
          lineHeight: 1.25,
          letterSpacing: "0.02em",
          color: "#2A2A2A",
          marginBottom: "20px"
        }}>
          O Que É e o Que Deve Conter um Manual de Identidade Visual Completo
        </h1>

        <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "36px", fontSize: "0.85rem", color: "#64748B" }}>
          <span>Por <strong>The Brand Box Editorial</strong></span>
          <span>•</span>
          <span>Atualizado em Setembro de 2026</span>
          <span>•</span>
          <span>Leitura de 5 min</span>
        </div>

        {/* Featured Image */}
        <div style={{
          position: "relative",
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
          marginBottom: "48px"
        }}>
          <Image
            src="/showcase-guia-manual-marca.jpg"
            alt="Manual de Identidade Visual e Brand Book The Brand Box"
            width={1200}
            height={675}
            priority
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>

        {/* Article Body */}
        <div style={{ fontSize: "1.02rem", lineHeight: 1.85, color: "#334155", display: "flex", flexDirection: "column", gap: "28px" }}>
          
          <p style={{ fontSize: "1.12rem", fontWeight: 500, color: "#2A2A2A" }}>
            Muitos empreendedores e profissionais da saúde acreditam que criar uma marca resume-se a desenhar um logotipo e salvá-lo em PNG. No entanto, contratar apenas um logo solto é o mesmo que comprar o motor de um carro sem volante, painel e chassi: você tem uma peça isolada, mas não tem como conduzir a sua presença visual.
          </p>

          <p>
            O <strong>Manual de Identidade Visual</strong> (frequentemente chamado de <em>Brand Book</em> ou <em>Brand Guidelines</em>) é a bíblia técnica e estética da sua marca. É o documento que garante que o seu negócio transmita exatamente a mesma sofisticação em uma embalagem física, em um post do Instagram ou na fachada do seu consultório.
          </p>

          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.6rem", color: "#2A2A2A", marginTop: "20px", letterSpacing: "0.03em" }}>
            Os 7 Pilares Indispensáveis de um Manual de Marca
          </h2>

          {/* Pillar 1 */}
          <div style={{ backgroundColor: "#FFFFFF", padding: "28px 24px", borderRadius: "18px", border: "1px solid #EFECE3", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.2rem", color: "#1F8A80", marginBottom: "8px" }}>
              1. Assinatura Visual Principal & Variações Estruturais
            </h3>
            <p style={{ fontSize: "0.92rem", color: "#515361", margin: 0 }}>
              Apresenta a versão horizontal principal, a versão vertical (para avatares e selos redondos), versão monocromática (para carimbos e hot stamping) e versão negativa (para aplicações sobre fundos escuros).
            </p>
          </div>

          {/* Pillar 2 */}
          <div style={{ backgroundColor: "#FFFFFF", padding: "28px 24px", borderRadius: "18px", border: "1px solid #EFECE3", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.2rem", color: "#1F8A80", marginBottom: "8px" }}>
              2. Área de Proteção e Respiro Técnico (Clear Space)
            </h3>
            <p style={{ fontSize: "0.92rem", color: "#515361", margin: 0 }}>
              Define a margem invisível mínima ao redor da marca na qual nenhum outro elemento gráfico ou texto pode invadir, garantindo máxima legibilidade e destaque visual.
            </p>
          </div>

          {/* Pillar 3 */}
          <div style={{ backgroundColor: "#FFFFFF", padding: "28px 24px", borderRadius: "18px", border: "1px solid #EFECE3", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.2rem", color: "#1F8A80", marginBottom: "8px" }}>
              3. Paleta Cromática Calibrada (HEX, RGB, CMYK e Pantone)
            </h3>
            <p style={{ fontSize: "0.92rem", color: "#515361", margin: 0 }}>
              Especifica os códigos exatos para uso digital (RGB/HEX) e para impressão gráfica (CMYK/Pantone), impedindo que a sua gráfica imprima sua marca com cores apagadas ou distorcidas.
            </p>
          </div>

          {/* Pillar 4 */}
          <div style={{ backgroundColor: "#FFFFFF", padding: "28px 24px", borderRadius: "18px", border: "1px solid #EFECE3", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.2rem", color: "#1F8A80", marginBottom: "8px" }}>
              4. Sistema Tipográfico Institucional
            </h3>
            <p style={{ fontSize: "0.92rem", color: "#515361", margin: 0 }}>
              Indica quais famílias tipográficas devem ser utilizadas em títulos nobres (como fontes serifadas de alta legibilidade) e quais em corpos de texto, com orientações de pesos e espaçamentos.
            </p>
          </div>

          {/* Pillar 5 */}
          <div style={{ backgroundColor: "#FFFFFF", padding: "28px 24px", borderRadius: "18px", border: "1px solid #EFECE3", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.2rem", color: "#1F8A80", marginBottom: "8px" }}>
              5. Estampa Contínua e Padrões Vetoriais de Marca (Pattern)
            </h3>
            <p style={{ fontSize: "0.92rem", color: "#515361", margin: 0 }}>
              Um dos maiores diferenciais de marcas de alto luxo. Fornece padrões geométricos ou orgânicos vetoriais para papel de seda, forros de caixas, fitas e papel de presente.
            </p>
          </div>

          {/* Pillar 6 */}
          <div style={{ backgroundColor: "#FFFFFF", padding: "28px 24px", borderRadius: "18px", border: "1px solid #EFECE3", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.2rem", color: "#1F8A80", marginBottom: "8px" }}>
              6. O Que NUNCA Fazer com a Marca (Usos Incorretos)
            </h3>
            <p style={{ fontSize: "0.92rem", color: "#515361", margin: 0 }}>
              Instrui fornecedores terceirizados sobre erros comuns a serem estritamente evitados: distorcer proporções, mudar as cores da paleta, aplicar sombras pesadas ou rotacionar a assinatura.
            </p>
          </div>

          {/* Pillar 7 */}
          <div style={{ backgroundColor: "#FFFFFF", padding: "28px 24px", borderRadius: "18px", border: "1px solid #EFECE3", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.2rem", color: "#1F8A80", marginBottom: "8px" }}>
              7. Mockups e Guias de Aplicação Física e Digital
            </h3>
            <p style={{ fontSize: "0.92rem", color: "#515361", margin: 0 }}>
              Exemplos visuais reais de como a marca deve ser aplicada em caixas gaveta (13,5x18,5cm), cartões de visita nobres, receituários médicos, pastas e assinaturas de e-mail.
            </p>
          </div>

          {/* CTA Box */}
          <div style={{
            backgroundColor: "#203830",
            borderRadius: "20px",
            padding: "36px 30px",
            color: "#FFFFFF",
            textAlign: "center",
            margin: "24px 0"
          }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.4rem", marginBottom: "12px", color: "#E1EDE7" }}>
              Receba o Manual Completo da sua Marca em Minutos
            </h3>
            <p style={{ fontSize: "0.95rem", color: "#A7F3D0", maxWidth: "600px", margin: "0 auto 24px auto", lineHeight: 1.6 }}>
              A The Brand Box entrega um Brand Board e Manual de Identidade Visual de mais de 25 páginas diagramado sob medida para o seu negócio por um valor único e acessível.
            </p>
            <Link
              href="/pt"
              style={{
                display: "inline-block",
                padding: "14px 36px",
                borderRadius: "30px",
                background: "#1F8A80",
                color: "#FFFFFF",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                boxShadow: "0 6px 20px rgba(0,0,0,0.3)"
              }}
            >
              Começar Meu Brand Book
            </Link>
          </div>

          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.6rem", color: "#2A2A2A", marginTop: "24px", letterSpacing: "0.03em" }}>
            Perguntas Frequentes sobre Manuais de Marca
          </h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {jsonLd["@graph"][1].mainEntity.map((faq, i) => (
              <div key={i} style={{ backgroundColor: "#FFFFFF", padding: "20px 24px", borderRadius: "14px", border: "1px solid #EFECE3" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#2A2A2A", marginBottom: "8px" }}>{faq.name}</h4>
                <p style={{ fontSize: "0.92rem", lineHeight: 1.65, color: "#515361", margin: 0 }}>{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>

        </div>

        {/* Back Link */}
        <div style={{ marginTop: "56px", borderTop: "1px solid #EFECE3", paddingTop: "24px", textAlign: "center" }}>
          <Link
            href="/pt/precos"
            style={{ color: "#1F8A80", fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}
          >
            ← Ver Planos e Preços da The Brand Box
          </Link>
        </div>

      </main>

      {/* Footer */}
      <footer style={{
        padding: "36px 24px",
        backgroundColor: "#2A2A2A",
        color: "#A0A0A0",
        fontSize: "0.8rem",
        textAlign: "center"
      }}>
        <p style={{ marginBottom: "12px" }}>
          © {new Date().getFullYear()} The Brand Box. Todos os direitos reservados.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
          <Link href="/pt" style={{ color: "#E1EDE7", textDecoration: "none" }}>Início</Link>
          <Link href="/pt/identidade-visual-para-clinicas-e-consultorios" style={{ color: "#E1EDE7", textDecoration: "none" }}>Clínicas & Médicos</Link>
          <Link href="/pt/identidade-visual-para-pequenos-negocios" style={{ color: "#E1EDE7", textDecoration: "none" }}>Pequenos Negócios</Link>
          <Link href="/pt/papelaria-personalizada" style={{ color: "#E1EDE7", textDecoration: "none" }}>Papelaria</Link>
          <Link href="/pt/precos" style={{ color: "#E1EDE7", textDecoration: "none" }}>Preços</Link>
          <Link href="/pt/politica-de-privacidade" style={{ color: "#E1EDE7", textDecoration: "none" }}>Privacidade</Link>
        </div>
      </footer>
    </div>
  );
}
