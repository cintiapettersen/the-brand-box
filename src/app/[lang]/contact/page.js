import Link from "next/link";
import ContactForm from "@/components/legal/ContactForm";

export const metadata = {
  title: "Contact & Creative Concierge | The Brand Box",
  description: "Get in touch with The Brand Box creative direction and concierge team. Technical support, atelier printing inquiries, and partnerships.",
  keywords: [
    "contact the brand box",
    "the brand box support",
    "branding concierge",
    "custom stationery inquiries"
  ],
  alternates: {
    canonical: "https://thebrandbox.sonhodepapel.com/en/contact",
    languages: {
      "pt-BR": "https://thebrandbox.sonhodepapel.com/pt/contato",
      "en-US": "https://thebrandbox.sonhodepapel.com/en/contact",
    },
  },
  openGraph: {
    title: "Contact & Creative Concierge | The Brand Box",
    description: "Official customer service, WhatsApp concierge, and support for The Brand Box.",
    url: "https://thebrandbox.sonhodepapel.com/en/contact",
    images: [
      {
        url: "https://thebrandbox.sonhodepapel.com/og-brandbox.jpg",
        width: 1200,
        height: 630,
        alt: "Contact The Brand Box",
      },
    ],
  },
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact — The Brand Box",
    url: "https://thebrandbox.sonhodepapel.com/en/contact",
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
        <Link href="/en" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
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
            href="/pt/contato"
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: "#8D9A87",
              textDecoration: "none"
            }}
          >
            PT
          </Link>
          <Link
            href="/en"
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
            Create My Brand
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
            Customer Concierge & Inquiries
          </div>
          <h1 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 600,
            color: "#2A2A2A",
            marginBottom: "16px"
          }}>
            How Can We Assist Your Brand?
          </h1>
          <p style={{ fontSize: "1rem", color: "#515361", maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
            Whether you have questions about your brand board, want to request bespoke handcrafted atelier boxes, or discuss partnerships, we are here to help.
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
                Creative Concierge WhatsApp
              </h2>
              <p style={{ fontSize: "0.88rem", color: "#515361", lineHeight: 1.6, marginBottom: "18px" }}>
                Quick direct chat for urgent inquiries, custom physical box batches, and print turnaround guidance.
              </p>
              <a
                href="https://wa.me/4793630746?text=Hello!%20I%20have%20an%20inquiry%20regarding%20The%20Brand%20Box."
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
                Chat on WhatsApp →
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
                Official Email
              </h2>
              <p style={{ fontSize: "0.88rem", color: "#515361", lineHeight: 1.6, marginBottom: "12px" }}>
                For in-depth inquiries, invoice requests, and institutional agreements.
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
              <div style={{ fontWeight: 700, color: "#2A2A2A", marginBottom: "6px" }}>Company Information:</div>
              <div>Pettersen Lunt design • Org: 932425643</div>
              <div>Festnigsvein 10 - kråkerrøy - Norway</div>
              <div>Support hours: Mon–Fri, 9am–6pm (BRT / CET)</div>
            </div>

          </div>

          {/* Interactive Form */}
          <div>
            <ContactForm lang="en" />
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
          © {new Date().getFullYear()} The Brand Box. All rights reserved.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
          <Link href="/en" style={{ color: "#E1EDE7", textDecoration: "none" }}>Home</Link>
          <Link href="/en/visual-identity-for-clinics-and-medical-offices" style={{ color: "#E1EDE7", textDecoration: "none" }}>Clinics & Doctors</Link>
          <Link href="/en/visual-identity-for-small-businesses" style={{ color: "#E1EDE7", textDecoration: "none" }}>Small Businesses</Link>
          <Link href="/en/custom-stationery" style={{ color: "#E1EDE7", textDecoration: "none" }}>Custom Stationery</Link>
          <Link href="/en/pricing" style={{ color: "#E1EDE7", textDecoration: "none" }}>Pricing</Link>
          <Link href="/en/privacy-policy" style={{ color: "#E1EDE7", textDecoration: "none" }}>Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
