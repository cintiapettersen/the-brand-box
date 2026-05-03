'use client';
import React, { useState } from 'react';
import { BordaToggle } from './page';

const SIZES = [
  { label: '49,8 × 72,5 cm', w: 49.8, h: 72.5, scale: 4.2 },
  { label: 'A4 — 21 × 29,7 cm', w: 21,   h: 29.7, scale: 7.2 },
  { label: '72,8 × 104,3 cm', w: 72.8, h: 104.3, scale: 2.9 },
];

export default function PapelPresentePreview({
  accentColor, paletteColors = [], comBorda, setComBorda,
  patternSrc, patternScale, setPatternScale, borderColor, setBorderColor,
  sizeIdx, setSizeIdx,
}) {
  const [sizeIdxLocal, setSizeIdxLocal] = useState(1); // A4 default
  const idx = sizeIdx ?? sizeIdxLocal;
  const setIdx = setSizeIdx ?? setSizeIdxLocal;

  const solidColor = borderColor || accentColor;
  const size = SIZES[idx];
  const W = Math.round(size.w * size.scale);
  const H = Math.round(size.h * size.scale);
  const bgSize = Math.round((patternScale || 150) * size.scale / 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', width: '100%', padding: '20px 0' }}>

      {/* Seletor de tamanho */}
      <div style={{ display: 'flex', gap: '8px', background: '#f0f0f0', borderRadius: '20px', padding: '4px' }}>
        {SIZES.map((s, i) => (
          <button key={i} onClick={() => setIdx(i)} style={{ padding: '6px 14px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontSize: '11px', fontWeight: 700, background: idx === i ? solidColor : 'transparent', color: idx === i ? '#fff' : '#888', transition: 'all 0.2s' }}>
            {s.label}
          </button>
        ))}
      </div>

      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />

      {/* Arte flat */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '10px', fontWeight: 800, color: '#999', textTransform: 'uppercase', fontFamily: 'Montserrat,sans-serif' }}>Arte ({size.label})</span>
        <div style={{
          width: W, height: H,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 6px 28px rgba(0,0,0,0.14)',
          borderRadius: 3,
          flexShrink: 0,
        }}>
          {comBorda && patternSrc
            ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${bgSize}px`, backgroundRepeat: 'repeat' }} />
            : <div style={{ position: 'absolute', inset: 0, background: solidColor }} />
          }
        </div>
        <div style={{ fontSize: '11px', color: '#aaa', fontFamily: 'Montserrat,sans-serif', fontWeight: 600 }}>
          {size.w} × {size.h} cm · Papel couché leve
        </div>
      </div>
    </div>
  );
}
