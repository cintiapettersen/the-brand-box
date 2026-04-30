import React from 'react';

const ConsultationTable = ({ color, rows = 9 }) => {
  const headers = ["DATA", "IG (DUM)", "IG (USG)", "PESO", "PRESSÃO", "BCF", "MB", "PESO FETAL"];
  
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0' }}>
      <div style={{ display: 'flex' }}>
        {headers.map((h, i) => (
          <div key={i} style={{ 
            flex: i === 0 ? '1.2' : '1', 
            background: color, 
            color: '#fff', 
            fontSize: '3.5px', 
            fontWeight: 800, 
            padding: '2.5px 1px', 
            textAlign: 'center', 
            borderRight: '0.1px solid #fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {h}
          </div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex', borderBottom: '0.2px solid #ccc' }}>
          {headers.map((_, colIndex) => (
            <div key={colIndex} style={{ 
              flex: colIndex === 0 ? '1.2' : '1', 
              height: '10px', 
              borderRight: '0.2px solid #ccc',
              background: colIndex === 0 ? `${color}10` : 'transparent'
            }} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default function PrenatalPage3({ accentColor, palette = [] }) {
  const mainColor = palette[0] || accentColor;
  const secondaryColor = palette[1] || '#72A9D1';
  const tertiaryColor = palette[2] || '#E6C673';

  return (
    <div style={{ width: '100%', height: '100%', padding: '10px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: "'Montserrat', sans-serif", background: '#fff' }}>
      <ConsultationTable color={secondaryColor} rows={6} />
      <ConsultationTable color="#E67E7E" rows={6} />
    </div>
  );
}
