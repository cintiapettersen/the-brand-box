import Link from "next/link";

export const metadata = {
  title: "Termos de Uso & Licença Comercial | The Brand Box",
  description: "Termos de Uso e Condições Gerais da plataforma The Brand Box. Direitos patrimoniais, cessão de uso comercial e diretrizes legais.",
  alternates: {
    canonical: "https://thebrandbox.sonhodepapel.com/pt/termos-de-uso",
    languages: {
      "pt-BR": "https://thebrandbox.sonhodepapel.com/pt/termos-de-uso",
      "en-US": "https://thebrandbox.sonhodepapel.com/en/terms-of-service",
    },
  },
};

export default function TermosDeUsoPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#F8F5F1", color: "#2A2A2A", fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif", padding: "40px 20px 80px" }}>
      <div style={{ maxWidth: "840px", margin: "0 auto", background: "#FFFFFF", borderRadius: "24px", padding: "48px 36px", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #EFECE3" }}>
        
        {/* Header */}
        <div style={{ marginBottom: "36px", borderBottom: "1px solid #EFECE3", paddingBottom: "24px" }}>
          <Link href="/pt" style={{ width: "fit-content", display: "inline-block", fontSize: "0.85rem", fontWeight: 600, color: "#1F8A80", textDecoration: "none", marginBottom: "16px" }}>
            ← Voltar para o início
          </Link>
          <h1 style={{ fontFamily: "'Cinzel', 'Playfair Display', serif", fontSize: "2.2rem", fontWeight: 700, color: "#2A2A2A", margin: "8px 0 12px", letterSpacing: "-0.02em" }}>
            TERMOS DE USO E LICENÇA COMERCIAL
          </h1>
          <p style={{ fontSize: "0.88rem", color: "#64748B", margin: 0 }}>
            <strong>Última atualização:</strong> Setembro de 2026
          </p>
        </div>

        {/* Content Body */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px", lineHeight: "1.75", fontSize: "0.95rem", color: "#334155" }}>
          
          <section>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.25rem", fontWeight: 700, color: "#2A2A2A", marginBottom: "12px" }}>
              1. Objeto e Aceitação dos Termos
            </h2>
            <p>
              Estes Termos de Uso regem o acesso e a utilização dos serviços digitais da plataforma <strong>The Brand Box</strong>, operada por <strong>Pettersen Lunt design</strong>. Ao utilizar nossa plataforma ou contratar qualquer um de nossos pacotes, o cliente declara concordar integralmente com estas disposições.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.25rem", fontWeight: 700, color: "#2A2A2A", marginBottom: "12px" }}>
              2. Cessão de Direitos Patrimoniais e Uso Comercial
            </h2>
            <p style={{ marginBottom: "12px" }}>
              Ao concluir a contratação e receber os arquivos finais da sua identidade visual, a The Brand Box concede ao cliente a <strong>licença patrimonial plena e irrestrita para exploração comercial</strong> dos ativos digitais gerados.
            </p>
            <p>
              O cliente possui total liberdade para:
            </p>
            <ul style={{ paddingLeft: "22px", margin: "8px 0 16px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li>Submeter a assinatura visual e elementos de marca para registro perante o <strong>INPI (Instituto Nacional da Propriedade Industrial)</strong> ou órgãos internacionais;</li>
              <li>Aplicar a identidade visual em produtos físicos, embalagens, caixas gaveta, fachadas, uniformes e frotas;</li>
              <li>Utilizar os arquivos em campanhas publicitárias digitais, redes sociais e materiais impressos ilimitados.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.25rem", fontWeight: 700, color: "#2A2A2A", marginBottom: "12px" }}>
              3. Entregáveis Técnicos e Suporte Gráfico
            </h2>
            <p>
              Os materiais digitais são entregues em conformidade com os padrões gráficos profissionais (arquivos vetoriais em PDF/X-1a, EPS, SVG e PNG em alta resolução). Caso haja necessidade de ajustes técnicos de renderização ou incompatibilidade na sua gráfica, nosso suporte fornecerá assistência sem custos adicionais.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.25rem", fontWeight: 700, color: "#2A2A2A", marginBottom: "12px" }}>
              4. Cancelamento, Reembolso e Revogação de Licença
            </h2>
            <p>
              As solicitações de arrependimento e cancelamento obedecem rigorosamente à nossa <Link href="/pt/politica-de-reembolso" style={{ color: "#1F8A80", fontWeight: 600 }}>Política de Reembolso e Cancelamento</Link>, ao Art. 49 do CDC e ao Decreto nº 7.962/2013. A confirmação de estorno implica a revogação imediata da licença de uso dos arquivos da marca.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.25rem", fontWeight: 700, color: "#2A2A2A", marginBottom: "12px" }}>
              5. Confidencialidade e Proteção de Dados
            </h2>
            <p>
              O tratamento dos dados pessoais e cadastrais do cliente observa integralmente a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018), conforme detalhado em nossa <Link href="/pt/politica-de-privacidade" style={{ color: "#1F8A80", fontWeight: 600 }}>Política de Privacidade</Link>.
            </p>
          </section>

          <section style={{ backgroundColor: "#FAFAFA", borderRadius: "16px", padding: "24px 28px", border: "1px solid #EFECE3", marginTop: "12px" }}>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.15rem", fontWeight: 700, color: "#2A2A2A", marginBottom: "12px" }}>
              Identificação do Fornecedor & Atendimento
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.9rem", color: "#515361" }}>
              <div><strong>Razão Social:</strong> Pettersen Lunt design</div>
              <div><strong>Número de Registro:</strong> 932425643</div>
              <div><strong>Endereço:</strong> Festnigsvein 10 - kråkerrøy - Norway</div>
              <div><strong>Canal Oficial:</strong> <a href="mailto:hello@thebrandbox.design" style={{ color: "#1F8A80", fontWeight: 600 }}>hello@thebrandbox.design</a></div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
