'use client';
import React from 'react';
import { useTranslation } from '../../LanguageContext';

const TableHeader = ({ children, color }) => (
  <div style={{ background: color, color: '#fff', fontSize: '3.5px', fontWeight: 800, padding: '2px', textAlign: 'center', borderRight: '0.1px solid #fff' }}>
    {children}
  </div>
);

export default function PrenatalPage4({ accentColor, palette = [], comBorda, patternSrc, patternScale, borderColor }) {
  const { lang } = useTranslation();
  const mainColor = palette[0] || accentColor;
  const secondaryColor = palette[1] || '#72A9D1';
  const tertiaryColor = palette[2] || '#E6C673';
  const _borderColor = borderColor || mainColor;

  const labExams = lang === 'en' 
    ? ["HB/HT", "TSH/FT4", "GLUCOSE", "OGTT", "AST/ALT", "UREA/CREAT", "URINALYSIS", "URINE CULTURE", "HIV", "VDRL"]
    : ["HB/HT", "TSH/T4L", "GLICEMIA", "TOTG", "TGO/TGP", "UREIA/CREAT", "EAS", "UROCULTURA", "HIV", "VDRL"];
    
  const otherExams1 = lang === 'en'
    ? ["HTLV", "HBsAg", "HEP C"]
    : ["HTLV", "HBsAg", "HEP C"];
    
  const otherExams2 = lang === 'en'
    ? ["CMV", "RUBELLA", "TOXOPLASMOSIS"]
    : ["CMV", "RUBÉOLA", "TOXOPLASMOSE"];
    
  const otherExams3 = lang === 'en'
    ? ["BLOOD TYPING", "HB ELECTROPHORESIS", "INDIRECT COOMBS", "GBS CULTURE", "VITAMIN D", "PLASMODIUM SEARCH"]
    : ["TIPAGEM SANGUÍNEA", "ELETROFORESE HB", "COOMBS INDIRETO", "CULTURA STREPTOCOCOS", "VITAMINA D", "PESQUISA PLASMODIUM"];

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      padding: '4px', 
      boxSizing: 'border-box', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '2px', 
      fontFamily: "'Montserrat', sans-serif", 
      background: !comBorda ? _borderColor : 'transparent',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern logic */}
      {comBorda && patternSrc && (
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${(patternScale || 120) * 0.35}px`, backgroundRepeat: 'repeat', opacity: 1, zIndex: 1 }} />
      )}
      {comBorda && !patternSrc && (
        <div style={{ position: 'absolute', inset: 0, background: `${_borderColor}15`, zIndex: 1 }} />
      )}

      {/* Content Container */}
      <div style={{ position: 'relative', zIndex: 2, background: '#fff', padding: '3px', height: '100%', display: 'flex', flexDirection: 'column', gap: '2px', borderRadius: '1.5px', boxShadow: '0 1px 5px rgba(0,0,0,0.05)' }}>
        {/* Exames Laboratoriais */}
        <div style={{ background: secondaryColor, color: '#fff', fontSize: '4px', fontWeight: 900, padding: '1.5px 4px', textTransform: 'uppercase' }}>
          {lang === 'en' ? "LAB EXAMS" : "EXAMES LABORATORIAIS"}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', border: '0.2px solid #ccc' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1.5fr 1fr 1.5fr' }}>
            <TableHeader color={secondaryColor}>{lang === 'en' ? "TEST" : "EXAME"}</TableHeader>
            <TableHeader color={secondaryColor}>{lang === 'en' ? "DATE" : "DATA"}</TableHeader>
            <TableHeader color={secondaryColor}>{lang === 'en' ? "RESULT" : "RESULTADO"}</TableHeader>
            <TableHeader color={secondaryColor}>{lang === 'en' ? "DATE" : "DATA"}</TableHeader>
            <TableHeader color={secondaryColor}>{lang === 'en' ? "RESULT" : "RESULTADO"}</TableHeader>
          </div>
          {labExams.map((ex, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1.5fr 1fr 1.5fr', borderBottom: '0.2px solid #eee', height: '6.5px', alignItems: 'center' }}>
              <div style={{ fontSize: '3px', fontWeight: 700, paddingLeft: '2px', background: `${secondaryColor}10`, height: '100%', display: 'flex', alignItems: 'center' }}>{ex}</div>
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} style={{ borderLeft: '0.2px solid #eee', height: '100%' }} />
              ))}
            </div>
          ))}
        </div>

        {/* Row with 2 small tables */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', border: '0.2px solid #ccc' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.8fr 1.2fr', background: '#E67E7E', color: '#fff' }}>
               <TableHeader color="#E67E7E">{lang === 'en' ? "TEST" : "EXAME"}</TableHeader>
               <TableHeader color="#E67E7E">{lang === 'en' ? "DATE" : "DATA"}</TableHeader>
               <TableHeader color="#E67E7E">{lang === 'en' ? "RESULT" : "RESULTADO"}</TableHeader>
            </div>
            {otherExams1.map((ex, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 0.8fr 1.2fr', borderBottom: '0.2px solid #eee', height: '6.5px', alignItems: 'center' }}>
                <div style={{ fontSize: '3px', fontWeight: 700, paddingLeft: '2px', background: `#E67E7E10`, height: '100%', display: 'flex', alignItems: 'center' }}>{ex}</div>
                <div style={{ borderLeft: '0.2px solid #eee', height: '100%' }} />
                <div style={{ borderLeft: '0.2px solid #eee', height: '100%' }} />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', border: '0.2px solid #ccc' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1.5fr', background: secondaryColor, color: '#fff' }}>
               <TableHeader color={secondaryColor}>{lang === 'en' ? "TEST" : "EXAME"}</TableHeader>
               <TableHeader color={secondaryColor}>{lang === 'en' ? "DATE" : "DATA"}</TableHeader>
               <TableHeader color={secondaryColor}>{lang === 'en' ? "RESULT" : "RESULTADO"}</TableHeader>
            </div>
            {otherExams2.map((ex, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1.5fr', borderBottom: '0.2px solid #eee', height: '6.5px', alignItems: 'center' }}>
                <div style={{ fontSize: '3px', fontWeight: 700, paddingLeft: '2px', background: `${secondaryColor}10`, height: '100%', display: 'flex', alignItems: 'center' }}>{ex}</div>
                <div style={{ borderLeft: '0.2px solid #eee', height: '100%' }} />
                <div style={{ borderLeft: '0.2px solid #eee', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 1px' }}>
                   <div style={{ fontSize: '2px', color: '#999' }}>IgG:___________ IgM:___________</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Third table */}
        <div style={{ display: 'flex', border: '0.2px solid #ccc' }}>
          <div style={{ flex: '1.5', display: 'flex', flexDirection: 'column' }}>
             <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', background: mainColor, color: '#fff' }}>
                <TableHeader color={mainColor}>{lang === 'en' ? "TEST" : "EXAME"}</TableHeader>
                <TableHeader color={mainColor}>{lang === 'en' ? "DATE" : "DATA"}</TableHeader>
             </div>
             {otherExams3.map((ex, i) => (
               <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', borderBottom: '0.2px solid #eee', height: '6.5px', alignItems: 'center' }}>
                 <div style={{ fontSize: '3px', fontWeight: 700, paddingLeft: '2px', background: `${mainColor}10`, height: '100%', display: 'flex', alignItems: 'center' }}>{ex}</div>
                 <div style={{ borderLeft: '0.2px solid #eee', height: '100%' }} />
               </div>
             ))}
          </div>
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', borderLeft: '0.2px solid #ccc' }}>
             <div style={{ background: tertiaryColor, color: '#222', fontSize: '3.5px', fontWeight: 800, padding: '2px', textAlign: 'center' }}>
               {lang === 'en' ? "RESULT" : "RESULTADO"}
             </div>
             <div style={{ flex: 1, padding: '2px' }}>
                <div style={{ fontSize: '3px', fontWeight: 700 }}>{lang === 'en' ? "BLOOD TYPING" : "TIPAGEM SANGUÍNEA"}</div>
                <div style={{ fontSize: '3.5px', marginTop: '1.5px' }}>
                  {lang === 'en' ? "M: _________ F: __________" : "M: _________ P: __________"}
                </div>
                <div style={{ marginTop: '2px', height: '0.5px', background: '#eee' }} />
                <div style={{ flex: 1 }} />
             </div>
          </div>
        </div>

        {/* Observações */}
        <div style={{ display: 'flex', gap: '4px', marginTop: '1px' }}>
          <div style={{ flex: '0 0 22%', background: tertiaryColor, color: '#fff', fontSize: '4px', fontWeight: 900, padding: '3px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '2px' }}>
             {lang === 'en' ? "REMARKS" : "OBSERVAÇÕES"}
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
             {Array.from({ length: 2 }).map((_, i) => (
               <div key={i} style={{ borderBottom: '0.2px solid #ccc', height: '5px' }} />
             ))}
          </div>
        </div>
      </div>

    </div>
  );
}
