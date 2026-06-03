import React from 'react';

export default function FolderSonoPage3({ accentColor, palette = [] }) {
  const c0 = palette[0] || accentColor;
  const c1 = palette[1] || accentColor;
  const c2 = palette[2] || c0;
  const c3 = palette[3] || c1;

  const habitos = [
    { title: 'Diferencie dia e noite', text: 'Ambiente claro e agitado de dia; escuro, silencioso e calmo à noite.' },
    { title: 'Rotina antes de dormir', text: 'Banho → mamada → música suave → berço. Consistência é tudo!' },
    { title: 'Rituais sensoriais', text: 'Canção de ninar, shushing (shhh), ninadas suaves criam âncoras de sono.' },
    { title: 'Janela de sono', text: 'Respeite o tempo acordado ideal. Bebês até 3m: 45–90 min entre cochilos.' },
    { title: 'Evite associações', text: 'Não associe sono ao colo ou mamada toda vez. Coloque sonolento, não dormindo.' },
    { title: 'Sem telas à noite', text: 'Luz azul inibe melatonina. Desligue TVs e celulares 1h antes de dormir.' },
  ];

  const seguranca = [
    { ok: true,  text: 'Berço firme, colchão rígido e sem buracos' },
    { ok: true,  text: 'Bebê de barriga para cima (decúbito dorsal)' },
    { ok: true,  text: 'Ambiente livre de fumaça' },
    { ok: false, text: 'Sem travesseiros, almofadas ou cobertores fofos' },
    { ok: false, text: 'Sem objetos ou pelúcias no berço' },
    { ok: false, text: 'Sem sofás ou camas de adultos sem supervisão' },
  ];

  const colors = [c0, c1, c2, c3, c0, c1];

  return (
    <div style={{
      width: '100%', height: '210px',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Montserrat', sans-serif",
      boxSizing: 'border-box',
      padding: '5px 5px 3px',
      gap: '0',
      justifyContent: 'space-between',
      background: '#fff',
      overflow: 'hidden'
    }}>

      {/* SEÇÃO: Bons Hábitos */}
      <div style={{ flex: '0 0 auto' }}>
        <div style={{ fontSize: '5px', fontWeight: 900, color: c0, textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '2px' }}>
          ✨ Como Criar Bons Hábitos
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2px' }}>
          {habitos.map((h, i) => (
            <div key={i} style={{
              padding: '1.5px 3px',
              borderRadius: '1.5px',
              borderLeft: `1.5px solid ${colors[i]}`,
              background: colors[i] + '0d',
            }}>
              <div style={{ fontSize: '3px', fontWeight: 800, color: colors[i], lineHeight: 1, marginBottom: '0.3px' }}>{h.title}</div>
              <div style={{ fontSize: '2.6px', color: '#666', lineHeight: 1.2 }}>{h.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Divisor */}
      <div style={{ height: '0.4px', background: c1 + '40', margin: '1px 0' }} />

      {/* SEÇÃO: Segurança */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', marginTop: '3px' }}>
        <div style={{ fontSize: '5px', fontWeight: 900, color: c1, textTransform: 'uppercase', letterSpacing: '0.3px', marginBottom: '0.5px' }}>
          🛡️ Segurança no Sono
        </div>
        <div style={{ fontSize: '2.5px', color: '#888', marginBottom: '5px', fontStyle: 'italic' }}>
          Ambiente seguro reduz o risco de morte súbita (SMSL)
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: '5px' }}>
          {seguranca.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '2px',
              padding: '0.6px 2.5px', borderRadius: '1.5px',
              background: s.ok ? c0 + '0d' : '#fff3f3',
              border: `0.2px solid ${s.ok ? c0 + '30' : '#ffbbbb'}`
            }}>
              <div style={{
                width: '5.5px', height: '5.5px', borderRadius: '50%', flexShrink: 0,
                background: s.ok ? c0 : '#ff5555',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <span style={{ fontSize: '3.5px', color: '#fff', lineHeight: 1 }}>{s.ok ? '✓' : '✕'}</span>
              </div>
              <span style={{ fontSize: '2.6px', color: s.ok ? '#444' : '#c00', lineHeight: 1.1, fontWeight: s.ok ? 500 : 700 }}>{s.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
