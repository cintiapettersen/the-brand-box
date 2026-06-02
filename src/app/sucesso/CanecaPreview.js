'use client';
import React from 'react';
import { useScaleToFit } from './useScaleToFit';
import BrandTemplateSVG from '../../components/BrandTemplateSVG';

// Caneca padrão 325ml — wrap sublimação: 20 × 8,5 cm
const WRAP_W_CM = 20;
const WRAP_H_CM = 8.5;
const WRAP_SCALE = 22; // px/cm para exibição flat

// Tamanho base do círculo logo
const CIRCLE_BASE = 74;
const CIRCLE_FLAT = 92; // px
// scaleFactor base — o customLogoScale do slider vai multiplicar por cima
const LOGO_SF_BASE   = 0.36;  // fundo sólido (sem círculo)
const LOGO_SF_F_BASE = 0.44;  // fundo sólido — arte flat

// BordaToggle local para evitar dependência circular com o arquivo page.js
function BordaToggle({ comBorda, setComBorda, accentColor, paletteColors = [], borderColor, setBorderColor, patternScale, setPatternScale }) {
  const btn = (active) => ({
    padding: '6px 16px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
    cursor: 'pointer', border: 'none',
    background: active ? accentColor : '#eee', color: active ? '#fff' : '#888',
    transition: 'all 0.2s ease'
  });
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', padding: '10px', background: '#fcfcfc', borderRadius: '30px', border: '1px solid #f0f0f0' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        <button style={btn(comBorda)} onClick={() => setComBorda(true)}>Estampa</button>
        <button style={btn(!comBorda)} onClick={() => setComBorda(false)}>Sólida</button>
      </div>

      {comBorda && setPatternScale && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px solid #eee', paddingLeft: '12px', marginLeft: '4px' }}>
          <span style={{ fontSize: '0.62rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Tamanho:</span>
          <input 
            type="range" min="50" max="600" step="10"
            value={patternScale || 120} 
            onChange={(e) => setPatternScale(parseInt(e.target.value))}
            style={{ width: '80px', height: '4px', cursor: 'pointer', accentColor: accentColor }}
          />
        </div>
      )}

      {!comBorda && paletteColors?.length > 0 && (
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center', marginLeft: '4px', borderLeft: '1px solid #eee', paddingLeft: '12px' }}>
          {paletteColors.map((hex, i) => {
            const isSelected = (borderColor || accentColor) === hex;
            return (
              <div
                key={i}
                onClick={() => setBorderColor?.(hex)}
                style={{
                  width: '14px', height: '14px', borderRadius: '50%', background: hex,
                  cursor: 'pointer', flexShrink: 0, transition: 'transform 0.15s',
                  transform: isSelected ? 'scale(1.25)' : 'scale(1)',
                  boxShadow: isSelected ? `0 0 0 2px #fff, 0 0 0 3.5px ${hex}` : '0 0 0 1px rgba(0,0,0,0.1)',
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// LogoBg: círculo exato atrás da logo (omitido quando logo customizada)
function LogoBg({ children, solidColor, size = 80, hideCircle = false }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: size, minHeight: size }}>
      {!hideCircle && (
        <div style={{ position: 'absolute', width: size, height: size, background: `${solidColor}d0`, borderRadius: '50%' }} />
      )}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>{children}</div>
    </div>
  );
}

// SeloCaneca: usa BrandTemplateSVG (o selo redondo já pronto) quando há estampa
// Para logo customizada, cai de volta para renderizador local de logo customizada
function SeloCaneca({ editData, solidColor, size, usePattern, hasCustomLogo, logoLayout, scaleFactor, submarcaColor, submarcaTextColor, iconPath }) {
  if (!hasCustomLogo) {
    // Monta o seloData igual à página principal
    const seloData = editData?.fontStyle === 'script'
      ? { ...editData, fontFamily: 'Montserrat', fontWeight: 700, fontStyle: 'display' }
      : { ...editData };

    return (
      <div style={{
        width: size, height: size,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <BrandTemplateSVG
          data={seloData}
          color={submarcaColor || solidColor}
          textColor={submarcaTextColor || '#ffffff'}
          side="verso"
          hideBackground={true}
          iconPath={iconPath || null}
        />
      </div>
    );
  }

  // Logo customizada: renderização direta e limpa sem dependência circular
  const customScale = scaleFactor * (editData?.customLogoScale ? editData.customLogoScale / 100 : 1);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: hasCustomLogo ? 'rgba(255,255,255,0.92)' : 'transparent', padding: hasCustomLogo ? '8px 12px' : '0', borderRadius: '4px', maxWidth: '100%' }}>
      <img
        src={editData.customLogoSrc}
        alt="Logo"
        style={{
          maxWidth: `${size * customScale * 2.2}px`,
          maxHeight: `${size * customScale * 1.6}px`,
          objectFit: 'contain'
        }}
      />
    </div>
  );
}

function CanecaPreviewComponent({
  accentColor, paletteColors = [], editData, logoColor, logoLayout,
  cartaoContacts, crmLine, clinicaNome, comBorda, setComBorda,
  patternSrc, patternScale, setPatternScale, borderColor, setBorderColor,
  submarcaColor, submarcaTextColor, iconPath
}) {
  const solidColor = borderColor || accentColor;
  const usePattern = comBorda && patternSrc;
  const hasCustomLogo = !!editData?.customLogoSrc;

  const FONT_SCALE_MAP = {
    'LittleFriend': 0.80, 'GoldenBlast': 0.80, 'Cafigine': 0.80,
    'Amelie': 0.82, 'Cinzel': 0.82, 'Releawy': 0.82,
  };
  const fontScaleMult = FONT_SCALE_MAP[editData?.fontFamily] ?? 1.0;
  const LOGO_SF = LOGO_SF_BASE * fontScaleMult;
  const LOGO_SF_F = LOGO_SF_F_BASE * fontScaleMult;

  // Dimensões do mockup
  const MW = 500;
  const MH = 283;

  const artLeft   = Math.round(364  * (MW / 1190));
  const artTop    = Math.round(107  * (MH / 611));
  const artWidth  = Math.round((694 - 364) * (MW / 1190));
  const artHeight = Math.round((487 - 107) * (MH / 611));

  const WRAP_W = WRAP_W_CM * WRAP_SCALE;
  const WRAP_H = WRAP_H_CM * WRAP_SCALE;

  // Responsive scale hooks
  const scaleMockup = useScaleToFit(MW + 32, MH + 48 + 36);
  const scaleWrap   = useScaleToFit(WRAP_W, WRAP_H + 36);

  // Tamanho do selo/círculo no mockup e na arte flat
  const SELO_SIZE_MOCKUP = CIRCLE_BASE;
  const SELO_SIZE_FLAT   = CIRCLE_FLAT;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', width: '100%', padding: '20px 0' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />

      {/* Mockup */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
        <span style={{ fontSize: '10px', fontWeight: 800, color: '#999', textTransform: 'uppercase', fontFamily: 'Montserrat,sans-serif' }}>Mockup</span>

        <div ref={scaleMockup.wrapperRef} style={scaleMockup.wrapperStyle}>
          <div style={scaleMockup.innerStyle}>
            <div style={{ background: '#f5f5f5', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ position: 'relative', width: MW, height: MH }}>

                {/* 1. Arte fica em baixo */}
                <div style={{
                  position: 'absolute',
                  left: artLeft,
                  top: artTop,
                  width: artWidth,
                  height: artHeight,
                  borderRadius: '3px',
                  overflow: 'hidden',
                  zIndex: 1,
                }}>
                  {usePattern
                    ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${(patternScale || 150) * 0.65}px`, backgroundRepeat: 'repeat' }} />
                    : <div style={{ position: 'absolute', inset: 0, background: solidColor }} />
                  }
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SeloCaneca
                      editData={editData}
                      solidColor={solidColor}
                      size={SELO_SIZE_MOCKUP}
                      usePattern={usePattern}
                      hasCustomLogo={hasCustomLogo}
                      logoLayout={logoLayout}
                      scaleFactor={LOGO_SF}
                      submarcaColor={submarcaColor}
                      submarcaTextColor={submarcaTextColor}
                      iconPath={iconPath}
                    />
                  </div>
                </div>

                {/* 2. PNG da caneca por cima */}
                <img
                  src="/caneca.png"
                  alt="Caneca"
                  style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    objectFit: 'contain',
                    zIndex: 2,
                    mixBlendMode: 'multiply',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ fontSize: '11px', color: '#999', fontFamily: 'Montserrat,sans-serif', fontWeight: 600 }}>Caneca 325ml · Sublimação</div>
      </div>

      {/* Arte flat para gráfica */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
        <span style={{ fontSize: '10px', fontWeight: 800, color: '#999', textTransform: 'uppercase', fontFamily: 'Montserrat,sans-serif' }}>Arte para Sublimação ({WRAP_W_CM} × {WRAP_H_CM} cm)</span>
        <div ref={scaleWrap.wrapperRef} style={scaleWrap.wrapperStyle}>
          <div style={scaleWrap.innerStyle}>
            <div style={{
              width: WRAP_W,
              height: WRAP_H,
              position: 'relative',
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              border: '0.5px solid #eee',
            }}>
              {usePattern
                ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${(patternScale || 150) * 0.75}px`, backgroundRepeat: 'repeat' }} />
                : <div style={{ position: 'absolute', inset: 0, background: solidColor }} />
              }
              {/* Selos repetidos 2× — frente e verso do wrap */}
              {['25%', '75%'].map(left => (
                <div key={left} style={{ position: 'absolute', top: '50%', left, transform: 'translate(-50%, -50%)', textAlign: 'center', width: `${Math.round(WRAP_W * 0.44)}px`, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <SeloCaneca
                    editData={editData}
                    solidColor={solidColor}
                    size={SELO_SIZE_FLAT}
                    usePattern={usePattern}
                    hasCustomLogo={hasCustomLogo}
                    logoLayout={logoLayout}
                    scaleFactor={LOGO_SF_F}
                    submarcaColor={submarcaColor}
                    submarcaTextColor={submarcaTextColor}
                    iconPath={iconPath}
                  />
                </div>
              ))}
              {/* Linha divisória central e marcas de sangria */}
              <div style={{ position: 'absolute', top: '10%', bottom: '10%', left: '50%', width: '0.5px', background: 'rgba(255,255,255,0.2)' }} />
              <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '3px', background: 'rgba(255,255,255,0.3)' }} />
              <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '3px', background: 'rgba(255,255,255,0.3)' }} />
            </div>
          </div>
        </div>
        <div style={{ fontSize: '10px', color: '#aaa', fontFamily: 'Montserrat,sans-serif' }}>Faixas laterais = área de sobreposição do wrap</div>
      </div>
    </div>
  );
}

class CanecaErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Erro no CanecaPreview:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '24px', background: '#fff0f0', border: '1.5px solid #ffcccc', borderRadius: '16px', color: '#cc0000', fontFamily: 'monospace', fontSize: '0.85rem', width: '100%', maxWidth: '500px', margin: '20px auto', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', textAlign: 'left', boxSizing: 'border-box' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>⚠️ Erro ao carregar o Preview da Caneca</h4>
          <p style={{ margin: '0 0 12px 0', fontWeight: 600, lineHeight: 1.4 }}>{this.state.error?.toString()}</p>
          <p style={{ margin: '0 0 8px 0', fontSize: '0.78rem', color: '#666', fontWeight: 'bold' }}>Pilha de Execução (Stack Trace):</p>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', fontSize: '0.72rem', background: '#fff', border: '1px solid #ffdddd', padding: '10px', borderRadius: '8px', overflowX: 'auto', maxH: '200px', opacity: 0.9, color: '#444' }}>
            {this.state.error?.stack}
          </pre>
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button 
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{ padding: '8px 16px', background: '#cc0000', color: '#fff', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem', fontFamily: 'Montserrat, sans-serif' }}
            >
              Tentar novamente
            </button>
            <button 
              onClick={() => window.location.reload()}
              style={{ padding: '8px 16px', background: '#eee', color: '#333', border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 700, fontSize: '0.75rem', fontFamily: 'Montserrat, sans-serif' }}
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function CanecaPreview(props) {
  return (
    <CanecaErrorBoundary>
      <CanecaPreviewComponent {...props} />
    </CanecaErrorBoundary>
  );
}
