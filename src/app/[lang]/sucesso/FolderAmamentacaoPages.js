'use client';
import React from 'react';
import { useTranslation } from '../../LanguageContext';

const getSafeColor = (hex, amount = 25) => {
  if (!hex) return hex;
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  if (brightness > 200) {
    const darken = (v) => Math.max(0, Math.min(255, Math.floor(v * (1 - amount/100))));
    return `#${darken(r).toString(16).padStart(2, '0')}${darken(g).toString(16).padStart(2, '0')}${darken(b).toString(16).padStart(2, '0')}`;
  }
  return hex;
};

export function FolderAmamentacaoPage1({ accentColor, borderColor, palette = [], logoComponent, folderRoof = true }) {
  const { lang } = useTranslation();
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ 
      width: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      padding: '10px 8px', 
      boxSizing: 'border-box', 
      background: '#fff',
      position: 'relative',
      clipPath: folderRoof ? 'polygon(0% 12%, 50% 0%, 100% 12%, 100% 100%, 0% 100%)' : 'none',
      paddingTop: folderRoof ? '38px' : '15px'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
        <div style={{ marginBottom: '5px', display: 'flex', justifyContent: 'center', width: '100%', padding: '0 10px', boxSizing: 'border-box' }}>{logoComponent}</div>
        <div style={{ width: '35px', height: '1.5px', background: mainColor }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%', marginBottom: '15px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '5.5px', fontWeight: 400, color: '#888', letterSpacing: '2.5px', textTransform: 'uppercase' }}>
            {lang === 'en' ? 'GUIDE TO' : 'GUIA DE'}
          </div>
          <div style={{ fontSize: '9px', fontWeight: 900, color: '#333', letterSpacing: '0.6px', textTransform: 'uppercase', lineHeight: 1.1 }}>
            {lang === 'en' ? 'BREASTFEEDING' : 'AMAMENTAÇÃO'}
          </div>
        </div>
        
        <div style={{ 
          padding: '2.5px 12px', 
          background: `${mainColor}15`, 
          borderRadius: '20px', 
          border: `0.3px solid ${mainColor}30`,
          maxWidth: '90%',
          textAlign: 'center'
        }}>
           <div style={{ fontSize: '5px', fontWeight: 800, color: mainColor, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
             {lang === 'en' ? 'EXCLUSIVE BREASTFEEDING' : 'ALEITAMENTO MATERNO EXCLUSIVO'}
           </div>
        </div>
      </div>

      <div style={{ width: '100%', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px', padding: '0 5px', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
           <span style={{ fontSize: '5px', fontWeight: 700, color: mainColor }}>
             {lang === 'en' ? 'NAME:' : 'NOME:'}
           </span>
           <div style={{ flex: 1, borderBottom: `0.3px solid ${mainColor}40`, height: '7px' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
           <span style={{ fontSize: '5px', fontWeight: 700, color: mainColor }}>
             {lang === 'en' ? 'BIRTH DATE:' : 'NASCIMENTO:'}
           </span>
           <div style={{ width: '10mm', borderBottom: `0.3px solid ${mainColor}40`, height: '7px' }} />
           <span style={{ fontSize: '5px', color: mainColor }}>/</span>
           <div style={{ width: '10mm', borderBottom: `0.3px solid ${mainColor}40`, height: '8px' }} />
           <span style={{ fontSize: '5px', color: mainColor }}>/</span>
           <div style={{ width: '10mm', borderBottom: `0.3px solid ${mainColor}40`, height: '8px' }} />
        </div>
      </div>
    </div>
  );
}

export function FolderAmamentacaoPage2({ accentColor, borderColor, palette = [] }) {
  const { lang } = useTranslation();
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', padding: '10px 8px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: mainColor, color: '#fff', padding: '4px 8px', fontWeight: 800, marginBottom: '8px', borderRadius: '1px', textAlign: 'center' }}>
        {lang === 'en' ? "MOTHER'S NUTRITION" : "ALIMENTAÇÃO DA MÃE"}
      </div>
      <p style={{ color: '#555', lineHeight: 1.45, marginBottom: '10px' }}>
        {lang === 'en' 
          ? "A balanced diet rich in protein, fiber, and vitamins is recommended. Eat small portions multiple times a day to maintain your energy."
          : "Recomenda-se uma alimentação balanceada, rica em proteínas, fibras e vitaminas. Coma diversas vezes ao dia em pequenas porções para manter a energia."}
      </p>
      <p style={{ color: '#555', lineHeight: 1.45, marginBottom: '15px' }}>
        <strong>{lang === 'en' ? 'Water:' : 'Água:'}</strong> {lang === 'en' ? 'consume at least two liters per day. Keep glasses of water in the rooms where you nurse the most.' : 'consuma ao menos dois litros por dia. Mantenha copos d\'água nos cômodos onde você mais amamenta.'}
      </p>
      
      <div style={{ marginTop: '20px', border: `0.3px solid ${mainColor}40`, padding: '8px', borderRadius: '5px', background: `${mainColor}05` }}>
        <div style={{ fontWeight: 800, color: mainColor, marginBottom: '8px', textAlign: 'center', fontSize: '5.2px', letterSpacing: '0.5px' }}>
          {lang === 'en' ? 'BREAST MILK COMPOSITION' : 'COMPOSIÇÃO DO LEITE MATERNO'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5px' }}>
          {[
            { label: lang === 'en' ? 'Protective agents' : 'Agentes de proteção', w: '100%', c: mainColor },
            { label: lang === 'en' ? 'Growth' : 'Crescimento', w: '90%', c: palette[1] || mainColor },
            { label: lang === 'en' ? 'Microbiota' : 'Microbiota', w: '80%', c: palette[2] || mainColor },
            { label: lang === 'en' ? 'Energy' : 'Energia', w: '70%', c: palette[3] || mainColor },
            { label: lang === 'en' ? 'Brain' : 'Cérebro', w: '60%', c: palette[4] || mainColor },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '38px', textAlign: 'right', fontSize: '3.4px', fontWeight: 600 }}>{item.label}</div>
              <div style={{ flex: 1, height: '4.5px', background: `${item.c}20`, borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: item.w, height: '100%', background: item.c }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FolderAmamentacaoPage3({ accentColor, borderColor, palette = [] }) {
  const { lang } = useTranslation();
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', padding: '10px 8px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: mainColor, color: '#fff', padding: '4px 8px', fontWeight: 800, marginBottom: '12px', borderRadius: '1px', textAlign: 'center' }}>
        {lang === 'en' ? 'COMMON PROBLEMS' : 'PROBLEMAS COMUNS'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <section>
          <div style={{ fontWeight: 800, color: mainColor, borderBottom: `0.3px solid ${mainColor}20`, marginBottom: '4px', fontSize: '4.6px' }}>
            {lang === 'en' ? 'Nipple Fissures' : 'Fissuras nos Mamilos'}
          </div>
          <p style={{ lineHeight: 1.4 }}><strong>{lang === 'en' ? 'Cause:' : 'Causa:'}</strong> {lang === 'en' ? 'Poor baby positioning or incorrect technique.' : 'Má posição do bebê ou técnica incorreta.'}</p>
          <p style={{ lineHeight: 1.4 }}><strong>{lang === 'en' ? 'Treatment:' : 'Tratamento:'}</strong> {lang === 'en' ? 'Correct the technique, apply breast milk after nursing.' : 'Corrija a técnica, aplique leite materno após as mamadas.'}</p>
        </section>
        <section>
          <div style={{ fontWeight: 800, color: mainColor, borderBottom: `0.3px solid ${mainColor}20`, marginBottom: '4px', fontSize: '4.6px' }}>
            {lang === 'en' ? 'Breast Engorgement' : 'Ingurgitamento Mamário'}
          </div>
          <p style={{ lineHeight: 1.4 }}><strong>{lang === 'en' ? 'Cause:' : 'Causa:'}</strong> {lang === 'en' ? 'Imbalance in production and drainage.' : 'Causa: Desequilíbrio na produção e drenagem.'}</p>
          <p style={{ lineHeight: 1.4 }}><strong>{lang === 'en' ? 'Relief:' : 'Alívio:'}</strong> {lang === 'en' ? 'Empty manually, perform gentle breast massages.' : 'Esvazie manualmente, faça massagens suaves na mama.'}</p>
        </section>
      </div>
      
      <div style={{ marginTop: '20px', display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <div style={{ flex: 1, background: '#f8f8f8', padding: '8px 5px', borderRadius: '5px', border: '0.2px solid #eee' }}>
          <div style={{ fontWeight: 800, color: '#333', marginBottom: '5px', textAlign: 'center' }}>
            {lang === 'en' ? 'Before returning:' : 'Antes do retorno:'}
          </div>
          <div style={{ fontSize: '3.8px', lineHeight: 1.3 }}>
            {lang === 'en' ? (
              <>• Exclusive nursing;<br/>• Local pumping.</>
            ) : (
              <>• Aleitamento exclusivo;<br/>• Retirada no local.</>
            )}
          </div>
        </div>
        <div style={{ flex: 1, background: '#f8f8f8', padding: '8px 5px', borderRadius: '5px', border: '0.2px solid #eee' }}>
          <div style={{ fontWeight: 800, color: '#333', marginBottom: '5px', textAlign: 'center' }}>
            {lang === 'en' ? 'After returning:' : 'Após o retorno:'}
          </div>
          <div style={{ fontSize: '3.8px', lineHeight: 1.3 }}>
            {lang === 'en' ? (
              <>• Breastfeed at home;<br/>• Pump at work.</>
            ) : (
              <>• Amamentar em casa;<br/>• Ordenha no trabalho.</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FolderAmamentacaoPage4({ accentColor, borderColor, palette = [], clinicaNome, endereco, allPhones, brand }) {
  const { lang } = useTranslation();
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', padding: '10px 8px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: mainColor, color: '#fff', padding: '4px 8px', fontWeight: 800, marginBottom: '12px', borderRadius: '1px', textAlign: 'center' }}>
        {lang === 'en' ? 'EMOTIONAL SUPPORT' : 'APOIO EMOCIONAL'}
      </div>
      <p style={{ fontWeight: 700, marginBottom: '8px', fontSize: '4.6px' }}>
        {lang === 'en' ? 'Family support is key:' : 'O apoio da família é fundamental:'}
      </p>
      <ul style={{ paddingLeft: '10px', marginBottom: '10px', lineHeight: 1.5 }}>
        {lang === 'en' ? (
          <>
            <li>A calm environment favors breastfeeding.</li>
            <li>The mother needs support in her decision.</li>
            <li>Sharing household chores is essential.</li>
          </>
        ) : (
          <>
            <li>Ambiente calmo favorece a amamentação.</li>
            <li>A mãe precisa de apoio em sua decisão.</li>
            <li>Dividir as tarefas de casa é essencial.</li>
          </>
        )}
      </ul>
      <div style={{ background: '#f9f9f9', padding: '8px', borderRadius: '5px', border: `0.3px solid ${mainColor}30` }}>
        <div style={{ fontWeight: 800, color: mainColor, marginBottom: '6px', fontSize: '4.8px' }}>
          {lang === 'en' ? 'How to Help?' : 'Como Ajudar?'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {(lang === 'en' ? [
            'Seek professional help if needed',
            'Organized and comfortable space',
            'Assist with household chores'
          ] : [
            'Buscar ajuda profissional se necessário',
            'Ambiente organizado e confortável',
            'Auxiliar nas tarefas domésticas'
          ]).map((text, i) => (
            <div key={i} style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <div style={{ width: '5px', height: '5px', border: `0.3px solid ${mainColor}`, borderRadius: '1px' }} />
              <span style={{ fontSize: '4px' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
      
      {(clinicaNome || endereco || allPhones) ? (
        <div style={{ marginTop: '12px', textAlign: 'center', borderTop: `0.3px solid ${mainColor}20`, paddingTop: '8px', paddingBottom: '5px' }}>
          {clinicaNome && <div style={{ fontSize: '5px', fontWeight: 800, color: mainColor, marginBottom: '1px' }}>{clinicaNome}</div>}
          {endereco && <div style={{ fontSize: '3.8px', color: '#999', marginBottom: '3px' }}>{endereco}</div>}
          {allPhones && <div style={{ fontSize: '5px', fontWeight: 800, color: '#444' }}>{allPhones}</div>}
        </div>
      ) : null}
    </div>
  );
}

export function FolderAmamentacaoPage5({ accentColor, borderColor, palette = [] }) {
  const { lang } = useTranslation();
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', padding: '10px 8px 20px 8px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px', display: 'flex', flexDirection: 'column' }}>
      <p style={{ lineHeight: 1.5, marginBottom: '15px', fontSize: '4.6px' }}>
        {lang === 'en' ? (
          <><strong>Breastfeeding is much more than nourishing.</strong> It is interaction, immunity, and emotional development for the baby.</>
        ) : (
          <><strong>Amamentar é muito mais que nutrir.</strong> É interação, imunidade e desenvolvimento emocional para o bebê.</>
        )}
      </p>
      <div style={{ background: `${mainColor}10`, padding: '10px', borderRadius: '5px', border: `0.2px solid ${mainColor}20`, marginBottom: '15px' }}>
        <p style={{ margin: 0, lineHeight: 1.4, textAlign: 'center' }}>
          {lang === 'en'
            ? "The WHO recommends exclusive breastfeeding for the first six months of life."
            : "A OMS recomenda aleitamento materno exclusivo nos primeiros seis meses de vida."}
        </p>
      </div>
      
      <div style={{ fontWeight: 800, color: mainColor, marginBottom: '10px', textTransform: 'uppercase', fontSize: '5.2px', letterSpacing: '0.5px', textAlign: 'center' }}>
        {lang === 'en' ? 'BENEFITS OF BREASTFEEDING' : 'BENEFÍCIOS DO ALEITAMENTO'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {(lang === 'en' ? [
          { t: 'For the Baby:', c: 'Better digestion, immunity, and allergy reduction.' },
          { t: 'For the Mother:', c: 'Helps with weight loss and uterine health.' },
          { t: 'For the Family:', c: 'Strengthens bonds and is practical daily.' },
        ] : [
          { t: 'Para o Bebê:', c: 'Melhor digestão, imunidade e redução de alergias.' },
          { t: 'Para a Mamãe:', c: 'Auxilia na perda de peso e na saúde uterina.' },
          { t: 'Para a Família:', c: 'Fortalece os vínculos e é prático no dia a dia.' },
        ]).map((box, i) => (
          <div key={i} style={{ borderLeft: `2.5px solid ${mainColor}`, paddingLeft: '10px', background: `${mainColor}05`, padding: '6px 10px', borderRadius: '0 4px 4px 0' }}>
            <div style={{ fontWeight: 800, color: mainColor, marginBottom: '2px' }}>{box.t}</div>
            <div style={{ fontSize: '3.8px', color: '#666', lineHeight: 1.3 }}>{box.c}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FolderAmamentacaoPage6({ accentColor, borderColor, palette = [] }) {
  const { lang } = useTranslation();
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', padding: '10px 8px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: mainColor, color: '#fff', padding: '4px 8px', fontWeight: 800, marginBottom: '10px', borderRadius: '1px', textAlign: 'center' }}>
        {lang === 'en' ? 'THE CORRECT LATCH' : 'A PEGA CORRETA'}
      </div>
      <p style={{ lineHeight: 1.4, marginBottom: '12px', textAlign: 'center' }}>
        {lang === 'en'
          ? "An inadequate latch can lead to sore nipples and low weight gain for the baby."
          : "Uma pega inadequada pode levar a mamilos doloridos e baixo ganho de peso do bebê."}
      </p>
      
      <div style={{ position: 'relative', width: '68px', margin: '0 auto', border: '0.4px solid #eee', borderRadius: '5px', overflow: 'hidden' }}>
        <img src="/pega-correta.png" style={{ width: '100%', display: 'block' }} />
      </div>
      
      <div style={{ marginTop: '15px', display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <div style={{ flex: 1, background: `${mainColor}10`, padding: '8px 5px', borderRadius: '5px', border: `0.3px solid ${mainColor}20` }}>
          <div style={{ fontWeight: 800, color: mainColor, marginBottom: '4px', textAlign: 'center', fontSize: '4.8px' }}>
            {lang === 'en' ? 'Right:' : 'Certo:'}
          </div>
          <div style={{ fontSize: '3.6px', lineHeight: 1.25 }}>
            {lang === 'en' ? 'Mouth wide open, flanged lips, chin touching breast.' : 'Boca bem aberta, lábios para fora, queixo na mama.'}
          </div>
        </div>
        <div style={{ flex: 1, background: '#fff5f5', padding: '8px 5px', borderRadius: '5px', border: '0.3px solid #feb2b2' }}>
          <div style={{ fontWeight: 800, color: '#c53030', marginBottom: '4px', textAlign: 'center', fontSize: '4.8px' }}>
            {lang === 'en' ? 'Wrong:' : 'Errado:'}
          </div>
          <div style={{ fontSize: '3.6px', lineHeight: 1.25 }}>
            {lang === 'en' ? 'Mouth narrow, dimpled cheeks, pain.' : 'Boca pouco aberta, bochechas encovadas, dor.'}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FolderAmamentacaoPage7({ accentColor, borderColor, palette = [] }) {
  const { lang } = useTranslation();
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', padding: '10px 8px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: mainColor, color: '#fff', padding: '4px 8px', fontWeight: 800, marginBottom: '15px', borderRadius: '1px', textAlign: 'center' }}>
        {lang === 'en' ? 'MANUAL PUMPING' : 'ORDENHA MANUAL'}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '4px', lineHeight: 1.45 }}>
          {lang === 'en' ? (
            <>
              <p><strong>1.</strong> Wash hands and forearms thoroughly.</p>
              <p><strong>2.</strong> Gently massage the breast.</p>
              <p><strong>3.</strong> Thumb above the areola, fingers below.</p>
              <p><strong>4.</strong> Press backward and release.</p>
            </>
          ) : (
            <>
              <p><strong>1.</strong> Lave bem mãos e antebraços.</p>
              <p><strong>2.</strong> Massageie a mama suavemente.</p>
              <p><strong>3.</strong> Polegar acima da aréola, dedos abaixo.</p>
              <p><strong>4.</strong> Pressione para trás e solte.</p>
            </>
          )}
        </div>
        <div style={{ width: '100%', border: '0.4px solid #eee', borderRadius: '5px', overflow: 'hidden' }}>
          <img src="/ordenha.png" style={{ width: '100%', display: 'block' }} />
        </div>
      </div>
      <div style={{ marginTop: '20px', background: '#fdfdfd', padding: '10px', borderRadius: '5px', border: '0.2px dashed #ddd', textAlign: 'center' }}>
        <p style={{ fontSize: '3.8px', fontStyle: 'italic', margin: 0, color: '#666' }}>
          {lang === 'en' ? 'Tip: Always use a sterilized glass jar with a plastic lid for storage.' : 'Dica: Use sempre um frasco de vidro esterilizado com tampa plástica para armazenar.'}
        </p>
      </div>
    </div>
  );
}

export function FolderAmamentacaoPage8({ accentColor, borderColor, palette = [] }) {
  const { lang } = useTranslation();
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', padding: '10px 8px 20px 8px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px' }}>
      <div style={{ background: mainColor, color: '#fff', padding: '4px 8px', fontWeight: 800, marginBottom: '10px', borderRadius: '1px', textAlign: 'center' }}>
        {lang === 'en' ? 'STORAGE AND USE' : 'ARMAZENAMENTO E USO'}
      </div>
      
      <div style={{ marginBottom: '6px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '4px' }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${mainColor}40` }}>
              <th style={{ textAlign: 'left', padding: '4px' }}>{lang === 'en' ? 'Location' : 'Local'}</th>
              <th style={{ textAlign: 'right', padding: '4px' }}>{lang === 'en' ? 'Time' : 'Tempo'}</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '0.1px solid #eee' }}>
              <td style={{ padding: '5px 4px' }}>{lang === 'en' ? 'Fridge' : 'Geladeira'}</td>
              <td style={{ textAlign: 'right' }}>{lang === 'en' ? 'Up to 12 hours' : 'Até 12 horas'}</td>
            </tr>
            <tr style={{ borderBottom: '0.1px solid #eee' }}>
              <td style={{ padding: '5px 4px' }}>{lang === 'en' ? 'Freezer' : 'Congelador'}</td>
              <td style={{ textAlign: 'right' }}>{lang === 'en' ? 'Up to 15 days' : 'Até 15 dias'}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div style={{ marginBottom: '10px', background: `${mainColor}05`, padding: '8px', borderRadius: '6px', border: `0.3px solid ${mainColor}15` }}>
        <div style={{ fontWeight: 800, color: mainColor, marginBottom: '3px', fontSize: '4.6px' }}>
          {lang === 'en' ? 'How to Warm:' : 'Como Aquecer:'}
        </div>
        <p style={{ lineHeight: 1.3, margin: '0 0 8px 0' }}>
          {lang === 'en' 
            ? "Water bath (stove off). Never use the microwave, to preserve its properties."
            : "Banho-maria (fogo desligado). Nunca use o micro-ondas, para não perder as propriedades."}
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '45px', height: '45px', position: 'relative', borderRadius: '50%', overflow: 'hidden', border: `0.5px solid ${mainColor}20`, background: '#fff' }}>
            <img src="/banho_maria_circular_neutro_1777906864151.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <p style={{ fontSize: '3.4px', color: '#777', margin: 0, fontStyle: 'italic', fontWeight: 600, textAlign: 'center' }}>
            {lang === 'en' ? '"Breast milk is the best food for your baby."' : '"O leite materno é o melhor alimento para o seu bebê."'}
          </p>
        </div>
      </div>
    </div>
  );
}
