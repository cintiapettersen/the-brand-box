import React from 'react';

const textColor = (hex) => { const h = (hex || '#000').replace('#',''); const r = parseInt(h.substr(0,2),16); const g = parseInt(h.substr(2,2),16); const b = parseInt(h.substr(4,2),16); return (0.299*r+0.587*g+0.114*b)/255 > 0.6 ? '#333' : '#fff'; };

const dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'];
const semanas = [1, 2, 3, 4];
const alimentos = ['Cereal/Tubérculo', 'Proteína', 'Leguminosa', 'Hortaliça', 'Fruta'];

export default function FolderPage6Etiqueta({ accentColor = '#D8AD3A', palette = [] }) {
  const c1 = palette[0] || accentColor;
  const c2 = palette[1] || c1;
  const c3 = palette[2] || c2;

  return (
    <div style={{ width: '85%', height: 'auto', position: 'relative', margin: '0 auto', fontFamily: 'Montserrat,sans-serif' }}>

      {/* Header */}
      <div style={{ background: c1, borderRadius: '4px 4px 0 0', padding: '4px 8px', textAlign: 'center' }}>
        <div style={{ fontSize: '6px', fontWeight: 900, color: textColor(c1), textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Cardápio Semanal
        </div>
        <div style={{ fontSize: '4px', color: textColor(c1), opacity: 0.85, marginTop: '1px' }}>
          Introdução Alimentar
        </div>
      </div>

      {/* Tabela de alimentos por semana */}
      <div style={{ background: '#fff', border: `0.5px solid ${c1}40`, overflow: 'hidden' }}>
        {/* Header dias */}
        <div style={{ display: 'flex', background: c2, borderBottom: `0.5px solid ${c1}40` }}>
          <div style={{ width: '28%', padding: '2px 3px', fontSize: '3px', fontWeight: 900, color: textColor(c2), textTransform: 'uppercase' }}>Alimento</div>
          {dias.map(d => (
            <div key={d} style={{ flex: 1, padding: '2px 1px', fontSize: '3px', fontWeight: 900, color: textColor(c2), textAlign: 'center', textTransform: 'uppercase' }}>{d}</div>
          ))}
        </div>

        {/* Linhas de alimentos */}
        {alimentos.map((al, i) => (
          <div key={i} style={{ display: 'flex', borderBottom: `0.3px solid ${c1}25`, background: i % 2 === 0 ? '#fff' : c1 + '0C' }}>
            <div style={{ width: '28%', padding: '2.5px 3px', fontSize: '2.8px', fontWeight: 700, color: c1, lineHeight: 1.2 }}>{al}</div>
            {dias.map(d => (
              <div key={d} style={{ flex: 1, borderLeft: `0.3px solid ${c1}20` }} />
            ))}
          </div>
        ))}
      </div>

      {/* Semana indicator */}
      <div style={{ background: c3, padding: '3px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '3.5px', fontWeight: 900, color: textColor(c3), textTransform: 'uppercase' }}>Semana:</span>
        <div style={{ display: 'flex', gap: '3px' }}>
          {semanas.map(s => (
            <div key={s} style={{ width: '10px', height: '10px', borderRadius: '50%', background: textColor(c3) === '#fff' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '4px', fontWeight: 900, color: textColor(c3) }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Observações */}
      <div style={{ background: '#fff', border: `0.5px solid ${c1}40`, borderTop: 'none', padding: '3px 6px', borderRadius: '0 0 4px 4px' }}>
        <div style={{ fontSize: '3px', fontWeight: 900, color: c1, textTransform: 'uppercase', marginBottom: '1.5px', letterSpacing: '0.3px' }}>Observações:</div>
        {['', '', ''].map((_, i) => (
          <div key={i} style={{ height: '6px', borderBottom: `0.4px solid ${c1}25`, marginBottom: '1px' }} />
        ))}
      </div>
    </div>
  );
}
