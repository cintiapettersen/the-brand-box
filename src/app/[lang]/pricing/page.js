import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Brand Identity Pricing & Plans | The Brand Box",
  description: "How much does a complete brand identity cost? Discover our transparent one-time pricing without subscriptions. Complete kit for $67 with vectors, brand book, and pattern.",
  keywords: [
    "brand identity pricing",
    "how much does branding cost",
    "brand book price",
    "complete visual identity cost",
    "branding cost for clinics small business",
    "the brand box pricing"
  ],
  alternates: {
    canonical: "https://thebrandbox.sonhodepapel.com/en/pricing",
    languages: {
      "pt-BR": "https://thebrandbox.sonhodepapel.com/pt/precos",
      "en-US": "https://thebrandbox.sonhodepapel.com/en/pricing",
    },
  },
  openGraph: {
    title: "Brand Identity Pricing & Plans | The Brand Box",
    description: "Transparent and accessible investment. Complete high-end brand identity system for a single flat fee, no recurring subscriptions.",
    url: "https://thebrandbox.sonhodepapel.com/en/pricing",
    images: [
      {
        url: "https://thebrandbox.sonhodepapel.com/og-precos.jpg",
        width: 1200,
        height: 630,
        alt: "The Brand Box Deliverables & Pricing",
      },
    ],
  },
};

