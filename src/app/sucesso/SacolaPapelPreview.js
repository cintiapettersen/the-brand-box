'use client';
import React, { useState } from 'react';
import { LogoPreviewHTML, BordaToggle } from './page';

const SIZES = [
  { label: 'P — 18×25×9,5 cm', w: 18, h: 25, p: 9.5 },
  { label: 'M — 24×31×10 cm',  w: 24, h: 31, p: 10 },
  { label: 'G — 30×40×13 cm',  w: 30, h: 40, p: 13 },
];

export default function SacolaPapelPreview({
  accentColor, paletteColors = [], editData, logoColor, logoLayout,
  cartaoContacts, crmLine, clinicaNome, comBorda, setComBorda,
  patternSrc, patternScale, setPatternScale, borderColor, setBorderColor
}) {
  const [sizeIdx, setSizeIdx] = useState(0);
  const solidColor = borderColor || accentColor;
  const c0 = paletteColors[0] || solidColor;
  const size = SIZES[sizeIdx];

  // Área da frente da sacola no mockup (posição aproximada em %)
  // viewBox: 1210.526 x 685.802 — frente da sacola ocupa de ~30% a ~75% horizontalmente
  const MOCKUP_W = 520;
  const MOCKUP_H = 294;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', width: '100%', padding: '20px 0' }}>

      {/* Seletor de tamanho */}
      <div style={{ display: 'flex', gap: '8px', background: '#f0f0f0', borderRadius: '20px', padding: '4px' }}>
        {SIZES.map((s, i) => (
          <button key={i} onClick={() => setSizeIdx(i)} style={{ padding: '6px 14px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontSize: '11px', fontWeight: 700, background: sizeIdx === i ? solidColor : 'transparent', color: sizeIdx === i ? '#fff' : '#888', transition: 'all 0.2s' }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Mockup */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div style={{ position: 'relative', width: MOCKUP_W, height: MOCKUP_H }}>

          {/* Imagem base da sacola */}
          <img src="/sacola-papel.svg" alt="Sacola de Papel" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: 8 }} />

          {/* Logo centralizada na frente da sacola */}
          <div style={{
            position: 'absolute',
            top: '58%', left: '50%',
            transform: 'translate(-50%, -50%) rotate(-5deg)',
            width: '36%',
          }}>
            <LogoPreviewHTML editData={editData} color="#ffffff" layout={logoLayout} scaleFactor={0.38} hideTagline={false} withBackground={comBorda && !!patternSrc} />
          </div>
        </div>

        {/* Info de tamanho */}
        <div style={{ fontSize: '11px', color: '#999', fontFamily: 'Montserrat,sans-serif', fontWeight: 600 }}>
          Frente: {size.w} cm × {size.h} cm · Profundidade: {size.p} cm
        </div>
      </div>

      {/* Preview flat da frente (arte para gráfica) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '10px', fontWeight: 800, color: '#999', textTransform: 'uppercase' }}>Arte Flat (Frente)</span>
        <div style={{
          width: Math.round(size.w * 7),
          height: Math.round(size.h * 7),
          position: 'relative',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          border: '0.5px solid #eee',
        }}>
          {/* Fundo estampa ou cor */}
          {comBorda && patternSrc
            ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${patternScale * 0.3}px`, backgroundRepeat: 'repeat' }} />
            : <div style={{ position: 'absolute', inset: 0, background: solidColor }} />
          }
          {/* Logo proporcional ao tamanho da sacola */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '60%' }}>
            <LogoPreviewHTML editData={editData} color={comBorda ? logoColor : '#fff'} layout={logoLayout} scaleFactor={size.w * 0.018} hideTagline={false} withBackground={comBorda && !!patternSrc} />
          </div>
        </div>
      </div>

    </div>
  );
}
