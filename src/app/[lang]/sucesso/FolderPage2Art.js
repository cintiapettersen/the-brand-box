'use client';
import React from 'react';
import { useTranslation } from '../../LanguageContext';

const textColor = (hex) => { const h = (hex || '#000').replace('#',''); const r = parseInt(h.substr(0,2),16); const g = parseInt(h.substr(2,2),16); const b = parseInt(h.substr(4,2),16); return (0.299*r+0.587*g+0.114*b)/255 > 0.6 ? '#333' : '#fff'; };

const Card = ({ title, color, items, twoCol = false }) => (
  <div style={{ background: '#fff', border: `0.5px solid ${color}40`, borderRadius: '3px', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
    <div style={{ background: color, padding: '1.5px 3px' }}>
      <span style={{ fontSize: '3.5px', fontWeight: 900, color: textColor(color), textTransform: 'uppercase', letterSpacing: '0.2px', fontFamily: 'Montserrat,sans-serif', whiteSpace: 'nowrap' }}>{title}</span>
    </div>
    <div style={{ padding: '1.8px 3px', flex: 1, ...(twoCol ? { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5px 4px' } : { display: 'flex', flexDirection: 'column', gap: '1.5px' }) }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '2px', alignItems: 'flex-start', textAlign: 'left' }}>
          <span style={{ fontSize: '3px', color: color, flexShrink: 0, fontWeight: 900, fontFamily: 'Montserrat,sans-serif' }}>›</span>
          <span style={{ fontSize: '2.8px', color: '#444', lineHeight: 1.2, fontFamily: 'Montserrat,sans-serif', textAlign: 'left' }}>{item}</span>
        </div>
      ))}
    </div>
  </div>
);

export default function FolderPage2Art({ accentColor, palette = [] }) {
  const { lang } = useTranslation();
  const c0 = palette[0] || accentColor;
  const c1 = palette[1] || c0;
  const c2 = palette[2] || c0;
  const c3 = palette[3] || c1;

  const faixas = lang === 'en' ? [
    { faixa: 'Up to 6 months', tipo: 'Exclusive breast milk' },
    { faixa: '6 to 12 months', tipo: 'Breast milk + Complementary feeding' },
    { faixa: '1 to 3 years', tipo: 'Family foods' },
    { faixa: '3 to 6 years', tipo: 'Family food consistency' },
  ] : [
    { faixa: 'Até 6 meses', tipo: 'Leite materno exclusivo' },
    { faixa: '6 a 12 meses', tipo: 'Leite materno + Introdução alimentar' },
    { faixa: '1 ao 3 anos', tipo: 'Alimentos da família' },
    { faixa: '3° ao 6° ano', tipo: 'Consistência da família' },
  ];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Montserrat,sans-serif', boxSizing: 'border-box', padding: '3px 5px 4px', gap: '2.5px', background: '#f8f8f8', overflow: 'hidden' }}>

      {/* Banner título */}
      <div style={{ background: c0, borderRadius: '3px', padding: '0.8px 3px', textAlign: 'center', flexShrink: 0 }}>
        <div style={{ fontSize: '4.1px', fontWeight: 900, color: textColor(c0), textTransform: 'uppercase', letterSpacing: '0.4px', fontFamily: 'Montserrat,sans-serif' }}>
          {lang === 'en' ? 'Complementary Feeding' : 'Alimentação Complementar'}
        </div>
        <div style={{ fontSize: '2.7px', color: textColor(c0), opacity: 0.85, marginTop: '0.5px', fontStyle: 'italic' }}>
          {lang === 'en' ? 'Slowly and gradually, respecting the child\'s pace' : 'De forma lenta e gradual, respeitando a vontade da criança'}
        </div>
      </div>

      {/* Tabela FAIXA ETÁRIA */}
      <div style={{ background: '#fff', border: `0.5px solid ${c0}40`, borderRadius: '3px', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ background: c0, padding: '1px 3px', display: 'flex' }}>
          <span style={{ flex: 1, fontSize: '3px', fontWeight: 900, color: textColor(c0), textTransform: 'uppercase', fontFamily: 'Montserrat,sans-serif' }}>
            {lang === 'en' ? 'Age Group' : 'Faixa Etária'}
          </span>
          <span style={{ flex: 1.6, fontSize: '3px', fontWeight: 900, color: textColor(c0), textTransform: 'uppercase', fontFamily: 'Montserrat,sans-serif' }}>
            {lang === 'en' ? 'Food Type' : 'Tipo de Alimento'}
          </span>
        </div>
        {faixas.map((row, i) => (
          <div key={i} style={{ display: 'flex', background: i % 2 === 0 ? '#fff' : c0 + '12', borderTop: `0.2px solid ${c0}25` }}>
            <div style={{ flex: 1, padding: '1px 3px', fontSize: '3px', fontWeight: 700, color: c0, lineHeight: 1.2, fontFamily: 'Montserrat,sans-serif' }}>{row.faixa}</div>
            <div style={{ flex: 1.6, padding: '1px 3px', fontSize: '3px', color: '#555', lineHeight: 1.2, fontFamily: 'Montserrat,sans-serif' }}>{row.tipo}</div>
          </div>
        ))}
      </div>

      {/* Linha superior: Na refeição + A partir de 6 meses */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px', flexShrink: 0, height: '72px' }}>
        <Card color={c1} title={lang === 'en' ? 'During the meal' : 'Na refeição'} items={lang === 'en' ? [
          'Mashed foods, not blended.',
          'Encourage interaction with food.',
          'Respect signs of fullness.',
          'Do not force — eating autonomy.',
          'Pureed consistency until 12 months.',
        ] : [
          'Alimentos amassados, não liquidificados.',
          'Estimular a interação com a comida.',
          'Respeitar sinais de saciedade.',
          'Não forçar — autonomia alimentar.',
          'Consistência pastosa até os 12 meses.',
        ]} />
        <Card color={c3} title={lang === 'en' ? 'From 6 months' : 'A partir de 6 meses'} items={lang === 'en' ? [
          'Start with 2–3 spoons, increase gradually.',
          'Cereals, tubers, legumes, and meats.',
          'Vegetables: vary colors at every meal.',
          'Filtered water after 6 months.',
          'Do not replace breast milk.',
          'Fruits as dessert, not as a meal.',
        ] : [
          'Iniciar com 2–3 colheres, aumentar gradual.',
          'Cereais, tubérculos, leguminosas e carnes.',
          'Hortaliças: variar as cores a cada refeição.',
          'Água filtrada após os 6 meses.',
          'Não substituir o leite materno.',
          'Frutas como sobremesa, não como refeição.',
        ]} />
      </div>

      {/* Linha inferior: IMPORTANTES largura total, 2 colunas de bullets */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <Card color={c2} title={lang === 'en' ? 'Important Notes' : 'Importantes'} twoCol items={lang === 'en' ? [
          'No salt in the 1st year of life.',
          'No sugar before 2 years.',
          'Honey: prohibited before 1 year (botulism).',
          'Citrus fruits post-meal: iron absorption.',
          'Avoid ultra-processed foods.',
          'Cow\'s milk: avoid before 1 year.',
        ] : [
          'Sem sal no 1° ano de vida.',
          'Sem açúcar antes dos 2 anos.',
          'Mel: proibido antes de 1 ano (botulismo).',
          'Frutas cítricas pós-refeição: absorção de ferro.',
          'Evitar alimentos ultraprocessados.',
          'Leite de vaca: evitar antes de 1 ano.',
        ]} />
      </div>
    </div>
  );
}
