'use client';
import React from 'react';

const isDarkColor = (hex) => {
  if (!hex) return false;
  const h = hex.replace('#', '');
  if (h.length < 6) return false;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
};

const horarios = [
  { label: 'CAFÉ DA MANHÃ', val: 'Leite materno ou fórmula infantil' },
  { label: 'LANCHE DA MANHÃ', val: 'Fruta / leite materno ou fórmula' },
  { label: 'ALMOÇO', val: 'Cereal ou tubérculo + proteína + leguminosa + hortaliças + fruta' },
  { label: 'LANCHE DA TARDE', val: 'Fruta / leite materno ou fórmula' },
  { label: 'JANTAR', val: 'Igual almoço' },
  { label: 'LANCHE DA NOITE', val: 'Leite materno ou fórmula infantil' },
];

const introducao = [
  { idade: 'A partir de 6 meses', text: 'Alimentos amassados', qty: 'Iniciar com 2–3 colheres e aumentar conforme aceitação' },
  { idade: 'A partir dos 7 meses', text: 'Alimentos amassados', qty: '2/3 de uma xícara de 250 ml' },
  { idade: '9 a 11 meses', text: 'Cortados ou amassados', qty: '3/4 de uma xícara de 250 ml' },
  { idade: '12 a 24 meses', text: 'Alimentos cortados', qty: 'Uma xícara ou tigela de 250 ml' },
];

export default function FolderPage4Art({ accentColor = '#D8AD3A', palette = [] }) {
  const c1 = palette[0] || accentColor;
  const c2 = palette[1] || c1;
  const c3 = palette[2] || c2;
  const c4 = palette[3] || c3;
  const c5 = palette[4] || c4;

  const leftTableLabelCol = isDarkColor(c3) ? '#FFFFFF' : '#231F20';
  const leftTableValCol = isDarkColor(c4) ? '#FFFFFF' : '#231F20';
  const col1TextCol = isDarkColor(c5) ? '#FFFFFF' : '#231F20';
  const col2TextCol = isDarkColor(c3) ? '#FFFFFF' : '#231F20';
  const col3TextCol = isDarkColor(c4) ? '#FFFFFF' : '#231F20';

  return (
    <div style={{ width: '148px', height: '210px', position: 'absolute', top: 0, left: 0, overflow: 'hidden', pointerEvents: 'none' }}>

      {/* FUNDO CSS */}
      <div style={{ position: 'absolute', inset: 0, background: '#FAFAF8' }}>
        {/* Tabela 1: linhas coloridas */}
        <div style={{ position: 'absolute', top: '11.6%', left: '7%', width: '84.9%', height: '30.3%' }}>
          {[0,1,2,3,4,5].map(i => (
            <div key={i} style={{ display: 'flex', height: '16.66%' }}>
              <div style={{ width: '33%', background: c3 }} />
              <div style={{ flex: 1, background: c4 }} />
            </div>
          ))}
        </div>
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{ position: 'absolute', top: `${11.6 + i * (30.3/6)}%`, left: '7%', width: '84.9%', height: '0.4px', background: 'rgba(255,255,255,0.4)' }} />
        ))}
        <div style={{ position: 'absolute', top: '11.6%', left: `calc(7% + 84.9% * 0.33)`, width: '0.4px', height: '30.3%', background: 'rgba(255,255,255,0.4)' }} />

        {/* Tabela 2: colunas coloridas — largura total */}
        <div style={{ position: 'absolute', top: '53.8%', left: '7%', width: '86%', bottom: '2%', display: 'flex' }}>
          <div style={{ width: '27%', background: c5 }} />
          <div style={{ width: '27%', background: c3 }} />
          <div style={{ flex: 1, background: c4 }} />
        </div>
        {[1,2,3].map(i => (
          <div key={i} style={{ position: 'absolute', top: `${53.8 + 4.7 + i * 8.7}%`, left: '7%', width: '86%', height: '0.4px', background: 'rgba(255,255,255,0.4)' }} />
        ))}
        <div style={{ position: 'absolute', top: '53.8%', left: `calc(7% + 86% * 0.27)`, width: '0.4px', bottom: '2%', background: 'rgba(255,255,255,0.4)' }} />
        <div style={{ position: 'absolute', top: '53.8%', left: `calc(7% + 86% * 0.54)`, width: '0.4px', bottom: '2%', background: 'rgba(255,255,255,0.4)' }} />
      </div>

      {/* CAMADA DE TEXTO */}
      <div style={{ position: 'absolute', inset: 0, fontFamily: 'sans-serif' }}>

        <div style={{ position: 'absolute', top: '5%', left: '7%', fontSize: '4px', fontWeight: 900, color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cardápio</div>

        <div style={{ position: 'absolute', top: '11.6%', left: '7%', width: '84.9%', height: '30.3%' }}>
          {horarios.map((item, i) => (
            <div key={i} style={{ display: 'flex', height: '16.6%', overflow: 'hidden' }}>
              <div style={{ width: '33%', display: 'flex', alignItems: 'center', paddingLeft: '4px', fontSize: '2.4px', fontWeight: 900, color: leftTableLabelCol, textTransform: 'uppercase', lineHeight: 1.1, overflow: 'hidden' }}>{item.label}</div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: i === 2 ? 'flex-start' : 'center', paddingLeft: '5px', paddingTop: i === 2 ? '2px' : '0', fontSize: '2.3px', fontWeight: 700, color: leftTableValCol, lineHeight: 1.15, overflow: 'hidden' }}>{item.val}</div>
            </div>
          ))}
        </div>

        <div style={{ position: 'absolute', top: '47.6%', left: '7%', fontSize: '4.5px', fontStyle: 'italic', fontWeight: 900, color: '#999', textTransform: 'uppercase' }}>
          Introdução Alimentar Clássica
        </div>

        <div style={{ position: 'absolute', top: '53.8%', left: '7%', width: '86%', height: '4.7%', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '27%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.4px', fontWeight: 900, color: col1TextCol, textTransform: 'uppercase', letterSpacing: '0.3px' }}>IDADE</div>
          <div style={{ width: '27%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.4px', fontWeight: 900, color: col2TextCol, textTransform: 'uppercase', letterSpacing: '0.3px' }}>TEXTURA</div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: '3px', fontSize: '2.4px', fontWeight: 900, color: col3TextCol, textTransform: 'uppercase', letterSpacing: '0.3px' }}>QUANTIDADE</div>
        </div>
        {introducao.map((item, i) => (
          <div key={i} style={{ position: 'absolute', top: `${58.7 + i * 8.7}%`, left: '7%', width: '86%', height: '8.7%', display: 'flex', overflow: 'hidden' }}>
            <div style={{ width: '27%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5px', fontWeight: 800, color: col1TextCol, textAlign: 'center', padding: '2px', lineHeight: 1.2, overflow: 'hidden' }}>{item.idade}</div>
            <div style={{ width: '27%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5px', fontWeight: 800, color: col2TextCol, textAlign: 'center', padding: '2px', lineHeight: 1.2, overflow: 'hidden' }}>{item.text}</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', paddingLeft: '4px', paddingRight: '2px', fontSize: '2.2px', fontWeight: 700, color: col3TextCol, lineHeight: 1.25, overflow: 'hidden', wordBreak: 'break-word' }}>{item.qty}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
