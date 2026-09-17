import Link from "next/link";

export const metadata = {
  title: "Terms of Service & Commercial License | The Brand Box",
  description: "Terms of Service and Commercial Licensing conditions for The Brand Box platform. Intellectual property rights, commercial usage, and legal terms.",
  alternates: {
    canonical: "https://thebrandbox.sonhodepapel.com/en/terms-of-service",
    languages: {
      "pt-BR": "https://thebrandbox.sonhodepapel.com/pt/termos-de-uso",
      "en-US": "https://thebrandbox.sonhodepapel.com/en/terms-of-service",
    },
  },
};

export default function TermsOfServicePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#F8F5F1", color: "#2A2A2A", fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif", padding: "40px 20px 80px" }}>
      <div style={{ maxWidth: "840px", margin: "0 auto", background: "#FFFFFF", borderRadius: "24px", padding: "48px 36px", boxShadow: "0 10px 40px rgba(0,0,0,0.04)", border: "1px solid #EFECE3" }}>
        
        {/* Header */}
        <div style={{ marginBottom: "36px", borderBottom: "1px solid #EFECE3", paddingBottom: "24px" }}>
          <Link href="/en" style={{ width: "fit-content", display: "inline-block", fontSize: "0.85rem", fontWeight: 600, color: "#1F8A80", textDecoration: "none", marginBottom: "16px" }}>
            ← Back to home
          </Link>
          <h1 style={{ fontFamily: "'Cinzel', 'Playfair Display', serif", fontSize: "2.2rem", fontWeight: 700, color: "#2A2A2A", margin: "8px 0 12px", letterSpacing: "-0.02em" }}>
            TERMS OF SERVICE & COMMERCIAL LICENSE
          </h1>
          <p style={{ fontSize: "0.88rem", color: "#64748B", margin: 0 }}>
            <strong>Last updated:</strong> September 2026
          </p>
        </div>

        {/* Content Body */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px", lineHeight: "1.75", fontSize: "0.95rem", color: "#334155" }}>
          
          <section>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.25rem", fontWeight: 700, color: "#2A2A2A", marginBottom: "12px" }}>
              1. Purpose and Acceptance
            </h2>
            <p>
              These Terms of Service govern access to and use of <strong>The Brand Box</strong> platform, operated by <strong>Pettersen Lunt design</strong>. By engaging our services, you agree to be bound by these provisions.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.25rem", fontWeight: 700, color: "#2A2A2A", marginBottom: "12px" }}>
              2. Commercial Rights & Full License Assignment
            </h2>
            <p style={{ marginBottom: "12px" }}>
              Upon successful payment and file delivery, The Brand Box grants the client a <strong>perpetual, worldwide, royalty-free commercial license</strong> over the delivered brand identity assets.
            </p>
            <p>
              You have full rights to:
            </p>
            <ul style={{ paddingLeft: "22px", margin: "8px 0 16px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li>Submit marks and visual identity elements for trademark registration worldwide;</li>
              <li>Apply the branding across packaging, physical drawer boxes, signage, retail stores, uniforms, and fleets;</li>
              <li>Deploy the vector assets across digital advertising campaigns, social channels, and infinite print runs.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.25rem", fontWeight: 700, color: "#2A2A2A", marginBottom: "12px" }}>
              3. Technical Deliverables & Printing Support
            </h2>
            <p>
              All assets are provided according to standard print press specifications (PDF/X-1a, EPS, SVG, and high-resolution PNG). If technical adjustments are required by your local printer, our concierge team will provide priority support at no extra charge.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.25rem", fontWeight: 700, color: "#2A2A2A", marginBottom: "12px" }}>
              4. Cancellation & Refund Policy
            </h2>
            <p>
              Cancellation and refund requests are governed by our <Link href="/en/refund-policy" style={{ color: "#1F8A80", fontWeight: 600 }}>Refund Policy</Link>. Completed refunds result in immediate termination of the granted commercial license.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.25rem", fontWeight: 700, color: "#2A2A2A", marginBottom: "12px" }}>
              5. Privacy & Data Protection
            </h2>
            <p>
              Personal data processing adheres to GDPR and applicable data protection regulations, as detailed in our <Link href="/en/privacy-policy" style={{ color: "#1F8A80", fontWeight: 600 }}>Privacy Policy</Link>.
            </p>
          </section>

          <section style={{ backgroundColor: "#FAFAFA", borderRadius: "16px", padding: "24px 28px", border: "1px solid #EFECE3", marginTop: "12px" }}>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.15rem", fontWeight: 700, color: "#2A2A2A", marginBottom: "12px" }}>
              Supplier Details
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.9rem", color: "#515361" }}>
              <div><strong>Supplier:</strong> Pettersen Lunt design</div>
              <div><strong>Registration:</strong> 932425643</div>
              <div><strong>Address:</strong> Festnigsvein 10 - kråkerrøy - Norway</div>
              <div><strong>Email:</strong> <a href="mailto:hello@thebrandbox.design" style={{ color: "#1F8A80", fontWeight: 600 }}>hello@thebrandbox.design</a></div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
