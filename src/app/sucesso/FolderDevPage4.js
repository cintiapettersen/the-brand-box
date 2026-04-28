import React from 'react';

export default function FolderDevPage4({ accentColor, palette = [] }) {
  const mainColor = palette[0] || accentColor;
  
  // Semanas mágicas (Saltos)
  const storms = [5, 8, 12, 19, 26, 37, 46, 55, 64, 75];
  const weeks = Array.from({ length: 84 }, (_, i) => i);

  return (
    <div style={{ padding: '8px', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: "'Montserrat', sans-serif" }}>
      <div style={{ fontSize: '10px', fontWeight: 900, color: mainColor, marginBottom: '8px', textAlign: 'center', textTransform: 'uppercase' }}>
        Salto de Desenvolvimento
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <div style={{ flex: 1, padding: '5px', background: `${mainColor}08`, borderRadius: '3px', fontSize: '4.5px', color: '#444', lineHeight: 1.3 }}>
          <strong style={{ color: mainColor }}>O QUE É?</strong><br/>
          Quando a criança aprende algo novo, adquire uma habilidade nova, ela quer treinar exaustivamente. São os chamados saltos de desenvolvimento.
        </div>
        <div style={{ flex: 1, padding: '5px', background: `${mainColor}08`, borderRadius: '3px', fontSize: '4.5px', color: '#444', lineHeight: 1.3 }}>
          <strong style={{ color: mainColor }}>O QUE ESPERAR?</strong><br/>
          Fica mais carente, precisa de mais colo, pode comer ou dormir pior. Demonstra felicidade ao final da crise.
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div style={{ fontSize: '5px', fontWeight: 800, color: mainColor, textTransform: 'uppercase' }}>Calendário de Semanas Mágicas</div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(21, 1fr)', gap: '1px', background: '#eee', padding: '1px', borderRadius: '2px' }}>
          {weeks.map(w => {
            const isStorm = storms.includes(w);
            return (
              <div key={w} style={{ 
                aspectRatio: '1', 
                background: isStorm ? mainColor : '#fff', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                position: 'relative'
              }}>
                <span style={{ fontSize: '3px', color: isStorm ? '#fff' : '#aaa', position: 'absolute', top: '1px', left: '1px' }}>{w}</span>
                {isStorm && (
                  <svg viewBox="0 0 24 24" width="4" height="4" fill="#fff"><path d="M13,2L3,14H10L8,22L18,10H11L13,2Z"/></svg>
                )}
              </div>
            );
          })}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <div style={{ width: '4px', height: '4px', background: mainColor, borderRadius: '1px' }} />
            <span style={{ fontSize: '4px', color: '#666' }}>Salto de Desenvolvimento (Tempestade)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            <div style={{ width: '4px', height: '4px', background: '#fff', border: '0.1px solid #ddd', borderRadius: '1px' }} />
            <span style={{ fontSize: '4px', color: '#666' }}>Período Estável</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 'auto', textAlign: 'center', fontSize: '3.5px', color: '#bbb' }}>
        Fonte: As Semanas Mágicas App
      </div>
    </div>
  );
}
