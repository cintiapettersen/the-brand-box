import Link from "next/link";
import ContactForm from "@/components/legal/ContactForm";

export const metadata = {
  title: "Contato & Concierge Criativo | The Brand Box",
  description: "Fale com a equipe de direção de arte e concierge da The Brand Box. Suporte técnico, dúvidas sobre impressões no atelier e parcerias.",
  keywords: [
    "contato the brand box",
    "suporte the brand box",
    "concierge branding the brand box",
    "atendimento papelaria personalizada"
  ],
  alternates: {
    canonical: "https://thebrandbox.sonhodepapel.com/pt/contato",
    languages: {
      "pt-BR": "https://thebrandbox.sonhodepapel.com/pt/contato",
      "en-US": "https://thebrandbox.sonhodepapel.com/en/contact",
    },
  },
  openGraph: {
    title: "Contato & Concierge Criativo | The Brand Box",
    description: "Canais oficiais de atendimento, WhatsApp e suporte da The Brand Box.",
    url: "https://thebrandbox.sonhodepapel.com/pt/contato",
    images: [
      {
        url: "https://thebrandbox.sonhodepapel.com/og-brandbox.jpg",
        width: 1200,
        height: 630,
        alt: "Contato The Brand Box",
      },
    ],
  },
};

export default function ContatoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contato — The Brand Box",
    url: "https://thebrandbox.sonhodepapel.com/pt/contato",
    mainEntity: {
      "@type": "Organization",
      name: "The Brand Box",
      email: "hello@thebrandbox.design",
      url: "https://thebrandbox.sonhodepapel.com",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "hello@thebrandbox.design",
        availableLanguage: ["Portuguese", "English"],
      },
    },
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
            href="/en/contact"
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

      {/* Hero & Content */}
      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px 80px 24px" }}>
        
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
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
            marginBottom: "16px"
          }}>
            Canais de Atendimento & Concierge
          </div>
          <h1 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 600,
            color: "#2A2A2A",
            marginBottom: "16px"
          }}>
            Como Podemos Ajudar Você?
          </h1>
          <p style={{ fontSize: "1rem", color: "#515361", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
            Seja para tirar dúvidas sobre a sua identidade visual, consultar tiragens físicas no atelier ou propor parcerias institucionais, estamos à disposição.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "36px",
          alignItems: "start"
        }}>
          {/* Direct Channels Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* WhatsApp Card */}
            <div style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "20px",
              padding: "28px 24px",
              border: "1px solid #EFECE3",
              boxShadow: "0 8px 24px rgba(0,0,0,0.04)"
            }}>
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "#E1EDE7",
                color: "#1F8A80",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
                marginBottom: "16px"
              }}>
                💬
              </div>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.15rem", color: "#2A2A2A", margin: "0 0 8px 0" }}>
                WhatsApp do Concierge Criativo
              </h2>
              <p style={{ fontSize: "0.88rem", color: "#515361", lineHeight: 1.6, marginBottom: "18px" }}>
                Atendimento direto para tirar dúvidas rápidas sobre projetos, pedidos especiais de caixas no atelier e prazos.
              </p>
              <a
                href="https://wa.me/4793630746?text=Ol%C3%A1!%20Gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20o%20The%20Brand%20Box."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  padding: "10px 22px",
                  borderRadius: "20px",
                  backgroundColor: "#1F8A80",
                  color: "#FFFFFF",
                  textDecoration: "none",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase"
                }}
              >
                Conversar no WhatsApp →
              </a>
            </div>

            {/* Email Card */}
            <div style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "20px",
              padding: "28px 24px",
              border: "1px solid #EFECE3",
              boxShadow: "0 8px 24px rgba(0,0,0,0.04)"
            }}>
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "#F4E8DC",
                color: "#4A3A30",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
                marginBottom: "16px"
              }}>
                ✉️
              </div>
              <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.15rem", color: "#2A2A2A", margin: "0 0 8px 0" }}>
                E-mail Institucional
              </h2>
              <p style={{ fontSize: "0.88rem", color: "#515361", lineHeight: 1.6, marginBottom: "12px" }}>
                Para suporte técnico aprofundado, envio de notas fiscais e parcerias comerciais.
              </p>
              <a
                href="mailto:hello@thebrandbox.design"
                style={{ color: "#1F8A80", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none" }}
              >
                hello@thebrandbox.design
              </a>
            </div>

            {/* Business Info Card */}
            <div style={{
              backgroundColor: "#FAFAFA",
              borderRadius: "20px",
              padding: "24px 24px",
              border: "1px solid #EFECE3",
              fontSize: "0.85rem",
              color: "#515361",
              lineHeight: 1.6
            }}>
              <div style={{ fontWeight: 700, color: "#2A2A2A", marginBottom: "6px" }}>Dados da Empresa & Atelier:</div>
              <div>Pettersen Lunt design • Org: 932425643</div>
              <div>Festnigsvein 10 - kråkerrøy - Norway</div>
              <div>Horário de atendimento: Seg a Sex, 9h às 18h (BRT)</div>
            </div>

          </div>

          {/* Interactive Form */}
          <div>
            <ContactForm lang="pt" />
          </div>

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
