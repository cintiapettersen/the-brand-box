import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Paleta de Cores para Clínicas e Consultórios: Guia de Psicologia e Códigos HEX | The Brand Box",
  description: "Descubra como escolher a paleta de cores ideal para sua clínica ou consultório médico. Guia completo de psicologia das cores, códigos HEX/CMYK e harmonizações elegantes.",
  keywords: [
    "paleta de cores clinica medica",
    "cores para consultorio medico",
    "psicologia das cores saude",
    "paleta de cores clinica estetica",
    "paleta de cores pediatria consultorio",
    "codigos hex identidade visual medica",
    "branding para medicos e clinicas"
  ],
  alternates: {
    canonical: "https://thebrandbox.sonhodepapel.com/pt/guia/paleta-de-cores-para-clinicas-e-consultorios",
    languages: {
      "pt-BR": "https://thebrandbox.sonhodepapel.com/pt/guia/paleta-de-cores-para-clinicas-e-consultorios",
      "en-US": "https://thebrandbox.sonhodepapel.com/en/guide/color-palette-for-medical-clinics-and-offices",
    },
  },
  openGraph: {
    title: "Paleta de Cores para Clínicas e Consultórios: Guia Completo | The Brand Box",
    description: "Psicologia das cores na saúde, códigos HEX e as melhores combinações cromáticas para transmitir autoridade e acolhimento.",
    url: "https://thebrandbox.sonhodepapel.com/pt/guia/paleta-de-cores-para-clinicas-e-consultorios",
    images: [
      {
        url: "https://thebrandbox.sonhodepapel.com/og-guia-cores-clinicas.jpg",
        width: 1200,
        height: 630,
        alt: "Guia de Paleta de Cores para Clínicas e Consultórios The Brand Box",
      },
    ],
  },
};

