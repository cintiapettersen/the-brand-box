import Link from 'next/link';
import Image from 'next/image';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const baseUrl = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://thebrandbox.design').replace(/\/$/, '');

  const title = 'Visual Identity & Stationery Suite for Clinics & Doctors | The Brand Box';
  const description = 'Create complete visual identity and technical medical stationery for your clinic: standard & special prescriptions, patient guides, certificates, folders and charts.';

  return {
    metadataBase: new URL(baseUrl),
    title: title,
    description: description,
    keywords: [
      'visual identity for clinics',
      'medical stationery suite',
      'custom prescription pad',
      'pediatric clinic branding',
      'doctor brand identity',
      'the brand box',
    ],
    alternates: {
      canonical: '/en/visual-identity-for-clinics-and-medical-offices',
      languages: {
        'pt-BR': '/pt/identidade-visual-para-clinicas-e-consultorios',
        'en': '/en/visual-identity-for-clinics-and-medical-offices',
        'x-default': '/pt/identidade-visual-para-clinicas-e-consultorios',
      },
    },
    openGraph: {
      title: title,
      description: description,
      url: `${baseUrl}/en/visual-identity-for-clinics-and-medical-offices`,
      siteName: 'The Brand Box',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: '/og-clinicas.jpg',
          width: 1200,
          height: 630,
          alt: 'Visual Identity & Technical Stationery Suite for Clinics & Doctors - The Brand Box',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: ['/og-clinicas.jpg'],
    },
  };
}

