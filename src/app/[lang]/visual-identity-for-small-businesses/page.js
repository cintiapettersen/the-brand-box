import Link from 'next/link';
import Image from 'next/image';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const baseUrl = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://thebrandbox.design').replace(/\/$/, '');

  const title = 'Visual Identity & Custom Packaging for Small Businesses | The Brand Box';
  const description = 'Build your complete visual identity and packaging suite: brand signature, submark seal, shopping tags, thank you cards, boxes, and shipping labels.';

  return {
    metadataBase: new URL(baseUrl),
    title: title,
    description: description,
    keywords: [
      'visual identity for small businesses',
      'boutique branding package',
      'custom packaging and stationery',
      'unboxing thank you card',
      'shopping bag tag template',
      'the brand box',
    ],
    alternates: {
      canonical: '/en/visual-identity-for-small-businesses',
      languages: {
        'pt-BR': '/pt/identidade-visual-para-pequenos-negocios',
        'en': '/en/visual-identity-for-small-businesses',
        'x-default': '/pt/identidade-visual-para-pequenos-negocios',
      },
    },
    openGraph: {
      title: title,
      description: description,
      url: `${baseUrl}/en/visual-identity-for-small-businesses`,
      siteName: 'The Brand Box',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: '/og-pequenos-negocios.jpg',
          width: 1200,
          height: 630,
          alt: 'Visual Identity & Custom Packaging for Small Businesses - The Brand Box',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      images: ['/og-pequenos-negocios.jpg'],
    },
  };
}

export default function SmallBusinessesPageEn() {
  const businessPillars = [
    {
      dotColor: '#C7B49F',
      title: 'Brand Visual Signature (Logo System)',
      desc: 'Refined typographic hierarchy with coordinate versions (horizontal for web, vertical for product tags, and compact for social media).',
    },
    {
      dotColor: '#1F8A80',
      title: 'Submark & Circular Seal',
      desc: 'The authenticity seal for packaging stickers, Instagram profile avatar, stamps, and wax seals.',
    },
    {
      dotColor: '#E1EDE7',
      title: 'Exclusive Seamless Pattern',
      desc: 'High-resolution bespoke repeatable pattern in your brand colors for luxury tissue paper, delivery boxes, and shopping bags.',
    },
    {
      dotColor: '#9B8B9B',
      title: 'Packaging & Unboxing Experience',
      desc: 'Product and bag hang tags, Thank You Cards (10x15cm) for unforgettable unboxing, and standard shipping labels.',
    },
    {
      dotColor: '#8D9A87',
      title: 'Commercial Stationery Suite',
      desc: 'Business & Loyalty Cards, A4 Folder with inner pocket for contracts and proposals, Letterhead, Envelopes, and Commercial Invoices.',
    },
    {
      dotColor: '#515361',
      title: 'Digital Presence & Social Media',
      desc: 'Interactive Digital Business Card (direct links to WhatsApp, online catalog, and store map) and professional Email Signature.',
    },
  ];

  const businessFaq = [
    {
      q: 'Does The Brand Box work for both online e-commerce and physical stores?',
      a: 'Yes! Deliverables cover both digital presence (interactive card, social media avatar, email signature) and physical touchpoints (hang tags, unboxing cards, shipping labels, drawer boxes).',
    },
    {
      q: 'How can I use the Exclusive Pattern on my packaging?',
      a: 'The pattern is delivered as a seamless repeat tile in ultra-high resolution, ready to send to tissue paper, gift box, or bag manufacturers.',
    },
    {
      q: 'Are the stationery files ready for high-resolution printing?',
      a: 'Yes! Every template comes with standard bleed margins, cutting marks, and vector quality PDF ready for local or online print vendors.',
    },
    {
      q: 'Is it a one-time purchase or a subscription?',
      a: 'It is a one-time purchase. No recurring subscriptions — all generated assets and your Brand Board are yours forever.',
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
          <a href="#entregas" style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5A5855', textDecoration: 'none' }}>
            Deliverables
          </a>
          <a href="#unboxing" style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5A5855', textDecoration: 'none' }}>
            Unboxing
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
            Create My Brand
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{ width: '100%', maxWidth: '1160px', margin: '0 auto', padding: '75px 24px 60px 24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '7px 18px', borderRadius: '30px', background: '#E1EDE7', color: '#16554E', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '32px' }}>
          🛍️ BRANDING FOR BOUTIQUES, CREATORS & SMALL BUSINESSES
        </div>

        <h1 style={{ fontFamily: "'Cinzel', 'Playfair Display', serif", fontSize: 'clamp(2.1rem, 4.5vw, 3.5rem)', fontWeight: 700, lineHeight: 1.25, color: '#363532', maxWidth: '960px', margin: '0 auto 26px auto', letterSpacing: '-0.02em' }}>
          Complete Visual Identity & Packaging That Elevates Your Products
        </h1>

        <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.18rem)', color: '#5A5855', lineHeight: 1.75, maxWidth: '780px', margin: '0 auto 46px auto', fontWeight: 400 }}>
          Transform your brand into a high-end memorable experience in minutes. Receive <strong>Brand Visual Signature, Submark Seal, Custom Pattern, Hang Tags, Unboxing Cards, and Packaging Templates</strong>.
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
            START MY BRANDING NOW
          </Link>
        </div>

        {/* HERO SHOWCASE IMAGE */}
        <div style={{ width: '100%', maxWidth: '980px', margin: '0 auto', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.08)' }}>
          <Image
            src="/og-pequenos-negocios.jpg"
            alt="Visual Identity & Custom Packaging for Small Businesses - The Brand Box"
            width={1200}
            height={630}
            priority
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </section>

      {/* SECTION: DELIVERABLES */}
      <section id="entregas" style={{ width: '100%', maxWidth: '1160px', margin: '60px auto', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#1F8A80', fontWeight: 700, marginBottom: '8px' }}>
            COMPLETE BRANDING SUITE
          </p>
          <h2 style={{ fontFamily: "'Cinzel', 'Playfair Display', serif", fontSize: 'clamp(1.7rem, 3vw, 2.5rem)', color: '#363532', margin: 0 }}>
            Everything your business needs to position with luxury and value
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {businessPillars.map((pillar, i) => (
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

      {/* SECTION: FAQ */}
      <section id="faq" style={{ width: '100%', maxWidth: '860px', margin: '60px auto', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#1F8A80', fontWeight: 700, marginBottom: '8px' }}>
            FREQUENTLY ASKED QUESTIONS
          </p>
          <h2 style={{ fontFamily: "'Cinzel', 'Playfair Display', serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#363532', margin: 0 }}>
            Everything You Need to Know
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {businessFaq.map((item, index) => (
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
              Privacy Policy
            </Link>
            <span style={{ color: '#E2DDD5' }}>•</span>
            <Link href="/en/refund-policy" style={{ fontSize: '0.82rem', color: '#5A5855', textDecoration: 'none' }}>
              Refund Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
