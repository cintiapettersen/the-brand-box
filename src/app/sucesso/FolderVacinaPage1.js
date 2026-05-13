import React from 'react';

export default function FolderVacinaPage1({ accentColor, palette = [], logoComponent, pdfMode = false }) {
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
      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: pdfMode ? '10px 8px 24px' : '4px 8px 6px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo no topo */}
        <div style={{ width: '100%', maxHeight: '70px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'visible' }}>
          {logoComponent}
        </div>

        {/* Título no meio */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '7px', fontWeight: 400, color: '#888', letterSpacing: '2px', textTransform: 'uppercase' }}>Guia de</div>
          <div style={{ fontSize: '16px', fontWeight: 900, color: '#1a1a1a', letterSpacing: '0.8px', textTransform: 'uppercase', lineHeight: 1 }}>VACINA</div>
        </div>

        {/* Etiqueta única */}
        <div style={{ width: '82%', marginBottom: '4px', background: `${mainColor}10`, borderRadius: '8px', padding: '5px 8px', border: `0.5px solid ${mainColor}25`, display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '5.5px', fontWeight: 700, color: mainColor, letterSpacing: '0.6px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Nome</span>
            <div style={{ flex: 1, borderBottom: `0.4px solid ${mainColor}35`, height: '6px' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span style={{ fontSize: '5.5px', fontWeight: 700, color: mainColor, letterSpacing: '0.6px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Nasc.</span>
            <div style={{ flex: 1, borderBottom: `0.4px solid ${mainColor}35`, height: '6px' }} />
            <span style={{ fontSize: '5px', color: `${mainColor}50` }}>/</span>
            <div style={{ width: '9px', borderBottom: `0.4px solid ${mainColor}35`, height: '6px' }} />
            <span style={{ fontSize: '5px', color: `${mainColor}50` }}>/</span>
            <div style={{ width: '9px', borderBottom: `0.4px solid ${mainColor}35`, height: '6px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
