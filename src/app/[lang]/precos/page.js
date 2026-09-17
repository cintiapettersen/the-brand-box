import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Preços & Planos de Identidade Visual | The Brand Box",
  description: "Quanto custa criar uma identidade visual completa? Conheça nossos preços transparentes sem mensalidades. Pacote completo por R$ 497 com vetores, manual e estampa.",
  keywords: [
    "quanto custa uma identidade visual",
    "preço identidade visual completa",
    "valor manual de marca",
    "custo branding clinicas pequenas empresas",
    "tabela de precos identidade visual",
    "the brand box precos"
  ],
  alternates: {
    canonical: "https://thebrandbox.sonhodepapel.com/pt/precos",
    languages: {
      "pt-BR": "https://thebrandbox.sonhodepapel.com/pt/precos",
      "en-US": "https://thebrandbox.sonhodepapel.com/en/pricing",
    },
  },
  openGraph: {
    title: "Preços e Planos de Identidade Visual | The Brand Box",
    description: "Investimento transparente e acessível. Crie um sistema visual de alto padrão em minutos com pagamento único, sem mensalidades.",
    url: "https://thebrandbox.sonhodepapel.com/pt/precos",
    images: [
      {
        url: "https://thebrandbox.sonhodepapel.com/og-precos.jpg",
        width: 1200,
        height: 630,
        alt: "Entregáveis e Tabela de Preços The Brand Box",
      },
    ],
  },
};

