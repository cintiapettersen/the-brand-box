'use client';
import React from 'react';
import { useTranslation } from '../../LanguageContext';

export default function PrenatalPage1({ accentColor, palette = [], logoComponent, folderRoof = true, tagline, comBorda, patternSrc, patternScale, borderColor }) {
  const { lang } = useTranslation();
  const mainColor = palette[0] || accentColor;
  const secondaryColor = palette[1] || '#72A9D1';
  const defaultTagline = lang === 'en' ? 'Follow-up and Care during Pregnancy' : 'Acompanhamento e Cuidado na Gestação';
  const displayTagline = tagline || defaultTagline;
  const _borderColor = borderColor || mainColor;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: !comBorda ? _borderColor : 'transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0',
      boxSizing: 'border-box',
      fontFamily: "'Montserrat', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern logic for Cover */}
      {comBorda && patternSrc && (
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${(patternScale || 120) * 0.35}px`, backgroundRepeat: 'repeat', opacity: 1 }} />
      )}
      {comBorda && !patternSrc && (
        <div style={{ position: 'absolute', inset: 0, background: `${_borderColor}15` }} />
      )}

      {/* Inner White Box with Casinha Roof */}
      <div style={{ 
        position: 'absolute', 
        top: '10px', 
        left: '10px', 
        right: '10px', 
        bottom: '10px', 
        background: '#fff', 
        borderRadius: '2px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
        zIndex: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'flex-start', 
        paddingTop: '32px', 
        textAlign: 'center', 
        border: `0.5px solid ${accentColor}15`, 
        clipPath: folderRoof ? 'polygon(0% 12%, 50% 0%, 100% 12%, 100% 100%, 0% 100%)' : 'none', 
        transition: 'clip-path 0.3s ease' 
      }}>
        
        {/* Logo Area */}
        <div style={{ width: '120px', height: '40px', marginBottom: '25px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {logoComponent}
        </div>

        {/* Separator Line */}
        <div style={{ width: '22px', height: '1.2px', background: accentColor, marginBottom: '14px', borderRadius: '10px' }} />

        {/* Title Area */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px', marginBottom: '4px' }}>
          <div style={{ 
            fontSize: '5.2px', 
            fontWeight: 800, 
            color: `${accentColor}cc`, 
            textTransform: 'uppercase', 
            letterSpacing: '0.6px', 
            fontStyle: 'italic',
            fontFamily: "'Montserrat', sans-serif"
          }}>
            {lang === 'en' ? "CARD FOR" : "CARTÃO DE"}
          </div>
          <div style={{ 
            fontSize: '9.2px', 
            fontWeight: 800, 
            color: '#333', 
            textTransform: 'uppercase', 
            letterSpacing: '0.8px', 
            lineHeight: 1.2 
          }}>
            {lang === 'en' ? "PRENATAL EXAM" : "EXAME PRÉ-NATAL"}
          </div>
        </div>

        {/* Tagline Area (Standardized) - Closer now */}
        <div style={{ 
          marginTop: '3px',
          padding: '2px 8px',
          background: (palette[0] || accentColor) + '20',
          borderRadius: '20px',
          border: `0.5px solid ${(palette[0] || accentColor) + '40'}`,
          maxWidth: '82%',
          overflow: 'hidden'
        }}>
          <div style={{ 
            fontSize: '4.5px',
            fontWeight: 800,
            color: palette[0] || accentColor,
            letterSpacing: '0.3px',
            fontFamily: "'Montserrat', sans-serif",
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            lineHeight: 1.1
          }}>
            {displayTagline}
          </div>
        </div>

        {/* Spacer to push graphic down */}
        <div style={{ flex: 1 }} />
      </div>
    </div>
  );
}
