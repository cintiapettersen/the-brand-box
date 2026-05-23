'use client';
import React from 'react';
import { LogoPreviewHTML, BordaToggle } from './page';

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

// LogoBg: círculo exato atrás da logo (omitido quando logo customizada)
function LogoBg({ children, solidColor, size = 80, hideCircle = false }) {
  // Círculo decorativo fica por baixo com tamanho fixo
  // O texto pode crescer além do círculo horizontalmente
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: size, minHeight: size }}>
      {!hideCircle && (
        <div style={{ position: 'absolute', width: size, height: size, background: `${solidColor}d0`, borderRadius: '50%' }} />
      )}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>{children}</div>
    </div>
  );
}

export default function CanecaPreview({
  accentColor, paletteColors = [], editData, logoColor, logoLayout,
  cartaoContacts, crmLine, clinicaNome, comBorda, setComBorda,
  patternSrc, patternScale, setPatternScale, borderColor, setBorderColor
}) {
  const solidColor = borderColor || accentColor;
  const usePattern = comBorda && patternSrc;
  const hasCustomLogo = !!editData?.customLogoSrc;
  // Com estampa: força 2 linhas para caber no círculo; sem estampa: usa layout livre
  const effectiveLayout = usePattern && !hasCustomLogo ? 'balanced' : (logoLayout || 'stacked');
  // Fontes que precisam de scaleFactor menor para caber bem no círculo da caneca
  const FONT_SCALE_MAP = {
    'LittleFriend': 0.80, 'GoldenBlast': 0.80, 'Cafigine': 0.80,
    'Amelie': 0.82, 'Cinzel': 0.82, 'Releawy': 0.82,
  };
  const fontScaleMult = FONT_SCALE_MAP[editData?.fontFamily] ?? 1.0;
  // Tamanho reduzido quando há círculo (padrão) ou sólido — ambos respeitam fontScaleMult
  const LOGO_SF_PATTERN = 0.25 * fontScaleMult;
  const LOGO_SF_PATTERN_F = 0.32 * fontScaleMult;
  const LOGO_SF = LOGO_SF_BASE * fontScaleMult;
  const LOGO_SF_F = LOGO_SF_F_BASE * fontScaleMult;

  // Dimensões do mockup
  const MW = 500;
  const MH = 283;

  // Área da arte calibrada pelo SVG da gráfica (viewBox 1190×611 → display 500×283)
  // Path marcado: x1=364, x2=694, y1=87, y2=487 — top ajustado +20 para não ultrapassar borda
  const artLeft   = Math.round(364  * (MW / 1190));
  const artTop    = Math.round(107  * (MH / 611));
  const artWidth  = Math.round((694 - 364) * (MW / 1190));
  const artHeight = Math.round((487 - 107) * (MH / 611));

  const WRAP_W = WRAP_W_CM * WRAP_SCALE;
  const WRAP_H = WRAP_H_CM * WRAP_SCALE;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', width: '100%', padding: '20px 0' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />

      {/* Mockup */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '10px', fontWeight: 800, color: '#999', textTransform: 'uppercase', fontFamily: 'Montserrat,sans-serif' }}>Mockup</span>

        {/* Container com fundo cinza claro para o mockup respirar */}
        <div style={{ background: '#f5f5f5', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ position: 'relative', width: MW, height: MH }}>

            {/* 1. Arte fica em baixo — normal blend */}
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
              {/* Círculo sempre visível — cor sólida no fundo sólido, solidColor no padrão */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', width: `${Math.round(artWidth * 0.88)}px`, overflow: 'hidden' }}>
                <LogoBg solidColor={solidColor} size={CIRCLE_BASE} hideCircle={!usePattern || hasCustomLogo}>
                  <LogoPreviewHTML editData={editData} color="#ffffff" layout={effectiveLayout} scaleFactor={usePattern ? LOGO_SF_PATTERN : LOGO_SF} hideTagline={true} withBackground={hasCustomLogo} />
                </LogoBg>
              </div>
            </div>

            {/* 2. PNG da caneca por cima com multiply — sombras e reflexos aparecem naturalmente */}
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

        <div style={{ fontSize: '11px', color: '#999', fontFamily: 'Montserrat,sans-serif', fontWeight: 600 }}>Caneca 325ml · Sublimação</div>
      </div>

      {/* Arte flat para gráfica */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '10px', fontWeight: 800, color: '#999', textTransform: 'uppercase', fontFamily: 'Montserrat,sans-serif' }}>Arte para Sublimação ({WRAP_W_CM} × {WRAP_H_CM} cm)</span>
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
          {/* Logo repetida 2× — frente e verso do wrap */}
          {['25%', '75%'].map(left => (
            <div key={left} style={{ position: 'absolute', top: '50%', left, transform: 'translate(-50%, -50%)', textAlign: 'center', width: `${Math.round(WRAP_W * 0.44)}px`, overflow: 'hidden' }}>
              <LogoBg solidColor={solidColor} size={CIRCLE_FLAT} hideCircle={!usePattern || hasCustomLogo}>
                <LogoPreviewHTML editData={editData} color="#ffffff" layout={effectiveLayout} scaleFactor={usePattern ? LOGO_SF_PATTERN_F : LOGO_SF_F} hideTagline={true} withBackground={hasCustomLogo} />
              </LogoBg>
            </div>
          ))}
          {/* Linha divisória central e marcas de sangria */}
          <div style={{ position: 'absolute', top: '10%', bottom: '10%', left: '50%', width: '0.5px', background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '3px', background: 'rgba(255,255,255,0.3)' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '3px', background: 'rgba(255,255,255,0.3)' }} />
        </div>
        <div style={{ fontSize: '10px', color: '#aaa', fontFamily: 'Montserrat,sans-serif' }}>Faixas laterais = área de sobreposição do wrap</div>
      </div>
    </div>
  );
}
