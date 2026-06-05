'use client';
import React from 'react';
import { useTranslation } from '../../LanguageContext';

const textColor = (hex) => { const h = (hex || '#000').replace('#',''); const r = parseInt(h.substr(0,2),16); const g = parseInt(h.substr(2,2),16); const b = parseInt(h.substr(4,2),16); return (0.299*r+0.587*g+0.114*b)/255 > 0.6 ? '#333' : '#fff'; };

const Card = ({ title, color, items, style }) => (
  <div style={{ background: '#fff', border: `0.5px solid ${color}40`, borderRadius: '3px', overflow: 'hidden', ...style }}>
    <div style={{ background: color, padding: '1px 3px', textAlign: 'center' }}>
      <span style={{ fontSize: '3.5px', fontWeight: 900, color: textColor(color), textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.2px', fontFamily: 'Montserrat,sans-serif' }}>{title}</span>
    </div>
    <div style={{ padding: '2px 3px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '1.5px', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '3px', color: color, flexShrink: 0, marginTop: '0.2px', fontWeight: 900, fontFamily: 'Montserrat,sans-serif' }}>›</span>
          <span style={{ fontSize: '2.6px', color: '#444', lineHeight: 1.25, fontFamily: 'Montserrat,sans-serif', textAlign: 'left' }}>{item}</span>
        </div>
      ))}
    </div>
  </div>
);

const Tip = ({ text, color }) => (
  <div style={{ background: color + '15', border: `0.4px solid ${color}40`, borderRadius: '2px', padding: '1.5px 3px', display: 'flex', gap: '2px', alignItems: 'flex-start' }}>
    <span style={{ fontSize: '3.5px', flexShrink: 0 }}></span>
    <span style={{ fontSize: '2.5px', color: '#555', lineHeight: 1.25, fontFamily: 'Montserrat,sans-serif', fontStyle: 'italic' }}>{text}</span>
  </div>
);

export default function FolderCuidadosPage2({ accentColor, palette = [] }) {
  const { lang } = useTranslation();
  const c0 = palette[0] || accentColor;
  const c1 = palette[1] || accentColor;
  const c2 = palette[2] || c0;
  const c3 = palette[3] || c1;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', fontFamily: 'Montserrat,sans-serif', boxSizing: 'border-box', padding: '4px 5px 3px', gap: '2px', background: '#f8f8f8', overflow: 'hidden' }}>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
        <Card color={c0} title={lang === 'en' ? "Breastfeeding" : "Amamentação"} items={lang === 'en' ? [
          'On demand, no fixed schedule.',
          'Exclusive breast milk up to 6 months.',
          'Do not offer water, teas, or juices.',
          'Correct latch: mouth open, areola in, no pain.',
          'Burping after each feed.',
        ] : [
          'Livre demanda, sem horário fixo.',
          'Leite materno exclusivo até 6 meses.',
          'Não oferecer água, chás ou sucos.',
          'Pega correta: boca aberta, aréola dentro, sem dor.',
          'Eructação (arroto) após cada mamada.',
        ]} />
        <Card color={c1} title={lang === 'en' ? "Formula & Vit. D" : "Fórmula & Vit. D"} items={lang === 'en' ? [
          'Formula: only if indicated by pediatrician.',
          'Prepare per instructions — do not dilute.',
          'Vitamin D: from birth.',
          'Dose: 400–600 IU/day per prescription.',
          'Do not replace breast milk without guidance.',
        ] : [
          'Fórmula: só se indicado pelo pediatra.',
          'Preparar conforme bula — não diluir.',
          'Vitamina D: desde o nascimento.',
          'Dose: 400–600 UI/dia conforme prescrição.',
          'Não substituir leite materno sem orientação.',
        ]} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
        <Card color={c2} title={lang === 'en' ? "Belly Button" : "Umbigo"} items={lang === 'en' ? [
          'Keep clean and dry.',
          '70% alcohol not routinely recommended.',
          'Fold diaper below the stump.',
          'Redness or odor → pediatrician.',
          'Stump falls off in 7–21 days.',
        ] : [
          'Manter limpo e seco.',
          'Álcool 70% não recomendado de rotina.',
          'Dobrar fralda abaixo do coto.',
          'Vermelhidão ou cheiro → pediatra.',
          'Coto cai em 7–21 dias.',
        ]} />
        <Card color={c3} title={lang === 'en' ? "Jaundice" : "Icterícia"} items={lang === 'en' ? [
          'Yellow skin: common in first days.',
          'Observe: face → chest → feet.',
          'Sunbathing is NOT treatment.',
          'Treatment: hospital phototherapy.',
          'Persists after 2 weeks → evaluation.',
        ] : [
          'Amarelão: comum nos primeiros dias.',
          'Observe: rosto → peito → pés.',
          'Banho de sol NÃO é tratamento.',
          'Tratamento: fototerapia hospitalar.',
          'Persistiu após 2 sem. → avaliação.',
        ]} />
      </div>

      {/* FEBRE EXPANDIDA */}
      <div style={{ background: '#fff', border: `0.5px solid ${c0}40`, borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ background: c0, padding: '1px 3px', textAlign: 'center' }}>
          <span style={{ fontSize: '3.5px', fontWeight: 900, color: '#333', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.2px', fontFamily: 'Montserrat,sans-serif' }}>
            {lang === 'en' ? 'Fever' : 'Febre'}
          </span>
        </div>
        <div style={{ padding: '2px 3px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5px 4px' }}>
          {(lang === 'en' ? [
            '< 3 months + axillary temp > 37.8°C → emergency.',
            '> 3 months, ≥ 38°C: observe symptoms.',
            'Axillary thermometer: hold 3 min on dry skin.',
            '≥ 39°C or no improvement in 48h → pediatrician.',
            'Do NOT overdress a baby with fever.',
            'Do NOT rub alcohol on skin to reduce fever.',
            'Do NOT give fever reducers without medical advice.',
            'Offer breast milk/liquids frequently.',
          ] : [
            '< 3 meses + temp > 37,8°C axilar → emergência.',
            '> 3 meses, ≥ 38°C: observe sintomas.',
            'Termômetro axilar: segurar 3 min no seco.',
            '≥ 39°C ou sem melhora em 48h → pediatra.',
            'NÃO agasalhar o bebê com febre.',
            'NÃO esfregar álcool na pele para baixar febre.',
            'NÃO dar antitérmico sem orientação médica.',
            'Oferecer mama/líquidos com frequência.',
          ]).map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: '1.5px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '3px', color: c0, flexShrink: 0, fontWeight: 900, fontFamily: 'Montserrat,sans-serif' }}>›</span>
              <span style={{ fontSize: '2.6px', color: '#444', lineHeight: 1.25, fontFamily: 'Montserrat,sans-serif', textAlign: 'left' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      <Tip text={lang === 'en' ? "Did you know? Breast milk changes its composition according to the baby's needs — it even produces antibodies when they get sick!" : "Sabia que? O leite materno muda de composição conforme a necessidade do bebê — inclusive produz anticorpos quando ele fica doente!"} color={c1} />

    </div>
  );
}
