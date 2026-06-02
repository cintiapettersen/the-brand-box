'use client';
import React from 'react';

const isDarkColor = (hex) => {
  if (!hex) return false;
  const h = hex.replace('#', '');
  if (h.length < 6) return false;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness < 128;
};

export default function FolderPage4Dynamic({
  accentColor = '#D8AD3A',
  palette = [],
  horarios = [
    { label: 'CAFÉ DA MANHÃ', val: 'Leite materno ou fórmula infantil' },
    { label: 'LANCHE DA MANHÃ', val: 'Fruta / leite materno ou fórmula' },
    { label: 'ALMOÇO', val: 'Cereal ou tubérculo + proteína animal + leguminosa + hortaliças (verduras +legumes) + fruta' },
    { label: 'LANCHE DA TARDE', val: 'Fruta /leite materno ou fórmula' },
    { label: 'JANTAR', val: 'Igual almoço' },
    { label: 'LANCHE DA NOITE', val: 'Leite materno ou fórmula infantil' }
  ],
  introducao = [
    { idade: 'A partir de 6 meses', text: 'Alimentos amassados', qty: 'Iniciar com 2 a 3 colheres de sopa e aumentar a quantidade conforme aceitação' },
    { idade: 'A partir dos 7 meses', text: 'Alimentos amassados', qty: '2/3 de uma xícara ou tigela de 250 ml' },
    { idade: '9 a 11 meses', text: 'Alimentos cortados ou levemente amassados', qty: '3/4 de uma xícara ou tigela de 250 ml' },
    { idade: '12 a 24 meses', text: 'Alimentos cortados', qty: 'Uma xícara ou tigela de 250 ml' }
  ]
}) {
  const c1 = palette[0] || accentColor;
  const c2 = palette[1] || c1;
  const c3 = palette[2] || c2;
  const c4 = palette[3] || c3;
  const c5 = palette[4] || c4;

  const leftTableLabelCol = isDarkColor(c1) ? '#FFFFFF' : '#231F20';
  const leftTableValCol = isDarkColor(c2) ? '#FFFFFF' : '#231F20';

  const col1TextCol = isDarkColor(c3) ? '#FFFFFF' : '#231F20';
  const col2TextCol = isDarkColor(c4) ? '#FFFFFF' : '#231F20';
  const col3TextCol = isDarkColor(c5) ? '#FFFFFF' : '#231F20';

  // Table 1: top=11.6%, height=30.3%, 6 rows × 16.6%
  // Divider strip: 41.9%–53.8% (c5, where "Introdução" title sits at 47.6%)
  // Table 2: top=53.8%, 4 rows × 8.7% = 34.8% → bottom=~94%

  return (
    <div style={{ width: '148px', height: '210px', position: 'absolute', top: 0, left: 0, overflow: 'hidden', pointerEvents: 'none' }}>

      {/* 1. FUNDO CSS */}
      <div style={{ position: 'absolute', inset: 0, background: '#FAFAF8' }}>

        {/* Tabela 1: linhas coloridas (label=c1, valor=c2) */}
        <div style={{ position: 'absolute', top: '11.6%', left: '7%', width: '84.9%', height: '30.3%' }}>
          {[0,1,2,3,4,5].map(i => (
            <div key={i} style={{ display: 'flex', height: '16.66%' }}>
              <div style={{ width: '33%', background: c1 }} />
              <div style={{ flex: 1, background: c2 }} />
            </div>
          ))}
        </div>
        {/* Linhas horizontais separadoras tabela 1 */}
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{ position: 'absolute', top: `${11.6 + i * (30.3/6)}%`, left: '7%', width: '84.9%', height: '0.4px', background: isDarkColor(c2) ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.12)' }} />
        ))}
        {/* Linha vertical separando col1/col2 tabela 1 */}
        <div style={{ position: 'absolute', top: '11.6%', left: `calc(7% + 84.9% * 0.33)`, width: '0.4px', height: '30.3%', background: isDarkColor(c1) ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.12)' }} />

        {/* Tabela 2: colunas coloridas (c3 | c4 | c5) — largura total */}
        <div style={{ position: 'absolute', top: '53.8%', left: '7%', width: '86%', bottom: '2%', display: 'flex' }}>
          <div style={{ width: '27%', background: c3 }} />
          <div style={{ width: '27%', background: c4 }} />
          <div style={{ flex: 1, background: c5 }} />
        </div>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ position: 'absolute', top: `${53.8 + 4.7 + i * 8.7}%`, left: '7%', width: '86%', height: '0.4px', background: isDarkColor(c5) ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.12)' }} />
        ))}
        <div style={{ position: 'absolute', top: '53.8%', left: `calc(7% + 86% * 0.27)`, width: '0.4px', bottom: '2%', background: isDarkColor(c3) ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.12)' }} />
        <div style={{ position: 'absolute', top: '53.8%', left: `calc(7% + 86% * 0.54)`, width: '0.4px', bottom: '2%', background: isDarkColor(c4) ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.12)' }} />
      </div>

      {/* 2. CAMADA DE TEXTO (Medidas reais baseadas em % da largura 148px) */}
      <div style={{ position: 'absolute', inset: 0, fontFamily: 'sans-serif' }}>

        {/* TÍTULO TABELA 1 */}
        <div style={{ position: 'absolute', top: '5%', left: '7%', fontSize: '4px', fontWeight: 900, color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cardápio</div>

        {/* TABELA 1: HORÁRIOS — top=11.6%, height=30.3%, 6 linhas=16.6% cada, col1=33.3% */}
        <div style={{ position: 'absolute', top: '11.6%', left: '7%', width: '84.9%', height: '30.3%' }}>
          {horarios.map((item, i) => (
            <div key={i} style={{ display: 'flex', height: '16.66%', overflow: 'hidden' }}>
               <div style={{ width: '33%', display: 'flex', alignItems: 'center', paddingLeft: '4px', fontSize: '2.4px', fontWeight: 900, color: leftTableLabelCol, textTransform: 'uppercase', lineHeight: 1.1, overflow: 'hidden' }}>{item.label}</div>
               <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', textAlign: 'left', paddingLeft: '5px', paddingRight: '8px', paddingTop: '0', fontSize: '2.3px', fontWeight: 700, color: leftTableValCol, lineHeight: 1.15, overflow: 'hidden' }}>{item.val}</div>
            </div>
          ))}
        </div>

        {/* TÍTULO SEÇÃO B */}
        <div style={{ position: 'absolute', top: '47.6%', left: '7%', fontSize: '4.5px', fontStyle: 'italic', fontWeight: 900, color: '#999', textTransform: 'uppercase' }}>
          Introdução Alimentar Clássica
        </div>

        {/* TABELA 2: Header — largura total */}
        <div style={{ position: 'absolute', top: '53.8%', left: '7%', width: '86%', height: '4.7%', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '27%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.2px', fontWeight: 900, color: col1TextCol, textTransform: 'uppercase', letterSpacing: '0.3px' }}>IDADE</div>
          <div style={{ width: '27%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.2px', fontWeight: 900, color: col2TextCol, textTransform: 'uppercase', letterSpacing: '0.3px' }}>TEXTURA</div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.2px', fontWeight: 900, color: col3TextCol, textTransform: 'uppercase', letterSpacing: '0.3px' }}>QUANTIDADE</div>
        </div>
        {/* TABELA 2: Dados */}
        {introducao.map((item, i) => (
          <div key={i} style={{ position: 'absolute', top: `${58.7 + i * 8.7}%`, left: '7%', width: '86%', height: '8.7%', display: 'flex', overflow: 'hidden' }}>
            <div style={{ width: '27%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5px', fontWeight: 800, color: col1TextCol, textAlign: 'center', padding: '2px', lineHeight: 1.2, overflow: 'hidden' }}>{item.idade}</div>
            <div style={{ width: '27%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5px', fontWeight: 800, color: col2TextCol, textAlign: 'center', padding: '2px', lineHeight: 1.2, overflow: 'hidden' }}>{item.text}</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', textAlign: 'left', paddingLeft: '5px', paddingRight: '5px', fontSize: '2.2px', fontWeight: 700, color: col3TextCol, lineHeight: 1.25, overflow: 'hidden', wordBreak: 'break-word' }}>{item.qty}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
