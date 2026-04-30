'use client';
import React from 'react';
import { 
  FolderAmamentacaoPage1, FolderAmamentacaoPage2, FolderAmamentacaoPage3, FolderAmamentacaoPage4,
  FolderAmamentacaoPage5, FolderAmamentacaoPage6, FolderAmamentacaoPage7, FolderAmamentacaoPage8 
} from './FolderAmamentacaoPages';
import { LogoPreviewHTML, BordaToggle } from './page';

export default function GuiaAmamentacaoPreview({ 
  brand, logoColor, logoLayout, 
  comBorda, setComBorda, 
  patternSrc, patternScale, setPatternScale, 
  accentColor, borderColor, setBorderColor, 
  paletteColors, cartaoContacts, crmLine, illustrationsSrc 
}) {
  const mainColor = paletteColors?.[0] || accentColor;
  const _brandData = brand?.editData || {};
  const clinicaNome = brand?.clinicaNome || _brandData?.marca || 'Sua Clínica';
  const endereco = cartaoContacts?.endereco || brand?.endereco || _brandData?.endereco || '';
  const allPhones = [cartaoContacts?.whatsapp, cartaoContacts?.telefone].filter(Boolean).join(' · ');
  
  const logoHtml = <LogoPreviewHTML editData={_brandData} color={logoColor} layout={logoLayout} scaleFactor={0.16} crm={crmLine} />;

  const Page = ({ num, children }) => (
    <div style={{ 
      width: '110px', 
      height: '210px', 
      background: !comBorda ? (borderColor || paletteColors[0] || accentColor) : '#fff',
      borderRight: num % 4 !== 0 ? '1px dashed rgba(0,0,0,0.06)' : 'none',
      position: 'relative',
      overflow: 'hidden',
      flexShrink: 0
    }}>
      {/* Background Layer: Pattern or Solid */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {comBorda && patternSrc ? (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${patternScale * 0.25}px`, backgroundRepeat: 'repeat', opacity: 1 }} />
        ) : (
          !comBorda && <div style={{ position: 'absolute', inset: 0, background: borderColor || paletteColors[0] || accentColor }} />
        )}
        {comBorda && !patternSrc && <div style={{ position: 'absolute', inset: 0, background: `${accentColor}10` }} />}
      </div>

      <div style={{ position: 'absolute', top: '4px', right: '4px', fontSize: '5px', color: comBorda ? '#ddd' : '#fff', fontWeight: 700, zIndex: 10, opacity: 0.8 }}>PÁG {num}</div>
      
      {/* Content Layer in White Box */}
      <div style={{ 
        position: 'absolute', 
        top: '6px', left: '6px', right: '6px', bottom: '6px', 
        background: '#fff', 
        borderRadius: '1.5px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)', 
        zIndex: 2, 
        overflow: 'hidden' 
      }}>
        {children}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%', alignItems: 'center', paddingBottom: '40px' }}>
      
      <BordaToggle 
        comBorda={comBorda} setComBorda={setComBorda} 
        accentColor={accentColor} paletteColors={paletteColors} 
        borderColor={borderColor} setBorderColor={setBorderColor} 
        patternScale={patternScale} setPatternScale={setPatternScale} 
      />

      {/* SIDE A: 4 | 3 | 2 | 1 (Cover) */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ height: '1px', width: '60px', background: '#eee' }} />
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>LADO EXTERNO (FACE 1)</span>
          <div style={{ height: '1px', width: '60px', background: '#eee' }} />
        </div>
        <div style={{ display: 'flex', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
          <Page num={4}><FolderAmamentacaoPage4 accentColor={accentColor} borderColor={borderColor} palette={paletteColors} clinicaNome={clinicaNome} endereco={endereco} allPhones={allPhones} brand={brand} /></Page>
          <Page num={3}><FolderAmamentacaoPage3 accentColor={accentColor} borderColor={borderColor} palette={paletteColors} /></Page>
          <Page num={2}><FolderAmamentacaoPage2 accentColor={accentColor} borderColor={borderColor} palette={paletteColors} /></Page>
          <Page num={1}><FolderAmamentacaoPage1 accentColor={accentColor} borderColor={borderColor} palette={paletteColors} logoComponent={logoHtml} illustrationsSrc={illustrationsSrc} /></Page>
        </div>
      </div>

      {/* SIDE B: 5 | 6 | 7 | 8 */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ height: '1px', width: '60px', background: '#eee' }} />
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>LADO INTERNO (FACE 2)</span>
          <div style={{ height: '1px', width: '60px', background: '#eee' }} />
        </div>
        <div style={{ display: 'flex', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
          <Page num={5}><FolderAmamentacaoPage5 accentColor={accentColor} borderColor={borderColor} palette={paletteColors} illustrationsSrc={illustrationsSrc} /></Page>
          <Page num={6}><FolderAmamentacaoPage6 accentColor={accentColor} borderColor={borderColor} palette={paletteColors} illustrationsSrc={illustrationsSrc} /></Page>
          <Page num={7}><FolderAmamentacaoPage7 accentColor={accentColor} borderColor={borderColor} palette={paletteColors} illustrationsSrc={illustrationsSrc} /></Page>
          <Page num={8}><FolderAmamentacaoPage8 accentColor={accentColor} borderColor={borderColor} palette={paletteColors} illustrationsSrc={illustrationsSrc} /></Page>
        </div>
      </div>
    </div>
  );
}
