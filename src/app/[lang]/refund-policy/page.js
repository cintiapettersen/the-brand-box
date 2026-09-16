import Link from "next/link";
import CancellationForm from "@/components/legal/CancellationForm";

export const metadata = {
  title: "Refund and Cancellation Policy | The Brand Box",
  description: "Refund, Cancellation, and Right of Withdrawal Policy for The Brand Box in compliance with applicable consumer protection laws and E-commerce Regulations.",
  alternates: {
    canonical: "https://thebrandbox.sonhodepapel.com/en/refund-policy",
    languages: {
      "pt-BR": "https://thebrandbox.sonhodepapel.com/pt/politica-de-reembolso",
      "en-US": "https://thebrandbox.sonhodepapel.com/en/refund-policy",
    },
  },
};

export default function RefundPolicyPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#F8F5F1", color: "#2A2A2A", fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif", padding: "40px 20px 80px" }}>
      <div style={{ maxWidth: "840px", margin: "0 auto", background: "#FFFFFF", borderRadius: "24px", padding: "48px 36px", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #EFECE3" }}>
        
        {/* Header */}
        <div style={{ marginBottom: "36px", borderBottom: "1px solid #EFECE3", paddingBottom: "24px" }}>
          <Link href="/en" style={{ width: "fit-content", display: "inline-block", fontSize: "0.85rem", fontWeight: 600, color: "#1F8A80", textDecoration: "none", marginBottom: "16px" }}>
            ← Back to home
          </Link>
          <h1 style={{ fontFamily: "'Cinzel', 'Playfair Display', serif", fontSize: "2.2rem", fontWeight: 700, color: "#2A2A2A", margin: "8px 0 12px", letterSpacing: "-0.02em" }}>
            REFUND AND CANCELLATION POLICY
          </h1>
          <p style={{ fontSize: "0.88rem", color: "#64748B", margin: 0 }}>
            <strong>Last updated:</strong> September 2026 • In compliance with consumer protection legislation and E-commerce Decree No. 7,962/2013
          </p>
        </div>

        {/* Content Body */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px", lineHeight: "1.75", fontSize: "0.95rem", color: "#334155" }}>
          
          <p>
            This Policy sets forth the terms applicable to cancellation, refund, and technical correction requests regarding digital products and services provided by <strong>The Brand Box</strong>.
          </p>

          <section>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.25rem", fontWeight: 700, color: "#2A2A2A", marginBottom: "12px" }}>
              Nature of Service and Digital Content
            </h2>
            <p style={{ marginBottom: "12px" }}>
              The Brand Box is a digital art direction and bespoke brand identity creation platform designed for clinics, medical offices, and businesses.
            </p>
            <p style={{ marginBottom: "12px" }}>
              Our deliverables include Brand Boards, high-resolution vector files, color palettes, custom patterns, brand identity elements, and print-ready PDF graphics.
            </p>
            <p>
              By nature, these digital assets are custom-generated based on the specific inputs and choices provided by the client during the creation process.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.25rem", fontWeight: 700, color: "#2A2A2A", marginBottom: "12px" }}>
              Right of Withdrawal (Cooling-Off Period)
            </h2>
            <p style={{ marginBottom: "12px" }}>
              In accordance with Brazilian Consumer Protection legislation (CDC Art. 49) and applicable international standards, the customer may cancel the purchase within <strong>up to 7 (seven) calendar days</strong> from the date of payment confirmation.
            </p>
            <p style={{ marginBottom: "12px" }}>
              The cancellation request may be submitted <strong>without justification</strong> and entitles the customer to a <strong>full refund of the amount paid</strong>, without cancellation fees or penalties.
            </p>
            <p style={{ marginBottom: "12px" }}>
              The right of withdrawal will be fully honored even if the generation of customized brand files has already started or finished.
            </p>
            <div style={{ background: "#F4E8DC", padding: "16px 20px", borderRadius: "12px", borderLeft: "4px solid #C7B49F", fontSize: "0.92rem", color: "#4A3A30", margin: "16px 0" }}>
              <strong>Termination of License:</strong><br/>
              Upon confirmation of cancellation and refund, the commercial license granted for all provided files and brand assets is automatically terminated. The customer must immediately cease any use, reproduction, publication, or distribution of these materials.
            </div>
            <p>
              This provision does not limit any other mandatory statutory consumer rights under applicable law.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.25rem", fontWeight: 700, color: "#2A2A2A", marginBottom: "12px" }}>
              Technical Quality Guarantee & Support
            </h2>
            <p style={{ marginBottom: "12px" }}>
              In the event of rendering errors, corrupted files, system-generated typographical bugs, or technical print incompatibilities in the generated files, the customer may request priority technical support and correction at no additional cost.
            </p>
            <p style={{ marginBottom: "12px" }}>
              When required, files will be corrected or re-rendered promptly.
            </p>
            <p style={{ marginBottom: "12px" }}>
              Depending on the nature of the issue and statutory rights, the customer may also request a full refund or proportional price reduction.
            </p>
            <p>
              This technical guarantee is independent of the 7-day right of withdrawal and does not restrict legal consumer protections.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.25rem", fontWeight: 700, color: "#2A2A2A", marginBottom: "12px" }}>
              Refund Request Procedure
            </h2>
            <p style={{ marginBottom: "12px" }}>
              To request a cancellation, refund, or technical support:
            </p>
            <ol style={{ paddingLeft: "22px", margin: "12px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>
                Send an email to <a href="mailto:hello@thebrandbox.design" style={{ color: "#1F8A80", fontWeight: 600 }}>hello@thebrandbox.design</a> or use the <strong>online form below</strong>.
              </li>
              <li>
                Provide the email address used during purchase and, whenever possible, the transaction reference ID.
              </li>
              <li>
                Receipt of the request will be <strong>confirmed immediately</strong> with an official protocol sent to your inbox.
              </li>
              <li>
                When applicable, the refund process will be initiated within <strong>2 (two) business days</strong>.
              </li>
              <li>
                Refunds will be processed via the original payment method whenever technically feasible.
              </li>
            </ol>
            <p>
              After processing by The Brand Box, the timeframe for the funds to reflect on the customer’s statement depends on their card issuer or payment provider.
            </p>

            {/* Interactive Cancellation Form with Immediate Confirmation */}
            <CancellationForm lang="en" />
          </section>

          <section>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.25rem", fontWeight: 700, color: "#2A2A2A", marginBottom: "12px" }}>
              Institutional Discounts & Partner Programs
            </h2>
            <p style={{ marginBottom: "12px" }}>
              Participation in institutional benefit programs, professional council partnerships (such as medical agreements), or promotional campaigns does not diminish or alter any consumer rights under this Policy or applicable legislation.
            </p>
            <p>
              Specific discount conditions, eligibility verification, and timelines are clearly stated at the time of purchase.
            </p>
          </section>

          <section style={{ backgroundColor: "#FAFAFA", borderRadius: "16px", padding: "24px 28px", border: "1px solid #EFECE3", marginTop: "12px" }}>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.15rem", fontWeight: 700, color: "#2A2A2A", marginBottom: "12px" }}>
              Supplier Identification
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.9rem", color: "#515361" }}>
              <div><strong>Responsible Supplier:</strong> Pettersen Lunt design</div>
              <div><strong>Registration Number:</strong> 932425643</div>
              <div><strong>Address:</strong> Festnigsvein 10 - kråkerrøy - Norway</div>
              <div><strong>Customer Support:</strong> <a href="mailto:hello@thebrandbox.design" style={{ color: "#1F8A80", fontWeight: 600 }}>hello@thebrandbox.design</a></div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
