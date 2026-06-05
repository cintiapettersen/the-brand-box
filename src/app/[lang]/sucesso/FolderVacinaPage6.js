'use client';
import React from 'react';
import { useTranslation } from '../../LanguageContext';

export default function FolderVacinaPage6({ accentColor, palette = [] }) {
  const { lang } = useTranslation();
  const mainColor = palette[0] || accentColor;
  
  const reactions = lang === 'en' ? [
    { label: "2 months" },
    { label: "3 months" },
    { label: "4 months" },
    { label: "5 months" },
    { label: "6 months" },
    { label: "9 months" },
    { label: "12 months" },
    { label: "15 months" },
    { label: "4-6 years" },
    { label: "9-11 years" },
  ] : [
    { label: "2 meses" },
    { label: "3 meses" },
    { label: "4 meses" },
    { label: "5 meses" },
    { label: "6 meses" },
    { label: "9 meses" },
    { label: "12 meses" },
    { label: "15 meses" },
    { label: "4-6 anos" },
    { label: "9-11 anos" },
  ];

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      padding: '6px 8px', 
      display: 'flex', 
      flexDirection: 'column', 
      fontFamily: "'Montserrat', sans-serif", 
      boxSizing: 'border-box',
      background: '#fff',
      gap: '6px'
    }}>
      <div style={{ fontSize: '4.5px', fontWeight: 800, color: '#000', marginBottom: '2px', lineHeight: 1.2 }}>
        {lang === 'en' ? "Reaction tracking + antipyretic dosage based on weight / age:" : "Controle de reações + dosagem dos antitérmicos conforme peso / idade:"}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', background: mainColor, border: `0.2mm solid ${mainColor}` }}>
          <div style={{ flex: 1, padding: '1.5px 1px', fontSize: '3.5px', fontWeight: 800, color: '#fff', textAlign: 'center', borderRight: '0.2px solid #fff' }}>
            {lang === 'en' ? "Application" : "Aplicação"}
          </div>
          <div style={{ flex: 1, padding: '1.5px 1px', fontSize: '3.5px', fontWeight: 800, color: '#fff', textAlign: 'center', borderRight: '0.2px solid #fff' }}>
            {lang === 'en' ? "Medication" : "Medicamento"}
          </div>
          <div style={{ flex: 1, padding: '1.5px 1px', fontSize: '3.5px', fontWeight: 800, color: '#fff', textAlign: 'center', borderRight: '0.2px solid #fff' }}>
            {lang === 'en' ? "Medication" : "Medicamento"}
          </div>
          <div style={{ flex: 1.5, padding: '1.5px 1px', fontSize: '3.5px', fontWeight: 800, color: '#fff', textAlign: 'center' }}>
            {lang === 'en' ? "Reactions presented" : "Reações apresentadas"}
          </div>
        </div>
        {reactions.map((r, i) => (
          <div key={i} style={{ display: 'flex', borderBottom: `0.2mm solid ${mainColor}40`, borderLeft: `0.2mm solid ${mainColor}40`, borderRight: `0.2mm solid ${mainColor}40`, height: '8.5px' }}>
            <div style={{ flex: 1, padding: '1px', fontSize: '3.5px', fontWeight: 700, color: '#444', textAlign: 'center', borderRight: `0.2mm solid ${mainColor}40`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{r.label}</div>
            <div style={{ flex: 1, borderRight: `0.2mm solid ${mainColor}40` }} />
            <div style={{ flex: 1, borderRight: `0.2mm solid ${mainColor}40` }} />
            <div style={{ flex: 1.5 }} />
          </div>
        ))}
      </div>

      <div style={{ background: `${mainColor}10`, padding: '3px', borderRadius: '2px', border: `0.15mm solid ${mainColor}20` }}>
        <div style={{ fontSize: '3.2px', color: '#000', fontWeight: 800, lineHeight: 1.2 }}>
          {lang === 'en' 
            ? "The use of antipyretics BEFORE the vaccine IS NOT RECOMMENDED, except for the Meningo B vaccine, which is more reactogenic and where studies observed no interference with vaccine response. After vaccination, you can medicate in case of significant symptoms (averaging at least 1-2 hours after administration)."
            : "O uso de antitérmicos ANTES da vacina NÃO É RECOMENDADO, exceto na vacina meningo B que é uma vacina mais reatogênica e na qual os estudos não observaram interferência na resposta vacinal. Após a vacinação você pode medicar em caso de sintomas importantes (em média pelo menos 1-2 h após a aplicação)."
          }
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ fontSize: '4.2px', fontWeight: 800, color: mainColor }}>
          {lang === 'en' ? "What do I need to know about adverse reactions?" : "O que eu preciso saber sobre as reações adversas?"}
        </div>
      </div>
    </div>
  );
}
