'use client';
import React from 'react';
import { LogoPreviewHTML, BordaToggle } from './page';
import { useTranslation } from '../../LanguageContext';
import { useScaleToFit } from './useScaleToFit';

function F({ value, onChange, width = '20px', color, placeholder = '___' }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width, border: 'none', borderBottom: `0.5px solid ${color}90`, outline: 'none', fontSize: 'inherit', fontFamily: 'Montserrat,sans-serif', color, background: 'transparent', padding: '0 1px', textAlign: 'center', display: 'inline-block', verticalAlign: 'baseline' }}
    />
  );
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}
function shade(hex, amount) {
  const [r,g,b] = hexToRgb(hex);
  const s = v => Math.round(v * (1-amount)).toString(16).padStart(2,'0');
  return `#${s(r)}${s(g)}${s(b)}`;
}
function getLuminance(hex) {
  const [r,g,b] = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
function ensureLegibleColor(hex) {
  if (!hex || hex === 'transparent' || hex.length < 4) return '#666';
  const lum = getLuminance(hex);
  if (lum > 0.65) return shade(hex, 0.4); 
  return hex;
}

function MedLine({ name, qty, instructions, solidColor }) {
  return (
    <div style={{ marginBottom: '5px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '1px', fontSize: '3.8px', fontFamily: 'Montserrat,sans-serif', color: '#333' }}>
        <span style={{ color: solidColor, fontWeight: 700, flexShrink: 0 }}>•</span>
        <span style={{ fontWeight: 600, flexShrink: 0, marginLeft: '2px' }}>{name}</span>
        <span style={{ flex: 1, borderBottom: '0.5px dashed #ccc', minWidth: '4px', margin: '0 3px', position: 'relative', top: '-0.5px' }} />
        <span style={{ fontWeight: 600, flexShrink: 0 }}>{qty}</span>
      </div>
      <div style={{ fontSize: '3.2px', fontFamily: 'Montserrat,sans-serif', color: '#555', paddingLeft: '7px', lineHeight: 1.5, marginTop: '1px' }}>
        {instructions}
      </div>
    </div>
  );
}

function SecTitle({ children, color }) {
  const legible = ensureLegibleColor(color);
  return (
    <div style={{ fontSize: '4.5px', fontWeight: 800, fontStyle: 'italic', color: legible, fontFamily: 'Montserrat,sans-serif', marginBottom: '4px', marginTop: '6px', paddingBottom: '2px', borderBottom: `0.5px solid ${legible}30` }}>
      {children}
    </div>
  );
}

function FieldRow({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <label style={{ fontSize: '10px', fontWeight: 700, color: '#888', fontFamily: 'Montserrat,sans-serif' }}>{label}</label>
      {children}
    </div>
  );
}

export default function ReceitaAltaPreview({ accentColor, paletteColors = [], editData, logoColor, logoLayout, cartaoContacts, crmLine, clinicaNome, comBorda, setComBorda, patternSrc, patternScale, setPatternScale, borderColor, setBorderColor, receitaFields, setReceitaFields }) {
  const { dictionary, lang } = useTranslation();
  const solidColor = borderColor || paletteColors[0] || accentColor;
  const c0 = ensureLegibleColor(paletteColors[0] || accentColor);
  const c1 = ensureLegibleColor(paletteColors[1] || c0);
  const BORDER = 8; // Sempre tem borda (conforme BordaToggle: Estampa ou Sólida)

  const f = receitaFields || {};
  const set = (key) => (val) => setReceitaFields && setReceitaFields(prev => ({ ...prev, [key]: val }));

  const tVal = (saved, ptDef, enDef) => {
    if (!saved) return lang === 'en' ? enDef : ptDef;
    if (lang === 'en' && saved === ptDef) return enDef;
    if (lang !== 'en' && saved === enDef) return ptDef;
    return saved;
  };

  const med1Nome = tVal(f.med1Nome, 'Vitamina D 200UI/gota', 'Vitamin D 200UI/drop');
  const med1Qty = tVal(f.med1Qty, '1 vidro', '1 bottle');
  const med1Dose = f.med1Dose ?? '2';
  const med2Nome = tVal(f.med2Nome, 'Colidis', 'Colidis / Probiotics');
  const med2Qty = tVal(f.med2Qty, '1 vidro', '1 bottle');
  const med2Dose = tVal(f.med2Dose, '5 gotas 1 vez ao dia', '5 drops once a day');
  const med3Nome = tVal(f.med3Nome, 'Tylenol baby 140mg/ml', 'Infant Tylenol / Acetaminophen');
  const med3Qty = tVal(f.med3Qty, '1 frasco', '1 bottle');
  const med3Dose = f.med3Dose ?? '___';
  const med4Nome = tVal(f.med4Nome, 'Mylicon / Simeticona', 'Infant Gas Relief / Simethicone');
  const med4Qty = tVal(f.med4Qty, '1 frasco', '1 bottle');
  const med4Dose = f.med4Dose ?? '3';
  const top1Nome = tVal(f.top1Nome, 'Bepantol baby', 'Desitin / Triple Paste');
  const top2Nome = tVal(f.top2Nome, 'Álcool 70%', 'Rubbing Alcohol 70%');
  const top3Nome = tVal(f.top3Nome, 'Rinossoro infantil', 'Saline nose drops');
  const top4Nome = tVal(f.top4Nome, 'Sabonete Johnsons / Cetrilan', "Johnson's Baby Wash / Cetrilan");
  const consulta = f.consulta ?? '';
  const obsExtra = f.obsExtra ?? '';

  const setMed1Nome = set('med1Nome'); const setMed1Dose = set('med1Dose');
  const setMed2Nome = set('med2Nome'); const setMed2Dose = set('med2Dose');
  const setMed3Nome = set('med3Nome'); const setMed3Dose = set('med3Dose');
  const setMed4Nome = set('med4Nome'); const setMed4Dose = set('med4Dose');
  const setTop1Nome = set('top1Nome'); const setTop2Nome = set('top2Nome');
  const setTop3Nome = set('top3Nome'); const setTop4Nome = set('top4Nome');
  const setConsulta = set('consulta'); const setObsExtra = set('obsExtra');

  const { whatsapp, telefone, site, instagram } = cartaoContacts || {};
  const mainPhone = whatsapp || telefone || '';
  const contactLine = [mainPhone, site, instagram ? `@${instagram}` : ''].filter(Boolean).join('  ·  ');
  const [painelAberto, setPainelAberto] = React.useState(false);
  const scaleReceita = useScaleToFit(226, 320 + 16);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', width: '100%', padding: '20px 0' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />

      {/* Preview A4 */}
      <div ref={scaleReceita.wrapperRef} style={scaleReceita.wrapperStyle}>
      <div style={scaleReceita.innerStyle}>
      <div style={{ width: '226px', height: '320px', position: 'relative', boxShadow: '0 6px 30px rgba(0,0,0,0.13)', borderRadius: '4px', overflow: 'hidden', background: '#fff', flexShrink: 0 }}>
        {comBorda && patternSrc 
          ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${(patternScale || 150) / 2.5}px`, backgroundRepeat: 'repeat' }} />
          : <div style={{ position: 'absolute', inset: 0, background: solidColor }} />
        }
        <div style={{ position: 'absolute', top: BORDER, left: BORDER, right: BORDER, bottom: BORDER, background: '#fff', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* Header */}
          <div style={{ background: solidColor, padding: '5px 6px 4px', flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', bottom: '-30px', left: '50%', transform: 'translateX(-50%)', width: '200%', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.10)' }} />
            <div style={{ width: '160px', height: '45px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LogoPreviewHTML item="Receita de Alta" editData={editData} color="#fff" layout={logoLayout} scaleFactor={0.6} crm={null} hideTagline maxWidth="100%" maxHeight="100%" />
            </div>
            <div style={{ fontSize: '5.5px', fontWeight: 900, color: '#fff', fontFamily: 'Montserrat,sans-serif', textTransform: 'uppercase', letterSpacing: '0.4px', marginTop: '-1px' }}>{dictionary?.receita_alta?.titulo || 'Receita de Alta do Bebê'}</div>
          </div>

          {/* Body */}
          <div style={{ flex: 1, padding: '3px 8px 2px' }}>
            <SecTitle color={c0}>{dictionary?.receita_alta?.uso_oral || '📋 Uso Oral:'}</SecTitle>
            <MedLine solidColor={c0} name={med1Nome} qty={med1Qty} instructions={<>{(dictionary?.receita_alta?.gotas_dia || 'Dar {gotas} gotas por dia').split('{gotas}')[0]}<F value={med1Dose} onChange={setMed1Dose} width="12px" color={c0} />{(dictionary?.receita_alta?.gotas_dia || 'Dar {gotas} gotas por dia').split('{gotas}')[1]}</>} />
            <MedLine solidColor={c0} name={med2Nome} qty={med2Qty} instructions={<F value={med2Dose} onChange={setMed2Dose} width="80px" color={c0} />} />
            <MedLine solidColor={c0} name={med3Nome} qty={med3Qty} instructions={<>{(dictionary?.receita_alta?.gotas_dor_febre || 'Dar {gotas} gotas de 6/6h se dor ou febre').split('{gotas}')[0]}<F value={med3Dose} onChange={setMed3Dose} width="14px" color={c0} />{(dictionary?.receita_alta?.gotas_dor_febre || 'Dar {gotas} gotas de 6/6h se dor ou febre').split('{gotas}')[1]}</>} />
            <MedLine solidColor={c0} name={med4Nome} qty={med4Qty} instructions={<>{(dictionary?.receita_alta?.gotas_colica || 'Dar {gotas} gotas de 8/8h se cólica').split('{gotas}')[0]}<F value={med4Dose} onChange={setMed4Dose} width="12px" color={c0} />{(dictionary?.receita_alta?.gotas_colica || 'Dar {gotas} gotas de 8/8h se cólica').split('{gotas}')[1]}</>} />

            <SecTitle color={c1}>{dictionary?.receita_alta?.uso_topico || '🧴 Uso Tópico:'}</SecTitle>
            <MedLine solidColor={c1} name={top1Nome} qty={lang === 'en' ? "1 tube" : "1 tubo"} instructions={dictionary?.receita_alta?.troca_fraldas || "Aplicar a cada troca de fraldas"} />
            <MedLine solidColor={c1} name={top2Nome} qty={lang === 'en' ? "1 bottle" : "1 frasco"} instructions={dictionary?.receita_alta?.coto_umbilical || "Aplicar no coto umbilical a cada troca de fralda"} />
            <MedLine solidColor={c1} name={top3Nome} qty={lang === 'en' ? "1 bottle" : "1 frasco"} instructions={dictionary?.receita_alta?.obstrucao_nasal || "Aplicar 3 jatos em cada narina se obstrução nasal"} />
            <MedLine solidColor={c1} name={top4Nome} qty={lang === 'en' ? "1 bottle" : "1 frasco"} instructions={dictionary?.receita_alta?.banho_diario || "Dar banho diariamente"} />

            {obsExtra && (
              <div style={{ marginTop: '3px', padding: '2px 4px', background: `${c0}0d`, borderRadius: '3px', border: `0.4px solid ${c0}30` }}>
                <div style={{ fontSize: '3px', fontFamily: 'Montserrat,sans-serif', color: '#555', lineHeight: 1.4 }}>{obsExtra}</div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{ borderTop: `0.5px solid ${c0}25`, padding: '3px 8px 3px', flexShrink: 0, background: `${c0}06` }}>
            <div style={{ fontSize: '3.5px', fontFamily: 'Montserrat,sans-serif', color: '#555', marginBottom: '3px', display: 'flex', alignItems: 'baseline', gap: '2px' }}>
              <span style={{ fontWeight: 700, color: c0, whiteSpace: 'nowrap' }}>{dictionary?.receita_alta?.consulta_medica || 'Consulta médica em:'}</span>
              <span style={{ flex: 1, borderBottom: '0.5px dashed #ccc', margin: '0 3px', position: 'relative', top: '-0.5px' }} />
              <span style={{ fontSize: '3px', color: '#aaa' }}>{consulta || '___/___/______'}</span>
            </div>
            {/* Espaço para carimbo */}
            <div style={{ height: '18px', border: `0.4px dashed ${c0}30`, borderRadius: '2px', marginBottom: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '2.5px', color: '#ccc', fontFamily: 'Montserrat,sans-serif', letterSpacing: '0.3px' }}>{dictionary?.receita_alta?.carimbo || 'CARIMBO'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px', minWidth: '70px' }}>
                <div style={{ width: '70px', borderBottom: `0.5px solid #999`, marginBottom: '1px' }} />
                <div style={{ fontSize: '3px', fontFamily: 'Montserrat,sans-serif', color: '#888', textAlign: 'center' }}>{clinicaNome || editData?.marca || (dictionary?.receita_alta?.medico_responsavel || 'Médico(a) Responsável')}</div>
                {crmLine && <div style={{ fontSize: '2.8px', fontFamily: 'Montserrat,sans-serif', color: '#aaa' }}>{crmLine}</div>}
              </div>
            </div>
            {contactLine && <div style={{ fontSize: '2.8px', color: '#bbb', fontFamily: 'Montserrat,sans-serif', textAlign: 'center', marginTop: '2px' }}>{contactLine}</div>}
          </div>
        </div>
      </div>
      </div></div>

      {/* Painel de edição */}
      <div style={{ width: '100%', maxWidth: '420px', background: '#fafafa', borderRadius: '10px', border: '1px solid #eee', overflow: 'hidden' }}>
        <button onClick={() => setPainelAberto(v => !v)} style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#666', fontFamily: 'Montserrat,sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{dictionary?.receita_alta?.personalizar || 'Personalizar Receita'}</span>
          <span style={{ fontSize: '14px', color: '#aaa', fontWeight: 700 }}>{painelAberto ? '▲' : '▼'}</span>
        </button>
      {painelAberto && <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

        <div style={{ fontSize: '10px', fontWeight: 700, color: c0, fontFamily: 'Montserrat,sans-serif', textTransform: 'uppercase' }}>{dictionary?.receita_alta?.uso_oral?.replace(/[^a-zA-Z\s]/g, '').trim() || 'Uso Oral'}</div>
        {[
          { label: lang === 'en' ? 'Medication 1 (name)' : 'Medicamento 1 (nome)', value: med1Nome, onChange: setMed1Nome },
          { label: lang === 'en' ? 'Medication 1 (dose — drops/day)' : 'Medicamento 1 (dose — gotas/dia)', value: med1Dose, onChange: setMed1Dose, width: '60px' },
          { label: lang === 'en' ? 'Medication 2 (name/brand)' : 'Medicamento 2 (nome/marca)', value: med2Nome, onChange: setMed2Nome },
          { label: lang === 'en' ? 'Medication 2 (full dose)' : 'Medicamento 2 (dose completa)', value: med2Dose, onChange: setMed2Dose },
          { label: lang === 'en' ? 'Medication 3 (name)' : 'Medicamento 3 (nome)', value: med3Nome, onChange: setMed3Nome },
          { label: lang === 'en' ? 'Medication 3 (drops every 6h)' : 'Medicamento 3 (gotas de 6/6h)', value: med3Dose, onChange: setMed3Dose, width: '60px' },
          { label: lang === 'en' ? 'Medication 4 (name)' : 'Medicamento 4 (nome)', value: med4Nome, onChange: setMed4Nome },
          { label: lang === 'en' ? 'Medication 4 (drops every 8h)' : 'Medicamento 4 (gotas de 8/8h)', value: med4Dose, onChange: setMed4Dose, width: '60px' },
        ].map(({ label, value, onChange, width }) => (
          <FieldRow key={label} label={label}>
            <input value={value} onChange={e => onChange(e.target.value)} style={{ width: width || '100%', border: 'none', borderBottom: '1px solid #ccc', outline: 'none', fontSize: '12px', fontFamily: 'Montserrat,sans-serif', color: solidColor, background: 'transparent', padding: '2px 0' }} />
          </FieldRow>
        ))}

        <div style={{ fontSize: '10px', fontWeight: 700, color: c1, fontFamily: 'Montserrat,sans-serif', textTransform: 'uppercase', marginTop: '4px' }}>{dictionary?.receita_alta?.uso_topico?.replace(/[^a-zA-Z\s]/g, '').trim() || 'Uso Tópico'}</div>
        {[
          { label: lang === 'en' ? 'Topic 1 (ointment)' : 'Tópico 1 (pomada)', value: top1Nome, onChange: setTop1Nome },
          { label: lang === 'en' ? 'Topic 2 (umbilical stump)' : 'Tópico 2 (coto umbilical)', value: top2Nome, onChange: setTop2Nome },
          { label: lang === 'en' ? 'Topic 3 (nose)' : 'Tópico 3 (nariz)', value: top3Nome, onChange: setTop3Nome },
          { label: lang === 'en' ? 'Topic 4 (bath)' : 'Tópico 4 (banho)', value: top4Nome, onChange: setTop4Nome },
        ].map(({ label, value, onChange }) => (
          <FieldRow key={label} label={label}>
            <input value={value} onChange={e => onChange(e.target.value)} style={{ width: '100%', border: 'none', borderBottom: '1px solid #ccc', outline: 'none', fontSize: '12px', fontFamily: 'Montserrat,sans-serif', color: solidColor, background: 'transparent', padding: '2px 0' }} />
          </FieldRow>
        ))}

        <FieldRow label={dictionary?.receita_alta?.data_consulta_label || "Data da próxima consulta"}>
          <input value={consulta} onChange={e => setConsulta(e.target.value)} placeholder="dd/mm/aaaa" style={{ width: '140px', border: 'none', borderBottom: '1px solid #ccc', outline: 'none', fontSize: '12px', fontFamily: 'Montserrat,sans-serif', color: solidColor, background: 'transparent', padding: '2px 0' }} />
        </FieldRow>
        <FieldRow label={dictionary?.receita_alta?.obs_extra_label || "Observações extras (opcional)"}>
          <input value={obsExtra} onChange={e => setObsExtra(e.target.value)} placeholder={dictionary?.receita_alta?.texto_livre || "texto livre…"} style={{ width: '100%', border: 'none', borderBottom: '1px solid #ccc', outline: 'none', fontSize: '12px', fontFamily: 'Montserrat,sans-serif', color: solidColor, background: 'transparent', padding: '2px 0' }} />
        </FieldRow>
      </div>}
      </div>
    </div>
  );
}

export function buildReceitaAltaHTML({ logoHtml, solidColor, paletteColors = [], clinicaNome, cartaoContacts, crmLine, marca, fields = {}, comBorda, patternSrc, patternScale, dictionary, lang }) {
  const c0 = ensureLegibleColor(paletteColors[0] || solidColor);
  const c1 = ensureLegibleColor(paletteColors[1] || c0);
  const BORDER_P = 12; // Sempre tem borda (Estampa ou Sólida)
  const isEn = lang === 'en';

  const tValP = (saved, ptDef, enDef) => {
    if (!saved) return isEn ? enDef : ptDef;
    if (isEn && saved === ptDef) return enDef;
    if (!isEn && saved === enDef) return ptDef;
    return saved;
  };

  const med1Nome = tValP(fields.med1Nome, 'Vitamina D 200UI/gota', 'Vitamin D 200UI/drop');
  const med1Qty = tValP(fields.med1Qty, '1 vidro', '1 bottle');
  const med1Dose = fields.med1Dose ?? '2';
  const med2Nome = tValP(fields.med2Nome, 'Colidis', 'Colidis / Probiotics');
  const med2Qty = tValP(fields.med2Qty, '1 vidro', '1 bottle');
  const med2Dose = tValP(fields.med2Dose, '5 gotas 1 vez ao dia', '5 drops once a day');
  const med3Nome = tValP(fields.med3Nome, 'Tylenol baby 140mg/ml', 'Infant Tylenol / Acetaminophen');
  const med3Qty = tValP(fields.med3Qty, '1 frasco', '1 bottle');
  const med3Dose = fields.med3Dose ?? '___';
  const med4Nome = tValP(fields.med4Nome, 'Mylicon / Simeticona', 'Infant Gas Relief / Simethicone');
  const med4Qty = tValP(fields.med4Qty, '1 frasco', '1 bottle');
  const med4Dose = fields.med4Dose ?? '3';
  const top1Nome = tValP(fields.top1Nome, 'Bepantol baby', 'Desitin / Triple Paste');
  const top2Nome = tValP(fields.top2Nome, 'Álcool 70%', 'Rubbing Alcohol 70%');
  const top3Nome = tValP(fields.top3Nome, 'Rinossoro infantil', 'Saline nose drops');
  const top4Nome = tValP(fields.top4Nome, 'Sabonete Johnsons / Cetrilan', "Johnson's Baby Wash / Cetrilan");
  const consulta = fields.consulta ?? '';
  const obsExtra = fields.obsExtra ?? '';

  const { whatsapp, telefone, site, instagram } = cartaoContacts || {};
  const mainPhone = whatsapp || telefone || '';
  const contactLine = [mainPhone, site, instagram ? `@${instagram}` : ''].filter(Boolean).join('  ·  ');

  const medLine = (name, qty, instr, color) => `
    <div style="margin-bottom:5mm;">
      <div style="display:flex;align-items:baseline;font-size:3.2mm;font-family:Montserrat,sans-serif;color:#333;">
        <span style="color:${color};font-weight:700;flex-shrink:0;margin-right:2mm;">•</span>
        <span style="font-weight:600;flex-shrink:0;">${name}</span>
        <span style="flex:1;border-bottom:0.4mm dashed #ccc;margin:0 3mm;position:relative;top:-0.5mm;"></span>
        <span style="font-weight:600;flex-shrink:0;">${qty}</span>
      </div>
      <div style="font-size:2.8mm;font-family:Montserrat,sans-serif;color:#555;padding-left:6mm;line-height:1.5;margin-top:1mm;">${instr}</div>
    </div>`;

  const secTitle = (text, color) => `<div style="font-size:4mm;font-weight:800;font-style:italic;color:${color};font-family:Montserrat,sans-serif;margin:6mm 0 3mm;padding-bottom:1.5mm;border-bottom:0.3mm solid ${color}30;">${text}</div>`;

  return `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,600;0,700;0,800;0,900;1,700;1,800&display=swap" rel="stylesheet"/>
<style>* { box-sizing:border-box; margin:0; padding:0; print-color-adjust:exact !important; -webkit-print-color-adjust:exact !important; } @page { size:220mm 307mm; margin:0; }</style>
</head><body>
<div style="width:220mm;height:307mm;background:${solidColor};display:flex;flex-direction:column;overflow:hidden;position:relative;">
  <!-- BACKGROUND / BORDER -->
  ${comBorda && patternSrc 
    ? `<div style="position:absolute;inset:0;background-image:url(${patternSrc});background-size:${(patternScale*0.4).toFixed(1)}mm;background-repeat:repeat;"></div>`
    : `<div style="position:absolute;inset:0;background:${solidColor};"></div>`}

  <div style="position:absolute;top:${BORDER_P + 5}mm;left:${BORDER_P + 5}mm;right:${BORDER_P + 5}mm;bottom:${BORDER_P + 5}mm;background:#fff;display:flex;flex-direction:column;overflow:hidden;">
  <div style="background:${solidColor};padding:6mm 8mm 4mm;display:flex;flex-direction:column;align-items:center;position:relative;overflow:hidden;flex-shrink:0;">
    <div style="position:absolute;bottom:-15mm;left:50%;transform:translateX(-50%);width:220%;height:30mm;border-radius:50%;background:rgba(255,255,255,0.08);"></div>
    <div style="width:100mm; height:32mm; display:flex; align-items:center; justify-content:center; margin-bottom:2mm; overflow:hidden;">${logoHtml}</div>
    <div style="font-size:4.2mm;font-weight:900;color:#fff;font-family:Montserrat,sans-serif;text-transform:uppercase;letter-spacing:0.4mm;">${dictionary?.receita_alta?.titulo || 'Receita de Alta do Bebê'}</div>
  </div>
  <div style="flex:1;padding:4mm 10mm 2mm;overflow:hidden;">
    ${secTitle(dictionary?.receita_alta?.uso_oral || '📋 Uso Oral:', c0)}
    ${medLine(med1Nome, med1Qty, (dictionary?.receita_alta?.gotas_dia || 'Dar {gotas} gotas por dia').replace('{gotas}', med1Dose), c0)}
    ${medLine(med2Nome, med2Qty, med2Dose, c0)}
    ${medLine(med3Nome, med3Qty, (dictionary?.receita_alta?.gotas_dor_febre || 'Dar {gotas} gotas de 6/6h se dor ou febre').replace('{gotas}', med3Dose), c0)}
    ${medLine(med4Nome, med4Qty, (dictionary?.receita_alta?.gotas_colica || 'Dar {gotas} gotas de 8/8h se cólica').replace('{gotas}', med4Dose), c0)}
    ${secTitle(dictionary?.receita_alta?.uso_topico || '🧴 Uso Tópico:', c1)}
    ${medLine(top1Nome, isEn ? '1 tube' : '1 tubo', dictionary?.receita_alta?.troca_fraldas || 'Aplicar a cada troca de fraldas', c1)}
    ${medLine(top2Nome, isEn ? '1 bottle' : '1 frasco', dictionary?.receita_alta?.coto_umbilical || 'Aplicar no coto umbilical a cada troca de frada', c1)}
    ${medLine(top3Nome, isEn ? '1 bottle' : '1 frasco', dictionary?.receita_alta?.obstrucao_nasal || 'Aplicar 3 jatos em cada narina se obstrução nasal', c1)}
    ${medLine(top4Nome, isEn ? '1 bottle' : '1 frasco', dictionary?.receita_alta?.banho_diario || 'Dar banho diariamente', c1)}
    ${obsExtra ? `<div style="margin-top:3mm;padding:2mm 4mm;background:${c0}12;border-radius:1.5mm;border:0.25mm solid ${c0}35;"><div style="font-size:2.6mm;font-family:Montserrat,sans-serif;color:#555;line-height:1.4;">${obsExtra}</div></div>` : ''}
  </div>
  <div style="border-top:0.3mm solid ${c0}25;padding:4mm 10mm 4mm;flex-shrink:0;background:${c0}06;">
    <div style="display:flex;align-items:baseline;font-size:2.8mm;font-family:Montserrat,sans-serif;color:#555;margin-bottom:4mm;">
      <span style="font-weight:700;color:${c0};white-space:nowrap;">${dictionary?.receita_alta?.consulta_medica || 'Próxima consulta em:'}</span>
      <span style="flex:1;border-bottom:0.3mm dashed #ccc;margin:0 3mm;"></span>
      <span style="color:#888;">${consulta || '___/___/______'}</span>
    </div>
    <div style="border:0.3mm dashed ${c0}40;border-radius:1.5mm;height:22mm;margin-bottom:4mm;display:flex;align-items:center;justify-content:center;">
      <span style="font-size:2.2mm;color:#ccc;font-family:Montserrat,sans-serif;letter-spacing:0.4mm;text-transform:uppercase;">${dictionary?.receita_alta?.carimbo || 'Carimbo'}</span>
    </div>
    <div style="display:flex;justify-content:flex-end;margin-bottom:2mm;">
      <div style="display:flex;flex-direction:column;align-items:center;gap:1mm;min-width:55mm;">
        <div style="width:55mm;border-bottom:0.3mm solid #999;margin-bottom:0.8mm;"></div>
        <div style="font-size:2.6mm;font-family:Montserrat,sans-serif;color:#777;text-align:center;">${clinicaNome || marca || (dictionary?.receita_alta?.medico_responsavel || 'Médico(a) Responsável')}</div>
        ${crmLine ? `<div style="font-size:2.3mm;font-family:Montserrat,sans-serif;color:#aaa;">${crmLine}</div>` : ''}
      </div>
    </div>
    ${contactLine ? `<div style="font-size:2.2mm;color:#bbb;font-family:Montserrat,sans-serif;text-align:center;">${contactLine}</div>` : ''}
  </div>
  </div>
  <!-- Crop marks BLEED=5mm -->
  <div style="position:absolute;top:5mm;left:0;width:4mm;height:0.2mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;top:0;left:5mm;width:0.2mm;height:4mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;top:5mm;right:0;width:4mm;height:0.2mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;top:0;right:5mm;width:0.2mm;height:4mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:5mm;left:0;width:4mm;height:0.2mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:0;left:5mm;width:0.2mm;height:4mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:5mm;right:0;width:4mm;height:0.2mm;background:#000;z-index:100;"></div>
  <div style="position:absolute;bottom:0;right:5mm;width:0.2mm;height:4mm;background:#000;z-index:100;"></div>
</div>
</body></html>`;
}
