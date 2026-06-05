'use client';
import React, { useState } from 'react';
import { LogoPreviewHTML, BordaToggle } from './page';
import { useScaleToFit } from './useScaleToFit';
import { useTranslation } from '../../LanguageContext';

const SIZES = [
  { label: '10 × 10 cm', w: 10, h: 10, scale: 26 },
  { label: '15 × 15 cm', w: 15, h: 15, scale: 20 },
  { label: '20 × 20 cm', w: 20, h: 20, scale: 16 },
];

export default function CartaoAgradecimentoPreview({
  accentColor, paletteColors = [], editData, logoColor, logoLayout,
  cartaoContacts, crmLine, clinicaNome, comBorda, setComBorda,
  patternSrc, patternScale, setPatternScale, borderColor, setBorderColor,
  sizeIdx, setSizeIdx, msgIdx, setMsgIdx
}) {
  const { dictionary } = useTranslation();
  const MESSAGES = [
    dictionary?.cartao_agradecimento?.msg1 || 'Obrigada pela sua confiança! ✨',
    dictionary?.cartao_agradecimento?.msg2 || 'Foi um prazer te atender 🌸',
    dictionary?.cartao_agradecimento?.msg3 || 'Que bom ter você aqui! 💛',
  ];
  const solidColor = borderColor || accentColor;
  const c0 = paletteColors[0] || solidColor;
  const c1 = paletteColors[1] || solidColor;
  const effectiveSrc = comBorda ? patternSrc : null;
  const size = SIZES[sizeIdx];
  const W = size.w * size.scale;
  const H = size.h * size.scale;

  // Two cards side-by-side: 2 × W + 32px gap
  const totalW = W * 2 + 32;
  const scaleCards = useScaleToFit(totalW, H + 32 + 24); // +label+gap

  const CardFace = ({ side }) => {
    const isFront = side === 'frente';
    return (
      <div style={{ width: W, height: H, position: 'relative', boxShadow: '0 6px 24px rgba(0,0,0,0.13)', borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
        {isFront ? (
          <>
            {effectiveSrc
              ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${effectiveSrc})`, backgroundSize: `${(patternScale || 150) / 1.2}px`, backgroundRepeat: 'repeat' }} />
              : <div style={{ position: 'absolute', inset: 0, background: solidColor }} />}

            <div style={{ position: 'absolute', bottom: -W * 0.15, right: -W * 0.15, width: W * 0.6, height: W * 0.6, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
            <div style={{ position: 'absolute', top: -W * 0.1, left: -W * 0.1, width: W * 0.45, height: W * 0.45, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

            {(() => {
              const hasPattern = !!(comBorda && patternSrc);
              const logoWithBg = hasPattern || !!editData?.customLogoSrc;
              const logoColorToUse = logoWithBg ? (logoColor || solidColor) : '#fff';
              const logoFilter = logoWithBg ? 'none' : 'brightness(0) invert(1)';

              return (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '75%',
                  textAlign: 'center',
                  filter: logoFilter
                }}>
                  <LogoPreviewHTML
                    item="Cartão de Agradecimento"
                    editData={editData}
                    color={logoColorToUse}
                    layout={logoLayout}
                    scaleFactor={size.w * (editData?.customLogoSrc ? 0.14 : 0.055)}
                    hideTagline={false}
                    withBackground={logoWithBg}
                    maxWidth="100%"
                    maxHeight="100%"
                  />
                </div>
              );
            })()}

          </>
        ) : (
          <>
            <div style={{ position: 'absolute', inset: 0, background: '#fff' }} />
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: W * 0.045, background: solidColor }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: W * 0.045, background: solidColor }} />

            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: size.scale * 0.3, padding: W * 0.1 }}>
              <div style={{ fontSize: size.scale * 0.54, color: solidColor, fontFamily: 'Montserrat,sans-serif', fontWeight: 400, fontStyle: 'italic', textAlign: 'center', letterSpacing: '0.3px', maxWidth: '90%', lineHeight: 1.4 }}>
                {MESSAGES[msgIdx]}
              </div>
              {clinicaNome && clinicaNome.trim() && (
                <>
                  <div style={{ width: W * 0.12, height: 1, background: `${c0}45` }} />
                  <div style={{ fontSize: size.scale * 0.6, fontWeight: 600, color: '#333', fontFamily: 'Montserrat,sans-serif', textAlign: 'center', lineHeight: 1.4 }}>
                    {clinicaNome}
                  </div>
                  <div style={{ width: W * 0.12, height: 1, background: `${c0}45` }} />
                </>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size.scale * 0.18 }}>
                {cartaoContacts?.telefone && <div style={{ fontSize: size.scale * 0.44, color: '#999', fontFamily: 'Montserrat,sans-serif', fontWeight: 300 }}>{cartaoContacts.telefone}</div>}
                {cartaoContacts?.instagram && <div style={{ fontSize: size.scale * 0.44, color: c0, fontFamily: 'Montserrat,sans-serif', fontWeight: 400 }}>@{cartaoContacts.instagram.replace('@','')}</div>}
                {cartaoContacts?.site && <div style={{ fontSize: size.scale * 0.4, color: '#bbb', fontFamily: 'Montserrat,sans-serif', fontWeight: 300 }}>{cartaoContacts.site}</div>}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', width: '100%', padding: '20px 0' }}>

      {/* Seletor tamanho */}
      <div style={{ display: 'flex', gap: '8px', background: '#f0f0f0', borderRadius: '20px', padding: '4px' }}>
        {SIZES.map((s, i) => (
          <button key={i} onClick={() => setSizeIdx(i)} style={{ padding: '6px 14px', borderRadius: '16px', border: 'none', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontSize: '11px', fontWeight: 700, background: sizeIdx === i ? solidColor : 'transparent', color: sizeIdx === i ? '#fff' : '#888', transition: 'all 0.2s' }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Seletor de mensagem */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {MESSAGES.map((m, i) => (
          <button key={i} onClick={() => setMsgIdx(i)} style={{ padding: '4px 12px', borderRadius: '12px', border: `1px solid ${msgIdx === i ? solidColor : '#ddd'}`, cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontSize: '10px', fontWeight: 600, background: msgIdx === i ? solidColor + '15' : 'transparent', color: msgIdx === i ? solidColor : '#999', transition: 'all 0.2s' }}>
            {m}
          </button>
        ))}
      </div>

      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />

      {/* Frente e Verso — escalado */}
      <div ref={scaleCards.wrapperRef} style={scaleCards.wrapperStyle}>
        <div style={scaleCards.innerStyle}>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start', justifyContent: 'center' }}>
            {['frente', 'verso'].map(side => (
              <div key={side} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#999', textTransform: 'uppercase' }}>{side === 'frente' ? (dictionary?.geral?.frente || 'Frente') : (dictionary?.geral?.verso || 'Verso')}</span>
                <CardFace side={side} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ fontSize: '11px', color: '#999', fontFamily: 'Montserrat,sans-serif', fontWeight: 600 }}>{size.label} · {dictionary?.geral?.quadrado || 'Quadrado'}</div>
    </div>
  );
}
