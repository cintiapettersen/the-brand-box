'use client';
import React, { useState } from 'react';
import { LogoPreviewHTML, BordaToggle } from './page';
import { useScaleToFit } from './useScaleToFit';
import { useTranslation } from '../../LanguageContext';

const SIZES = [
  { label: '4,8 × 4,8 cm', w: 4.8, h: 4.8, shape: 'square', scale: 36 },
  { label: '9 × 4,8 cm', w: 9, h: 4.8, shape: 'rect', scale: 28 },
  { label: '6 × 6 cm', w: 6, h: 6, shape: 'circle', scale: 30 },
];

function TagCard({ size, solidColor, c0, c1, paletteColors, effectiveSrc, patternScale, editData, logoColor, logoLayout, clinicaNome, cartaoContacts, crmLine, side }) {
  const W = Math.round(size.w * size.scale);
  const H = Math.round(size.h * size.scale);
  const isCircle = size.shape === 'circle';
  const holeSize = Math.round(size.scale * 0.28);

  const containerStyle = {
    width: W, height: H,
    position: 'relative',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    overflow: 'hidden',
    flexShrink: 0,
    borderRadius: isCircle ? '50%' : 6,
  };

  const bgStyle = effectiveSrc
    ? { position: 'absolute', inset: 0, backgroundImage: `url(${effectiveSrc})`, backgroundSize: `${(patternScale || 100) * size.scale / 35}px`, backgroundRepeat: 'repeat' }
    : { position: 'absolute', inset: 0, background: solidColor };

  if (side === 'frente') {
    return (
      <div style={containerStyle}>
        <div style={bgStyle} />
        {(() => {
          const isRect = size.shape === 'rect';
          const boxDim = Math.round(Math.min(W, H) * (isCircle ? 0.74 : isRect ? 0.65 : 0.78));
          const boxW = isRect ? Math.round(W * 0.72) : boxDim;
          const boxH = isRect ? Math.round(H * 0.65) : boxDim;
          return (
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: effectiveSrc ? 'rgba(255,255,255,0.95)' : 'transparent',
              padding: effectiveSrc ? '8px' : '0',
              borderRadius: isCircle ? '50%' : '4px',
              width: `${boxW}px`, height: `${boxH}px`,
              maxWidth: `${boxW}px`, maxHeight: `${boxH}px`, overflow: 'hidden',
              boxSizing: 'border-box',
            }}>
              <div style={{
                display: 'flex', width: '100%', height: '100%',
                alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
              }}>
                <LogoPreviewHTML item="Tag para Sacola" editData={editData}
                  color={effectiveSrc ? solidColor : '#ffffff'}
                  layout={logoLayout} scaleFactor={isCircle ? 0.75 : isRect ? 0.68 : 0.78}
                  hideTagline={false} withBackground={false}
                  taglineColor={effectiveSrc ? undefined : 'rgba(255,255,255,0.75)'}
                  maxWidth="100%" maxHeight="100%" />
              </div>
            </div>
          );
        })()}
      </div>
    );
  }

  // Verso
  return (
    <div style={{ ...containerStyle, background: '#fff', border: `6px solid ${solidColor}` }}>
      {(() => {
        const fs = Math.round(Math.min(W, H) * 0.075);
        const fsSmall = Math.round(fs * 0.72);
        const whatsapp = cartaoContacts?.whatsapp || '';
        const telefone = cartaoContacts?.telefone || '';
        const telefone2 = cartaoContacts?.telefone2 || '';
        const email = cartaoContacts?.email || '';
        const endereco = cartaoContacts?.endereco || '';
        const instagram = cartaoContacts?.instagram || '';
        const site = cartaoContacts?.site || '';
        
        const logoFont = editData?.fontFamily || 'Montserrat';

        return <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: Math.round(fs * 0.35), overflow: 'hidden', maxHeight: '85%', textAlign: 'center' }}>
          {clinicaNome && <div style={{ fontSize: fs, fontWeight: 600, color: solidColor, fontFamily: `'${logoFont}', sans-serif`, textAlign: 'center', lineHeight: 1.3 }}>{clinicaNome}</div>}
          <div style={{ width: 24, height: 0.5, background: `${solidColor}60` }} />
          {whatsapp && <div style={{ fontSize: fsSmall, fontWeight: 400, color: '#888', fontFamily: 'Montserrat,sans-serif', letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>{whatsapp}</div>}
          {(telefone || telefone2) && <div style={{ fontSize: Math.round(fsSmall * 0.8), fontWeight: 400, color: '#999', fontFamily: 'Montserrat,sans-serif', letterSpacing: '0.3px', whiteSpace: 'nowrap', marginTop: '2px' }}>{[telefone, telefone2].filter(Boolean).join(' · ')}</div>}
          {instagram && <div style={{ fontSize: fsSmall, fontWeight: 400, color: '#888', fontFamily: 'Montserrat,sans-serif', letterSpacing: '0.3px', whiteSpace: 'nowrap' }}>@{instagram.replace('@','')}</div>}
          {email && <div style={{ fontSize: Math.round(fsSmall * 0.85), fontWeight: 400, color: '#888', fontFamily: 'Montserrat,sans-serif', letterSpacing: '0.2px', wordBreak: 'break-all' }}>{email}</div>}
          {site && <div style={{ fontSize: Math.round(fsSmall * 0.85), fontWeight: 400, color: '#bbb', fontFamily: 'Montserrat,sans-serif', letterSpacing: '0.3px', wordBreak: 'break-all' }}>{site}</div>}
          {endereco && <div style={{ fontSize: Math.round(fsSmall * 0.75), fontWeight: 400, color: '#aaa', fontFamily: 'Montserrat,sans-serif', letterSpacing: '0.2px', marginTop: '2px', lineHeight: 1.2 }}>{endereco}</div>}
        </div>;
      })()}
    </div>
  );
}

