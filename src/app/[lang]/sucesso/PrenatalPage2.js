import React from 'react';

const Field = ({ label, flex = 1, border = true }) => (
  <div style={{ flex, display: 'flex', alignItems: 'center', gap: '4px', borderBottom: border ? '0.5px solid #ccc' : 'none', padding: '2px 0' }}>
    <span style={{ fontSize: '3.5px', fontWeight: 800, color: '#333', whiteSpace: 'nowrap' }}>{label}:</span>
    <div style={{ flex: 1, height: '6px' }} />
  </div>
);

const Checkbox = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
    <span style={{ fontSize: '3.5px', color: '#444' }}>{label}</span>
    <div style={{ width: '4px', height: '4px', border: '0.5px solid #333' }} />
  </div>
);

const USGSection = ({ title, count, mainColor }) => (
  <div style={{ marginBottom: '1px' }}>
    <div style={{ fontSize: '4.5px', fontWeight: 900, color: '#111', textTransform: 'uppercase', marginBottom: '0.5px' }}>{title}</div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5px' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
          <div style={{ flex: 1, background: '#f5f5f5', height: '4px', display: 'flex', alignItems: 'center', padding: '0 2px' }}>
             <span style={{ fontSize: '2.5px', color: '#999' }}>___/___/___</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default function PrenatalPage2({ accentColor, palette = [] }) {
  const mainColor = palette[0] || accentColor;
  const secondaryColor = palette[1] || '#72A9D1';
  const tertiaryColor = palette[2] || '#E6C673';

  return (
    <div style={{ width: '100%', height: '100%', padding: '4px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '3px', fontFamily: "'Montserrat', sans-serif", background: '#fff' }}>
      
      {/* Personal Info Box */}
      <div style={{ border: '0.8px solid #333', padding: '4px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <Field label="NOME" />
        <div style={{ display: 'flex', gap: '6px' }}>
          <Field label="D UM" />
          <Field label="DPP" />
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '3.5px', fontWeight: 800 }}>GESTA:</span>
          <div style={{ width: '15px', borderBottom: '0.5px solid #ccc' }} />
          <Checkbox label="NORMAL" />
          <Checkbox label="CESÁREA" />
          <Checkbox label="ABORTO" />
        </div>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <span style={{ fontSize: '3.5px', fontWeight: 800 }}>DOENÇAS MATERNAS:</span>
          <Checkbox label="DIABETES" />
          <Checkbox label="HIPERTENSÃO" />
          <Field label="OUTROS" />
        </div>
        <Field label="MEDICAMENTOS EM USO" />
        <Field label="INTERCORRÊNCIAS DURANTE A GESTAÇÃO" />
        <div style={{ display: 'flex', gap: '6px' }}>
          <Field label="DENTISTA" />
          <Field label="CORTICOIDE IG" />
        </div>
      </div>

      {/* Vaccines Section */}
      <div style={{ background: tertiaryColor, borderRadius: '2px', padding: '4px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <div style={{ fontSize: '5px', fontWeight: 900, color: '#fff', textTransform: 'uppercase' }}>VACINAS</div>
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
          <div style={{ fontSize: '3.5px', color: '#fff', fontWeight: 600 }}>COVID: _________________</div>
          <div style={{ fontSize: '3.5px', color: '#fff', fontWeight: 600 }}>INFLUENZA: ______________</div>
          <div style={{ fontSize: '3.5px', color: '#fff', fontWeight: 600 }}>DTPa: _________________</div>
          <div style={{ fontSize: '3.5px', color: '#fff', fontWeight: 600 }}>HEP B: __________________</div>
        </div>
      </div>

      {/* USG Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        <USGSection title="USG OBSTÉTRICA SIMPLES" count={4} mainColor={mainColor} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <USGSection title="USG MORFOLÓGICA" count={2} mainColor={mainColor} />
          <USGSection title="DOPPLER FETAL" count={2} mainColor={mainColor} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <USGSection title="ECO FETAL" count={2} mainColor={mainColor} />
          <USGSection title="ARTERIAS UTERINAS" count={2} mainColor={mainColor} />
        </div>
      </div>

    </div>
  );
}
