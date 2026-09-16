import Link from "next/link";
import CancellationForm from "@/components/legal/CancellationForm";

export const metadata = {
  title: "Política de Reembolso e Cancelamento | The Brand Box",
  description: "Política de Reembolso, Cancelamento e Direito de Arrependimento da The Brand Box em conformidade com o Art. 49 do CDC e Decreto nº 7.962/2013.",
  alternates: {
    canonical: "https://thebrandbox.sonhodepapel.com/pt/politica-de-reembolso",
    languages: {
      "pt-BR": "https://thebrandbox.sonhodepapel.com/pt/politica-de-reembolso",
      "en-US": "https://thebrandbox.sonhodepapel.com/en/refund-policy",
    },
  },
};

export default function PoliticaDeReembolsoPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#F8F5F1", color: "#2A2A2A", fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif", padding: "40px 20px 80px" }}>
      <div style={{ maxWidth: "840px", margin: "0 auto", background: "#FFFFFF", borderRadius: "24px", padding: "48px 36px", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #EFECE3" }}>
        
        {/* Header */}
        <div style={{ marginBottom: "36px", borderBottom: "1px solid #EFECE3", paddingBottom: "24px" }}>
          <Link href="/pt" style={{ width: "fit-content", display: "inline-block", fontSize: "0.85rem", fontWeight: 600, color: "#1F8A80", textDecoration: "none", marginBottom: "16px" }}>
            ← Voltar para o início
          </Link>
          <h1 style={{ fontFamily: "'Cinzel', 'Playfair Display', serif", fontSize: "2.2rem", fontWeight: 700, color: "#2A2A2A", margin: "8px 0 12px", letterSpacing: "-0.02em" }}>
            POLÍTICA DE REEMBOLSO E CANCELAMENTO
          </h1>
          <p style={{ fontSize: "0.88rem", color: "#64748B", margin: 0 }}>
            <strong>Última atualização:</strong> Setembro de 2026 • Em conformidade com o CDC (Lei nº 8.078/1990) e Decreto do E-commerce (Decreto nº 7.962/2013)
          </p>
        </div>

        {/* Content Body */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px", lineHeight: "1.75", fontSize: "0.95rem", color: "#334155" }}>
          
          <p>
            Esta Política estabelece as condições aplicáveis às solicitações de cancelamento, reembolso e correção relacionadas aos produtos e serviços digitais disponibilizados pela <strong>The Brand Box</strong>.
          </p>

          <section>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.25rem", fontWeight: 700, color: "#2A2A2A", marginBottom: "12px" }}>
              Natureza do Serviço e Conteúdo Digital
            </h2>
            <p style={{ marginBottom: "12px" }}>
              A The Brand Box é uma plataforma digital de direção de arte e criação personalizada de sistemas de identidade visual, assinaturas de marca e materiais gráficos para clínicas, consultórios e profissionais.
            </p>
            <p style={{ marginBottom: "12px" }}>
              Os produtos disponibilizados podem incluir Brand Boards, arquivos vetoriais, paletas cromáticas, estampas, elementos de identidade visual e gabaritos gráficos em PDF prontos para impressão.
            </p>
            <p>
              Por sua natureza, esses ativos digitais podem ser gerados de forma personalizada com base nas informações e escolhas fornecidas pelo cliente durante o processo de criação.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.25rem", fontWeight: 700, color: "#2A2A2A", marginBottom: "12px" }}>
              Direito de Arrependimento
            </h2>
            <p style={{ marginBottom: "12px" }}>
              Nos termos do <strong>artigo 49 do Código de Defesa do Consumidor brasileiro</strong>, o cliente poderá desistir da compra no prazo de <strong>até 7 (sete) dias corridos</strong>, contados da confirmação da contratação realizada pela internet.
            </p>
            <p style={{ marginBottom: "12px" }}>
              A solicitação poderá ser feita <strong>sem necessidade de justificativa</strong> e dará direito à <strong>restituição integral dos valores pagos</strong>, sem cobrança de multa ou taxa de cancelamento.
            </p>
            <p style={{ marginBottom: "12px" }}>
              O direito de arrependimento será respeitado mesmo que a geração dos arquivos personalizados já tenha sido iniciada ou concluída.
            </p>
            <div style={{ background: "#F4E8DC", padding: "16px 20px", borderRadius: "12px", borderLeft: "4px solid #C7B49F", fontSize: "0.92rem", color: "#4A3A30", margin: "16px 0" }}>
              <strong>Encerramento da Licença de Uso:</strong><br/>
              Após a confirmação do cancelamento e do reembolso, a licença de uso concedida sobre os arquivos e materiais disponibilizados será encerrada. O cliente deverá interromper a utilização, reprodução, publicação ou distribuição desses materiais.
            </div>
            <p>
              Esta disposição não limita outros direitos obrigatórios assegurados ao consumidor pela legislação aplicável.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.25rem", fontWeight: 700, color: "#2A2A2A", marginBottom: "12px" }}>
              Garantia Técnica de Qualidade e Correção
            </h2>
            <p style={{ marginBottom: "12px" }}>
              Caso ocorra erro de renderização, arquivo corrompido, erro ortográfico provocado pelo sistema ou incompatibilidade técnica nos arquivos gerados, o cliente poderá solicitar suporte e correção sem custo adicional.
            </p>
            <p style={{ marginBottom: "12px" }}>
              Quando necessário, os arquivos poderão ser corrigidos ou gerados novamente.
            </p>
            <p style={{ marginBottom: "12px" }}>
              Conforme a natureza do problema e os direitos assegurados pela legislação aplicável, o cliente também poderá solicitar a restituição do valor pago ou o abatimento proporcional do preço.
            </p>
            <p>
              Esta garantia é independente do direito de arrependimento e não limita os demais direitos legais do consumidor.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.25rem", fontWeight: 700, color: "#2A2A2A", marginBottom: "12px" }}>
              Procedimento para Solicitação de Reembolso
            </h2>
            <p style={{ marginBottom: "12px" }}>
              Para solicitar cancelamento, reembolso ou suporte relacionado a uma compra:
            </p>
            <ol style={{ paddingLeft: "22px", margin: "12px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>
                Envie um e-mail para <a href="mailto:hello@thebrandbox.design" style={{ color: "#1F8A80", fontWeight: 600 }}>hello@thebrandbox.design</a> ou utilize o <strong>formulário online abaixo</strong>.
              </li>
              <li>
                Informe o e-mail utilizado na compra e, sempre que possível, o número de identificação da transação.
              </li>
              <li>
                O recebimento da solicitação será <strong>confirmado imediatamente</strong> por e-mail com número de protocolo.
              </li>
              <li>
                Quando aplicável, o procedimento de estorno será iniciado em até <strong>2 (dois) dias úteis</strong>.
              </li>
              <li>
                O reembolso será realizado pelo mesmo meio de pagamento utilizado na compra, sempre que tecnicamente possível.
              </li>
            </ol>
            <p>
              Após o processamento pela The Brand Box, o prazo para que o valor apareça na conta ou na fatura do cliente dependerá da instituição financeira, administradora do cartão ou meio de pagamento utilizado.
            </p>

            {/* Formulário Interativo com Confirmação Imediata */}
            <CancellationForm lang="pt" />
          </section>

          <section>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.25rem", fontWeight: 700, color: "#2A2A2A", marginBottom: "12px" }}>
              Descontos e Programas Institucionais
            </h2>
            <p style={{ marginBottom: "12px" }}>
              A participação em programas de benefícios, convênios ou campanhas promocionais não reduz nem modifica os direitos assegurados ao consumidor por esta Política ou pela legislação aplicável.
            </p>
            <p>
              As condições específicas de desconto, prazo de utilização e comprovação de elegibilidade serão apresentadas de forma clara no momento da contratação.
            </p>
          </section>

          <section style={{ backgroundColor: "#FAFAFA", borderRadius: "16px", padding: "24px 28px", border: "1px solid #EFECE3", marginTop: "12px" }}>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.15rem", fontWeight: 700, color: "#2A2A2A", marginBottom: "12px" }}>
              Identificação do Fornecedor
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.9rem", color: "#515361" }}>
              <div><strong>Fornecedor responsável:</strong> Pettersen Lunt design</div>
              <div><strong>Número de registro:</strong> 932425643</div>
              <div><strong>Endereço:</strong> Festnigsvein 10 - kråkerrøy - Norway</div>
              <div><strong>E-mail de atendimento:</strong> <a href="mailto:hello@thebrandbox.design" style={{ color: "#1F8A80", fontWeight: 600 }}>hello@thebrandbox.design</a></div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
