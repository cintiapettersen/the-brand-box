import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Color Palette for Medical Clinics & Offices: Psychology Guide & HEX Codes | The Brand Box",
  description: "Learn how to choose the ideal color palette for your clinic or medical practice. Comprehensive guide to color psychology, HEX/CMYK codes, and sophisticated palettes.",
  keywords: [
    "color palette for medical clinic",
    "doctor office color schemes",
    "healthcare color psychology",
    "aesthetic clinic color palette",
    "pediatric office colors",
    "hex codes medical branding",
    "branding for doctors and healthcare"
  ],
  alternates: {
    canonical: "https://thebrandbox.sonhodepapel.com/en/guide/color-palette-for-medical-clinics-and-offices",
    languages: {
      "pt-BR": "https://thebrandbox.sonhodepapel.com/pt/guia/paleta-de-cores-para-clinicas-e-consultorios",
      "en-US": "https://thebrandbox.sonhodepapel.com/en/guide/color-palette-for-medical-clinics-and-offices",
    },
  },
  openGraph: {
    title: "Color Palette for Medical Clinics: Complete Guide | The Brand Box",
    description: "Healthcare color psychology, HEX codes, and the best palette pairings to convey authority and patient comfort.",
    url: "https://thebrandbox.sonhodepapel.com/en/guide/color-palette-for-medical-clinics-and-offices",
    images: [
      {
        url: "https://thebrandbox.sonhodepapel.com/og-guia-cores-clinicas.jpg",
        width: 1200,
        height: 630,
        alt: "Medical Color Palette Guide The Brand Box",
      },
    ],
  },
};

export default function MedicalColorPaletteGuidePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "How to Choose the Perfect Color Palette for Medical Clinics and Healthcare Practices",
        description: "Comprehensive guide on healthcare color psychology, elegant palette combinations, and HEX/CMYK codes for doctors.",
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
          "@id": "https://thebrandbox.sonhodepapel.com/en/guide/color-palette-for-medical-clinics-and-offices",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is the best color for a medical practice?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "There is no single universal color, but rather harmonious palettes that balance clinical authority with soothing warmth. Sage Herb Green (#8D9A87), Powder Blue Mist (#C9D7E5), and warm Cashmere Taupe (#C7B49F) are proven to lower patient anxiety while retaining prestige.",
            },
          },
          {
            "@type": "Question",
            name: "Why should clinics avoid sterile pure white and harsh royal blues?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Overly sterile pure white and saturated royal blues trigger clinical coldness and spike cortisol before consultations. Warm off-whites and biophilic greens humanize patient care without losing professional rigor.",
            },
          },
          {
            "@type": "Question",
            name: "What is the difference between HEX, RGB, and CMYK for medical stationery?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "HEX and RGB are screen-based color formats (websites, social media, EHR systems). CMYK and Pantone matching are essential for printed stationery (prescription pads, examination folders) to ensure precise color fidelity without muddy shifts.",
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
            href="/pt/guia/paleta-de-cores-para-clinicas-e-consultorios"
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

      {/* Article Content */}
      <main style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px 80px 24px" }}>
        
        {/* Breadcrumbs */}
        <div style={{ fontSize: "0.82rem", color: "#8D9A87", marginBottom: "20px" }}>
          <Link href="/en" style={{ color: "#8D9A87", textDecoration: "none" }}>Home</Link>
          {" › "}
          <Link href="/en/visual-identity-for-clinics-and-medical-offices" style={{ color: "#8D9A87", textDecoration: "none" }}>Clinics & Doctors</Link>
          {" › "}
          <span>Color Guide</span>
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
          Medical Branding & Design Guide
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
          Color Palettes for Medical Clinics: The Definitive Psychology & Elegance Guide
        </h1>

        <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "36px", fontSize: "0.85rem", color: "#64748B" }}>
          <span>By <strong>The Brand Box Editorial</strong></span>
          <span>•</span>
          <span>Updated September 2026</span>
          <span>•</span>
          <span>6 min read</span>
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
            alt="Medical Color Palettes The Brand Box"
            width={1200}
            height={675}
            priority
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>

        {/* Article Body */}
        <div style={{ fontSize: "1.02rem", lineHeight: 1.85, color: "#334155", display: "flex", flexDirection: "column", gap: "28px" }}>
          
          <p style={{ fontSize: "1.12rem", fontWeight: 500, color: "#2A2A2A" }}>
            Color is the very first sensory cue a patient registers upon entering your reception, reading your prescription pad, or browsing your website. Far beyond pure aesthetics, a physician’s color palette is a neuroscientific instrument for alleviating anxiety and commanding clinical authority.
          </p>

          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.6rem", color: "#2A2A2A", marginTop: "16px", letterSpacing: "0.03em" }}>
            1. Color Psychology in Healthcare Environments
          </h2>
          <p>
            For decades, medicine was dominated by sterile bleached white and stark hospital blue. Contemporary research in sensory architecture and biomedical branding reveals that excessively cold environments heighten patient stress and elevate pre-consultation cortisol levels.
          </p>
          <p>
            Leading modern practices embrace a <strong>Biophilic and Tactile</strong> approach: nature-inspired hues (botanical herbs, cashmere taupe, mineral earths, and morning mist) that communicate clinical precision while radiating genuine human warmth.
          </p>

          {/* Color Grids Section */}
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.6rem", color: "#2A2A2A", marginTop: "24px", letterSpacing: "0.03em" }}>
            2. The 4 Most Prestigious Color Pairings for Physicians
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
              A. Botanical Sage & Cashmere Taupe (Dermatology & Plastic Surgery)
            </h3>
            <p style={{ fontSize: "0.9rem", color: "#515361", marginBottom: "20px" }}>
              Tailored for practices emphasizing rejuvenation, biological harmony, and high aesthetics. Sage reflects botanical healing, while taupe adds architectural grounding.
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
              B. Ice Pale Mint & Powder Blue Mist (Pediatrics & Maternity)
            </h3>
            <p style={{ fontSize: "0.9rem", color: "#515361", marginBottom: "20px" }}>
              Instills immediate serenity for mothers and infants. Soft pastel clarity that fosters a comforting ambiance in vaccination booklets and developmental milestone charts.
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
            3. Common Mistakes in Medical Stationery Color Selection
          </h2>
          <ol style={{ paddingLeft: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <li>
              <strong>Designing exclusively in RGB/HEX without CMYK proofing:</strong> Backlit screens exaggerate vibrance. When exported to commercial press without color profiling, delicate sand tones can turn dull gray or greenish.
            </li>
            <li>
              <strong>Lack of contrast on prescription pads:</strong> Ultra-light font colors make dosage instructions illegible in pharmacy dispensing environments and can breach health board guidelines. Body copy should always use deep solid charcoals (#2A2A2A or #1E2D3B).
            </li>
            <li>
              <strong>Unbalanced functional hierarchy:</strong> Having 5 colors competing equally confuses the reader. Apply the 60-30-10 rule: 60% dominant light background, 30% supporting tone, 10% high-contrast accent.
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
              Get a Calibrated Color Palette for Your Practice in Minutes
            </h3>
            <p style={{ fontSize: "0.95rem", color: "#A7F3D0", maxWidth: "600px", margin: "0 auto 24px auto", lineHeight: 1.6 }}>
              The Brand Box evaluates your medical specialty and target clientele to automatically configure HEX, RGB, CMYK, and print-ready vector formats.
            </p>
            <Link
              href="/en"
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
              Create My Clinic Palette
            </Link>
          </div>

          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.6rem", color: "#2A2A2A", marginTop: "24px", letterSpacing: "0.03em" }}>
            4. Frequently Asked Questions
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
            href="/en/visual-identity-for-clinics-and-medical-offices"
            style={{ color: "#1F8A80", fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}
          >
            ← View Complete Medical Branding Solution
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