export default function PricingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: "The Brand Box — Complete Brand Identity & Branding System",
        description: "Full brand identity package including comprehensive brand manual, professional vector files, color palette, typography system, custom brand pattern, and templates.",
        image: "https://thebrandbox.sonhodepapel.com/og-precos.jpg",
        brand: {
          "@type": "Brand",
          name: "The Brand Box",
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "67.00",
          priceValidUntil: "2027-12-31",
          availability: "https://schema.org/InStock",
          url: "https://thebrandbox.sonhodepapel.com/en/pricing",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "How much does the complete The Brand Box kit cost?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The complete digital package is a one-time payment of $67.00 USD. We never charge monthly fees or hidden licensing costs.",
            },
          },
          {
            "@type": "Question",
            name: "How does The Brand Box compare to traditional design agencies?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Traditional branding agencies charge between $2,500 and $10,000+ with turnarounds of 4 to 8 weeks. The Brand Box delivers identical technical rigor and luxury aesthetic in minutes for $67 thanks to our guided creative intelligence engine.",
            },
          },
          {
            "@type": "Question",
            name: "Do I own full commercial rights to my generated brand?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, 100% of the commercial and intellectual property rights belong to you upon delivery. You can register trademarks, print packaging, make signage, and run global ad campaigns.",
            },
          },
          {
            "@type": "Question",
            name: "How does the refund guarantee work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We offer full transparency. If you have not downloaded the final vector production assets, you can request a full refund within 7 days.",
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
            href="/pt/precos"
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
          Transparent Investment & No Subscriptions
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
          How Much Does a High-End Brand Identity Cost?
        </h1>

        <p style={{
          fontSize: "1.05rem",
          lineHeight: 1.75,
          color: "#515361",
          maxWidth: "750px",
          margin: "0 auto 48px auto"
        }}>
          Say goodbye to inflated agency retainers and uncurated freelance risks. Get an enterprise-grade brand ecosystem delivered immediately for a fair flat rate.
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
            All-Inclusive • One-Time Payment
          </div>

          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "1.2rem",
            color: "#8D9A87",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            marginBottom: "8px"
          }}>
            The Brand Box Digital Complete
          </div>

          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "baseline",
            gap: "8px",
            marginBottom: "16px"
          }}>
            <span style={{ fontSize: "1.5rem", fontWeight: 600, color: "#2A2A2A" }}>$</span>
            <span style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "3.5rem",
              fontWeight: 700,
              color: "#2A2A2A",
              lineHeight: 1
            }}>
              67
            </span>
            <span style={{ fontSize: "0.9rem", color: "#8D9A87" }}>USD flat fee</span>
          </div>

          <p style={{ fontSize: "0.95rem", color: "#515361", lineHeight: 1.6, marginBottom: "32px" }}>
            Lifetime access to your vector assets and comprehensive application manual. No subscription or recurring maintenance fees.
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
              Vector Brand Visual Signature
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "#2A2A2A" }}>
              <span style={{ color: "#1F8A80", fontWeight: "bold" }}>✓</span>
              Complete 25+ Page Brand Style Guide
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "#2A2A2A" }}>
              <span style={{ color: "#1F8A80", fontWeight: "bold" }}>✓</span>
              Color Palette (HEX, RGB, CMYK, Pantone)
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "#2A2A2A" }}>
              <span style={{ color: "#1F8A80", fontWeight: "bold" }}>✓</span>
              Institutional Typography Hierarchy
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "#2A2A2A" }}>
              <span style={{ color: "#1F8A80", fontWeight: "bold" }}>✓</span>
              Seamless Vector Brand Pattern
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "#2A2A2A" }}>
              <span style={{ color: "#1F8A80", fontWeight: "bold" }}>✓</span>
              Slide Drawer Box Architecture Design (13.5x18.5cm)
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "#2A2A2A" }}>
              <span style={{ color: "#1F8A80", fontWeight: "bold" }}>✓</span>
              Print-Ready Vector Files (PDF/X-1a, EPS, SVG)
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "#2A2A2A" }}>
              <span style={{ color: "#1F8A80", fontWeight: "bold" }}>✓</span>
              Full Commercial Ownership Rights
            </div>
          </div>

          <Link
            href="/en"
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
            Start My Brand Project Now
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
            alt="The Brand Box Deliverables and Brand Guide"
            width={1200}
            height={675}
            priority
            style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
          />
        </div>
      </section>

      {/* Market Comparison Table */}
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
              Market Comparison
            </span>
            <h2 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(1.6rem, 3.2vw, 2.3rem)",
              fontWeight: 600,
              color: "#2A2A2A",
              marginTop: "12px",
              letterSpacing: "0.03em"
            }}>
              Why The Brand Box Is the Smarter Choice
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
                  <th style={{ padding: "16px", color: "#515361", fontWeight: 600 }}>Criteria</th>
                  <th style={{
                    padding: "16px",
                    color: "#1F8A80",
                    fontWeight: 700,
                    backgroundColor: "#E1EDE7",
                    borderRadius: "12px 12px 0 0"
                  }}>
                    THE BRAND BOX
                  </th>
                  <th style={{ padding: "16px", color: "#515361", fontWeight: 600 }}>Traditional Agency</th>
                  <th style={{ padding: "16px", color: "#515361", fontWeight: 600 }}>Freelance Designer</th>
                  <th style={{ padding: "16px", color: "#515361", fontWeight: 600 }}>Generic Logo Makers</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: "1px solid #EFECE3" }}>
                  <td style={{ padding: "16px", fontWeight: 600 }}>Investment</td>
                  <td style={{ padding: "16px", fontWeight: 700, color: "#1F8A80", backgroundColor: "rgba(225, 237, 231, 0.4)" }}>$67 (one-time)</td>
                  <td style={{ padding: "16px", color: "#515361" }}>$2,500 – $10,000+</td>
                  <td style={{ padding: "16px", color: "#515361" }}>$500 – $2,000</td>
                  <td style={{ padding: "16px", color: "#515361" }}>$20 – $50</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #EFECE3" }}>
                  <td style={{ padding: "16px", fontWeight: 600 }}>Delivery Speed</td>
                  <td style={{ padding: "16px", fontWeight: 700, color: "#1F8A80", backgroundColor: "rgba(225, 237, 231, 0.4)" }}>Immediate (minutes)</td>
                  <td style={{ padding: "16px", color: "#515361" }}>4 to 8 weeks</td>
                  <td style={{ padding: "16px", color: "#515361" }}>2 to 4 weeks</td>
                  <td style={{ padding: "16px", color: "#515361" }}>Instant</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #EFECE3" }}>
                  <td style={{ padding: "16px", fontWeight: 600 }}>Brand Style Guide</td>
                  <td style={{ padding: "16px", fontWeight: 700, color: "#1F8A80", backgroundColor: "rgba(225, 237, 231, 0.4)" }}>Complete (25+ pages)</td>
                  <td style={{ padding: "16px", color: "#515361" }}>Complete</td>
                  <td style={{ padding: "16px", color: "#515361" }}>Basic or none</td>
                  <td style={{ padding: "16px", color: "#515361" }}>Not included</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #EFECE3" }}>
                  <td style={{ padding: "16px", fontWeight: 600 }}>Seamless Vector Pattern</td>
                  <td style={{ padding: "16px", fontWeight: 700, color: "#1F8A80", backgroundColor: "rgba(225, 237, 231, 0.4)" }}>Included</td>
                  <td style={{ padding: "16px", color: "#515361" }}>Charged extra</td>
                  <td style={{ padding: "16px", color: "#515361" }}>Rarely included</td>
                  <td style={{ padding: "16px", color: "#515361" }}>Not included</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #EFECE3" }}>
                  <td style={{ padding: "16px", fontWeight: 600 }}>Print-Ready (PDF/X-1a)</td>
                  <td style={{ padding: "16px", fontWeight: 700, color: "#1F8A80", backgroundColor: "rgba(225, 237, 231, 0.4)" }}>Yes (CMYK, bleeds)</td>
                  <td style={{ padding: "16px", color: "#515361" }}>Yes</td>
                  <td style={{ padding: "16px", color: "#515361" }}>Hit or miss</td>
                  <td style={{ padding: "16px", color: "#515361" }}>Low-res PNG only</td>
                </tr>
                <tr>
                  <td style={{ padding: "16px", fontWeight: 600 }}>Optional Physical Atelier</td>
                  <td style={{ padding: "16px", fontWeight: 700, color: "#1F8A80", backgroundColor: "rgba(225, 237, 231, 0.4)", borderRadius: "0 0 12px 12px" }}>Handcrafted Atelier</td>
                  <td style={{ padding: "16px", color: "#515361" }}>No (digital only)</td>
                  <td style={{ padding: "16px", color: "#515361" }}>No</td>
                  <td style={{ padding: "16px", color: "#515361" }}>No</td>
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
          Frequently Asked Questions About Pricing & Payment
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
            href="/en"
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
            Start My Brand Project for $67
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
          © {new Date().getFullYear()} The Brand Box. All rights reserved.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
          <Link href="/en" style={{ color: "#E1EDE7", textDecoration: "none" }}>Home</Link>
          <Link href="/en/visual-identity-for-clinics-and-medical-offices" style={{ color: "#E1EDE7", textDecoration: "none" }}>Clinics & Doctors</Link>
          <Link href="/en/visual-identity-for-small-businesses" style={{ color: "#E1EDE7", textDecoration: "none" }}>Small Businesses</Link>
          <Link href="/en/custom-stationery" style={{ color: "#E1EDE7", textDecoration: "none" }}>Custom Stationery</Link>
          <Link href="/en/refund-policy" style={{ color: "#E1EDE7", textDecoration: "none" }}>Refund Policy</Link>
          <Link href="/en/privacy-policy" style={{ color: "#E1EDE7", textDecoration: "none" }}>Privacy</Link>
        </div>
      </footer>
    </div>
  );
}