export default function TagSacolaPreview({
  accentColor, paletteColors = [], editData, logoColor, logoLayout,
  cartaoContacts, crmLine, clinicaNome, comBorda, setComBorda,
  patternSrc, patternScale, setPatternScale, borderColor, setBorderColor,
  sizeIdx: sizeIdxProp, setSizeIdx: setSizeIdxProp,
}) {
  const { dictionary, lang } = useTranslation();
  const [sizeIdxLocal, setSizeIdxLocal] = useState(0);
  const sizeIdx = sizeIdxProp ?? sizeIdxLocal;
  const setSizeIdx = setSizeIdxProp ?? setSizeIdxLocal;
  const solidColor = borderColor || accentColor;
  const c0 = paletteColors[0] || solidColor;
  const c1 = paletteColors[1] || solidColor;
  const effectiveSrc = comBorda ? patternSrc : null;
  const size = SIZES[sizeIdx];

  const W = Math.round(size.w * size.scale);
  const H = Math.round(size.h * size.scale);
  // Two cards side by side with 40px gap
  const totalW = W * 2 + 40;
  const scaleCards = useScaleToFit(totalW, H + 32 + 24);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', width: '100%', padding: '20px 0' }}>

      {/* Seletor de formato */}
      <div style={{ display: 'flex', gap: '8px', background: '#f0f0f0', borderRadius: '20px', padding: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {SIZES.map((s, i) => (
          <button key={i} onClick={() => setSizeIdx(i)} style={{ padding: '6px 14px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontSize: '11px', fontWeight: 700, background: sizeIdx === i ? solidColor : 'transparent', color: sizeIdx === i ? '#fff' : '#888', transition: 'all 0.2s' }}>
            {s.label}
          </button>
        ))}
      </div>

      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />

      {/* Frente e Verso lado a lado — escalado */}
      <div ref={scaleCards.wrapperRef} style={scaleCards.wrapperStyle}>
        <div style={scaleCards.innerStyle}>
          <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#999', textTransform: 'uppercase' }}>{dictionary?.geral?.frente || 'Frente'}</span>
              <TagCard size={size} solidColor={solidColor} c0={c0} c1={c1} paletteColors={paletteColors} effectiveSrc={effectiveSrc} patternScale={patternScale} editData={editData} logoColor={logoColor} logoLayout={logoLayout} clinicaNome={clinicaNome} cartaoContacts={cartaoContacts} crmLine={crmLine} side="frente" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: 800, color: '#999', textTransform: 'uppercase' }}>{dictionary?.geral?.verso || 'Verso'}</span>
              <TagCard size={size} solidColor={solidColor} c0={c0} c1={c1} paletteColors={paletteColors} effectiveSrc={effectiveSrc} patternScale={patternScale} editData={editData} logoColor={logoColor} logoLayout={logoLayout} clinicaNome={clinicaNome} cartaoContacts={cartaoContacts} crmLine={crmLine} side="verso" />
            </div>
          </div>
        </div>
      </div>

      <div style={{ fontSize: '11px', color: '#999', fontFamily: 'Montserrat,sans-serif', fontWeight: 600 }}>
        {size.label} · {lang === 'en' ? (size.shape === 'circle' ? 'Round' : size.shape === 'square' ? 'Square' : 'Rectangular') : (size.shape === 'circle' ? 'Redondo' : size.shape === 'square' ? 'Quadrado' : 'Retangular')}
      </div>
    </div>
  );
}
