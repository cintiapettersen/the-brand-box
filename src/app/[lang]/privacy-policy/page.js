import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | The Brand Box',
  description: 'Privacy Policy and Data Protection guidelines for The Brand Box platform.',
  alternates: {
    canonical: '/en/privacy-policy',
    languages: {
      'pt-BR': '/pt/politica-de-privacidade',
      'en': '/en/privacy-policy',
      'x-default': '/pt/politica-de-privacidade',
    },
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main style={{ minHeight: '100vh', background: '#FAFAFA', color: '#1E293B', fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif", padding: '40px 20px 80px' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto', background: '#FFFFFF', borderRadius: '24px', padding: '48px 36px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '36px', borderBottom: '1px solid #F1F5F9', paddingBottom: '24px' }}>
          <Link href="/en" style={{ width: 'fit-content', display: 'inline-block', fontSize: '0.85rem', fontWeight: 600, color: '#2A897F', textDecoration: 'none', marginBottom: '16px' }}>
            ← Back to home
          </Link>
          <h1 style={{ fontFamily: "'Cinzel', 'Playfair Display', serif", fontSize: '2.2rem', fontWeight: 700, color: '#0F172A', margin: '8px 0 12px', letterSpacing: '-0.02em' }}>
            Privacy Policy
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
            <strong>Last Updated:</strong> August 04, 2026
          </p>
        </div>

        {/* Content Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', lineHeight: '1.7', fontSize: '0.95rem', color: '#334155' }}>
          
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>1. Who we are and Data Controller</h2>
            <p>
              <strong>The Brand Box</strong> is an interactive visual identity and digital stationery creation platform operated by <strong>PETTERSEN LUNT DESIGN</strong>.
            </p>
            <p style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid #2A897F', fontSize: '0.9rem' }}>
              <strong>Legal Name:</strong> PETTERSEN LUNT DESIGN, responsible for The Brand Box<br/>
              <strong>Organization Number:</strong> 932 370 956<br/>
              <strong>Privacy Contact:</strong> <a href="mailto:thebrandbox@sonhodepapel.com" style={{ color: '#2A897F', textDecoration: 'underline' }}>thebrandbox@sonhodepapel.com</a>
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>2. Data we collect</h2>
            <p>We collect only the data strictly necessary to provide the briefing experience and deliver your brand materials:</p>
            <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
              <li><strong>Identity & Contact Data:</strong> Name/nickname and email address.</li>
              <li><strong>Project & Brand Data:</strong> Brand name, business industry, visual preferences, tone of voice, colors, and selected patterns.</li>
              <li><strong>Consent Records:</strong> Voluntary opt-in records for marketing communications and product news, including timestamp and consent version.</li>
              <li><strong>Transaction &amp; Purchase Data:</strong> Plan selection history (e.g., Pro, Single purchase) and Stripe payment session identifiers (we do not store credit card details on our servers).</li>
              <li><strong>Technical Log Data:</strong> IP address, browser type, operating system, and system access logs for security purposes.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>3. How we collect data</h2>
            <p>Data is collected directly when you fill out the initial step (&quot;Before we start&quot;), progress through the interactive briefing questions, and complete checkout.</p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>4. How we use your data</h2>
            <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
              <li>Save your project progress and allow you to resume your session later.</li>
              <li>Generate printable PDF templates and digital assets for your brand.</li>
              <li>Send essential transactional emails (your permanent project link and brand name update notices).</li>
              <li>Send news, useful content, and special offers from The Brand Box (only with your explicit opt-in consent).</li>
              <li>Prevent fraud and ensure application cybersecurity.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>5. Legal basis for processing (GDPR &amp; LGPD)</h2>
            <p>We process personal data under the following legal bases:</p>
            <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
              <li><strong>Contract Performance:</strong> sending project links and providing access to your purchased files.</li>
              <li><strong>Consent (GDPR Art. 6(1)(a)):</strong> sending optional newsletters and promotional offers.</li>
              <li><strong>Legitimate Interests:</strong> improving platform usability and providing customer support.</li>
              <li><strong>Legal Compliance:</strong> retaining security logs as required by applicable legislation.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>6. How we use Artificial Intelligence</h2>
            <p>
              We utilize artificial intelligence models from <strong>OpenAI and Google (including Gemini and Imagen)</strong> exclusively to process your creative preferences, generate tagline suggestions, brand diagnosis, and pattern designs.
            </p>
            <p style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid #2A897F', fontSize: '0.9rem' }}>
              <strong>Secure Processing:</strong> Your briefing responses are processed securely via dedicated technical APIs for immediate asset generation without unauthorized data sharing.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>7. Third-party services and data recipients</h2>
            <p>Data is shared exclusively with essential infrastructure providers:</p>
            <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
              <li><strong>Supabase Inc.:</strong> database hosting and lead records.</li>
              <li><strong>Vercel Inc.:</strong> web application hosting and edge infrastructure.</li>
              <li><strong>InMotion Hosting (SMTP):</strong> transactional project email delivery.</li>
              <li><strong>OpenAI &amp; Google LLC (Gemini and Imagen):</strong> creative AI generation.</li>
              <li><strong>Stripe Inc.:</strong> payment processing and secure checkout.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>8. Payments and Stripe</h2>
            <p>
              All payment transactions are handled directly by <strong>Stripe</strong>. The Brand Box does not store or process full credit card numbers or sensitive banking details.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>9. Essential emails and optional marketing</h2>
            <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
              <li><strong>Essential (Transactional) Emails:</strong> sent to deliver your project link and order confirmations. These do not require promotional opt-in.</li>
              <li><strong>Optional Marketing:</strong> sent only if you check the box in the form. You can unsubscribe at any time via the link in any promotional email.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>10. Cookies, logs and analytics</h2>
            <p>
              We use browser local storage (`localStorage`) to maintain your project session (`brandbox_session`). We do not use invasive third-party tracking cookies without prior notice.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>11. International data transfers</h2>
            <p>
              Since our technology providers (Supabase, Vercel, Stripe, Google, OpenAI) operate global infrastructure, your data may be transferred and processed internationally under standard data protection safeguards.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>12. Data retention periods</h2>
            <p>
              We retain personal data and project files for as long as necessary to fulfill the purposes outlined in this policy:
            </p>
            <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
              <li><strong>Unfinished projects:</strong> retained for up to 12 months after the last activity.</li>
              <li><strong>Purchased projects and generated assets:</strong> retained for up to 24 months after delivery.</li>
              <li><strong>Tax, accounting, and payment records:</strong> retained during the applicable statutory period, typically 5 years.</li>
              <li><strong>Marketing data:</strong> retained until consent is withdrawn.</li>
            </ul>
            <p style={{ marginTop: '8px', fontSize: '0.9rem', color: '#64748B' }}>
              * Deletion requests will be fulfilled prior to these periods when no legal retention obligation exists.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>13. Data Security</h2>
            <p>
              We enforce SSL/TLS encryption across all connections, strict database access controls, and server-side API key protection to secure your data.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>14. Your Rights (GDPR &amp; LGPD)</h2>
            <p>You have the right to request at any time:</p>
            <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
              <li>Access to your personal data.</li>
              <li>Correction of inaccurate or incomplete data.</li>
              <li>Deletion of your personal data.</li>
              <li>Restriction or objection to processing.</li>
              <li>Data portability.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>15. How to withdraw consent</h2>
            <p>
              You can withdraw marketing consent at any time by clicking &quot;Unsubscribe&quot; in any marketing email or contacting our privacy contact at <a href="mailto:thebrandbox@sonhodepapel.com" style={{ color: '#2A897F', textDecoration: 'underline' }}>thebrandbox@sonhodepapel.com</a>.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>16. Data erasure and portability</h2>
            <p>
              To request permanent erasure of your lead records, please contact <a href="mailto:thebrandbox@sonhodepapel.com" style={{ color: '#2A897F', textDecoration: 'underline' }}>thebrandbox@sonhodepapel.com</a>.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>17. Children&apos;s Privacy</h2>
            <p>
              Our platform is intended for users aged 18 and older. We do not knowingly collect data from children without parental consent.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>18. Changes to this Privacy Policy</h2>
            <p>
              We reserve the right to update this policy at any time. Material changes will be posted on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>19. Contact Us</h2>
            <p>
              For questions or privacy requests:
            </p>
            <p>
              <strong>Legal Name:</strong> PETTERSEN LUNT DESIGN<br/>
              <strong>Privacy Contact:</strong> <a href="mailto:thebrandbox@sonhodepapel.com" style={{ color: '#2A897F', textDecoration: 'underline' }}>thebrandbox@sonhodepapel.com</a><br/>
              <strong>Brand:</strong> The Brand Box
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>20. Right to Lodge a Complaint</h2>
            <p style={{ marginBottom: '10px' }}>
              If you have any questions or concerns regarding the processing of your personal data, we recommend that you first contact us at <a href="mailto:thebrandbox@sonhodepapel.com" style={{ color: '#2A897F', textDecoration: 'underline' }}>thebrandbox@sonhodepapel.com</a> so we can review and try to resolve the matter.
            </p>
            <p>
              You also have the right to lodge a complaint with <strong>Datatilsynet</strong>, the Norwegian Data Protection Authority, or another competent supervisory authority where applicable. More information is available on the <a href="https://www.datatilsynet.no/en/" target="_blank" rel="noopener noreferrer" style={{ color: '#2A897F', textDecoration: 'underline' }}>Datatilsynet website</a>.
            </p>
          </section>

        </div>

        {/* Footer */}
        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid #E2E8F0', textAlign: 'center', fontSize: '0.85rem', color: '#94A3B8' }}>
          © 2026 The Brand Box · All rights reserved.
        </div>
      </div>
    </main>
  );
}
