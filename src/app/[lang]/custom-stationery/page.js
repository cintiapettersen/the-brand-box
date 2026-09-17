import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Custom Stationery & Luxury Brand Packaging | The Brand Box",
  description: "Elevate your brand unboxing with bespoke rigid slide drawer boxes, branded pattern gift wrap, business cards, and tags on fine paper. Print-ready vector files or physical atelier delivery.",
  keywords: [
    "custom stationery design",
    "luxury brand packaging",
    "bespoke rigid drawer box",
    "custom patterned wrapping paper",
    "luxury product hang tags",
    "fine cotton business cards",
    "luxury unboxing small business",
    "corporate stationery design"
  ],
  alternates: {
    canonical: "https://thebrandbox.sonhodepapel.com/en/custom-stationery",
    languages: {
      "pt-BR": "https://thebrandbox.sonhodepapel.com/pt/papelaria-personalizada",
      "en-US": "https://thebrandbox.sonhodepapel.com/en/custom-stationery",
    },
  },
  openGraph: {
    title: "Custom Stationery & Luxury Packaging | The Brand Box",
    description: "Turn your brand unboxing into an unforgettable tactile experience. Custom drawer boxes, branded gift wrap, and fine stationery.",
    url: "https://thebrandbox.sonhodepapel.com/en/custom-stationery",
    images: [
      {
        url: "https://thebrandbox.sonhodepapel.com/og-papelaria.jpg",
        width: 1200,
        height: 630,
        alt: "Custom Stationery & Drawer Box The Brand Box",
      },
    ],
  },
};

export default function CustomStationeryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: "The Brand Box — Custom Stationery & Luxury Packaging",
        description: "Bespoke corporate stationery kit and luxury packaging system with slide drawer boxes, repeating brand pattern wrapping paper, business cards, and hang tags.",
        image: "https://thebrandbox.sonhodepapel.com/og-papelaria.jpg",
        brand: {
          "@type": "Brand",
          name: "The Brand Box",
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "98.00",
          availability: "https://schema.org/InStock",
          url: "https://thebrandbox.sonhodepapel.com/en/custom-stationery",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is included in The Brand Box custom stationery kit?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The kit includes custom design for rigid slide Drawer Boxes (13.5x18.5cm), seamless repeating vector brand pattern for wrapping and tissue paper, institutional business cards, product hang tags with ribbon punch, and print finish specifications.",
            },
          },
          {
            "@type": "Question",
            name: "Do I receive print-ready files for commercial print shops?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes! All layouts are delivered in vector PDF/X-1a formats, standardized in CMYK color mode with technical bleed, trim marks, and dedicated spot layers for foil stamping and embossing.",
            },
          },
          {
            "@type": "Question",
            name: "Can I order physical production of the boxes and stationery?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, The Brand Box offers optional physical handcrafted production through our partnered atelier Sonho de Papel, delivering finished luxury boxes directly to your door.",
            },
          },
          {
            "@type": "Question",
            name: "What types of premium paper and finishes are recommended?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We recommend textured cotton stocks (Markatto, Rives, G.F Smith, Colorplan), premium kraft boards, and exquisite finishes like Gold/Copper Hot Foil Stamping, blind debossing, and spot UV coating.",
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
            href="/pt/papelaria-personalizada"
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
              boxShadow: "0 4px 14px rgba(31, 138, 128, 0.25)",
              transition: "all 0.2s ease"
            }}
          >
            Create My Brand
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
          Brand Experience & Luxury Unboxing
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
          Custom Stationery & Packaging that Captivates at First Touch
        </h1>

        <p style={{
          fontSize: "1.05rem",
          lineHeight: 1.75,
          color: "#515361",
          maxWidth: "750px",
          margin: "0 auto 40px auto"
        }}>
          The moment a customer opens your parcel defines the perceived value of your entire service or product. We craft complete bespoke stationery systems with rigid Drawer Boxes, custom brand patterns, and sophisticated tactile textures.
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
            alt="Custom Stationery and Drawer Box The Brand Box"
            width={1200}
            height={675}
            priority
            style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
          <Link
            href="/en"
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
            Start My Stationery Project
          </Link>
        </div>
      </section>

      {/* Kit Items */}
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
              Bespoke Design & Craftsmanship
            </span>
            <h2 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "clamp(1.6rem, 3.2vw, 2.3rem)",
              fontWeight: 600,
              color: "#2A2A2A",
              marginTop: "12px",
              letterSpacing: "0.03em"
            }}>
              What Is Included in Your Stationery Collection
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
                Custom Slide Drawer Box (13.5x18.5cm)
              </h3>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "#515361" }}>
                Rigid slide-out drawer architecture with ribbon pull and tailored insert, ideal for greeting cards, VIP client welcome kits, and luxury samples.
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
                Pattern Wrapping & Tissue Paper
              </h3>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "#515361" }}>
                Seamless vector repeating patterns generated from your brand identity for packaging wrappers, box linings, and product inserts.
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
                Luxury Business Cards & Product Hang Tags
              </h3>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "#515361" }}>
                Corporate business cards and hang tags with calibrated typography, die-cut punch holes, and fine heavyweight paper recommendations.
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
                Print-Ready Vector Files (PDF/X-1a)
              </h3>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "#515361" }}>
                Production-standard vectors with technical bleed, trim crop marks, and separated layers for foil stamping and embossing dies.
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
                Paper & Finishes Production Guide
              </h3>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "#515361" }}>
                A step-by-step production handbook guiding paper weights, textures, spot coatings, and clear instructions for your local commercial printer.
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
                Optional Physical Atelier Production
              </h3>
              <p style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "#515361" }}>
                Prefer receiving finished boxes ready for immediate client delivery? Leverage our partner atelier Sonho de Papel for handcrafted assembly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Unboxing Matters */}
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
            The Power of Unboxing in Brand Positioning
          </h2>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "#515361", marginBottom: "20px" }}>
            In a digital-first marketplace, physical touchpoints carry unprecedented emotional weight. When a client unboxes a rigid bespoke drawer box with textured heavy paper and foil details, your perceived authority immediately matches top-tier luxury labels.
          </p>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.8, color: "#515361" }}>
            The Brand Box bridges the speed of intelligent digital vector systems with fine artisanal craftsmanship, ensuring your brand commands genuine prestige.
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
          Frequently Asked Questions
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
            Create My Custom Stationery
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
          © {new Date().getFullYear()} The Brand Box & Sonho de Papel. All rights reserved.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap" }}>
          <Link href="/en" style={{ color: "#E1EDE7", textDecoration: "none" }}>Home</Link>
          <Link href="/en/visual-identity-for-clinics-and-medical-offices" style={{ color: "#E1EDE7", textDecoration: "none" }}>Clinics & Doctors</Link>
          <Link href="/en/visual-identity-for-small-businesses" style={{ color: "#E1EDE7", textDecoration: "none" }}>Small Businesses</Link>
          <Link href="/en/privacy-policy" style={{ color: "#E1EDE7", textDecoration: "none" }}>Privacy</Link>
          <Link href="/en/refund-policy" style={{ color: "#94A3B8", textDecoration: "none" }}>Terms & Support</Link>
        </div>
      </footer>
    </div>
  );
}
