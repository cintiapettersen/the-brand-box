import React from 'react';

// 148px wide component, 8px padding each side = 132px disponível
// Larguras em px que somam exatamente 132px
const COLS = [
  { label: 'DATA',       w: 20 },
  { label: 'IG (DUM)',   w: 16 },
  { label: 'IG (USG)',   w: 16 },
  { label: 'PESO',       w: 15 },
  { label: 'PRESSÃO',    w: 23 },
  { label: 'BCF',        w: 14 },
  { label: 'MB',         w: 14 },
  { label: 'PESO FETAL', w: 14 },
]; // total = 132px

const B = '0.2px solid'; // espessura uniforme

const ConsultationTable = ({ color, rows = 7 }) => (
  <table style={{ width: '132px', borderCollapse: 'collapse', tableLayout: 'fixed', border: `${B} #ccc` }}>
    <thead>
      <tr>
        {COLS.map((c, i) => (
          <th key={i} style={{
            width: c.w,
            background: color,
            color: '#fff',
            fontSize: '3px',
            fontWeight: 800,
            padding: '2px 0',
            textAlign: 'center',
            borderLeft: `${B} rgba(255,255,255,0.4)`,
            lineHeight: 1.2,
          }}>{c.label}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r}>
          {COLS.map((c, ci) => (
            <td key={ci} style={{
              width: c.w,
              height: '10px',
              borderTop: `${B} #ddd`,
              borderLeft: `${B} #ddd`,
              background: ci === 0 ? `${color}14` : 'transparent',
            }} />
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default function PrenatalPage3({ accentColor, palette = [] }) {
  const mainColor = palette[0] || accentColor;
  const secondaryColor = palette[1] || '#72A9D1';

  return (
    <div style={{ width: '100%', height: '100%', padding: '4px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: "'Montserrat', sans-serif", background: '#fff' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}><ConsultationTable color={secondaryColor} rows={8} /></div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}><ConsultationTable color={mainColor} rows={8} /></div>
    </div>
  );
}
