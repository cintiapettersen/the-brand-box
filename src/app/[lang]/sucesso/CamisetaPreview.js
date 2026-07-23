'use client';
// Inline pattern tile helper to avoid circular import from page.js
// tilePx = (scale * 0.25mm) * (previewPx / itemMm)
const _tilePx = (scale, previewPx, itemMm) => Math.round((parseFloat(scale) || 120) * 0.25 * (previewPx / itemMm));

import React from 'react';
import { useScaleToFit } from './useScaleToFit';
import BrandTemplateSVG from '../../../components/BrandTemplateSVG';
import { useTranslation } from '../../LanguageContext';

// BordaToggle local (Estampa vs Sólida + Slider)
function BordaToggle({ comBorda, setComBorda, accentColor, paletteColors = [], borderColor, setBorderColor, patternScale, setPatternScale, patternOffset, setPatternOffset, showLogo, setShowLogo }) {
  const { dictionary } = useTranslation();
  const btn = (active) => ({
    padding: '6px 16px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
    cursor: 'pointer', border: 'none',
    background: active ? accentColor : '#eee', color: active ? '#fff' : '#888',
    transition: 'all 0.2s ease'
  });
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', padding: '10px', background: '#fcfcfc', borderRadius: '30px', border: '1px solid #f0f0f0' }}>
      <div style={{ display: 'flex', gap: '4px' }}>
        <button style={btn(comBorda)} onClick={() => setComBorda(true)}>{dictionary?.geral?.estampa || 'Estampa'}</button>
        <button style={btn(!comBorda)} onClick={() => setComBorda(false)}>{dictionary?.geral?.solida || 'Sólida'}</button>
      </div>

      {comBorda && setPatternScale && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px solid #eee', paddingLeft: '12px', marginLeft: '4px' }}>
            <span style={{ fontSize: '0.62rem', color: '#999', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>{dictionary?.geral?.tamanho || 'Tamanho:'}</span>
            <input 
              type="range" min="50" max="1500" step="10"
              value={patternScale || 120} 
              onChange={(e) => setPatternScale(parseInt(e.target.value))}
              style={{ width: '80px', height: '4px', cursor: 'pointer', accentColor: accentColor }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderLeft: '1px solid #eee', paddingLeft: '12px', marginLeft: '4px' }}>
             <label style={{ fontSize: '0.65rem', color: '#666', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
               <input 
                 type="checkbox" 
                 checked={showLogo} 
                 onChange={(e) => setShowLogo(e.target.checked)} 
                 style={{ accentColor: accentColor, cursor: 'pointer' }}
               />
               {dictionary?.nav?.submarca || 'Selo'}
             </label>
          </div>
          
        </>
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

// Selo redondo
function SeloCamiseta({ editData, solidColor, size, hasCustomLogo, scaleFactor, submarcaColor, submarcaTextColor, iconPath }) {
  if (!hasCustomLogo) {
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

  const customScale = scaleFactor * (editData?.customLogoScale ? editData.customLogoScale / 100 : 1);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: 'rgba(255,255,255,0.92)', padding: '8px 12px', borderRadius: '4px', maxWidth: '100%' }}>
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

export default function CamisetaPreview({
  accentColor, paletteColors = [], editData, logoColor, logoLayout,
  cartaoContacts, crmLine, clinicaNome, comBorda, setComBorda,
  patternSrc, patternScale, setPatternScale, patternOffset, setPatternOffset, borderColor, setBorderColor,
  submarcaColor, submarcaTextColor, iconPath
}) {
  const solidColor = borderColor || accentColor;
  const hasCustomLogo = !!editData?.customLogoSrc;
  const [showLogo, setShowLogo] = React.useState(false);

  // Preview Area Dimensions
  const PREVIEW_W = 400;
  const PREVIEW_H = 450;
  const scalePreview = useScaleToFit(PREVIEW_W, PREVIEW_H + 36);

  // Tamanho do selo (reduzido para caber no peito)
  const SELO_SIZE = 65;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', width: '100%', padding: '20px 0' }}>

      <BordaToggle 
        comBorda={comBorda} 
        setComBorda={setComBorda} 
        accentColor={accentColor} 
        paletteColors={paletteColors} 
        borderColor={borderColor} 
        setBorderColor={setBorderColor} 
        patternScale={patternScale} 
        setPatternScale={setPatternScale} 
        patternOffset={patternOffset} 
        setPatternOffset={setPatternOffset} 
        showLogo={showLogo}
        setShowLogo={setShowLogo}
      />

      {/* Mockup Realista com Blend Modes */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
        <div ref={scalePreview.wrapperRef} style={scalePreview.wrapperStyle}>
          <div style={scalePreview.innerStyle}>
            <div style={{ 
              position: 'relative', 
              width: PREVIEW_W, 
              height: PREVIEW_H, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.15))'
            }}>
              
              <div style={{
                position: 'absolute',
                inset: 0,
                WebkitMaskImage: 'url(/mockups/tshirt-mockup.png)',
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskImage: 'url(/mockups/tshirt-mockup.png)',
                maskSize: 'contain',
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
              }}>
                {/* 1. Fundo da camiseta (Estampa ou Cor Lisa) */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: solidColor,
                  backgroundImage: (comBorda && patternSrc) ? `url(${patternSrc})` : 'none',
                  backgroundPosition: `${patternOffset || 0}% center`,
                  backgroundSize: `${_tilePx(patternScale, 320, 300)}px`,
                  backgroundRepeat: 'repeat'
                }} />
                
                {/* 2. Sombras realistas (Multiply) */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'url(/mockups/tshirt-mockup.png)',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  mixBlendMode: 'multiply',
                  opacity: 0.70
                }} />

                {/* 3. Brilhos/Luzes (Screen) para tecidos mais claros brilharem */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'url(/mockups/tshirt-mockup.png)',
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  mixBlendMode: 'screen',
                  opacity: 0.15
                }} />
              </div>

              {/* Selo Redondo Overlay (Posicionado no peito) */}
              {showLogo && (
                <div style={{
                  position: 'absolute',
                  top: '36%',
                  left: '66%',
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: 10,
                  filter: 'drop-shadow(0px 2px 6px rgba(0,0,0,0.08))'
                }}>
                  <SeloCamiseta
                    editData={editData}
                    solidColor={solidColor}
                    size={SELO_SIZE}
                    hasCustomLogo={hasCustomLogo}
                    scaleFactor={0.5}
                    submarcaColor={submarcaColor}
                    submarcaTextColor={submarcaTextColor}
                    iconPath={iconPath}
                  />
                </div>
              )}

            </div>
          </div>
        </div>
        <div style={{ fontSize: '11px', color: '#999', fontFamily: 'Montserrat,sans-serif', fontWeight: 600 }}>
          Preview: T-Shirt
        </div>
      </div>

    </div>
  );
}
