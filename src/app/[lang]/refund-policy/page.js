import Link from 'next/link';

export const metadata = {
  title: 'Refund & Cancellation Policy | The Brand Box',
  description: 'Refund, cancellation, and digital content delivery policy of The Brand Box.',
  alternates: {
    canonical: '/en/refund-policy',
    languages: {
      'pt-BR': '/pt/politica-de-reembolso',
      'en': '/en/refund-policy',
      'x-default': '/pt/politica-de-reembolso',
    },
  },
};

export default function RefundPolicyPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#FAFAFA', color: '#1E293B', fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif", padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto', background: '#FFFFFF', borderRadius: '24px', padding: '48px 36px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '36px', borderBottom: '1px solid #F1F5F9', paddingBottom: '24px' }}>
          <Link href="/en" style={{ width: 'fit-content', display: 'inline-block', fontSize: '0.85rem', fontWeight: 600, color: '#1F8A80', textDecoration: 'none', marginBottom: '16px' }}>
            ← Back to home
          </Link>
          <h1 style={{ fontFamily: "'Cinzel', 'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700, color: '#0F172A', margin: '8px 0 12px', letterSpacing: '-0.02em' }}>
            Refund & Cancellation Policy
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
            <strong>Last updated:</strong> September 2026
          </p>
        </div>

        {/* Content Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', lineHeight: '1.7', fontSize: '0.95rem', color: '#334155' }}>
          
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>1. Nature of Custom Digital Services</h2>
            <p>
              <strong>The Brand Box</strong> is an automated, AI-assisted art direction and brand creation platform delivering custom visual identity systems, vector brand boards, color palettes, patterns, and specialized print stationery templates.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>2. Cancellation and Refund Terms</h2>
            <p>
              Customers may request a full refund within <strong>7 days of purchase</strong>, provided that final high-resolution assets (print PDFs, SVG files, and full brand packages) have not yet been generated or downloaded.
            </p>
            <div style={{ background: '#F0FDF4', padding: '16px 20px', borderRadius: '12px', borderLeft: '4px solid #1F8A80', fontSize: '0.92rem', color: '#16554E' }}>
              <strong>Immediate Digital Delivery:</strong><br/>
              Generating or downloading final print-ready PDF files and brand deliverables constitutes the complete execution and fulfillment of the custom service. Once downloaded, the right of withdrawal no longer applies.
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>3. Technical Warranty & Quality Support</h2>
            <p>
              If you experience any technical defect, rendering error, or corrupted file:
            </p>
            <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
              <li>You are entitled to priority technical support to correct and regenerate assets at no extra cost;</li>
              <li>If a technical issue cannot be resolved by our team, a full refund will be provided at any time.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>4. How to Request Support or a Refund</h2>
            <p>
              To submit a request, please contact our support team at <a href="mailto:hello@thebrandbox.design" style={{ color: '#1F8A80', fontWeight: 600 }}>hello@thebrandbox.design</a> with your account email and transaction ID. Requests are processed within 2 business days.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
