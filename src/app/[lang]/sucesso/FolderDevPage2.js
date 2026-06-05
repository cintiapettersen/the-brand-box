'use client';
import React from 'react';
import { useTranslation } from '../../LanguageContext';

export default function FolderDevPage2({ accentColor, palette = [] }) {
  const { lang } = useTranslation();
  const mainColor = palette[0] || accentColor;
  
  const milestonesPt = [
    { label: "Abre e fecha os braços em resposta à estimulação (Reflexo de Moro)", range: [1, 3] },
    { label: "Postura: barriga para cima, pernas e braços fletidos, cabeça lateralizada", range: [1, 4] },
    { label: "Olha para a pessoa que o observa", range: [1, 2] },
    { label: "Dá mostras de prazer e desconforto", range: [2, 3] },
    { label: "Fixa e acompanha objetos em seu campo visual", range: [1, 3] },
    { label: "Colocado de bruços, levanta a cabeça momentaneamente", range: [1, 2] },
    { label: "Arrulha e sorri espontaneamente", range: [2, 4] },
    { label: "Começa a diferenciar dia/noite", range: [2, 4] },
    { label: "Postura: passa da posição lateral para linha média", range: [3, 5] },
    { label: "Colocado de bruços, levanta e sustenta a cabeça apoiando-se no antebraço", range: [3, 5] },
    { label: "Emite sons - Balbucia", range: [3, 5] },
    { label: "Senta com a ajuda de outra pessoa, mas não fica passivo", range: [3, 6] },
    { label: "Segura e transfere objetos de uma mão para a outra", range: [4, 7] },
    { label: "Levantado pelos braços, ajuda com o corpo", range: [4, 6] },
    { label: "Vira a cabeça na direção de uma voz ou objeto sonoro", range: [4, 6] },
    { label: "Reconhece quando se dirigem a ele", range: [4, 7] },
    { label: "Tenta ficar de pé com apoio", range: [5, 9] },
    { label: "Arrasta-se ou engatinha", range: [6, 11] },
    { label: "Responde diferentemente a pessoas familiares e a estranhos", range: [6, 12] },
    { label: "Imita pequenos gestos ou brincadeiras", range: [7, 13] },
    { label: "Anda com apoio", range: [8, 15] },
    { label: "Pega objetos usando o polegar e o indicador", range: [9, 15] },
  ];

  const milestonesEn = [
    { label: "Opens and closes arms in response to stimulation (Moro Reflex)", range: [1, 3] },
    { label: "Posture: flat on back, legs and arms flexed, head to side", range: [1, 4] },
    { label: "Looks at the person observing them", range: [1, 2] },
    { label: "Shows signs of pleasure and discomfort", range: [2, 3] },
    { label: "Fixates and follows objects in visual field", range: [1, 3] },
    { label: "Placed on tummy, lifts head momentarily", range: [1, 2] },
    { label: "Coos and smiles spontaneously", range: [2, 4] },
    { label: "Begins to differentiate day/night", range: [2, 4] },
    { label: "Posture: moves from side-lying to midline", range: [3, 5] },
    { label: "Placed on tummy, lifts and supports head on forearms", range: [3, 5] },
    { label: "Makes sounds - Babbles", range: [3, 5] },
    { label: "Sits with assistance, active participant", range: [3, 6] },
    { label: "Holds and transfers objects from hand to hand", range: [4, 7] },
    { label: "Pulled to sit, assists with body", range: [4, 6] },
    { label: "Turns head toward a voice or sound source", range: [4, 6] },
    { label: "Recognizes when spoken to", range: [4, 7] },
    { label: "Tries to stand with support", range: [5, 9] },
    { label: "Crawls or scoots", range: [6, 11] },
    { label: "Responds differently to family and strangers", range: [6, 12] },
    { label: "Imitates small gestures or games", range: [7, 13] },
    { label: "Walks with support", range: [8, 15] },
    { label: "Picks up objects using pincer grasp", range: [9, 15] },
  ];

  const milestones = lang === 'en' ? milestonesEn : milestonesPt;
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15];

  return (
    <div style={{ width: '100%', height: '100%', padding: '2px 4px', display: 'flex', flexDirection: 'column', fontFamily: "'Montserrat', sans-serif", boxSizing: 'border-box' }}>
      <div style={{ fontSize: '6px', fontWeight: 900, color: mainColor, marginBottom: '2px', textAlign: 'center', textTransform: 'uppercase' }}>
        {lang === 'en' ? 'Developmental Milestones' : 'Marcos de Desenvolvimento'}
      </div>
      <div style={{ fontSize: '4px', fontWeight: 600, color: '#666', marginBottom: '4px', textAlign: 'center' }}>
        {lang === 'en' ? '(expected response)' : '(resposta esperada)'}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ display: 'flex', borderBottom: `0.5px solid ${mainColor}` }}>
          <div style={{ width: '50%', padding: '1px 2px', fontSize: '3.5px', fontWeight: 700, color: mainColor, display: 'flex', alignItems: 'flex-end' }}>
            {lang === 'en' ? 'SKILLS' : 'HABILIDADES'}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
             <div style={{ fontSize: '3.5px', color: '#666', textAlign: 'center', marginBottom: '1px' }}>
               {lang === 'en' ? 'Age in months' : 'Idade em meses'}
             </div>
             <div style={{ display: 'flex', width: '100%' }}>
              {months.map(m => (
                <div key={m} style={{ flex: 1, textAlign: 'center', fontSize: '3.5px', fontWeight: 800, color: '#fff', background: '#72A9D1', padding: '1px 0', borderLeft: '0.1px solid #fff' }}>
                  {m}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', marginTop: '1px' }}>
          {milestones.map((ms, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'stretch', borderBottom: '0.3px solid #ccc' }}>
              <div style={{ width: '50%', padding: '0.8px 2px', fontSize: '2.8px', color: '#444', lineHeight: 1 }}>
                {ms.label}
              </div>
              <div style={{ flex: 1, display: 'flex', height: '100%', borderRight: '0.2px solid #ccc' }}>
                {months.map(m => {
                  const isFilled = m >= ms.range[0] && m <= ms.range[1];
                  return (
                    <div key={m} style={{ flex: 1, borderLeft: '0.2px solid #ccc', position: 'relative' }}>
                      {isFilled && (
                        <div style={{ position: 'absolute', top: '0.3px', bottom: '0.3px', left: 0, right: 0, background: '#E6C673' }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
