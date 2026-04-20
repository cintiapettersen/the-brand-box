'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect, useRef } from 'react';
import BrandTemplateSVG from '../../components/BrandTemplateSVG';
import html2canvas from 'html2canvas';

const MOCKUP_BACKGROUNDS = [
  {
    id: 'warm',
    label: 'Quente',
    style: {
      background: '#2a1a10',
      blobs: [
        { color: '#7a3a1a', x: '10%', y: '20%', size: '280px' },
        { color: '#c4621a', x: '60%', y: '10%', size: '200px' },
        { color: '#3a1a08', x: '80%', y: '60%', size: '320px' },
        { color: '#8a4a20', x: '20%', y: '70%', size: '240px' },
      ],
      overlay: 'rgba(20,10,5,0.35)',
    },
  },
  {
    id: 'dark',
    label: 'Premium',
    style: {
      background: '#0e0e14',
      blobs: [
        { color: '#2a1a4a', x: '15%', y: '25%', size: '260px' },
        { color: '#1a0a3a', x: '65%', y: '15%', size: '180px' },
        { color: '#0a0a2a', x: '75%', y: '65%', size: '300px' },
        { color: '#3a1a5a', x: '25%', y: '65%', size: '220px' },
      ],
      overlay: 'rgba(5,5,15,0.4)',
    },
  },
  {
    id: 'blush',
    label: 'Rosa',
    style: {
      background: '#2a1018',
      blobs: [
        { color: '#8a2050', x: '10%', y: '20%', size: '280px' },
        { color: '#c43070', x: '60%', y: '10%', size: '200px' },
        { color: '#4a1030', x: '80%', y: '60%', size: '300px' },
        { color: '#7a1840', x: '20%', y: '70%', size: '240px' },
      ],
      overlay: 'rgba(15,5,10,0.4)',
    },
  },
  {
    id: 'sage',
    label: 'Natural',
    style: {
      background: '#101a14',
      blobs: [
        { color: '#2a4a30', x: '10%', y: '20%', size: '280px' },
        { color: '#1a3a22', x: '60%', y: '10%', size: '200px' },
        { color: '#3a5a3a', x: '80%', y: '60%', size: '300px' },
        { color: '#1a3010', x: '20%', y: '70%', size: '240px' },
      ],
      overlay: 'rgba(5,12,8,0.4)',
    },
  },
];

