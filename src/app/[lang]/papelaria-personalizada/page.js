import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Papelaria Personalizada & Embalagens de Luxo para Marcas | The Brand Box",
  description: "Eleve o unboxing da sua marca com caixas gaveta exclusivas, papel de presente estampado, cartões e tags em papéis nobres. Arquivos prontos para gráfica ou entrega física.",
  keywords: [
    "papelaria personalizada",
    "embalagens personalizadas luxo",
    "caixa gaveta personalizada",
    "papel de presente personalizado com logo",
    "tags personalizadas para produtos",
    "cartao de visita papel nobre",
    "unboxing de luxo pequenas marcas",
    "papelaria corporativa elegante"
  ],
  alternates: {
    canonical: "https://thebrandbox.sonhodepapel.com/pt/papelaria-personalizada",
    languages: {
      "pt-BR": "https://thebrandbox.sonhodepapel.com/pt/papelaria-personalizada",
      "en-US": "https://thebrandbox.sonhodepapel.com/en/custom-stationery",
    },
  },
  openGraph: {
    title: "Papelaria Personalizada & Embalagens de Luxo | The Brand Box",
    description: "Transforme o unboxing da sua marca em uma experiência memorável. Caixas gaveta, papel de presente estampado e papelaria nobre.",
    url: "https://thebrandbox.sonhodepapel.com/pt/papelaria-personalizada",
    images: [
      {
        url: "https://thebrandbox.sonhodepapel.com/og-papelaria.jpg",
        width: 1200,
        height: 630,
        alt: "Papelaria Personalizada e Caixa Gaveta The Brand Box",
      },
    ],
  },
};

