'use client';
import React, { useState } from 'react';
import { LogoPreviewHTML, BordaToggle } from './page';

const SIZES = [
  { label: '10 × 10 cm', w: 10, h: 10, scale: 26 },
  { label: '15 × 10 cm', w: 15, h: 10, scale: 22 },
  { label: '10 × 15 cm', w: 10, h: 15, scale: 20 },
];

const FRASES = [
  'Oba, chegou!',
  'Com muito amor e cuidado',
  'Feito especialmente pra você',
  'Sua encomenda chegou!',
];

const IgIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill={color} stroke="none"/>
  </svg>
);

const WaIcon = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export default function EtiquetaCorreiosPreview({
  accentColor, paletteColors = [], editData, logoColor, logoLayout,
  cartaoContacts, crmLine, clinicaNome, comBorda, setComBorda,
  patternSrc, patternScale, setPatternScale, borderColor, setBorderColor,
  sizeIdx: sizeIdxProp, setSizeIdx: setSizeIdxProp,
  fraseIdx: fraseIdxProp, setFraseIdx: setFraseIdxProp,
}) {
  const [sizeIdxLocal, setSizeIdxLocal] = useState(0);
  const [fraseIdxLocal, setFraseIdxLocal] = useState(0);
  const sizeIdx = sizeIdxProp ?? sizeIdxLocal;
  const setSizeIdx = setSizeIdxProp ?? setSizeIdxLocal;
  const fraseIdx = fraseIdxProp ?? fraseIdxLocal;
  const setFraseIdx = setFraseIdxProp ?? setFraseIdxLocal;

  const solidColor = borderColor || accentColor;
  const usePattern = comBorda && patternSrc;
  const size = SIZES[sizeIdx];
  const W = size.w * size.scale;
  const H = size.h * size.scale;
  const frase = FRASES[fraseIdx];

  const { instagram, telefone, whatsapp } = cartaoContacts || {};
  const mainPhone = whatsapp || telefone || '';
  const iconSz = size.scale * 0.5;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', width: '100%', padding: '20px 0' }}>

      <div style={{ display: 'flex', gap: '8px', background: '#f0f0f0', borderRadius: '20px', padding: '4px' }}>
        {SIZES.map((s, i) => (
          <button key={i} onClick={() => setSizeIdx(i)} style={{ padding: '6px 14px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontSize: '11px', fontWeight: 700, background: sizeIdx === i ? solidColor : 'transparent', color: sizeIdx === i ? '#fff' : '#888', transition: 'all 0.2s' }}>
            {s.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {FRASES.map((f, i) => (
          <button key={i} onClick={() => setFraseIdx(i)} style={{ padding: '4px 12px', borderRadius: '12px', border: `1px solid ${fraseIdx === i ? solidColor : '#ddd'}`, cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontSize: '10px', fontWeight: 600, background: fraseIdx === i ? solidColor + '15' : 'transparent', color: fraseIdx === i ? solidColor : '#999', transition: 'all 0.2s' }}>
            {f}
          </button>
        ))}
      </div>

      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: W, height: H, position: 'relative', borderRadius: 10, overflow: 'hidden', boxShadow: '0 6px 24px rgba(0,0,0,0.15)', flexShrink: 0 }}>

          {/* Fundo: estampa ou cor */}
          {usePattern
            ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${(patternScale || 120) * size.scale / 50}px`, backgroundRepeat: 'repeat' }} />
            : <div style={{ position: 'absolute', inset: 0, background: solidColor }} />
          }

          {/* Borda interna */}
          <div style={{ position: 'absolute', inset: W * 0.04, border: '1px solid rgba(255,255,255,0.45)', borderRadius: 7, pointerEvents: 'none' }} />

          {/* Card branco semitransparente atrás do conteúdo */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '82%', minHeight: '72%', background: 'rgba(255,255,255,0.82)', borderRadius: 8, padding: `${W * 0.07}px ${W * 0.06}px`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: W * 0.032, backdropFilter: 'blur(4px)' }}>

            {/* Frase */}
            <div style={{ fontSize: size.scale * 0.58, fontWeight: 800, color: solidColor, fontFamily: 'Montserrat,sans-serif', textAlign: 'center', lineHeight: 1.2 }}>
              {frase}
            </div>

            {/* Separador */}
            <div style={{ width: '30%', height: '0.5px', background: solidColor + '50' }} />

            {/* Logo */}
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <LogoPreviewHTML editData={editData} color={solidColor} layout={logoLayout} scaleFactor={size.w * 0.044} hideTagline={false} />
            </div>

            {/* Contatos com ícones */}
            {(instagram || mainPhone) && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginTop: W * 0.04 }}>
                {instagram && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <IgIcon size={iconSz} color={solidColor} />
                    <span style={{ fontSize: size.scale * 0.36, color: solidColor, fontFamily: 'Montserrat,sans-serif', fontWeight: 600 }}>@{instagram.replace('@','')}</span>
                  </div>
                )}
                {mainPhone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <WaIcon size={iconSz} color={solidColor} />
                    <span style={{ fontSize: size.scale * 0.36, color: solidColor + 'cc', fontFamily: 'Montserrat,sans-serif', fontWeight: 400 }}>{mainPhone}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div style={{ fontSize: '11px', color: '#999', fontFamily: 'Montserrat,sans-serif', fontWeight: 600 }}>{size.label} · Adesivo</div>
      </div>
    </div>
  );
}
