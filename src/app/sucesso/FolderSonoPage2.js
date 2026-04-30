import React from 'react';

export default function FolderSonoPage2({ accentColor, palette = [] }) {
  const c0 = palette[0] || accentColor;
  const c1 = palette[1] || accentColor;
  const c2 = palette[2] || c0;

  const sleepData = [
    { faixa: 'Recém-Nascido', horas: '16–22h', cochilos: 'Incluídos', icon: '🌙' },
    { faixa: '4–12 meses',    horas: '12–16h', cochilos: 'Incluídos', icon: '⭐' },
    { faixa: '1–2 anos',      horas: '11–14h', cochilos: 'Incluídos', icon: '⭐' },
    { faixa: '3–5 anos',      horas: '10–13h', cochilos: 'Incluídos', icon: '☀️' },
    { faixa: '6–12 anos',     horas: '9–12h',  cochilos: '—',         icon: '☀️' },
    { faixa: '13–18 anos',    horas: '8–10h',  cochilos: '—',         icon: '☀️' },
  ];

  const sinais = [
    { icon: '👀', text: 'Olhos vermelhos ou coçando' },
    { icon: '🥱', text: 'Bocejo frequente' },
    { icon: '😢', text: 'Choro sem motivo aparente' },
    { icon: '👂', text: 'Puxa orelha ou cabelo' },
    { icon: '🫥', text: 'Olhar fixo e desatento' },
    { icon: '😤', text: 'Agitação e irritabilidade' },
  ];

  return (
    <div style={{
      width: '100%', height: '210px',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Montserrat', sans-serif",
      boxSizing: 'border-box',
      padding: '5px 5px 3px',
      gap: '3px',
      background: '#fff',
      overflow: 'hidden'
    }}>

      {/* SEÇÃO: Médias de Sono */}
      <div style={{ flex: '0 0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '1px' }}>
          <span style={{ fontSize: '7px' }}>🌙</span>
          <div style={{ fontSize: '5px', fontWeight: 900, color: c0, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
            Médias de Sono por Idade
          </div>
        </div>
        <div style={{ fontSize: '2.8px', color: '#888', marginBottom: '2px', fontStyle: 'italic', paddingLeft: '2px' }}>
          Necessidades médias — cada criança é única. Observe os sinais!
        </div>

        <div style={{ border: `0.3px solid ${c0}35`, borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', background: c0, padding: '1.2px 3px' }}>
            <div style={{ flex: 2, fontSize: '3px', fontWeight: 800, color: '#fff', letterSpacing: '0.3px' }}>FAIXA ETÁRIA</div>
            <div style={{ flex: 1.2, fontSize: '3px', fontWeight: 800, color: '#fff', textAlign: 'center' }}>SONO TOTAL</div>
            <div style={{ flex: 1.2, fontSize: '3px', fontWeight: 800, color: '#fff', textAlign: 'center' }}>COCHILOS</div>
          </div>
          {sleepData.map((row, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center',
              padding: '1.5px 3px',
              background: i % 2 === 0 ? '#fff' : c0 + '12',
              borderTop: `0.2px solid ${c0}25`
            }}>
              <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '1.5px' }}>
                <span style={{ fontSize: '4.5px' }}>{row.icon}</span>
                <span style={{ fontSize: '3px', fontWeight: 700, color: '#444', lineHeight: 1 }}>{row.faixa}</span>
              </div>
              <div style={{ flex: 1.2, fontSize: '3.5px', fontWeight: 800, color: c0, textAlign: 'center' }}>{row.horas}</div>
              <div style={{ flex: 1.2, fontSize: '2.8px', color: '#888', textAlign: 'center' }}>{row.cochilos}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Divisor */}
      <div style={{ height: '0.4px', background: c1 + '40' }} />

      {/* SEÇÃO: Sinais de Sono */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginBottom: '1px' }}>
          <span style={{ fontSize: '7px' }}>😴</span>
          <div style={{ fontSize: '5px', fontWeight: 900, color: c1, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
            Sinais de Sono
          </div>
        </div>
        <div style={{ fontSize: '2.8px', color: '#777', marginBottom: '2px', paddingLeft: '2px', lineHeight: 1.2 }}>
          Quando seu bebê dá esses sinais, inicie o ritual — não espere o choro!
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5px' }}>
          {sinais.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '2px',
              background: (i % 3 === 0 ? c0 : i % 3 === 1 ? c1 : c2) + '14',
              borderRadius: '2px', padding: '1.5px 2.5px',
              border: `0.2px solid ${(i % 3 === 0 ? c0 : i % 3 === 1 ? c1 : c2)}30`
            }}>
              <span style={{ fontSize: '5.5px', flexShrink: 0 }}>{s.icon}</span>
              <span style={{ fontSize: '2.8px', color: '#555', lineHeight: 1.2 }}>{s.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', opacity: 0.25 }}>
        {[c0, c1, c2, c0, c1, c2].map((c, i) => (
          <div key={i} style={{ width: '2px', height: '2px', borderRadius: '50%', background: c }} />
        ))}
      </div>
    </div>
  );
}
