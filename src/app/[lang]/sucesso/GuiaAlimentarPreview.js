'use client';
import React, { useState } from 'react';
import FolderPage2Art from './FolderPage2Art';
import FolderPage3Art from './FolderPage3Art';
import FolderPage4Dynamic from './FolderPage4Dynamic';
import FolderPage5Art from './FolderPage5Art';
import { LogoPreviewHTML, BordaToggle } from './page';

const WHATSAPP_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z';

function FieldRow({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
      <label style={{ fontSize: '10px', fontWeight: 700, color: '#888', fontFamily: 'Montserrat,sans-serif' }}>{label}</label>
      {children}
    </div>
  );
}

export default function GuiaAlimentarPreview({
  brand, editData, logoColor, logoLayout,
  comBorda, setComBorda,
  patternSrc, patternScale, setPatternScale,
  accentColor, borderColor, setBorderColor,
  paletteColors = [], cartaoContacts, crmLine,
  folderRoof, setFolderRoof,
  horarios, setHorarios,
  introducao, setIntroducao,
  localSlogan
}) {
  const mainColor = paletteColors?.[0] || accentColor;
  const _brandData = editData || brand?.editData || {};
  const clinicaNome = brand?.clinicaNome || brand?.editData?.clinicaNome || '';
  const endereco = cartaoContacts?.endereco || brand?.endereco || brand?.editData?.endereco || '';
  const allPhones = [cartaoContacts?.whatsapp, cartaoContacts?.telefone].filter(Boolean).join(' · ');
  const _slogan = localSlogan || _brandData?.tagline || '';
  const logoHtml = <div style={{ display: "flex", alignItems: "center", justifyContent: "center"}}><LogoPreviewHTML item="Guia Alimentar" editData={{ ..._brandData, tagline: _slogan }} color={logoColor} layout={logoLayout} scaleFactor={1} crm={crmLine} maxWidth="70px" maxHeight="40px" /></div>;

  const [painelAberto, setPainelAberto] = useState(false);

  const Page = ({ num, children, isSmall = false, withPattern = false, padding = '15px' }) => (
    <div style={{ 
      width: isSmall ? '146px' : '148px', 
      height: '210px', 
      background: '#fff', 
      borderRight: num === 2 || num === 3 || num === 5 || num === 6 ? '1px dashed rgba(0,0,0,0.06)' : 'none',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {withPattern && (
        comBorda && patternSrc ? (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${patternScale * 0.45}px`, backgroundRepeat: 'repeat', opacity: 0.1 }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: borderColor || paletteColors[0] || accentColor, opacity: 0.12 }} />
        )
      )}
      <div style={{ position: 'absolute', top: '5px', right: '5px', fontSize: '6px', color: '#ccc', fontWeight: 700, zIndex: 10 }}>PÁG {num} {num === 1 ? '(CAPA)' : ''}</div>
      <div style={{ position: 'relative', zIndex: 2, padding, height: '100%', boxSizing: 'border-box' }}>
        {children}
      </div>
    </div>
  );

  const darkenHex = (hex, factor = 0.55) => {
    const h = hex.replace('#', '');
    if (h.length < 6) return hex;
    const r = Math.round(parseInt(h.substring(0,2),16) * factor);
    const g = Math.round(parseInt(h.substring(2,4),16) * factor);
    const b = Math.round(parseInt(h.substring(4,6),16) * factor);
    return `rgb(${r},${g},${b})`;
  };

  const handleHorarioChange = (index, value) => {
    if (!setHorarios) return;
    setHorarios(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], val: value };
      return copy;
    });
  };

  const handleIntroducaoChange = (index, field, value) => {
    if (!setIntroducao) return;
    setIntroducao(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  return (
    <div id="folder-trifold-preview" style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%', alignItems: 'center', paddingBottom: '40px' }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" />
      
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />
      {setFolderRoof && (
        <button onClick={() => setFolderRoof(v => !v)} style={{ fontSize: '0.7rem', padding: '4px 12px', borderRadius: '20px', border: `1px solid ${folderRoof ? accentColor : '#eee'}`, background: folderRoof ? `${accentColor}10` : '#fff', color: folderRoof ? accentColor : '#aaa', cursor: 'pointer', fontFamily: 'Montserrat,sans-serif', fontWeight: folderRoof ? 700 : 400 }}>
          {folderRoof ? '🏠 Recorte Casinha ATIVO' : '⬜️ Recorte Reto ATIVO'}
        </button>
      )}

      {/* LADO EXTERNO (5 | 6 | 1) */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ height: '1px', flex: 1, background: '#eee' }} />
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>LADO EXTERNO (FACE 1)</span>
          <div style={{ height: '1px', flex: 1, background: '#eee' }} />
        </div>
        <div style={{ display: 'flex', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
          {/* Pág 5 - Aba que dobra pra dentro */}
          <Page num={5} isSmall>
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: !comBorda ? (borderColor || paletteColors[0] || accentColor) : 'transparent' }}>
               {comBorda && patternSrc && (
                 <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${patternScale * 0.45}px`, backgroundRepeat: 'repeat', opacity: 1 }} />
               )}
               <div style={{ position: 'absolute', inset: 0, background: !patternSrc && comBorda ? `${accentColor}10` : 'transparent' }} />
            </div>
            <div style={{ position: 'absolute', top: '6px', left: '6px', right: '6px', bottom: '6px', background: '#fff', borderRadius: '1.5px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden', justifyContent: 'center' }}>
               <div style={{ width: '100%', height: '100%', transform: 'scale(0.92)', transformOrigin: 'center center' }}>
                 <FolderPage5Art accentColor={accentColor} palette={paletteColors} />
               </div>
            </div>
          </Page>

          {/* Pág 6 - Contra-capa (ESTAMPA COMPLETA + LEMBRE-SE) */}
          <Page num={6}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: !comBorda ? (borderColor || paletteColors[0] || accentColor) : 'transparent' }}>
              {comBorda && patternSrc && (
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${patternScale * 0.45}px`, backgroundRepeat: 'repeat', opacity: 1 }} />
              )}
              <div style={{ position: 'absolute', inset: 0, background: !patternSrc && comBorda ? `${accentColor}10` : 'transparent' }} />
            </div>
            
             <div style={{ position: 'absolute', top: '6px', left: '6px', right: '6px', bottom: '6px', background: '#fff', borderRadius: '1.5px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '48%', left: '10px', right: '10px', zIndex: 3, display: 'flex', justifyContent: 'center', transform: 'translateY(-50%)' }}>
                  <div style={{ width: '92%', background: mainColor, borderRadius: '4px', padding: '12px 14px', textAlign: 'center', position: 'relative', border: `0.4px solid ${mainColor}`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                     <div style={{ fontFamily: `'Great Vibes', cursive`, color: '#fff', fontSize: '9px', marginBottom: '4px', textTransform: 'none' }}>"Brinque, converse e explore!"</div>
                     <div style={{ fontSize: '3.5px', color: '#fff', fontWeight: 500, lineHeight: 1.5, fontFamily: 'Montserrat, sans-serif' }}>
                        As brincadeiras são mais do que momentos de divertimento. Elas ajudam seu bebê a aprender, a desenvolver novas habilidades e a se sentir seguro e amado.
                     </div>
                  </div>
                </div>
                <div style={{ position: 'absolute', top: '75%', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '4px', opacity: 0.18 }}>
                   {Array.from({length: 8}).map((_, i) => (
                     <div key={i} style={{ width: '3px', height: '3px', background: mainColor, borderRadius: '50%' }} />
                   ))}
                </div>
            </div>

            {/* ETIQUETA DE DADOS NO RODAPÉ */}
            {(clinicaNome || endereco || allPhones || brand?.email || cartaoContacts?.site || cartaoContacts?.instagram) ? (
              <div style={{ position: 'absolute', bottom: '10px', left: '12px', right: '12px', background: '#fff', border: `0.5px solid ${mainColor}15`, borderRadius: '3px', padding: '4px 10px', zIndex: 4, boxShadow: '0 2px 10px rgba(0,0,0,0.04)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  {clinicaNome && <div style={{ fontSize: '5.2px', fontWeight: 800, color: mainColor, marginBottom: '0.5px' }}>{clinicaNome}</div>}
                  {endereco && <div style={{ fontSize: '4.2px', color: '#999', fontWeight: 500, lineHeight: 1.1 }}>{endereco}</div>}
                  
                  {allPhones && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px', marginTop: '0.5px' }}>
                       <svg viewBox="0 0 24 24" width="7" height="7" fill="#25D366" style={{ flexShrink: 0 }}><path d={WHATSAPP_PATH}/></svg>
                       <div style={{ fontSize: '5.5px', fontWeight: 800, color: '#444' }}>{allPhones}</div>
                    </div>
                  )}

                  {(brand?.email || cartaoContacts?.site || cartaoContacts?.instagram) && (
                    <div style={{ fontSize: '4px', color: '#aaa', marginTop: '0.5px' }}>
                       {[brand?.email, cartaoContacts?.site, cartaoContacts?.instagram ? `@${cartaoContacts.instagram}` : ''].filter(Boolean).join('  ·  ')}
                    </div>
                  )}
              </div>
            ) : null}
          </Page>

          {/* Pág 1 - Capa Principal */}
          <Page num={1}>
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: !comBorda ? (borderColor || paletteColors[0] || accentColor) : 'transparent' }}>
               {comBorda && patternSrc && (
                 <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${patternScale * 0.5}px`, backgroundRepeat: 'repeat', opacity: 1 }} />
               )}
               <div style={{ position: 'absolute', inset: 0, background: !patternSrc && comBorda ? `${accentColor}15` : 'transparent' }} />
            </div>
            <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', bottom: '10px', background: '#fff', borderRadius: '2px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: `0.5px solid ${accentColor}15`, clipPath: folderRoof ? 'polygon(0% 12%, 50% 0%, 100% 12%, 100% 100%, 0% 100%)' : 'none', transition: 'clip-path 0.3s ease' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', paddingTop: '32px', textAlign: 'center', width: '100%', height: '100%' }}>
                  <div style={{ width: '120px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>{logoHtml}</div>
                  <div style={{ width: '22px', height: '1.2px', background: accentColor, marginBottom: '14px', borderRadius: '10px' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px' }}>
                      <div style={{ fontSize: '5.2px', fontWeight: 800, color: `${accentColor}cc`, textTransform: 'uppercase', letterSpacing: '0.6px', fontStyle: 'italic' }}>GUIA DE</div>
                      <div style={{ fontSize: '9.2px', fontWeight: 800, color: '#333', textTransform: 'uppercase', letterSpacing: '0.8px', lineHeight: 1.2 }}>INTRODUÇÃO ALIMENTAR</div>
                  </div>
                  <div style={{
                    marginTop: '5px',
                    padding: '2px 10px',
                    background: (paletteColors[1] || accentColor) + '28',
                    borderRadius: '20px',
                    border: `0.5px solid ${(paletteColors[1] || accentColor) + '50'}`
                  }}>
                    <div style={{
                      fontSize: '4.8px',
                      fontWeight: 800,
                      color: darkenHex(paletteColors[1] || accentColor),
                      letterSpacing: '0.2px',
                      fontFamily: '"Myriad Pro Condensed", "MyriadPro-Cond", sans-serif',
                      textTransform: 'uppercase'
                    }}>NUTRIÇÃO QUE TRANSFORMA</div>
                  </div>
                </div>
            </div>
          </Page>
        </div>
      </div>

      {/* LADO INTERNO (2 | 3 | 4) */}
      <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ height: '1px', flex: 1, background: '#eee' }} />
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>LADO INTERNO (FACE 2)</span>
          <div style={{ height: '1px', flex: 1, background: '#eee' }} />
        </div>
        <div style={{ display: 'flex', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
          <Page num={2} withPattern padding="15px 4px 6px 4px">
            <FolderPage2Art accentColor={accentColor} palette={paletteColors} />
          </Page>
          <Page num={3} withPattern padding="15px 4px 6px 4px">
            <FolderPage3Art accentColor={accentColor} palette={paletteColors} />
          </Page>
          <Page num={4} isSmall withPattern padding="0">
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <FolderPage4Dynamic accentColor={accentColor} palette={paletteColors} horarios={horarios} introducao={introducao} />
            </div>
          </Page>
        </div>
      </div>

      {/* Painel de Edição */}
      <div style={{ width: '100%', maxWidth: '420px', background: '#fafafa', borderRadius: '10px', border: '1px solid #eee', overflow: 'hidden', zIndex: 10 }}>
        <button onClick={() => setPainelAberto(v => !v)} style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#666', fontFamily: 'Montserrat,sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Personalizar Conteúdo do Guia Alimentar</span>
          <span style={{ fontSize: '14px', color: '#aaa', fontWeight: 700 }}>{painelAberto ? '▲' : '▼'}</span>
        </button>

        {painelAberto && (
          <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '450px', overflowY: 'auto' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: mainColor, fontFamily: 'Montserrat,sans-serif', textTransform: 'uppercase', borderBottom: '1px solid #eee', paddingBottom: '4px' }}>Tabela de Horários</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {horarios.map((item, idx) => (
                <FieldRow key={idx} label={item.label}>
                  <input
                    value={item.val}
                    onChange={(e) => handleHorarioChange(idx, e.target.value)}
                    style={{ width: '100%', padding: '6px 8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '12px', fontFamily: 'Montserrat,sans-serif', color: '#333' }}
                  />
                </FieldRow>
              ))}
            </div>

            <div style={{ fontSize: '10px', fontWeight: 800, color: mainColor, fontFamily: 'Montserrat,sans-serif', textTransform: 'uppercase', borderBottom: '1px solid #eee', paddingBottom: '4px', marginTop: '10px' }}>Tabela de Introdução Clássica</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {introducao.map((item, idx) => (
                <div key={idx} style={{ padding: '8px', border: '1px solid #eee', borderRadius: '8px', background: '#fff', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '9px', fontWeight: 800, color: '#666' }}>Fase: {item.idade}</div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
                    <FieldRow label="Textura Recomendada">
                      <input
                        value={item.text}
                        onChange={(e) => handleIntroducaoChange(idx, 'text', e.target.value)}
                        style={{ width: '100%', padding: '6px 8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '11px', fontFamily: 'Montserrat,sans-serif', color: '#333' }}
                      />
                    </FieldRow>
                    <FieldRow label="Quantidade Recomendada">
                      <textarea
                        value={item.qty}
                        onChange={(e) => handleIntroducaoChange(idx, 'qty', e.target.value)}
                        rows={2}
                        style={{ width: '100%', padding: '6px 8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '11px', fontFamily: 'Montserrat,sans-serif', color: '#333', resize: 'vertical' }}
                      />
                    </FieldRow>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
