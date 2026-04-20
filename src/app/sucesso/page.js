'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect, useRef } from 'react';
import BrandTemplateSVG from '../../components/BrandTemplateSVG';
import { STYLE_ICONS } from '../../lib/styleIcons';
import html2canvas from 'html2canvas';


function ColorDot({ color, selected, onClick, size = 32 }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: size, height: size, borderRadius: '50%',
        background: color,
        cursor: 'pointer',
        border: selected ? '3px solid #333' : '2px solid transparent',
        boxShadow: selected
          ? '0 0 0 1px #333, 0 2px 8px rgba(0,0,0,0.15)'
          : '0 2px 6px rgba(0,0,0,0.12)',
        transform: selected ? 'scale(1.18)' : 'scale(1)',
        transition: 'all 0.15s ease',
        flexShrink: 0,
      }}
    />
  );
}

function SectionLabel({ children }) {
  return (
    <p style={{ fontSize: '0.65rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 700, marginBottom: '8px' }}>
      {children}
    </p>
  );
}

const MAX_GENERATIONS = 3;

function EstampaStep({ brand, accentColor, marca }) {
  const [genCount, setGenCount] = useState(brand.patternGenerationCount || 0);
  const [generating, setGenerating] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [patterns, setPatterns] = useState(brand.pattern ? [brand.pattern] : []);

  const remaining = MAX_GENERATIONS - genCount;
  const patternSrc = patterns[selectedIdx]
    ? `data:${patterns[selectedIdx].mimeType};base64,${patterns[selectedIdx].base64}`
    : null;

  const generate = async () => {
    if (genCount >= MAX_GENERATIONS) return;
    setGenerating(true);
    try {
      const paletas = brand.paletas || [];
      const sel = paletas.find(p => p.id === brand.selectedPaleta);
      const cores = sel?.paleta_hex || sel?.cores_hex || [];
      const estampas = brand.estampas || [];
      const refs = estampas.slice(0, 2).map(e => e.image_url).filter(Boolean);

      const res = await fetch('/api/generate-pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paleta: cores,
          estiloNome: brand.resultadoFinal?.estiloNome || '',
          marca: marca || brand.formData?.marca || '',
          descricao: brand.resultadoFinal?.mensagem || '',
          referenceUrls: refs,
        }),
      });
      const data = await res.json();
      const novos = (data.patterns || []).filter(p => p.base64);
      if (novos.length > 0) {
        setPatterns(prev => [...prev, ...novos]);
        setSelectedIdx(patterns.length);
        setGenCount(c => c + 1);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const download = () => {
    if (!patternSrc) return;
    const link = document.createElement('a');
    link.download = `${marca || 'estampa'}-padrao.png`;
    link.href = patternSrc;
    link.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      {patternSrc ? (
        <>
          <div style={{
            width: '100%', aspectRatio: '1 / 1', borderRadius: '16px',
            boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
            backgroundImage: `url(${patternSrc})`,
            backgroundSize: '50%', backgroundRepeat: 'repeat',
          }} />
          {patterns.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {patterns.map((p, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedIdx(i)}
                  style={{
                    width: 44, height: 44, borderRadius: '8px', cursor: 'pointer',
                    backgroundImage: `url(data:${p.mimeType};base64,${p.base64})`,
                    backgroundSize: 'cover',
                    border: selectedIdx === i ? `3px solid ${accentColor}` : '2px solid #e0e0e0',
                    boxShadow: selectedIdx === i ? `0 0 0 1px ${accentColor}` : 'none',
                  }}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: '16px', background: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#bbb' }}>
          <span style={{ fontSize: '2rem' }}>✨</span>
          <span style={{ fontSize: '0.9rem' }}>Nenhuma estampa gerada ainda</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px' }}>
        {patternSrc && (
          <button onClick={download} style={{ flex: 1, padding: '13px 8px', background: accentColor, color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}>
            ⬇ Baixar
          </button>
        )}
        {remaining > 0 && (
          <button
            onClick={generate}
            disabled={generating}
            style={{ flex: 1, padding: '13px 8px', background: 'none', color: accentColor, border: `1.5px solid ${accentColor}`, borderRadius: '30px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', opacity: generating ? 0.6 : 1 }}
          >
            {generating ? 'Gerando...' : `✨ ${patternSrc ? 'Gerar nova' : 'Gerar estampa'}`}
          </button>
        )}
      </div>
      <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#bbb' }}>
        {remaining > 0 ? `${remaining} geração${remaining > 1 ? 'ões' : ''} restante${remaining > 1 ? 's' : ''}` : 'Limite de gerações atingido'}
      </p>
    </div>
  );
}

function EntregaContent({ brand }) {
  const [step, setStep] = useState('logo');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logoColor, setLogoColor] = useState(brand.activeColor || '#dc3495');
  const [downloading, setDownloading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [marca, setMarca] = useState(brand.editData?.marca || '');
  const [tagline, setTagline] = useState(brand.editData?.tagline || '');
  const logoRef = useRef(null);

  const { paletas } = brand;
  const estiloNome = brand.resultadoFinal?.estiloNome || '';
  const styleIcons = STYLE_ICONS[estiloNome] || [];
  const [selectedIcon, setSelectedIcon] = useState(brand.selectedIcon || null);
  const currentIconPath = styleIcons.find(i => i.id === selectedIcon)?.path || null;

  const editData = { ...brand.editData, marca, tagline };
  const seloData = editData.fontStyle === 'script'
    ? { ...editData, fontFamily: 'Montserrat', fontWeight: 700, fontStyle: 'display' }
    : editData;

  const paletteColors = (() => {
    const sel = paletas?.find(p => p.id === brand.selectedPaleta);
    const hex = sel?.paleta_hex || sel?.cores_hex || [];
    if (hex.length > 0) return hex;
    const any = paletas?.find(p => p.paleta_hex?.length > 0);
    return any?.paleta_hex || [brand.activeColor || '#dc3495'];
  })();

  const BG_OPTIONS = [
    { color: '#ffffff', label: 'Branco' },
    { color: '#faf8f4', label: 'Creme' },
    { color: logoColor, label: 'Marca' },
    { color: '#1a1a1a', label: 'Escuro' },
    { color: '#f0ece6', label: 'Neutro' },
  ];

  const downloadComFundo = async () => {
    if (!logoRef.current) return;
    setDownloading('fundo');
    const el = logoRef.current;
    try {
      const canvas = await html2canvas(el, { scale: 4, useCORS: true, backgroundColor: bgColor });
      const link = document.createElement('a');
      link.download = `${marca || 'logo'}-com-fundo.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  const downloadTransparent = async () => {
    if (!logoRef.current) return;
    setDownloading('png');
    const el = logoRef.current;
    const prev = el.style.background;
    try {
      el.style.background = 'transparent';
      const canvas = await html2canvas(el, { scale: 4, useCORS: true, backgroundColor: null });
      el.style.background = prev;
      const link = document.createElement('a');
      link.download = `${marca || 'logo'}-sem-fundo.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      el.style.background = prev;
    } finally {
      setDownloading(false);
    }
  };

  const accentColor = logoColor || '#dc3495';

  return (
    <div style={{ minHeight: '100vh', background: '#faf9f7', fontFamily: 'Montserrat, sans-serif', paddingBottom: '3rem' }}>

      {/* Banner topo */}
      <div style={{ background: '#e8f7f5', padding: '10px 20px', textAlign: 'center', fontSize: '0.78rem', color: '#1a7a6e', fontWeight: 600, letterSpacing: '0.3px' }}>
        🎉 Pagamento confirmado! Aqui está sua marca.
      </div>

      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '1.5rem 1.4rem 0' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
          <div>
            <p style={{ fontSize: '0.62rem', color: '#bbb', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700, marginBottom: '2px' }}>brand box</p>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.2 }}>
              {step === 'logo' ? 'Sua Logo' : step === 'submarca' ? 'Sua Submarca' : 'Sua Estampa'}
            </h1>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#ccc', fontWeight: 600 }}>
            {step === 'logo' ? '1' : step === 'submarca' ? '2' : '3'} / 3
          </span>
        </div>

        {/* Área da estampa */}
        {step === 'estampa' && <EstampaStep brand={brand} accentColor={accentColor} marca={marca} />}

        {/* Área da logo */}
        {step !== 'estampa' && <div
          ref={logoRef}
          style={{
            width: '100%', aspectRatio: '1 / 1',
            background: bgColor,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s ease',
          }}
        >
          <div style={{ width: '68%', height: '68%' }}>
            <BrandTemplateSVG
              data={step === 'submarca' ? seloData : editData}
              color={logoColor}
              side={step === 'logo' ? 'frente' : 'verso'}
              hideBackground={true}
              iconPath={step === 'submarca' ? currentIconPath : undefined}
            />
          </div>
        </div>}

        {/* Controles */}
        {step !== 'estampa' &&
        <div style={{ marginTop: '1.4rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Editar texto */}
          <div>
            <button
              onClick={() => setShowEdit(v => !v)}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <SectionLabel>✏️ Editar texto {showEdit ? '▲' : '▼'}</SectionLabel>
            </button>
            {showEdit && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                <input
                  value={marca}
                  onChange={e => setMarca(e.target.value)}
                  placeholder="Nome da marca"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e0e0e0', fontSize: '0.9rem', fontFamily: 'Montserrat, sans-serif', boxSizing: 'border-box' }}
                />
                <input
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  placeholder="Tagline / frase da marca"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e0e0e0', fontSize: '0.9rem', fontFamily: 'Montserrat, sans-serif', boxSizing: 'border-box' }}
                />
              </div>
            )}
          </div>

          {/* Fundo (só na logo) */}
          {step === 'logo' && <div>
            <SectionLabel>Fundo</SectionLabel>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {BG_OPTIONS.map(opt => (
                <ColorDot
                  key={opt.label}
                  color={opt.color}
                  selected={bgColor === opt.color}
                  onClick={() => setBgColor(opt.color)}
                />
              ))}
            </div>
          </div>}

          {/* Ícone da submarca (só aparece na etapa submarca) */}
          {step === 'submarca' && styleIcons.length > 0 && (
            <div>
              <SectionLabel>Ícone</SectionLabel>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div
                  onClick={() => setSelectedIcon(null)}
                  style={{
                    width: 38, height: 38, borderRadius: '50%', cursor: 'pointer',
                    background: selectedIcon === null ? logoColor : '#f5f5f5',
                    border: selectedIcon === null ? '3px solid #333' : '2px solid #ddd',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.6rem', color: selectedIcon === null ? '#fff' : '#aaa', fontWeight: 700,
                    flexShrink: 0, transition: 'all 0.15s ease',
                    transform: selectedIcon === null ? 'scale(1.15)' : 'scale(1)',
                  }}
                >—</div>
                {styleIcons.map(icon => (
                  <div
                    key={icon.id}
                    onClick={() => setSelectedIcon(icon.id)}
                    title={icon.label}
                    style={{
                      width: 38, height: 38, borderRadius: '50%', cursor: 'pointer',
                      background: selectedIcon === icon.id ? logoColor : '#f5f5f5',
                      border: selectedIcon === icon.id ? '3px solid #333' : '2px solid #ddd',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all 0.15s ease',
                      transform: selectedIcon === icon.id ? 'scale(1.15)' : 'scale(1)',
                    }}
                  >
                    <img src={icon.path} alt={icon.label}
                      style={{ width: 22, height: 22, objectFit: 'contain',
                        filter: selectedIcon === icon.id ? 'brightness(0) invert(1)' : 'none' }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cor da logo */}
          {paletteColors.length > 0 && (
            <div>
              <SectionLabel>Cor da logo</SectionLabel>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {paletteColors.map((hex, i) => (
                  <ColorDot key={i} color={hex} selected={logoColor === hex} onClick={() => setLogoColor(hex)} />
                ))}
              </div>
            </div>
          )}
        </div>}

        {/* Botões */}
        <div style={{ marginTop: '1.6rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={downloadTransparent}
              disabled={!!downloading}
              style={{ flex: 1, padding: '13px 8px', background: accentColor, color: '#fff', border: 'none', borderRadius: '30px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', opacity: downloading === 'png' ? 0.6 : 1 }}
            >
              {downloading === 'png' ? '...' : '⬇ Sem fundo'}
            </button>
            <button
              onClick={downloadComFundo}
              disabled={!!downloading}
              style={{ flex: 1, padding: '13px 8px', background: 'none', color: accentColor, border: `1.5px solid ${accentColor}`, borderRadius: '30px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', opacity: downloading === 'fundo' ? 0.6 : 1 }}
            >
              {downloading === 'fundo' ? '...' : '⬇ Com fundo'}
            </button>
          </div>

          {step === 'logo' && (
            <button onClick={() => setStep('submarca')} style={{ width: '100%', padding: '13px', background: 'none', color: '#888', border: '1px solid #e0e0e0', borderRadius: '30px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
              Próximo: Submarca →
            </button>
          )}
          {step === 'submarca' && (
            <>
              <button onClick={() => setStep('estampa')} style={{ width: '100%', padding: '13px', background: 'none', color: '#888', border: '1px solid #e0e0e0', borderRadius: '30px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                Próximo: Estampa →
              </button>
              <button onClick={() => setStep('logo')} style={{ width: '100%', padding: '13px', background: 'none', color: '#bbb', border: 'none', borderRadius: '30px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                ← Voltar para a logo
              </button>
            </>
          )}
          {step === 'estampa' && (
            <button onClick={() => setStep('submarca')} style={{ width: '100%', padding: '13px', background: 'none', color: '#bbb', border: 'none', borderRadius: '30px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
              ← Voltar para a submarca
            </button>
          )}
        </div>

      </div>
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

  return <EntregaContent brand={brand} />;
}

export default function Sucesso() {
  return (
    <Suspense>
      <SucessoContent />
    </Suspense>
  );
}
