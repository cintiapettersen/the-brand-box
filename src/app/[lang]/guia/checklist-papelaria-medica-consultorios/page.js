import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Checklist de Papelaria Médica para Consultórios e Clínicas | The Brand Box",
  description: "Checklist completo de impressos médicos: receituários simples e controle especial, atestados, pastas para exames e guias de cuidados em conformidade com o CFM.",
  keywords: [
    "checklist papelaria medica",
    "impressos para consultorio medico",
    "receituario controle especial modelo",
    "pasta para exames personalizada",
    "papelaria para medicos e clinicas",
    "normas receituario medico cfm",
    "the brand box clinicas"
  ],
  alternates: {
    canonical: "https://thebrandbox.sonhodepapel.com/pt/guia/checklist-papelaria-medica-consultorios",
    languages: {
      "pt-BR": "https://thebrandbox.sonhodepapel.com/pt/guia/checklist-papelaria-medica-consultorios",
      "en-US": "https://thebrandbox.sonhodepapel.com/en/guide/medical-stationery-checklist",
    },
  },
  openGraph: {
    title: "Checklist de Papelaria Médica para Consultórios e Clínicas | The Brand Box",
    description: "Todos os impressos obrigatórios e recomendados para médicos ao abrir ou modernizar seu consultório.",
    url: "https://thebrandbox.sonhodepapel.com/pt/guia/checklist-papelaria-medica-consultorios",
    images: [
      {
        url: "https://thebrandbox.sonhodepapel.com/og-checklist-papelaria-medica.jpg",
        width: 1200,
        height: 630,
        alt: "Checklist de Papelaria Médica The Brand Box",
      },
    ],
  },
};

export default function ChecklistPapelariaMedicaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Checklist de Papelaria Médica: Todos os Impressos Obrigatórios e Recomendados para Consultórios",
        description: "Guia completo com todos os itens de papelaria técnica que um consultório médico de excelência deve possuir, com regras do CFM e boas práticas de design.",
        image: "https://thebrandbox.sonhodepapel.com/og-checklist-papelaria-medica.jpg",
        datePublished: "2026-09-16T16:00:00+02:00",
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
          "@id": "https://thebrandbox.sonhodepapel.com/pt/guia/checklist-papelaria-medica-consultorios",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Quais informações são obrigatórias em um receituário médico segundo o CFM?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "De acordo com o Conselho Federal de Medicina (CFM), todo receituário deve conter nome completo do médico, número de inscrição no CRM com respectivo estado federativo, RQE (se especialista), endereço profissional completo, telefone de contato e espaço legível para data e assinatura.",
            },
          },
          {
            "@type": "Question",
            name: "Qual é a gramatura ideal para pastas de exames e receituários?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Para receituários e atestados, recomenda-se papel offset de 90g a 120g para evitar que a tinta da caneta atravesse a folha. Para pastas de exames, o ideal são papéis cartão rígidos como Supremo ou Couché Fosco de 250g a 300g com laminação fosca.",
            },
          },
          {
            "@type": "Question",
            name: "Como funciona a entrega da papelaria médica na The Brand Box?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A The Brand Box entrega todos os gabaritos diagramados em arquivos vetoriais PDF/X-1a, no padrão de cor CMYK, prontos para qualquer gráfica imprimir. Além disso, oferecemos opcionalmente a produção física artesanal através do nosso atelier parceiro Sonho de Papel com envio direto para o consultório.",
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
            href="/en/guide/medical-stationery-checklist"
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
          <Link href="/pt/identidade-visual-para-clinicas-e-consultorios" style={{ color: "#8D9A87", textDecoration: "none" }}>Clínicas & Médicos</Link>
          {" › "}
          <span>Checklist de Papelaria</span>
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
          Gestão de Consultório & Papelaria Técnica
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
          Checklist de Papelaria Médica: Todos os Impressos Essenciais para Consultórios e Clínicas
        </h1>

        <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "36px", fontSize: "0.85rem", color: "#64748B" }}>
          <span>Por <strong>The Brand Box Editorial</strong></span>
          <span>•</span>
          <span>Atualizado em Setembro de 2026</span>
          <span>•</span>
          <span>7 min de leitura</span>
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
            src="/showcase-checklist-papelaria-medica.jpg"
            alt="Checklist de Papelaria Médica The Brand Box"
            width={1200}
            height={675}
            priority
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>

        {/* Article Body */}
        <div style={{ fontSize: "1.02rem", lineHeight: 1.85, color: "#334155", display: "flex", flexDirection: "column", gap: "28px" }}>
          
          <p style={{ fontSize: "1.12rem", fontWeight: 500, color: "#2A2A2A" }}>
            Abrir ou renovar um consultório médico envolve decisões clínicas, estruturais e de posicionamento. Entre todos os pontos de contato físico com o paciente, a <strong>papelaria técnica personalizada</strong> é o elemento que o paciente leva para casa, manuseia diariamente ao tomar medicamentos e guarda em pastas familiares por anos.
          </p>

          <p>
            Para garantir que a sua clínica transmita autoridade médica, segurança e acolhimento em total conformidade com as normas do Conselho Federal de Medicina (CFM) e da ANVISA, preparamos o <strong>checklist definitivo dos impressos fundamentais</strong>.
          </p>

          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.6rem", color: "#2A2A2A", marginTop: "20px", letterSpacing: "0.03em" }}>
            Os 7 Impressos Essenciais de um Consultório de Excelência
          </h2>

          {/* Item 1 */}
          <div style={{ backgroundColor: "#FFFFFF", padding: "28px 24px", borderRadius: "18px", border: "1px solid #EFECE3", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#1F8A80" }}></span>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.2rem", color: "#2A2A2A", margin: 0 }}>
                1. Receituário Padrão Simples (Formatos A4 e A5)
              </h3>
            </div>
            <p style={{ fontSize: "0.92rem", color: "#515361", margin: "0 0 12px 0" }}>
              O cartão de visitas do seu atendimento. Utilizado para prescrições rotineiras, pedidos de exames laboratoriais e orientações clínicas.
            </p>
            <div style={{ fontSize: "0.85rem", color: "#1F8A80", backgroundColor: "#E1EDE7", padding: "10px 14px", borderRadius: "10px" }}>
              <strong>Requisitos CFM:</strong> Nome completo, CRM/UF, RQE (se anunciado), endereço e telefone do consultório. Papel offset 90g a 120g.
            </div>
          </div>

          {/* Item 2 */}
          <div style={{ backgroundColor: "#FFFFFF", padding: "28px 24px", borderRadius: "18px", border: "1px solid #EFECE3", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#C7B49F" }}></span>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.2rem", color: "#2A2A2A", margin: 0 }}>
                2. Receituário de Controle Especial (Duas Vias Carbonadas)
              </h3>
            </div>
            <p style={{ fontSize: "0.92rem", color: "#515361", margin: "0 0 12px 0" }}>
              Obrigatório para prescrição de medicamentos controlados (Portaria SVS/MS nº 344/98). Diagramado em duas vias (1ª via Farmácia / 2ª via Paciente).
            </p>
            <div style={{ fontSize: "0.85rem", color: "#4A3A30", backgroundColor: "#F4E8DC", padding: "10px 14px", borderRadius: "10px" }}>
              <strong>Requisitos ANVISA:</strong> Campos dedicados para identificação do emitente, comprador, fornecedor e paciente com margem técnica de corte.
            </div>
          </div>

          {/* Item 3 */}
          <div style={{ backgroundColor: "#FFFFFF", padding: "28px 24px", borderRadius: "18px", border: "1px solid #EFECE3", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#8D9A87" }}></span>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.2rem", color: "#2A2A2A", margin: 0 }}>
                3. Atestados Médicos & Declarações de Comparecimento
              </h3>
            </div>
            <p style={{ fontSize: "0.92rem", color: "#515361", margin: 0 }}>
              Layout institucional sóbrio com marca d'água de segurança, campos de data/horário de atendimento e indicação de CID (quando expressamente autorizado pelo paciente).
            </p>
          </div>

          {/* Item 4 */}
          <div style={{ backgroundColor: "#FFFFFF", padding: "28px 24px", borderRadius: "18px", border: "1px solid #EFECE3", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#9B8B9B" }}></span>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.2rem", color: "#2A2A2A", margin: 0 }}>
                4. Pasta de Exames e Laudos com Bolsa Interna (A4)
              </h3>
            </div>
            <p style={{ fontSize: "0.92rem", color: "#515361", margin: 0 }}>
              Essencial para entregar exames laboratoriais, relatórios cirúrgicos e planos de tratamento sem amassar as folhas. Feita em papel rígido (Supremo 300g) com acabamento fosco e encaixe para cartão de visita.
            </p>
          </div>

          {/* Item 5 */}
          <div style={{ backgroundColor: "#FFFFFF", padding: "28px 24px", borderRadius: "18px", border: "1px solid #EFECE3", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#C9D7E5" }}></span>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.2rem", color: "#2A2A2A", margin: 0 }}>
                5. Guias Educativos e Cuidados Pós-Consulta (Pediatria & Maternidade)
              </h3>
            </div>
            <p style={{ fontSize: "0.92rem", color: "#515361", margin: 0 }}>
              Livreto sanfonado de vacinação, marcos do desenvolvimento infantil, guia de introdução alimentar e cuidados no pós-operatório. Reduz chamadas no WhatsApp ao esclarecer dúvidas frequentes com clareza visual.
            </p>
          </div>

          {/* Item 6 */}
          <div style={{ backgroundColor: "#FFFFFF", padding: "28px 24px", borderRadius: "18px", border: "1px solid #EFECE3", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#515361" }}></span>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.2rem", color: "#2A2A2A", margin: 0 }}>
                6. Cartão de Visita e Encaminhamento Interdisciplinar
              </h3>
            </div>
            <p style={{ fontSize: "0.92rem", color: "#515361", margin: 0 }}>
              Produzido em papéis nobres texturizados (Markatto ou Algodão 300g) com tipografia serifada e acabamento refinado em hot stamping dourado ou relevo seco.
            </p>
          </div>

          {/* Item 7 */}
          <div style={{ backgroundColor: "#FFFFFF", padding: "28px 24px", borderRadius: "18px", border: "1px solid #EFECE3", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#1F8A80" }}></span>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.2rem", color: "#2A2A2A", margin: 0 }}>
                7. Caixa Gaveta Personalizada (13,5x18,5cm)
              </h3>
            </div>
            <p style={{ fontSize: "0.92rem", color: "#515361", margin: 0 }}>
              A apresentação máxima de carinho e diferenciação: ideal para acomodar a caderneta de saúde do bebê, frascos de amostras cosméticas ou kit de boas-vindas do paciente VIP.
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
              Tenha Todo o Kit de Papelaria do Seu Consultório Diagramado
            </h3>
            <p style={{ fontSize: "0.95rem", color: "#A7F3D0", maxWidth: "600px", margin: "0 auto 24px auto", lineHeight: 1.6 }}>
              A The Brand Box entrega a identidade visual e todos os gabaritos técnicos de papelaria médica prontos para impressão em qualquer gráfica ou com confecção no nosso atelier.
            </p>
            <Link
              href="/pt/identidade-visual-para-clinicas-e-consultorios"
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
              Conhecer a Solução para Clínicas
            </Link>
          </div>

          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.6rem", color: "#2A2A2A", marginTop: "24px", letterSpacing: "0.03em" }}>
            Perguntas Frequentes sobre Impressos Médicos
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
            ← Voltar para Solução Especial para Clínicas & Médicos
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