export default function PapelariaPersonalizadaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: "The Brand Box — Papelaria Personalizada & Embalagens de Luxo",
        description: "Kit de papelaria institucional e embalagens personalizadas de luxo com caixa gaveta, papel de presente estampado, cartões e tags.",
        image: "https://thebrandbox.sonhodepapel.com/og-papelaria.jpg",
        brand: {
          "@type": "Brand",
          name: "The Brand Box",
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "BRL",
          price: "497.00",
          availability: "https://schema.org/InStock",
          url: "https://thebrandbox.sonhodepapel.com/pt/papelaria-personalizada",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "O que está incluído no kit de papelaria personalizada The Brand Box?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "O kit inclui design para Caixa Gaveta rígida (13,5x18,5cm), estampa contínua da marca para papel de presente e papel seda, cartões de visita institucionais, tags de produto com furação e guia de especificações de papel e acabamento.",
            },
          },
          {
            "@type": "Question",
            name: "Recebo os arquivos prontos para imprimir na minha gráfica de preferência?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sim! Todos os layouts são entregues em arquivos vetoriais PDF/X-1a, no padrão de cor CMYK profissional, com sangria técnica, marcas de corte e guias de faca especiais para produção em qualquer gráfica.",
            },
          },
          {
            "@type": "Question",
            name: "Posso solicitar a produção física das caixas e papelaria?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sim, a The Brand Box oferece o opcional de produção física artesanal através do nosso atelier parceiro Sonho de Papel, entregando as caixas montadas com acabamento de alto padrão diretamente no seu endereço.",
            },
          },
          {
            "@type": "Question",
            name: "Quais tipos de papéis e acabamentos nobres são recomendados?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Recomendamos papéis texturizados de algodão (Markatto, Rives, Colorplus), papéis kraft premium e acabamentos refinados como Hot Stamping dourado/cobre, relevo seco (blind deboss) e verniz localizado.",
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

      {/* Navigation Header */}
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
            href="/en/custom-stationery"
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
              boxShadow: "0 4px 14px rgba(31, 138, 128, 0.25)",
              transition: "all 0.2s ease"
            }}
          >
            Criar Minha Marca
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        padding: "48px 24px 72px 24px",
        maxWidth: "1100px",
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
          marginBottom: "24px"
        }}>
          Experiência de Marca & Unboxing de Luxo
        </div>

        <h1 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
          fontWeight: 600,
          lineHeight: 1.25,
          letterSpacing: "0.04em",
          color: "#2A2A2A",
          maxWidth: "900px",
          margin: "0 auto 24px auto"
        }}>
          Papelaria Personalizada & Embalagens que Encantam no Primeiro Toque
        </h1>

        <p style={{
          fontSize: "1.05rem",
          lineHeight: 1.75,
          color: "#515361",
          maxWidth: "750px",
          margin: "0 auto 40px auto"
        }}>
          O momento em que seu cliente abre o pacote define o valor percebido do seu produto ou serviço. Criamos sistemas completos de papelaria de luxo com Caixa Gaveta exclusiva, estampa da sua marca e acabamentos táteis de alta sofisticação.
        </p>

        <div style={{
          position: "relative",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 20px 48px rgba(0,0,0,0.12)",
          marginBottom: "48px",
          maxHeight: "520px"
        }}>
          <Image
            src="/showcase-papelaria.jpg"
            alt="Papelaria Personalizada e Caixa Gaveta The Brand Box"
            width={1200}
            height={675}
            priority
            style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          <Link
            href="/pt"
            style={{
              padding: "16px 36px",
              borderRadius: "30px",
              background: "#1F8A80",
              color: "#FFFFFF",
              textDecoration: "none",
              fontSize: "0.95rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              boxShadow: "0 8px 24px rgba(31, 138, 128, 0.35)",
              transition: "transform 0.2s ease"
            }}
          >
            Começar Meu Projeto de Papelaria
          </Link>
        </div>
      </section>

      {/* Itens do Kit de Papelaria */}
      <section style={{
        padding: "72px 24px",
        backgroundColor: "#FFFFFF",
        borderTop: "1px solid #EFECE3",
        borderBottom: "1px solid #EFECE3"
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.82rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#1F8A80",
              fontWeight: 700
            }}>
              Design Exclusivo & Detalhes
            </span>
            <h2 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(1.6rem, 3.2vw, 2.3rem)",
              fontWeight: 600,
              color: "#2A2A2A",
              marginTop: "12px",
              letterSpacing: "0.03em"
            }}>
              O Que Compõe a Sua Coleção de Papelaria
            </h2>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "28px"
          }}>
            {/* Card 1 */}
            <div style={{
              backgroundColor: "#FAFAFA",
              borderRadius: "20px",
              padding: "32px 28px",
              border: "1px solid #EFECE3",
              boxShadow: "0 8px 24px rgba(0,0,0,0.04)"
            }}>
              <div style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#C7B49F",
                marginBottom: "20px"
              }} />
              <h3 style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "1.15rem",
                color: "#2A2A2A",
                marginBottom: "12px",
                letterSpacing: "0.04em"
              }}>
                Caixa Gaveta Personalizada (13,5x18,5cm)
              </h3>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "#515361" }}>
                Estrutura rígida de deslizamento suave com puxador e berço, ideal para acomodar documentos, cartões, amostras ou mimos com sofisticação incomparável.
              </p>
            </div>

            {/* Card 2 */}
            <div style={{
              backgroundColor: "#FAFAFA",
              borderRadius: "20px",
              padding: "32px 28px",
              border: "1px solid #EFECE3",
              boxShadow: "0 8px 24px rgba(0,0,0,0.04)"
            }}>
              <div style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#1F8A80",
                marginBottom: "20px"
              }} />
              <h3 style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "1.15rem",
                color: "#2A2A2A",
                marginBottom: "12px",
                letterSpacing: "0.04em"
              }}>
                Papel de Presente & Seda com Estampa Exclusiva
              </h3>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "#515361" }}>
                Padrão geométrico ou botânico vetorial exclusivo gerado a partir da sua identidade de marca, em repetição contínua para embalagens e forros.
              </p>
            </div>

            {/* Card 3 */}
            <div style={{
              backgroundColor: "#FAFAFA",
              borderRadius: "20px",
              padding: "32px 28px",
              border: "1px solid #EFECE3",
              boxShadow: "0 8px 24px rgba(0,0,0,0.04)"
            }}>
              <div style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#9B8B9B",
                marginBottom: "20px"
              }} />
              <h3 style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "1.15rem",
                color: "#2A2A2A",
                marginBottom: "12px",
                letterSpacing: "0.04em"
              }}>
                Cartões Institucionais & Tags Nobres
              </h3>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "#515361" }}>
                Cartões de visita e tags de produto com tipografia calibrada, furações de precisão e recomendações de gramatura nobre (250g a 600g).
              </p>
            </div>

            {/* Card 4 */}
            <div style={{
              backgroundColor: "#FAFAFA",
              borderRadius: "20px",
              padding: "32px 28px",
              border: "1px solid #EFECE3",
              boxShadow: "0 8px 24px rgba(0,0,0,0.04)"
            }}>
              <div style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#8D9A87",
                marginBottom: "20px"
              }} />
              <h3 style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "1.15rem",
                color: "#2A2A2A",
                marginBottom: "12px",
                letterSpacing: "0.04em"
              }}>
                Arquivos Prontos para Gráfica (PDF/X-1a)
              </h3>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "#515361" }}>
                Vetores em escala real com margens de sangria técnica, guias de corte e separação de camadas para acabamentos especiais (hot stamp e relevo).
              </p>
            </div>

            {/* Card 5 */}
            <div style={{
              backgroundColor: "#FAFAFA",
              borderRadius: "20px",
              padding: "32px 28px",
              border: "1px solid #EFECE3",
              boxShadow: "0 8px 24px rgba(0,0,0,0.04)"
            }}>
              <div style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#E1EDE7",
                marginBottom: "20px"
              }} />
              <h3 style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "1.15rem",
                color: "#2A2A2A",
                marginBottom: "12px",
                letterSpacing: "0.04em"
              }}>
                Guia de Especificações & Papéis
              </h3>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "#515361" }}>
                Manual completo orientando tipos de papéis texturizados, linhas de acabamento e instruções passo a passo para enviar para sua gráfica.
              </p>
            </div>

            {/* Card 6 */}
            <div style={{
              backgroundColor: "#FAFAFA",
              borderRadius: "20px",
              padding: "32px 28px",
              border: "1px solid #EFECE3",
              boxShadow: "0 8px 24px rgba(0,0,0,0.04)"
            }}>
              <div style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: "#515361",
                marginBottom: "20px"
              }} />
              <h3 style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "1.15rem",
                color: "#2A2A2A",
                marginBottom: "12px",
                letterSpacing: "0.04em"
              }}>
                Produção Física Opcional no Atelier
              </h3>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "#515361" }}>
                Prefere receber tudo pronto? Conte com o serviço de confecção artesanal do nosso atelier parceiro Sonho de Papel com envio para todo o Brasil.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Por que o unboxing importa */}
      <section style={{ padding: "72px 24px", maxWidth: "900px", margin: "0 auto" }}>
        <div style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          padding: "44px 36px",
          boxShadow: "0 12px 32px rgba(0,0,0,0.06)",
          border: "1px solid #EFECE3"
        }}>
          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "1.65rem",
            color: "#2A2A2A",
            marginBottom: "20px",
            textAlign: "center",
            letterSpacing: "0.03em"
          }}>
            O Poder do Unboxing no Posicionamento de Marca
          </h2>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "#515361", marginBottom: "20px" }}>
            No mercado atual, o valor percebido de um produto é diretamente influenciado pela sua apresentação. Quando um cliente recebe uma embalagem rígida estruturada, com papel de presente de alta gramatura e acabamentos sofisticados, a experiência de compra se transforma em um momento de encantamento e desejo de compartilhamento espontâneo nas redes sociais.
          </p>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "#515361" }}>
            A The Brand Box une a precisão do design digital vetorial à tradição artesanal do design gráfico físico, garantindo que a sua marca transmita autoridade e refinamento em todos os pontos de contato.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "48px 24px 80px 24px", maxWidth: "850px", margin: "0 auto" }}>
        <h2 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: "1.8rem",
          textAlign: "center",
          marginBottom: "40px",
          color: "#2A2A2A",
          letterSpacing: "0.04em"
        }}>
          Perguntas Frequentes
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

        {/* CTA Footer */}
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
            Criar Minha Papelaria Personalizada
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
          © {new Date().getFullYear()} The Brand Box & Sonho de Papel. Todos os direitos reservados.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
          <Link href="/pt" style={{ color: "#E1EDE7", textDecoration: "none" }}>Início</Link>
          <Link href="/pt/identidade-visual-para-clinicas-e-consultorios" style={{ color: "#E1EDE7", textDecoration: "none" }}>Clínicas & Médicos</Link>
          <Link href="/pt/identidade-visual-para-pequenos-negocios" style={{ color: "#E1EDE7", textDecoration: "none" }}>Pequenos Negócios</Link>
          <Link href="/pt/politica-de-privacidade" style={{ color: "#E1EDE7", textDecoration: "none" }}>Privacidade</Link>
          <Link href="/pt/politica-de-reembolso" style={{ color: "#94A3B8", textDecoration: "none" }}>Termos & Suporte</Link>
        </div>
      </footer>
    </div>
  );
}
