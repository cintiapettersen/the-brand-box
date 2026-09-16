import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Medical Clinic Stationery Checklist: Mandatory & Essential Print Items | The Brand Box",
  description: "Complete checklist of medical stationery: standard and special control prescription pads, doctor certificates, examination folders, and care guides.",
  keywords: [
    "medical stationery checklist",
    "doctor office print essentials",
    "special control prescription pad template",
    "custom medical examination folders",
    "stationery for clinics and physicians",
    "the brand box medical"
  ],
  alternates: {
    canonical: "https://thebrandbox.sonhodepapel.com/en/guide/medical-stationery-checklist",
    languages: {
      "pt-BR": "https://thebrandbox.sonhodepapel.com/pt/guia/checklist-papelaria-medica-consultorios",
      "en-US": "https://thebrandbox.sonhodepapel.com/en/guide/medical-stationery-checklist",
    },
  },
  openGraph: {
    title: "Medical Clinic Stationery Checklist | The Brand Box",
    description: "Every essential print deliverable a doctor needs when launching or rebranding a medical practice.",
    url: "https://thebrandbox.sonhodepapel.com/en/guide/medical-stationery-checklist",
    images: [
      {
        url: "https://thebrandbox.sonhodepapel.com/og-checklist-papelaria-medica.jpg",
        width: 1200,
        height: 630,
        alt: "Medical Stationery Checklist The Brand Box",
      },
    ],
  },
};

export default function MedicalStationeryChecklistPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "Medical Clinic Stationery Checklist: Mandatory & Recommended Print Items",
        description: "A comprehensive operational blueprint of all technical and prestige stationery items required for high-end medical clinics and private practices.",
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
          "@id": "https://thebrandbox.sonhodepapel.com/en/guide/medical-stationery-checklist",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What mandatory details must be featured on medical prescription pads?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Every prescription pad must feature the physician's full name, medical license number (CRM/State or national registration), specialty certification (RQE if advertised), clinic physical address, contact telephone, and dedicated date and signature lines.",
            },
          },
          {
            "@type": "Question",
            name: "What is the recommended paper weight for medical folders and prescription pads?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Prescription pads perform best on 90gsm to 120gsm high-opacity uncoated woodfree paper to prevent ink bleed. Examination folders require rigid 300gsm heavyweight board with matte soft-touch lamination.",
            },
          },
          {
            "@type": "Question",
            name: "Does The Brand Box provide print-ready vector files for local print shops?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes! The Brand Box generates standardized PDF/X-1a vector templates in CMYK color mode with precision bleed margins and die-cut guides for immediate commercial printing.",
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
            href="/pt/guia/checklist-papelaria-medica-consultorios"
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

      {/* Main Container */}
      <main style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px 80px 24px" }}>
        
        {/* Breadcrumbs */}
        <div style={{ fontSize: "0.82rem", color: "#8D9A87", marginBottom: "20px" }}>
          <Link href="/en" style={{ color: "#8D9A87", textDecoration: "none" }}>Home</Link>
          {" › "}
          <Link href="/en/visual-identity-for-clinics-and-medical-offices" style={{ color: "#8D9A87", textDecoration: "none" }}>Clinics & Doctors</Link>
          {" › "}
          <span>Stationery Checklist</span>
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
          Practice Management & Clinical Stationery
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
          Medical Stationery Checklist: Mandatory & Essential Print Items for Clinics
        </h1>

        <div style={{ display: "flex", gap: "16px", alignItems: "center", marginBottom: "36px", fontSize: "0.85rem", color: "#64748B" }}>
          <span>By <strong>The Brand Box Editorial</strong></span>
          <span>•</span>
          <span>Updated September 2026</span>
          <span>•</span>
          <span>7 min read</span>
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
            alt="Medical Clinic Stationery Checklist The Brand Box"
            width={1200}
            height={675}
            priority
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>

        {/* Article Body */}
        <div style={{ fontSize: "1.02rem", lineHeight: 1.85, color: "#334155", display: "flex", flexDirection: "column", gap: "28px" }}>
          
          <p style={{ fontSize: "1.12rem", fontWeight: 500, color: "#2A2A2A" }}>
            Launching or modernizing a medical practice involves clinical, architectural, and branding decisions. Among all tangible patient touchpoints, <strong>bespoke technical medical stationery</strong> is what patients take home, interact with daily when administering treatments, and preserve in family health archives for decades.
          </p>

          <p>
            To ensure your practice projects unmatched authority and patient reassurance while remaining in full compliance with health regulatory bodies, we have compiled the <strong>definitive medical stationery checklist</strong>.
          </p>

          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.6rem", color: "#2A2A2A", marginTop: "20px", letterSpacing: "0.03em" }}>
            The 7 Essential Print Items of a Prestigious Medical Practice
          </h2>

          {/* Item 1 */}
          <div style={{ backgroundColor: "#FFFFFF", padding: "28px 24px", borderRadius: "18px", border: "1px solid #EFECE3", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#1F8A80" }}></span>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.2rem", color: "#2A2A2A", margin: 0 }}>
                1. Standard Prescription Pads (A4 and A5 Formats)
              </h3>
            </div>
            <p style={{ fontSize: "0.92rem", color: "#515361", margin: "0 0 12px 0" }}>
              The cornerstone of patient interaction. Used for routine medication orders, clinical recommendations, and diagnostic lab requisitions.
            </p>
            <div style={{ fontSize: "0.85rem", color: "#1F8A80", backgroundColor: "#E1EDE7", padding: "10px 14px", borderRadius: "10px" }}>
              <strong>Regulatory Standards:</strong> Physician name, license ID, specialty accreditation, practice address, phone, on 90gsm to 120gsm high-opacity uncoated paper.
            </div>
          </div>

          {/* Item 2 */}
          <div style={{ backgroundColor: "#FFFFFF", padding: "28px 24px", borderRadius: "18px", border: "1px solid #EFECE3", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#C7B49F" }}></span>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.2rem", color: "#2A2A2A", margin: 0 }}>
                2. Special Controlled Substance Prescription Pads (2-Part Carbonless)
              </h3>
            </div>
            <p style={{ fontSize: "0.92rem", color: "#515361", margin: "0 0 12px 0" }}>
              Mandatory for scheduled pharmaceuticals. Engineered in dual-copy format (1st Copy: Dispensing Pharmacy / 2nd Copy: Patient File).
            </p>
            <div style={{ fontSize: "0.85rem", color: "#4A3A30", backgroundColor: "#F4E8DC", padding: "10px 14px", borderRadius: "10px" }}>
              <strong>Compliance Layout:</strong> Dedicated identification blocks for prescriber, purchaser, supplier, and patient with precise perforation margins.
            </div>
          </div>

          {/* Item 3 */}
          <div style={{ backgroundColor: "#FFFFFF", padding: "28px 24px", borderRadius: "18px", border: "1px solid #EFECE3", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#8D9A87" }}></span>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.2rem", color: "#2A2A2A", margin: 0 }}>
                3. Medical Certificates & Consultation Verification Slips
              </h3>
            </div>
            <p style={{ fontSize: "0.92rem", color: "#515361", margin: 0 }}>
              Official documentation featuring anti-forgery design nuances, security watermarks, and clear fields for examination time and medical leave duration.
            </p>
          </div>

          {/* Item 4 */}
          <div style={{ backgroundColor: "#FFFFFF", padding: "28px 24px", borderRadius: "18px", border: "1px solid #EFECE3", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#9B8B9B" }}></span>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.2rem", color: "#2A2A2A", margin: 0 }}>
                4. Presentation Examination Folders with Die-Cut Flap (A4)
              </h3>
            </div>
            <p style={{ fontSize: "0.92rem", color: "#515361", margin: 0 }}>
              Essential for organizing imaging studies, surgical discharge summaries, and treatment plans. Built on rigid 300gsm heavyweight board with business card slot.
            </p>
          </div>

          {/* Item 5 */}
          <div style={{ backgroundColor: "#FFFFFF", padding: "28px 24px", borderRadius: "18px", border: "1px solid #EFECE3", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#C9D7E5" }}></span>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.2rem", color: "#2A2A2A", margin: 0 }}>
                5. Pediatric Care Guides & Post-Treatment Booklets
              </h3>
            </div>
            <p style={{ fontSize: "0.92rem", color: "#515361", margin: 0 }}>
              Accordion booklets for vaccination tracking, developmental milestones, dietary weaning, and postoperative recovery guidelines. Dramatically reduces repeated messaging inquiries.
            </p>
          </div>

          {/* Item 6 */}
          <div style={{ backgroundColor: "#FFFFFF", padding: "28px 24px", borderRadius: "18px", border: "1px solid #EFECE3", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#515361" }}></span>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.2rem", color: "#2A2A2A", margin: 0 }}>
                6. Interdisciplinary Referral & Physician Business Cards
              </h3>
            </div>
            <p style={{ fontSize: "0.92rem", color: "#515361", margin: 0 }}>
              Crafted on textured fine cotton boards (300gsm to 600gsm) with blind debossed typography or subtle metallic foil stamping for medical peer referrals.
            </p>
          </div>

          {/* Item 7 */}
          <div style={{ backgroundColor: "#FFFFFF", padding: "28px 24px", borderRadius: "18px", border: "1px solid #EFECE3", boxShadow: "0 4px 16px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ width: "14px", height: "14px", borderRadius: "50%", backgroundColor: "#1F8A80" }}></span>
              <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.2rem", color: "#2A2A2A", margin: 0 }}>
                7. Bespoke Slide Drawer Box (13.5x18.5cm)
              </h3>
            </div>
            <p style={{ fontSize: "0.92rem", color: "#515361", margin: 0 }}>
              The ultimate gesture of clinical care: houses infant health records, cosmetic care samples, or VIP patient onboarding kits with couture presentation.
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
              Get Your Complete Medical Stationery Kit Designed
            </h3>
            <p style={{ fontSize: "0.95rem", color: "#A7F3D0", maxWidth: "600px", margin: "0 auto 24px auto", lineHeight: 1.6 }}>
              The Brand Box provides full brand identity and all clinical print templates formatted for commercial printing or handcrafted atelier delivery.
            </p>
            <Link
              href="/en/visual-identity-for-clinics-and-medical-offices"
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
              Explore Medical Practice Solution
            </Link>
          </div>

          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: "1.6rem", color: "#2A2A2A", marginTop: "24px", letterSpacing: "0.03em" }}>
            Frequently Asked Questions
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
            ← Back to Clinic & Medical Solutions
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
