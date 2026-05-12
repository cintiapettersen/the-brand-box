import React from 'react';

export default function FolderVacinaPage1({ accentColor, palette = [], logoComponent }) {
  const mainColor = palette[0] || accentColor;
  
  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      padding: '0', 
      display: 'flex', 
      flexDirection: 'column', 
      fontFamily: "'Montserrat', sans-serif", 
      boxSizing: 'border-box',
      background: '#fff',
      position: 'relative'
    }}>
      {/* Top decorative pattern/background */}
      <div style={{ 
        height: '35%', 
        width: '100%', 
        background: `${mainColor}20`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Placeholder for the pattern or logo if needed */}
      </div>

      {/* Main Content */}
      <div style={{ 
        flex: 1, 
        padding: '10mm 5mm', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <div style={{ width: '100%', minHeight: '30px', maxHeight: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px', overflow: 'visible' }}>
          {logoComponent}
        </div>

        <div style={{ textAlign: 'center', marginTop: '5px' }}>
          <div style={{ 
            fontSize: '8px', 
            fontWeight: 400, 
            color: '#666', 
            letterSpacing: '1.5px', 
            textTransform: 'uppercase' 
          }}>
            Guia de
          </div>
          <div style={{ 
            fontSize: '18px', 
            fontWeight: 900, 
            color: '#1a1a1a', 
            letterSpacing: '0.8px', 
            textTransform: 'uppercase',
            lineHeight: 1
          }}>
            VACINA
          </div>
        </div>

        <div style={{ width: '88%', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {/* Etiqueta NOME */}
          <div style={{ background: `${mainColor}12`, borderRadius: '20px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '5px', border: `0.5px solid ${mainColor}25` }}>
            <span style={{ fontSize: '6px', fontWeight: 700, color: mainColor, letterSpacing: '0.8px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Nome</span>
            <div style={{ flex: 1, borderBottom: `0.4px solid ${mainColor}30`, height: '7px' }} />
          </div>
          {/* Etiqueta NASCIMENTO */}
          <div style={{ background: `${mainColor}12`, borderRadius: '20px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '5px', border: `0.5px solid ${mainColor}25` }}>
            <span style={{ fontSize: '6px', fontWeight: 700, color: mainColor, letterSpacing: '0.8px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Nasc.</span>
            <div style={{ flex: 1, borderBottom: `0.4px solid ${mainColor}30`, height: '7px' }} />
            <span style={{ fontSize: '6px', color: `${mainColor}60` }}>/</span>
            <div style={{ width: '10px', borderBottom: `0.4px solid ${mainColor}30`, height: '7px' }} />
            <span style={{ fontSize: '6px', color: `${mainColor}60` }}>/</span>
            <div style={{ width: '10px', borderBottom: `0.4px solid ${mainColor}30`, height: '7px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