export default function ClinicsLandingPageEn() {
  const clinicPillars = [
    {
      dotColor: '#1F8A80',
      title: 'Official Prescriptions & Certificates',
      desc: 'Standard Prescriptions (A4 & A5 sizes), Special Control Prescriptions, Medical Certificates, Receipts, and Return Cards formatted with your license and specialty.',
    },
    {
      dotColor: '#C7B49F',
      title: 'Folders, Envelopes & Patient Records',
      desc: 'Exclusive A4 folder with inner pocket for medical reports and exams, branded office envelopes, and standardized clinical records.',
    },
    {
      dotColor: '#E1EDE7',
      title: 'Pediatric & Patient Care Guides',
      desc: 'Exclusive patient education materials: Vaccination Guide, Infant Sleep Routine Guide, Solid Food Introduction Tips, and Breastfeeding Guide with correct latching advice.',
    },
    {
      dotColor: '#8D9A87',
      title: 'Patient Experience & Care',
      desc: 'Courage Certificate for children, branded shopping tag, Thank You Card, and Custom Drawer Box (13.5 x 18.5 cm).',
    },
    {
      dotColor: '#9B8B9B',
      title: 'Doctor Digital Presence',
      desc: 'Interactive Digital Business Card (direct links to appointments, WhatsApp, and clinic map), Email Signature, and Social Media kit.',
    },
    {
      dotColor: '#515361',
      title: 'Visual Brand Signature & Submark Seal',
      desc: 'Refined typographic hierarchy with coordinate variations and circular embossed seal perfect for doctor stamps, stickers, and letterheads.',
    },
  ];

  const medicalFaq = [
    {
      q: 'Do prescriptions and stationery follow standard medical board specifications?',
      a: 'Yes! All clinic templates are engineered following industry standards for prescription legibility, dosage fields, contact details, and license registration fields.',
    },
    {
      q: 'Can I customize with my medical license (MD), address, and contacts?',
      a: 'Absolutely. During setup, you enter your clinic or doctor name, specialty, license number, office address, and contacts. All stationery items are automatically generated with your information.',
    },
    {
      q: 'Are the files delivered print-ready for professional printing shops?',
      a: 'Yes! Every document comes with millimetric precision margins, safe bleed, and high-resolution PDF output ready for any commercial printer.',
    },
    {
      q: 'How fast is the clinic package generated?',
      a: 'Within minutes! Our algorithmic art direction engine crafts your Brand Board, color palette, logo signature, and all 30+ clinic templates in real time.',
    },
  ];

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#F8F5F1', color: '#363532', overflowX: 'hidden' }}>
      {/* TOP NAVBAR */}
      <header style={{ width: '100%', maxWidth: '1160px', margin: '0 auto', padding: '32px 24px 20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link href="/en">
            <Image
              src="/the-brand-box-logo.png"
              alt="The Brand Box"
              width={160}
              height={36}
              priority
              style={{ width: 'auto', height: '28px', objectFit: 'contain', mixBlendMode: 'multiply', cursor: 'pointer' }}
            />
          </Link>
        </div>

        <nav style={{ display: 'none', md: 'flex', alignItems: 'center', gap: '28px' }} className="hidden md:flex">
          <a href="#materiais" style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5A5855', textDecoration: 'none' }}>
            Deliverables
          </a>
          <a href="#diferencial" style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5A5855', textDecoration: 'none' }}>
            Why Us
          </a>
          <a href="#faq" style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5A5855', textDecoration: 'none' }}>
            FAQ
          </a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <LanguageSwitcher />
          <Link
            href="/en"
            style={{
              padding: '10px 20px',
              fontSize: '0.78rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 700,
              borderRadius: '24px',
              textDecoration: 'none',
              background: '#1F8A80',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(31, 138, 128, 0.28)',
              display: 'inline-block',
            }}
          >
            Create Clinic Brand
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{ width: '100%', maxWidth: '1160px', margin: '0 auto', padding: '75px 24px 60px 24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '7px 18px', borderRadius: '30px', background: '#E1EDE7', color: '#16554E', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '32px' }}>
          🩺 MEDICAL PARTNERSHIPS • EXCLUSIVE HEALTHCARE STATIONERY
        </div>

        <h1 style={{ fontFamily: "'Cinzel', 'Playfair Display', serif", fontSize: 'clamp(2.1rem, 4.5vw, 3.5rem)', fontWeight: 700, lineHeight: 1.25, color: '#363532', maxWidth: '960px', margin: '0 auto 26px auto', letterSpacing: '-0.02em' }}>
          Visual Identity & Technical Stationery Suite for Clinics and Doctors
        </h1>

        <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.18rem)', color: '#5A5855', lineHeight: 1.75, maxWidth: '780px', margin: '0 auto 46px auto', fontWeight: 400 }}>
          Elevate your practice with a high-end visual signature and receive <strong>over 30 customized medical print deliverables</strong>: standard and special control prescriptions, medical certificates, patient exam folders, and pediatric care booklets.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', smDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '60px' }}>
          <Link
            href="/en"
            style={{
              padding: '16px 44px',
              fontSize: '0.92rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 700,
              borderRadius: '30px',
              textDecoration: 'none',
              background: '#1F8A80',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(31, 138, 128, 0.35)',
              display: 'inline-block',
            }}
          >
            CREATE MY CLINIC BRAND
          </Link>
        </div>

        {/* HERO SHOWCASE CLINIC IMAGE */}
        <div style={{ width: '100%', maxWidth: '980px', margin: '0 auto', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.08)' }}>
          <Image
            src="/og-clinicas.jpg"
            alt="Technical Stationery and Visual Identity for Clinics and Doctors"
            width={1200}
            height={630}
            priority
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </section>

      {/* SECTION: DELIVERABLES */}
      <section id="materiais" style={{ width: '100%', maxWidth: '1160px', margin: '60px auto', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#1F8A80', fontWeight: 700, marginBottom: '8px' }}>
            COMPLETE CLINIC SUITE
          </p>
          <h2 style={{ fontFamily: "'Cinzel', 'Playfair Display', serif", fontSize: 'clamp(1.7rem, 3vw, 2.5rem)', color: '#363532', margin: 0 }}>
            Everything your practice needs to inspire trust and patient care
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {clinicPillars.map((pillar, i) => (
            <div
              key={i}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '30px 26px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.03)',
                border: '1px solid #E2DDD5',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: pillar.dotColor,
                    display: 'inline-block',
                    border: '1.5px solid rgba(0, 0, 0, 0.12)',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.06)',
                  }}
                />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#363532' }}>
                  {pillar.title}
                </h3>
              </div>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.65, color: '#5A5855', margin: 0 }}>
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: MEDICAL FAQ */}
      <section id="faq" style={{ width: '100%', maxWidth: '860px', margin: '60px auto', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#1F8A80', fontWeight: 700, marginBottom: '8px' }}>
            FREQUENTLY ASKED QUESTIONS
          </p>
          <h2 style={{ fontFamily: "'Cinzel', 'Playfair Display', serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#363532', margin: 0 }}>
            Everything Doctors Need to Know
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {medicalFaq.map((item, index) => (
            <div
              key={index}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #E2DDD5',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                padding: '22px 24px',
              }}
            >
              <h3 style={{ fontSize: '1.02rem', fontWeight: 700, margin: '0 0 10px 0', color: '#363532' }}>
                {item.q}
              </h3>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.65, color: '#5A5855', margin: 0 }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ width: '100%', borderTop: '1px solid #E2DDD5', background: '#ffffff', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: '1160px', margin: '0 auto', display: 'flex', flexDirection: 'column', mdDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Image
              src="/the-brand-box-logo.png"
              alt="The Brand Box"
              width={140}
              height={32}
              style={{ width: 'auto', height: '24px', objectFit: 'contain', mixBlendMode: 'multiply' }}
            />
          </div>

          <div style={{ fontSize: '0.82rem', color: '#5A5855', textAlign: 'center' }}>
            © {new Date().getFullYear()} The Brand Box. All rights reserved.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
            <Link href="/en/privacy-policy" style={{ fontSize: '0.82rem', color: '#5A5855', textDecoration: 'none' }}>
              Privacy
            </Link>
            <span style={{ color: '#E2DDD5' }}>•</span>
            <Link href="/en/refund-policy" style={{ fontSize: '0.82rem', color: '#94A3B8', textDecoration: 'none' }}>
              Terms & Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
