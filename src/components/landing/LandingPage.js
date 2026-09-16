'use client';

import { useState } from 'react';
import Image from 'next/image';
import LanguageSwitcher from '../LanguageSwitcher';
import JsonLdSchema from './JsonLdSchema';

export default function LandingPage({ onStart, lang = 'pt', dictionary }) {
  const isEn = (lang || '').startsWith('en');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqItems = isEn
    ? [
        {
          q: 'What is the Brand Visual Signature (Logo System)?',
          a: 'It is a sophisticated typographic identity system with balanced proportion and visual hierarchy. We provide complete coordinate signatures (horizontal, vertical, and compact) designed for versatility across both digital presence and physical luxury stationery.',
        },
        {
          q: 'Do I need design skills or any installed software?',
          a: 'No! The whole journey is guided step-by-step through our intuitive visual diagnosis. In just a few clicks, you choose your style, context, and aesthetic preferences, receiving professional files ready for use.',
        },
        {
          q: 'How fast is my visual identity generated?',
          a: 'Your entire Brand Board, Visual Signature, Color Palette, Exclusive Seamless Pattern, and Stationery items are generated in minutes, complete with real-time interactive previews.',
        },
        {
          q: 'Are the stationery files ready for high-end printing?',
          a: 'Yes! All stationery pieces are engineered according to industry print standards, safe bleed margins, and ultra-high-resolution vector and raster assets.',
        },
        {
          q: 'Can I customize colors, typography, or patterns along the way?',
          a: 'Absolutely. Our creative direction engine lets you refine palette harmonies, choose signature variations, calibrate color saturation, and regenerate custom patterns.',
        },
        {
          q: 'What medical and clinic materials are included?',
          a: 'We provide specialized stationery for healthcare professionals: standard prescriptions (A4 & A5), special control prescriptions, medical certificates, patient records, baby care guides (vaccination, sleep, breastfeeding), courage certificates, and gift boxes.',
        },
      ]
    : [
        {
          q: 'O que é a Assinatura Visual de Marca?',
          a: 'É uma composição tipográfica e visual sofisticada, com proporções harmônicas e hierarquia refinada. Você recebe o sistema completo com variações estruturadas (horizontal, vertical e compacta) para aplicar com máxima elegância tanto no digital quanto na papelaria física.',
        },
        {
          q: 'Preciso ter experiência em design ou programas instalados?',
          a: 'Não! Todo o processo é guiado passo a passo pelo nosso diagnóstico criativo. Você apenas escolhe sua área, sensações e preferências estéticas através de uma experiência intuitiva e agradável.',
        },
        {
          q: 'Em quanto tempo minha identidade visual fica pronta?',
          a: 'Em poucos minutos! O seu Brand Board completo com Assinatura Visual, Submarca/Selo, Paleta de Cores, Estampa Exclusiva e itens de Papelaria é gerado em tempo real na tela.',
        },
        {
          q: 'Os arquivos vêm prontos para mandar para a gráfica?',
          a: 'Sim! Todos os materiais impressos contam com medidas padrão de mercado, margens de sangria corretas e altíssima resolução para impressão gráfica profissional.',
        },
        {
          q: 'Posso personalizar cores, fontes e estampas durante a criação?',
          a: 'Sim. Durante a experiência você pode refinar as cores da sua paleta, testar diferentes estilos de assinatura tipográfica e gerar novos padrões exclusivos até encontrar a combinação perfeita.',
        },
        {
          q: 'Quais materiais para clínicas e consultórios estão inclusos?',
          a: 'O The Brand Box oferece uma linha completa para a área da saúde: receituários padrão (A4 e A5), receituário de controle especial, atestados médicos, prontuários, fichas, guias de vacinação, guia do sono, introdução alimentar, amamentação, certificado de coragem e caixa gaveta personalizada.',
        },
      ];

  const features = isEn
    ? [
        {
          dotColor: '#C7B49F',
          title: 'Brand Visual Signature',
          desc: 'Refined typographic hierarchy with balanced proportions, delivered with horizontal, vertical, and compact coordinate versions.',
        },
        {
          dotColor: '#1F8A80',
          title: 'Submark & Circular Seal',
          desc: 'The perfect emblem of authenticity for social media profiles, wax seals, stamps, stickers, and packaging.',
        },
        {
          dotColor: '#E1EDE7',
          title: 'Calibrated Color Palette',
          desc: 'Harmonious color combinations curated by color psychology, complete with Hex and RGB codes for web and print.',
        },
        {
          dotColor: '#9B8B9B',
          title: 'Exclusive Seamless Pattern',
          desc: 'Bespoke repeatable pattern designed with your brand colors for luxury wrapping paper, tissue, bags, and web backgrounds.',
        },
        {
          dotColor: '#8D9A87',
          title: 'Brand Board & Typography',
          desc: 'A complete one-page aesthetic brand guide that maps your visual universe, typography pairings, and stylistic tone.',
        },
        {
          dotColor: '#515361',
          title: 'Complete Stationery Suite',
          desc: 'Production-ready templates for business cards, folders, letterheads, envelopes, bags, gift boxes, and shipping labels.',
        },
      ]
    : [
        {
          dotColor: '#C7B49F',
          title: 'Assinatura Visual de Marca',
          desc: 'Composição tipográfica elegante com proporções refinadas, entregue com versões coordenadas (horizontal, vertical e compacta).',
        },
        {
          dotColor: '#1F8A80',
          title: 'Submarca & Selo Circular',
          desc: 'O selo de autenticidade perfeito para foto de perfil do Instagram, carimbos, adesivos, lacres de cera e embalagens.',
        },
        {
          dotColor: '#E1EDE7',
          title: 'Paleta Cromática Calibrada',
          desc: 'Harmonias de cores equilibradas com códigos Hex e RGB testados para legibilidade e impacto emocional.',
        },
        {
          dotColor: '#9B8B9B',
          title: 'Estampa Exclusiva (Pattern)',
          desc: 'Padrão contínuo sem emendas em altíssima resolução com as cores da sua marca para papel de presente, caixas, sacolas e fundos.',
        },
        {
          dotColor: '#8D9A87',
          title: 'Brand Board & Diretrizes',
          desc: 'O mapa visual completo que documenta a essência, as fontes complementares e a direção de arte da sua marca.',
        },
        {
          dotColor: '#515361',
          title: 'Kit de Papelaria Completo',
          desc: 'Gabaritos técnicos prontos para gráfica de cartão de visita, pasta A4, envelopes, papel timbrado, tags e caixas.',
        },
      ];

  const steps = isEn
    ? [
        {
          num: '01',
          title: 'Guided Visual Diagnosis',
          desc: 'Answer intuitive questions about your niche, values, audience, and the sensations you want your brand to convey.',
        },
        {
          num: '02',
          title: 'Art Direction & AI Engine',
          desc: 'Our algorithmic director curates typographic harmonies, balances palette saturation, and crafts your custom pattern.',
        },
        {
          num: '03',
          title: 'Complete Brand Universe',
          desc: 'Instantly preview and download your complete Brand Board, Visual Signature, and high-resolution print deliverables.',
        },
      ]
    : [
        {
          num: '01',
          title: 'Diagnóstico Visual Guiado',
          desc: 'Responda perguntas intuitivas sobre o seu nicho, valores, público e as sensações que você deseja transmitir.',
        },
        {
          num: '02',
          title: 'Direção de Arte com IA',
          desc: 'Nosso algoritmo harmoniza a tipografia ideal, equilibra a paleta cromática e gera sua estampa exclusiva.',
        },
        {
          num: '03',
          title: 'Universo de Marca Completo',
          desc: 'Visualize em tempo real e receba seu Brand Board, Assinatura Visual, Selo e arquivos de papelaria prontos para uso.',
        },
      ];

  const clinicItems = isEn
    ? [
        'Standard Prescriptions (A4 & A5)',
        'Special Control Prescriptions',
        'Medical Certificates & Patient Records',
        'Vaccination & Infant Care Guides',
        'Sleep & Feeding Routine Handouts',
        'Breastfeeding Orientation Cards',
        'Courage Certificate for Kids',
        'Custom Drawer Box (13.5 x 18.5 cm)',
      ]
    : [
        'Receituários Padrão (A4 e A5)',
        'Receituário de Controle Especial',
        'Atestados Médicos e Prontuários',
        'Guia de Vacinação e Desenvolvimento',
        'Guia do Sono e Introdução Alimentar',
        'Guia de Amamentação e Pega Correta',
        'Certificado de Coragem para Crianças',
        'Caixa Gaveta Personalizada (13,5x18,5cm)',
      ];

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-primary)', overflowX: 'hidden' }}>
      <JsonLdSchema lang={lang} />

      {/* TOP NAVBAR */}
      <header style={{ width: '100%', maxWidth: '1160px', margin: '0 auto', padding: '32px 24px 20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Image
            src="/the-brand-box-logo.png"
            alt="The Brand Box"
            width={160}
            height={36}
            priority
            style={{ width: 'auto', height: '28px', objectFit: 'contain', mixBlendMode: 'multiply' }}
          />
        </div>

        <nav style={{ display: 'none', md: 'flex', alignItems: 'center', gap: '28px' }} className="hidden md:flex">
          <a href="#como-funciona" style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', textDecoration: 'none' }}>
            {isEn ? 'How It Works' : 'Como Funciona'}
          </a>
          <a href="#entregas" style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', textDecoration: 'none' }}>
            {isEn ? 'Deliverables' : 'O Que Você Recebe'}
          </a>
          <a href="#clinicas" style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', textDecoration: 'none' }}>
            {isEn ? 'Clinics & Doctors' : 'Para Clínicas'}
          </a>
          <a href="#faq" style={{ fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-secondary)', textDecoration: 'none' }}>
            FAQ
          </a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <LanguageSwitcher />
          <button
            onClick={onStart}
            className="btn-primary"
            style={{
              padding: '10px 20px',
              fontSize: '0.78rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 700,
              borderRadius: '24px',
              cursor: 'pointer',
              border: 'none',
              background: 'var(--accent-turquoise)',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(31, 138, 128, 0.28)',
            }}
          >
            {isEn ? 'Create My Brand' : 'Criar Minha Marca'}
          </button>
        </div>
      </header>

      {/* HERO SECTION - Respiro aumentado */}
      <section style={{ width: '100%', maxWidth: '1160px', margin: '0 auto', padding: '75px 24px 60px 24px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', padding: '7px 18px', borderRadius: '30px', background: '#E1EDE7', color: '#16554E', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '32px' }}>
          ✨ {isEn ? 'ART DIRECTION & AI ENGINE' : 'DIREÇÃO DE ARTE & INTELIGÊNCIA ARTIFICIAL'}
        </div>

        <h1 style={{ fontFamily: "'Cinzel', 'Playfair Display', serif", fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', fontWeight: 700, lineHeight: 1.25, color: 'var(--text-primary)', maxWidth: '900px', margin: '0 auto 26px auto', letterSpacing: '-0.02em' }}>
          {isEn
            ? 'Build Your Complete Visual Identity with AI & Art Direction'
            : 'Crie sua Identidade Visual Completa com Direção de Arte e IA'}
        </h1>

        <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.18rem)', color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: '720px', margin: '0 auto 46px auto', fontWeight: 400 }}>
          {isEn
            ? 'Transform your business essence into a high-end, professional brand in minutes. Visual Signature, Submark Seal, Calibrated Color Palette, Bespoke Pattern, and Print-Ready Stationery.'
            : 'Transforme a essência do seu negócio em uma marca elegante e profissional em minutos. Assinatura Visual de Marca, Submarca/Selo, Paleta Cromática Calibrada, Estampa Exclusiva e Kit Completo de Papelaria pronto para imprimir.'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', smDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '60px' }}>
          <button
            onClick={onStart}
            className="btn-primary"
            style={{
              padding: '16px 42px',
              fontSize: '0.92rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 700,
              borderRadius: '30px',
              cursor: 'pointer',
              border: 'none',
              background: 'var(--accent-turquoise)',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(31, 138, 128, 0.35)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            {isEn ? 'START GUIDED EXPERIENCE' : 'COMEÇAR A CRIAR MINHA MARCA'}
          </button>
        </div>

        {/* HERO SHOWCASE IMAGE */}
        <div style={{ width: '100%', maxWidth: '980px', margin: '0 auto', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)', border: '1px solid rgba(0,0,0,0.08)', position: 'relative' }}>
          <Image
            src="/og-brandbox.jpg"
            alt={isEn ? 'The Brand Box Visual Identity Showcase' : 'Apresentação da Identidade Visual The Brand Box'}
            width={1200}
            height={630}
            priority
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </section>

      {/* SECTION: COMO FUNCIONA */}
      <section id="como-funciona" style={{ width: '100%', maxWidth: '1160px', margin: '60px auto', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent-turquoise)', fontWeight: 700, marginBottom: '8px' }}>
            {isEn ? 'HOW IT WORKS' : 'COMO FUNCIONA'}
          </p>
          <h2 style={{ fontFamily: "'Cinzel', 'Playfair Display', serif", fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: 'var(--text-primary)', margin: 0 }}>
            {isEn ? 'From Essence to Brand Universe in 3 Steps' : 'Da sua essência ao universo da marca em 3 passos'}
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {steps.map((st, i) => (
            <div
              key={i}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '32px 26px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.03)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-turquoise)', fontFamily: "'Cinzel', serif" }}>
                {st.num}
              </span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                {st.title}
              </h3>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: O QUE VOCÊ RECEBE - Minimalist Color Dots */}
      <section id="entregas" style={{ width: '100%', maxWidth: '1160px', margin: '60px auto', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '44px' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent-turquoise)', fontWeight: 700, marginBottom: '8px' }}>
            {isEn ? 'DELIVERABLES' : 'O QUE VOCÊ RECEBE'}
          </p>
          <h2 style={{ fontFamily: "'Cinzel', 'Playfair Display', serif", fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: 'var(--text-primary)', margin: 0 }}>
            {isEn ? 'A Complete and Harmonious Brand System' : 'Um sistema de marca completo e harmonioso'}
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {features.map((feat, i) => (
            <div
              key={i}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '30px 26px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.03)',
                border: '1px solid var(--border)',
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
                    background: feat.dotColor,
                    display: 'inline-block',
                    border: '1.5px solid rgba(0, 0, 0, 0.12)',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.06)',
                  }}
                />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  {feat.title}
                </h3>
              </div>
              <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: 'var(--text-secondary)', margin: 0 }}>
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: ESPECIAL CLÍNICAS E CONSULTÓRIOS */}
      <section id="clinicas" style={{ width: '100%', maxWidth: '1160px', margin: '60px auto', padding: '40px 24px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #203830 0%, #16554E 100%)',
            borderRadius: '28px',
            padding: '50px 36px',
            color: '#ffffff',
            boxShadow: '0 16px 36px rgba(22, 85, 78, 0.28)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '36px',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: '20px', background: 'rgba(255,255,255,0.15)', color: '#E1EDE7', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '16px' }}>
              🏥 {isEn ? 'CLINICAL & MEDICAL EXCLUSIVE' : 'EXCLUSIVO PARA CLÍNICAS E CONSULTÓRIOS'}
            </div>
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.6rem, 2.8vw, 2.3rem)', margin: '0 0 16px 0', lineHeight: 1.3 }}>
              {isEn ? 'Technical Stationery Engineered for Doctors & Healthcare' : 'Papelaria Técnica Pronta para Médicos e Especialistas'}
            </h2>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.65, color: '#E1EDE7', margin: '0 0 28px 0', opacity: 0.95 }}>
              {isEn
                ? 'No more generic medical templates. Receive complete, specialized clinic stationery personalized with your brand colors, typography, and professional layouts ready for printing.'
                : 'Chega de impressos médicos genéricos. Tenha toda a papelaria técnica do seu consultório diagramada com a sua paleta cromática, assinatura tipográfica e padrões visuais únicos prontos para a gráfica.'}
            </p>
            <button
              onClick={onStart}
              style={{
                padding: '14px 32px',
                fontSize: '0.85rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 700,
                borderRadius: '24px',
                cursor: 'pointer',
                border: 'none',
                background: '#ffffff',
                color: '#16554E',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
              }}
            >
              {isEn ? 'CREATE CLINIC BRAND' : 'CRIAR MARCA PARA MEU CONSULTÓRIO'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            {clinicItems.map((item, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.16)',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#ffffff',
                }}
              >
                <span style={{ color: '#A7F3D0', fontWeight: 'bold' }}>✓</span> {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION: FAQ */}
      <section id="faq" style={{ width: '100%', maxWidth: '860px', margin: '60px auto', padding: '40px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--accent-turquoise)', fontWeight: 700, marginBottom: '8px' }}>
            {isEn ? 'FREQUENTLY ASKED QUESTIONS' : 'PERGUNTAS FREQUENTES'}
          </p>
          <h2 style={{ fontFamily: "'Cinzel', 'Playfair Display', serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: 'var(--text-primary)', margin: 0 }}>
            {isEn ? 'Everything You Need to Know' : 'Tudo o que você precisa saber'}
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqItems.map((item, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: isOpen ? '1px solid var(--accent-turquoise)' : '1px solid var(--border)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    fontWeight: 700,
                  }}
                >
                  <span>{item.q}</span>
                  <span style={{ fontSize: '1.2rem', color: 'var(--accent-turquoise)', fontWeight: 700, marginLeft: '12px' }}>
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div style={{ padding: '0 24px 20px 24px', fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--text-secondary)' }}>
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FINAL CTA STRIP */}
      <section style={{ width: '100%', maxWidth: '1160px', margin: '40px auto 80px auto', padding: '0 24px' }}>
        <div
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            padding: '50px 30px',
            textAlign: 'center',
            boxShadow: '0 12px 32px rgba(0,0,0,0.06)',
          }}
        >
          <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: 'clamp(1.5rem, 2.5vw, 2.2rem)', margin: '0 0 16px 0', color: 'var(--text-primary)' }}>
            {isEn ? 'Ready to Bring Your Brand to Life?' : 'Pronta para dar vida à sua nova marca?'}
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
            {isEn
              ? 'Start your guided visual diagnosis now and receive your complete Brand Board in minutes.'
              : 'Inicie seu diagnóstico visual guiado agora e receba seu Brand Board completo em minutos.'}
          </p>
          <button
            onClick={onStart}
            className="btn-primary"
            style={{
              padding: '16px 44px',
              fontSize: '0.92rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 700,
              borderRadius: '30px',
              cursor: 'pointer',
              border: 'none',
              background: 'var(--accent-turquoise)',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(31, 138, 128, 0.35)',
            }}
          >
            {isEn ? 'START MY BRAND' : 'CRIAR MINHA MARCA AGORA'}
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ width: '100%', borderTop: '1px solid var(--border)', background: '#ffffff', padding: '40px 24px' }}>
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

          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
            © {new Date().getFullYear()} The Brand Box. {isEn ? 'All rights reserved.' : 'Todos os direitos reservados.'}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href={`/${isEn ? 'en/visual-identity-for-clinics-and-medical-offices' : 'pt/identidade-visual-para-clinicas-e-consultorios'}`} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
              {isEn ? 'Clinics & Doctors' : 'Clínicas & Médicos'}
            </a>
            <span style={{ color: 'var(--border)' }}>•</span>
            <a href={`/${isEn ? 'en/visual-identity-for-small-businesses' : 'pt/identidade-visual-para-pequenos-negocios'}`} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
              {isEn ? 'Small Businesses' : 'Pequenos Negócios'}
            </a>
            <span style={{ color: 'var(--border)' }}>•</span>
            <a href={`/${isEn ? 'en/custom-stationery' : 'pt/papelaria-personalizada'}`} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
              {isEn ? 'Custom Stationery' : 'Papelaria Personalizada'}
            </a>
            <span style={{ color: 'var(--border)' }}>•</span>
            <a href={`/${isEn ? 'en/pricing' : 'pt/precos'}`} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
              {isEn ? 'Pricing' : 'Preços'}
            </a>
            <span style={{ color: 'var(--border)' }}>•</span>
            <a href={`/${isEn ? 'en/refund-policy' : 'pt/politica-de-reembolso'}`} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
              {isEn ? 'Refund Policy' : 'Reembolso'}
            </a>
            <span style={{ color: 'var(--border)' }}>•</span>
            <a href={`/${isEn ? 'en/privacy-policy' : 'pt/politica-de-privacidade'}`} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', textDecoration: 'none' }}>
              {isEn ? 'Privacy' : 'Privacidade'}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