function MockupBackground({ bg, children }) {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', background: bg.style.background, overflow: 'hidden', borderRadius: '16px' }}>
      {bg.style.blobs.map((blob, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: blob.x, top: blob.y,
          width: blob.size, height: blob.size,
          borderRadius: '50%',
          background: blob.color,
          filter: 'blur(80px)',
          transform: 'translate(-50%, -50%)',
          opacity: 0.9,
        }} />
      ))}
      <div style={{ position: 'absolute', inset: 0, background: bg.style.overlay }} />
      <div style={{ position: 'relative', zIndex: 2, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
}

const DELIVERY_STEPS = ['logo', 'submarca'];

function EntregaContent({ brand }) {
  const [step, setStep] = useState('logo');
  const [bgId, setBgId] = useState('warm');
  const [downloading, setDownloading] = useState(false);
  const mockupRef = useRef(null);

  const bg = MOCKUP_BACKGROUNDS.find(b => b.id === bgId) || MOCKUP_BACKGROUNDS[0];
  const { editData, activeColor, iconPath } = brand;

  const handleDownload = async () => {
    if (!mockupRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(mockupRef.current, { scale: 3, useCORS: true, backgroundColor: null });
      const link = document.createElement('a');
      link.download = `${editData.marca || 'logo'}-mockup-${bgId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f5', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 0 3rem 0', fontFamily: 'Montserrat, sans-serif' }}>

      {/* Header */}
      <div style={{ width: '100%', maxWidth: '480px', padding: '1.5rem 1.5rem 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.65rem', color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>brand box</p>
          <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#1a1a1a' }}>
            {step === 'logo' ? 'Sua Logo' : 'Sua Submarca'}
          </h1>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#aaa' }}>
          {DELIVERY_STEPS.indexOf(step) + 1} / {DELIVERY_STEPS.length}
        </div>
      </div>

      {/* Mockup */}
      {step === 'logo' && (
        <div style={{ width: '100%', maxWidth: '480px', padding: '1rem 1.5rem 0' }}>
          {/* Moldura do mockup */}
          <div ref={mockupRef} style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>
            <MockupBackground bg={bg}>
              <div style={{ width: '72%', height: '72%' }}>
                <BrandTemplateSVG
                  data={editData}
                  color={activeColor}
                  side="frente"
                  hideBackground={true}
                  iconPath={iconPath}
                />
              </div>
            </MockupBackground>
          </div>

          {/* Seletor de fundo */}
          <div style={{ marginTop: '1rem', display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {MOCKUP_BACKGROUNDS.map(b => (
              <button
                key={b.id}
                onClick={() => setBgId(b.id)}
                style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: b.style.background,
                  border: bgId === b.id ? '3px solid #333' : '2px solid #ddd',
                  cursor: 'pointer',
                  boxShadow: bgId === b.id ? '0 0 0 2px #333' : 'none',
                  transform: bgId === b.id ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 0.15s ease',
                  position: 'relative', overflow: 'hidden',
                }}
                title={b.label}
              >
                {b.style.blobs.slice(0, 2).map((blob, i) => (
                  <div key={i} style={{
                    position: 'absolute',
                    left: blob.x, top: blob.y,
                    width: '60%', height: '60%',
                    borderRadius: '50%',
                    background: blob.color,
                    filter: 'blur(8px)',
                    transform: 'translate(-50%, -50%)',
                  }} />
                ))}
              </button>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '6px', fontSize: '0.72rem', color: '#aaa' }}>
            {bg.label}
          </div>

          {/* Botões */}
          <div style={{ marginTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handleDownload}
              disabled={downloading}
              style={{ width: '100%', padding: '13px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', opacity: downloading ? 0.6 : 1 }}
            >
              {downloading ? 'Preparando...' : '⬇ Baixar mockup'}
            </button>
            <button
              onClick={() => setStep('submarca')}
              style={{ width: '100%', padding: '13px', background: '#dc3495', color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
            >
              Próximo: Submarca →
            </button>
          </div>
        </div>
      )}

      {/* STEP: Submarca */}
      {step === 'submarca' && (
        <div style={{ width: '100%', maxWidth: '480px', padding: '1rem 1.5rem 0' }}>
          <div style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>
            <MockupBackground bg={bg}>
              <div style={{ width: '60%', height: '60%' }}>
                <BrandTemplateSVG
                  data={editData}
                  color={activeColor}
                  side="verso"
                  hideBackground={true}
                  iconPath={iconPath}
                />
              </div>
            </MockupBackground>
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {MOCKUP_BACKGROUNDS.map(b => (
              <button
                key={b.id}
                onClick={() => setBgId(b.id)}
                style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: b.style.background,
                  border: bgId === b.id ? '3px solid #333' : '2px solid #ddd',
                  cursor: 'pointer',
                  transform: bgId === b.id ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 0.15s ease',
                  position: 'relative', overflow: 'hidden',
                }}
                title={b.label}
              />
            ))}
          </div>

          <div style={{ marginTop: '1.2rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handleDownload}
              disabled={downloading}
              style={{ width: '100%', padding: '13px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
            >
              {downloading ? 'Preparando...' : '⬇ Baixar submarca'}
            </button>
            <button
              onClick={() => setStep('logo')}
              style={{ width: '100%', padding: '13px', background: 'none', color: '#aaa', border: '1px solid #ddd', borderRadius: '30px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
            >
              ← Voltar para a logo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SucessoContent() {
  const params = useSearchParams();
  const plano = params.get('plano');
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('brandbox_delivery');
      if (saved) setBrand(JSON.parse(saved));
    } catch {}
    setLoading(false);
  }, []);

  if (loading) return null;

  if (!brand) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', fontFamily: 'Montserrat, sans-serif' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1a1a1a' }}>Pagamento confirmado!</h1>
        <p style={{ fontSize: '1rem', color: '#555', maxWidth: '400px', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          {plano === 'experience'
            ? 'Seus arquivos estão sendo preparados e você receberá tudo por e-mail em instantes.'
            : 'Entraremos em contato em até 2 dias úteis pelo e-mail cadastrado.'}
        </p>
        <a href="/" style={{ padding: '12px 28px', background: '#dc3495', color: '#fff', borderRadius: '30px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}>
          Voltar ao início
        </a>
      </div>
    );
  }

  return (
    <>
      <div style={{ width: '100%', maxWidth: '480px', margin: '0 auto', background: '#e8f7f5', borderRadius: '0 0 16px 16px', padding: '10px 20px', textAlign: 'center', fontSize: '0.8rem', color: '#1a7a6e', fontWeight: 600 }}>
        🎉 Pagamento confirmado! Explore sua marca abaixo.
      </div>
      <EntregaContent brand={brand} />
    </>
  );
}

export default function Sucesso() {
  return (
    <Suspense>
      <SucessoContent />
    </Suspense>
  );
}