export default function GuiaCoresClinicasPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Como Escolher a Paleta de Cores Perfeita para Clínicas e Consultórios Médicos",
        description: "Guia completo sobre psicologia das cores na área da saúde, combinações sofisticadas de tons e códigos HEX/CMYK para consultórios e clínicas.",
        image: "https://thebrandbox.sonhodepapel.com/og-guia-cores-clinicas.jpg",
        datePublished: "2026-09-16T12:00:00+02:00",
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
          "@id": "https://thebrandbox.sonhodepapel.com/pt/guia/paleta-de-cores-para-clinicas-e-consultorios",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Qual a melhor cor para um consultório médico?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Não existe uma cor única universal, mas sim combinações que equilibram autoridade técnica e acolhimento. O verde sálvia (#8D9A87), o azul névoa (#C9D7E5) e tons neutros de cashmere (#C7B49F) são as opções mais recomendadas por reduzirem a ansiedade do paciente.",
            },
          },
          {
            "@type": "Question",
            name: "Por que evitar o excesso de branco e azul hospitalar tradicional?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "O excesso de branco puro (#FFFFFF) e azul royal saturado cria uma sensação de frieza asséptica que pode aumentar o cortisol e a tensão pré-consulta. O uso de tons off-white aquecidos e verdes botânicos humaniza o atendimento sem perder o profissionalismo.",
            },
          },
          {
            "@type": "Question",
            name: "Qual a diferença entre código HEX, RGB e CMYK para consultórios?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "O código HEX e RGB são usados para telas digitais (Instagram, site, prontuário eletrônico). O código CMYK e referências Pantone são indispensáveis para garantir que receituários, pastas e caixas impressas tenham exatamente a mesma cor na gráfica sem distorções.",
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
            href="/en/guide/color-palette-for-medical-clinics-and-offices"
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

      {/* Article Content */}
      <main style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px 80px 24px" }}>
        
        {/* Breadcrumbs */}
        <div style={{ fontSize: "0.82rem", color: "#8D9A87", marginBottom: "20px" }}>
          <Link href="/pt" style={{ color: "#8D9A87", textDecoration: "none" }}>Início</Link>
          {" › "}
          <Link href="/pt/identidade-visual-para-clinicas-e-consultorios" style={{ color: "#8D9A87", textDecoration: "none" }}>Clínicas & Médicos</Link>
          {" › "}
          <span>Guia de Cores</span>
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
          Guia de Branding Médico & Design
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
          Paleta de Cores para Clínicas e Consultórios: O Guia Definitivo de Psicologia & Elegância
        </h1>

        <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "36px", fontSize: "0.85rem", color: "#64748B" }}>
          <span>Por <strong>The Brand Box Editorial</strong></span>
          <span>•</span>
          <span>Atualizado em Setembro de 2026</span>
          <span>•</span>
          <span>Leitura de 6 min</span>
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
            src="/showcase-guia-cores-clinicas.jpg"
            alt="Paleta de Cores para Clínicas e Médicos The Brand Box"
            width={1200}
            height={675}
            priority
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>

        {/* Article Body */}
        <div style={{ fontSize: "1.02rem", lineHeight: 1.85, color: "#334155", display: "flex", flexDirection: "column", gap: "28px" }}>
          
          <p style={{ fontSize: "1.12rem", fontWeight: 500, color: "#2A2A2A" }}>
            A cor é o primeiro elemento sensorial que o paciente registra ao entrar no seu consultório, abrir o seu receituário ou acessar o seu perfil profissional. Muito além da estética, a paleta cromática de um profissional de saúde é uma ferramenta neurocientífica de redução de ansiedade e transmissão de autoridade médica.
          </p>

          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.6rem", color: "#2A2A2A", marginTop: "16px", letterSpacing: "0.03em" }}>
            1. A Psicologia das Cores na Área da Saúde
          </h2>
          <p>
            Durante décadas, a área médica foi dominada pelo branco asséptico e pelo azul hospitalar saturado. No entanto, pesquisas modernas em arquitetura sensorial e design biomédico comprovam que ambientes e materiais impressos excessivamente frios ativam o estado de alerta do paciente, elevando os níveis de estresse pré-atendimento.
          </p>
          <p>
            As clínicas contemporâneas mais prestigiadas adotam a abordagem <strong>Biofílica e Tátil</strong>: tons inspirados na natureza (ervas, argilas nobres, minerais e névoas) que comunicam limpeza e precisão cirúrgica sem abrir mão do calor humano.
          </p>

          {/* Color Grids Section */}
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.6rem", color: "#2A2A2A", marginTop: "24px", letterSpacing: "0.03em" }}>
            2. As 4 Harmonizações Cromáticas Mais Nobres para Médicos
          </h2>

          {/* Palette 1: Sage & Taupe */}
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "20px",
            padding: "28px 24px",
            border: "1px solid #EFECE3",
            boxShadow: "0 8px 24px rgba(0,0,0,0.04)"
          }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.2rem", color: "#2A2A2A", marginBottom: "8px" }}>
              A. Sage Botânico & Cashmere Taupe (Dermatologia & Cirurgia Plástica)
            </h3>
            <p style={{ fontSize: "0.9rem", color: "#515361", marginBottom: "20px" }}>
              Ideal para consultórios que valorizam naturalidade, sofisticação e rejuvenescimento. O verde sálvia transmite cura e frescor botânico, enquanto o taupe adiciona calor e nobreza.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
              <div style={{ backgroundColor: "#8D9A87", padding: "16px", borderRadius: "14px", color: "#FFFFFF", textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>Sage Herb Green</div>
                <div style={{ fontSize: "0.75rem", opacity: 0.9 }}>#8D9A87</div>
              </div>
              <div style={{ backgroundColor: "#C7B49F", padding: "16px", borderRadius: "14px", color: "#FFFFFF", textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>Cashmere Taupe</div>
                <div style={{ fontSize: "0.75rem", opacity: 0.9 }}>#C7B49F</div>
              </div>
              <div style={{ backgroundColor: "#F4E8DC", padding: "16px", borderRadius: "14px", color: "#4A3A30", textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>Cream Sand</div>
                <div style={{ fontSize: "0.75rem", opacity: 0.9 }}>#F4E8DC</div>
              </div>
              <div style={{ backgroundColor: "#515361", padding: "16px", borderRadius: "14px", color: "#FFFFFF", textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>Slate Charcoal</div>
                <div style={{ fontSize: "0.75rem", opacity: 0.9 }}>#515361</div>
              </div>
            </div>
          </div>

          {/* Palette 2: Ice Mint & Powder Blue */}
          <div style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "20px",
            padding: "28px 24px",
            border: "1px solid #EFECE3",
            boxShadow: "0 8px 24px rgba(0,0,0,0.04)"
          }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.2rem", color: "#2A2A2A", marginBottom: "8px" }}>
              B. Ice Pale Mint & Powder Blue Mist (Pediatria & Maternidade)
            </h3>
            <p style={{ fontSize: "0.9rem", color: "#515361", marginBottom: "20px" }}>
              Transmite tranquilidade imediata para mães e bebês. Cores suaves que criam uma atmosfera lúdica e serena em carteirinhas de vacinação e guias pediátricos.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
              <div style={{ backgroundColor: "#E1EDE7", padding: "16px", borderRadius: "14px", color: "#203830", textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>Ice Pale Mint</div>
                <div style={{ fontSize: "0.75rem", opacity: 0.9 }}>#E1EDE7</div>
              </div>
              <div style={{ backgroundColor: "#C9D7E5", padding: "16px", borderRadius: "14px", color: "#1E2D3B", textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>Powder Blue Mist</div>
                <div style={{ fontSize: "0.75rem", opacity: 0.9 }}>#C9D7E5</div>
              </div>
              <div style={{ backgroundColor: "#FAFAFA", padding: "16px", borderRadius: "14px", color: "#2A2A2A", textAlign: "center", border: "1px solid #E2E8F0" }}>
                <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>Chalk Off-White</div>
                <div style={{ fontSize: "0.75rem", opacity: 0.9 }}>#FAFAFA</div>
              </div>
              <div style={{ backgroundColor: "#1F8A80", padding: "16px", borderRadius: "14px", color: "#FFFFFF", textAlign: "center" }}>
                <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>Deep Turquoise</div>
                <div style={{ fontSize: "0.75rem", opacity: 0.9 }}>#1F8A80</div>
              </div>
            </div>
          </div>

          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.6rem", color: "#2A2A2A", marginTop: "24px", letterSpacing: "0.03em" }}>
            3. Os 3 Erros Fatais ao Definir Cores para Impressos Médicos
          </h2>
          <ol style={{ paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <li>
              <strong>Escolher cores apenas no celular ou monitor (RGB/HEX):</strong> No computador, a luz de fundo torna todas as cores brilhantes. Quando enviadas para gráfica sem conversão calibrada em CMYK, tons elegantes de areia podem sair cinzentos ou esverdeados.
            </li>
            <li>
              <strong>Falta de contraste no receituário:</strong> Cores de texto muito claras em receitas médicas dificultam a leitura na farmácia e podem violar normas sanitárias do CFM. Textos de orientação devem sempre utilizar cinzas escuros sólidos (#2A2A2A ou #1E293B).
            </li>
            <li>
              <strong>Não definir uma cor de destaque funcional:</strong> Ter 5 cores competindo pela atenção desorienta o paciente. A regra de ouro é 60% de base neutra clara, 30% de cor secundária de apoio e 10% de cor de destaque (botões, selos e carimbos).
            </li>
          </ol>

          {/* CTA In-Content Box */}
          <div style={{
            backgroundColor: "#203830",
            borderRadius: "20px",
            padding: "36px 30px",
            color: "#FFFFFF",
            textAlign: "center",
            margin: "24px 0"
          }}>
            <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.4rem", marginBottom: "12px", color: "#E1EDE7" }}>
              Quer uma Paleta Calibrada para o seu Consultório em Minutos?
            </h3>
            <p style={{ fontSize: "0.95rem", color: "#A7F3D0", maxWidth: "600px", margin: "0 auto 24px auto", lineHeight: 1.6 }}>
              A The Brand Box analisa a sua especialidade, público-alvo e estilo desejado para gerar automaticamente paletas com códigos HEX, RGB, CMYK e arquivos vetoriais prontos para impressão.
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
              Criar Paleta da Minha Clínica
            </Link>
          </div>

          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.6rem", color: "#2A2A2A", marginTop: "24px", letterSpacing: "0.03em" }}>
            4. Perguntas Frequentes sobre Identidade Cromática
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
            href="/pt/identidade-visual-para-clinicas-e-consultorios"
            style={{ color: "#1F8A80", fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}
          >
            ← Ver Solução Completa para Clínicas e Consultórios
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