export default function PrecosPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: "The Brand Box — Criação de Identidade Visual e Branding Completo",
        description: "Pacote completo de identidade visual com manual de marca, arquivos vetoriais, paleta de cores, tipografia, estampa contínua e gabaritos.",
        image: "https://thebrandbox.sonhodepapel.com/og-precos.jpg",
        brand: {
          "@type": "Brand",
          name: "The Brand Box",
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "BRL",
          price: "497.00",
          priceValidUntil: "2027-12-31",
          availability: "https://schema.org/InStock",
          url: "https://thebrandbox.sonhodepapel.com/pt/precos",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Quanto custa o kit completo The Brand Box?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "O pacote completo digital custa taxa única de R$ 497,00 (podendo ser parcelado no cartão de crédito). Não cobramos mensalidades nem taxas ocultas de licenciamento.",
            },
          },
          {
            "@type": "Question",
            name: "Qual a diferença de preço entre a The Brand Box e uma agência tradicional?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Agências tradicionais costumam cobrar entre R$ 4.500 e R$ 15.000 com prazos de 30 a 60 dias. A The Brand Box entrega a mesma sofisticação e rigor técnico em poucos minutos por R$ 497 graças ao nosso sistema de inteligência criativa guiada.",
            },
          },
          {
            "@type": "Question",
            name: "Eu tenho os direitos autorais e comerciais da marca gerada?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sim, todos os direitos patrimoniais de uso comercial da identidade visual criada pertencem integralmente a você. Você pode registrar no INPI, usar em fachadas, embalagens, uniformes e publicidade.",
            },
          },
          {
            "@type": "Question",
            name: "Como funciona a garantia e a política de reembolso?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Garantimos total transparência em conformidade com o Art. 49 do Código de Defesa do Consumidor. Caso você não tenha realizado o download dos arquivos vetoriais finais, poderá solicitar cancelamento em até 7 dias.",
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
            href="/en/pricing"
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

      {/* Hero Section */}
      <section style={{
        padding: "48px 24px 60px 24px",
        maxWidth: "1000px",
        margin: "0 auto",
        textAlign: "center"
      }}>
        <div style={{
          display: "inline-block",
          padding: "6px 16px",
          borderRadius: "30px",
          backgroundColor: "#E1EDE7",
          color: "#1F8A80",
          fontSize: "0.78rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "20px"
        }}>
          Investimento Transparente & Sem Mensalidades
        </div>

        <h1 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
          fontWeight: 600,
          lineHeight: 1.25,
          letterSpacing: "0.04em",
          color: "#2A2A2A",
          marginBottom: "20px"
        }}>
          Quanto Custa uma Identidade Visual de Alto Padrão?
        </h1>

        <p style={{
          fontSize: "1.05rem",
          lineHeight: 1.75,
          color: "#515361",
          maxWidth: "750px",
          margin: "0 auto 48px auto"
        }}>
          Esqueça os orçamentos abusivos de agências ou a falta de suporte técnico de freelancers. Tenha um ecossistema completo de marca com entrega imediata e valor justo.
        </p>

        {/* Pricing Main Box Card */}
        <div style={{
          maxWidth: "720px",
          margin: "0 auto 64px auto",
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          padding: "44px 36px",
          boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
          border: "2px solid #1F8A80",
          position: "relative"
        }}>
          <div style={{
            position: "absolute",
            top: "-14px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#1F8A80",
            color: "#FFFFFF",
            padding: "4px 18px",
            borderRadius: "20px",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase"
          }}>
            Tudo Incluso • Pagamento Único
          </div>

          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "1.2rem",
            color: "#8D9A87",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "8px"
          }}>
            The Brand Box Digital Completo
          </div>

          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "baseline",
            gap: "8px",
            marginBottom: "16px"
          }}>
            <span style={{ fontSize: "1.5rem", fontWeight: 600, color: "#2A2A2A" }}>R$</span>
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "3.5rem",
              fontWeight: 700,
              color: "#2A2A2A",
              lineHeight: 1
            }}>
              497
            </span>
            <span style={{ fontSize: "0.9rem", color: "#8D9A87" }}>à vista ou em até 12x</span>
          </div>

          <p style={{ fontSize: "0.95rem", color: "#515361", lineHeight: 1.6, marginBottom: "32px" }}>
            Acesso vitalício aos seus arquivos vetoriais e manual de aplicação completo. Sem assinaturas ou cobranças recorrentes.
          </p>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "14px",
            textAlign: "left",
            marginBottom: "36px",
            padding: "20px 0",
            borderTop: "1px solid #EFECE3",
            borderBottom: "1px solid #EFECE3"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "#2A2A2A" }}>
              <span style={{ color: "#1F8A80", fontWeight: "bold" }}>✓</span>
              Assinatura Visual de Marca Vetorial
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "#2A2A2A" }}>
              <span style={{ color: "#1F8A80", fontWeight: "bold" }}>✓</span>
              Manual de Identidade Visual Completo
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "#2A2A2A" }}>
              <span style={{ color: "#1F8A80", fontWeight: "bold" }}>✓</span>
              Paleta de Cores (HEX, RGB, CMYK, Pantone)
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "#2A2A2A" }}>
              <span style={{ color: "#1F8A80", fontWeight: "bold" }}>✓</span>
              Sistema Tipográfico Institucional
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "#2A2A2A" }}>
              <span style={{ color: "#1F8A80", fontWeight: "bold" }}>✓</span>
              Estampa Contínua Vetorial de Marca
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "#2A2A2A" }}>
              <span style={{ color: "#1F8A80", fontWeight: "bold" }}>✓</span>
              Design para Caixa Gaveta (13,5x18,5cm)
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "#2A2A2A" }}>
              <span style={{ color: "#1F8A80", fontWeight: "bold" }}>✓</span>
              Arquivos Vetoriais Prontos para Gráfica (PDF/X-1a, EPS, SVG)
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "#2A2A2A" }}>
              <span style={{ color: "#1F8A80", fontWeight: "bold" }}>✓</span>
              Uso Comercial Total e Irrestrito
            </div>
          </div>

          <Link
            href="/pt"
            style={{
              display: "inline-block",
              width: "100%",
              padding: "16px 24px",
              borderRadius: "30px",
              background: "#1F8A80",
              color: "#FFFFFF",
              textDecoration: "none",
              fontSize: "1rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              boxShadow: "0 8px 24px rgba(31, 138, 128, 0.35)",
              transition: "transform 0.2s ease"
            }}
          >
            Iniciar Minha Marca Agora
          </Link>
        </div>

        {/* Showcase Image */}
        <div style={{
          position: "relative",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 20px 48px rgba(0,0,0,0.12)",
          marginBottom: "64px",
          maxHeight: "500px"
        }}>
          <Image
            src="/showcase-precos.jpg"
            alt="Entregáveis e Manual de Marca The Brand Box"
            width={1200}
            height={675}
            priority
            style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
          />
        </div>
      </section>

      {/* Tabela Comparativa de Mercado */}
      <section style={{
        padding: "72px 24px",
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #EFECE3",
        borderBottom: "1px solid #EFECE3"
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "48px" }}>
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.82rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#1F8A80",
              fontWeight: 700
            }}>
              Comparativo de Mercado
            </span>
            <h2 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(1.6rem, 3.2vw, 2.3rem)",
              fontWeight: 600,
              color: "#2A2A2A",
              marginTop: "12px",
              letterSpacing: "0.03em"
            }}>
              Por Que a The Brand Box é a Escolha Mais Inteligente?
            </h2>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              minWidth: "650px"
            }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #EFECE3" }}>
                  <th style={{ padding: "16px", color: "#515361", fontWeight: 600 }}>Critério</th>
                  <th style={{
                    padding: "16px",
                    color: "#1F8A80",
                    fontWeight: 700,
                    backgroundColor: "#E1EDE7",
                    borderRadius: "12px 12px 0 0"
                  }}>
                    THE BRAND BOX
                  </th>
                  <th style={{ padding: "16px", color: "#515361", fontWeight: 600 }}>Agência Tradicional</th>
                  <th style={{ padding: "16px", color: "#515361", fontWeight: 600 }}>Freelancer Avulso</th>
                  <th style={{ padding: "16px", color: "#515361", fontWeight: 600 }}>Geradores Genéricos</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #EFECE3" }}>
                  <td style={{ padding: "16px", fontWeight: 600 }}>Investimento</td>
                  <td style={{ padding: "16px", fontWeight: 700, color: "#1F8A80", backgroundColor: "rgba(225, 237, 231, 0.4)" }}>R$ 497 (único)</td>
                  <td style={{ padding: "16px", color: "#515361" }}>R$ 4.500 a R$ 15.000</td>
                  <td style={{ padding: "16px", color: "#515361" }}>R$ 1.200 a R$ 3.500</td>
                  <td style={{ padding: "16px", color: "#515361" }}>R$ 50 a R$ 100</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #EFECE3" }}>
                  <td style={{ padding: "16px", fontWeight: 600 }}>Tempo de Entrega</td>
                  <td style={{ padding: "16px", fontWeight: 700, color: "#1F8A80", backgroundColor: "rgba(225, 237, 231, 0.4)" }}>Imediato (em minutos)</td>
                  <td style={{ padding: "16px", color: "#515361" }}>30 a 60 dias</td>
                  <td style={{ padding: "16px", color: "#515361" }}>15 a 30 dias</td>
                  <td style={{ padding: "16px", color: "#515361" }}>Instantâneo</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #EFECE3" }}>
                  <td style={{ padding: "16px", fontWeight: 600 }}>Manual de Identidade</td>
                  <td style={{ padding: "16px", fontWeight: 700, color: "#1F8A80", backgroundColor: "rgba(225, 237, 231, 0.4)" }}>Completo (25+ págs)</td>
                  <td style={{ padding: "16px", color: "#515361" }}>Completo</td>
                  <td style={{ padding: "16px", color: "#515361" }}>Básico ou Inexistente</td>
                  <td style={{ padding: "16px", color: "#515361" }}>Não incluso</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #EFECE3" }}>
                  <td style={{ padding: "16px", fontWeight: 600 }}>Estampa Vetorial Exclusiva</td>
                  <td style={{ padding: "16px", fontWeight: 700, color: "#1F8A80", backgroundColor: "rgba(225, 237, 231, 0.4)" }}>Inclusa</td>
                  <td style={{ padding: "16px", color: "#515361" }}>Cobrado à parte</td>
                  <td style={{ padding: "16px", color: "#515361" }}>Raramente incluso</td>
                  <td style={{ padding: "16px", color: "#515361" }}>Não incluso</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #EFECE3" }}>
                  <td style={{ padding: "16px", fontWeight: 600 }}>Pronto para Gráfica (PDF/X)</td>
                  <td style={{ padding: "16px", fontWeight: 700, color: "#1F8A80", backgroundColor: "rgba(225, 237, 231, 0.4)" }}>Sim (CMYK, sangrias)</td>
                  <td style={{ padding: "16px", color: "#515361" }}>Sim</td>
                  <td style={{ padding: "16px", color: "#515361" }}>Às vezes (frequentes erros)</td>
                  <td style={{ padding: "16px", color: "#515361" }}>Apenas PNG/JPG baixa</td>
                </tr>
                <tr>
                  <td style={{ padding: "16px", fontWeight: 600 }}>Produção Física Opcional</td>
                  <td style={{ padding: "16px", fontWeight: 700, color: "#1F8A80", backgroundColor: "rgba(225, 237, 231, 0.4)", borderRadius: "0 0 12px 12px" }}>Atelier Sonho de Papel</td>
                  <td style={{ padding: "16px", color: "#515361" }}>Não (apenas arquivos)</td>
                  <td style={{ padding: "16px", color: "#515361" }}>Não</td>
                  <td style={{ padding: "16px", color: "#515361" }}>Não</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "64px 24px 80px 24px", maxWidth: "850px", margin: "0 auto" }}>
        <h2 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "1.8rem",
          textAlign: "center",
          marginBottom: "40px",
          color: "#2A2A2A",
          letterSpacing: "0.04em"
        }}>
          Perguntas Frequentes sobre Preços & Pagamento
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {jsonLd["@graph"][1].mainEntity.map((item, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "16px",
                padding: "24px 28px",
                border: "1px solid #EFECE3",
                boxShadow: "0 4px 14px rgba(0,0,0,0.03)"
              }}
            >
              <h3 style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "1.05rem",
                fontWeight: 600,
                color: "#2A2A2A",
                marginBottom: "10px"
              }}>
                {item.name}
              </h3>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "#515361" }}>
                {item.acceptedAnswer.text}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", marginTop: "64px" }}>
          <Link
            href="/pt"
            style={{
              display: "inline-block",
              padding: "16px 40px",
              borderRadius: "30px",
              background: "#1F8A80",
              color: "#FFFFFF",
              textDecoration: "none",
              fontSize: "0.95rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              boxShadow: "0 8px 24px rgba(31, 138, 128, 0.35)"
            }}
          >
            Começar Meu Projeto por R$ 497
          </Link>
        </div>
      </section>

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
          <Link href="/pt/papelaria-personalizada" style={{ color: "#E1EDE7", textDecoration: "none" }}>Papelaria Personalizada</Link>
          <Link href="/pt/politica-de-privacidade" style={{ color: "#E1EDE7", textDecoration: "none" }}>Privacidade</Link>
          <Link href="/pt/politica-de-reembolso" style={{ color: "#94A3B8", textDecoration: "none" }}>Termos & Suporte</Link>
        </div>
      </footer>
    </div>
  );
}
