'use client';
import React, { useState, useRef } from 'react';
import { LogoPreviewHTML } from './page';

const textColor = (hex) => {
  const h = (hex || '#000').replace('#','');
  const r = parseInt(h.substr(0,2),16);
  const g = parseInt(h.substr(2,2),16);
  const b = parseInt(h.substr(4,2),16);
  return (0.299*r + 0.587*g + 0.114*b)/255 > 0.6 ? '#333' : '#fff';
};

const darkenHex = (hex, factor = 0.55) => {
  const h = (hex || '#C03B66').replace('#', '');
  if (h.length < 6) return hex;
  const r = Math.round(parseInt(h.substring(0,2),16) * factor);
  const g = Math.round(parseInt(h.substring(2,4),16) * factor);
  const b = Math.round(parseInt(h.substring(4,6),16) * factor);
  return `rgb(${r},${g},${b})`;
};

export default function CadernetaPreview({
  brand, editData, logoColor, logoLayout,
  comBorda, setComBorda,
  patternSrc, patternScale, setPatternScale,
  accentColor, borderColor, setBorderColor,
  paletteColors = [], cartaoContacts, crmLine,
  localSlogan, setLocalSlogan,
  clinicaNome, setClinicaNome,
  crmData, setCrmData,
  setCartaoContacts,
  isSaude = true
}) {
  const mainColor = paletteColors?.[0] || accentColor;
  const secondaryColor = paletteColors?.[1] || accentColor;

  const [activeSpread, setActiveSpread] = useState(0); 
  const [editingContacts, setEditingContacts] = useState(false);
  const [personalLocalSlogan, setPersonalLocalSlogan] = useState(localSlogan || brand?.editData?.tagline || '');
  const [personalClinicaNome, setPersonalClinicaNome] = useState(clinicaNome || brand?.clinicaNome || '');

  // Dynamic values
  const _slogan = personalLocalSlogan || 'CUIDADO INTEGRAL DA INFÂNCIA';
  const _clinica = personalClinicaNome || brand?.editData?.marca || 'Sua Clínica';
  
  // Custom logo upload state
  const [customUploadedLogo, setCustomUploadedLogo] = useState(editData?.customLogoSrc || null);
  const [babyPhoto, setBabyPhoto] = useState(null);
  const babyPhotoInputRef = React.useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomUploadedLogo(event.target?.result);
        if (brand && brand.editData) {
          brand.editData.customLogoSrc = event.target?.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (index, color) => {
    if (paletteColors && paletteColors[index] !== undefined) {
      paletteColors[index] = color;
      // Trigger color update in UI
      if (setBorderColor) setBorderColor(color);
    }
  };

  const WHATSAPP_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z';
  const allPhones = [cartaoContacts?.whatsapp, cartaoContacts?.telefone].filter(Boolean).join(' · ') || '(11) 99999-9999';

  // Rendering logic for Cover (Page 1)
  const renderCover = () => {
    const logoHtml = (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LogoPreviewHTML
          item="Caderneta de Saúde"
          editData={{ ...brand?.editData, logoColor, logoLayout, customLogoSrc: customUploadedLogo }}
          color={logoColor}
          layout={logoLayout}
          scaleFactor={1}
          crm={crmLine}
          maxWidth="90px"
          maxHeight="50px"
        />
      </div>
    );

    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: !comBorda ? mainColor : 'transparent' }}>
        {comBorda && patternSrc && (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${patternScale * 1.2}px`, backgroundRepeat: 'repeat', opacity: 1 }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: !patternSrc && comBorda ? `${mainColor}12` : 'transparent' }} />
        <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', bottom: '10px', background: '#fff', borderRadius: '3px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: `0.5px solid ${mainColor}15` }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '24px 10px', textAlign: 'center', width: '100%', height: '100%', boxSizing: 'border-box' }}>
            <div style={{ width: '120px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>{logoHtml}</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'center' }}>
              <div style={{ width: '24px', height: '1.5px', background: mainColor, borderRadius: '10px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <div style={{ fontSize: '5.8px', fontWeight: 700, color: `${mainColor}cc`, textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: "'Solea', 'Montserrat', sans-serif" }}>CADERNETA DE</div>
                <div style={{ fontSize: '8.5px', fontWeight: 800, color: '#2C2A29', textTransform: 'uppercase', letterSpacing: '1px', lineHeight: 1.25, fontFamily: "'Solea', 'Montserrat', sans-serif" }}>SAÚDE E DESENVOLVIMENTO</div>
              </div>
              <div style={{
                marginTop: '6px',
                padding: '3px 12px',
                background: secondaryColor + '18',
                borderRadius: '20px',
                border: `0.5px solid ${secondaryColor + '35'}`
              }}>
                <div style={{
                  fontSize: '5.2px',
                  fontWeight: 700,
                  color: darkenHex(secondaryColor, 0.65),
                  letterSpacing: '0.3px',
                  fontFamily: "'Solea', 'Montserrat', sans-serif",
                  textTransform: 'uppercase'
                }}>{_slogan}</div>
              </div>
            </div>
            <div style={{ fontSize: '3px', color: '#aaa', fontFamily: "'Solea', 'Montserrat', sans-serif", letterSpacing: '0.2px' }}>MINISTÉRIO DA SAÚDE</div>
          </div>
        </div>
      </div>
    );
  };

  // Rendering dynamic back cover (Page 124)
  const renderBackCover = () => {
    return (
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: !comBorda ? mainColor : 'transparent' }}>
        {comBorda && patternSrc && (
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${patternScale * 1.2}px`, backgroundRepeat: 'repeat', opacity: 1 }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: !patternSrc && comBorda ? `${mainColor}12` : 'transparent' }} />
        <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', bottom: '10px', background: '#fff', borderRadius: '3px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden', border: `0.5px solid ${mainColor}15` }}>
          <div style={{ padding: '20px 15px 15px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: '10px' }}>
              <span style={{ fontSize: '14px', marginBottom: '4px' }}>👶</span>
              <div style={{ fontSize: '6.5px', fontWeight: 700, color: mainColor, letterSpacing: '0.6px', textTransform: 'uppercase', fontFamily: "'Solea', 'Montserrat', sans-serif" }}>ESTE DIÁRIO PERTENCE A:</div>
              <div style={{ width: '85%', height: '1px', background: '#eee', margin: '22px 0', borderTop: '0.5px dashed #ccc' }} />
            </div>

            {/* CLINICAL BRANDING FOOTER */}
            <div style={{ width: '92%', background: '#fcfcfc', border: `0.5px solid ${mainColor}15`, borderRadius: '4px', padding: '6px 10px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '2px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', marginBottom: '8px' }}>
              <div style={{ fontSize: '6.2px', fontWeight: 700, color: mainColor, fontFamily: "'Solea', 'Montserrat', sans-serif", letterSpacing: '0.2px' }}>{_clinica}</div>
              <div style={{ fontSize: '4.8px', color: '#736E6A', fontWeight: 500, lineHeight: 1.2, fontFamily: "'Solea', 'Montserrat', sans-serif" }}>{cartaoContacts?.endereco || 'Endereço não informado'}</div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', marginTop: '1px' }}>
                <svg viewBox="0 0 24 24" width="8" height="8" fill="#25D366"><path d={WHATSAPP_PATH}/></svg>
                <div style={{ fontSize: '5.5px', fontWeight: 700, color: '#2C2A29', fontFamily: "'Solea', 'Montserrat', sans-serif" }}>{allPhones}</div>
              </div>

              <div style={{ fontSize: '4.5px', color: '#999', marginTop: '1px', fontFamily: "'Solea', 'Montserrat', sans-serif", letterSpacing: '0.1px' }}>
                {[brand?.email, cartaoContacts?.site, cartaoContacts?.instagram ? `@${cartaoContacts.instagram}` : ''].filter(Boolean).join('  ·  ')}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="caderneta-preview-container" style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%', alignItems: 'center', paddingBottom: '40px' }}>
      
      {/* 3D spiral open-book mockup */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '12px' }}>
          <div style={{ height: '1px', flex: 1, background: '#eee' }} />
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {activeSpread === 0 ? 'CAPA E VERSO DA CAPA' 
             : activeSpread === 1 ? 'GUIA DE AMOR E PROTEÇÃO (PÁG 2–3)' 
             : activeSpread === 2 ? 'INTRODUÇÃO E SUMÁRIO (PÁG 4–5)'
             : activeSpread === 3 ? 'PRIMEIRA FOTO E O INÍCIO DA JORNADA (PÁG 6–7)'
             : activeSpread === 4 ? 'PARA A FAMÍLIA E CUIDADORES E DIREITOS DA CRIANÇA (PÁG 8–9)'
             : activeSpread === 5 ? 'REGISTRO CIVIL E DIREITOS DOS RESPONSÁVEIS (PÁG 10–11)'
             : activeSpread === 6 ? 'DIREITOS DA MÃE E CUIDANDO DA SAÚDE (PÁG 12–13)'
             : activeSpread === 7 ? 'TRIAGEM, VACINAÇÃO E PRIMEIROS DIAS (PÁG 14–15)'
             : 'VERSO DA CONTRA-CAPA E CONTRA-CAPA'}
          </span>
          <div style={{ height: '1px', flex: 1, background: '#eee' }} />
        </div>

        {/* Real open-book frame */}
        <div style={{
          display: 'flex',
          boxShadow: '0 25px 60px rgba(0,0,0,0.18)',
          borderRadius: '6px',
          background: '#eaeaea',
          padding: '4px',
          position: 'relative',
          width: '298px',
          height: '210px',
          overflow: 'hidden'
        }}>
          
          {/* LEFT PAGE */}
          <div style={{
            flex: 1,
            height: '100%',
            background: '#fff',
            borderTopLeftRadius: '3px',
            borderBottomLeftRadius: '3px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '-3px 0 8px rgba(0,0,0,0.05) inset'
          }}>
            {activeSpread === 0 && (
              <div style={{ position: 'absolute', inset: 0, background: !comBorda ? mainColor : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {comBorda && patternSrc && (
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${patternScale * 1.2}px`, backgroundRepeat: 'repeat', opacity: 0.25 }} />
                )}
                <div style={{ position: 'absolute', inset: 0, background: !patternSrc && comBorda ? `${mainColor}12` : 'transparent' }} />
              </div>
            )}
            {activeSpread === 1 && (
              <div style={{ position: 'absolute', inset: 0, background: !comBorda ? mainColor : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {comBorda && patternSrc && (
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${patternScale * 1.2}px`, backgroundRepeat: 'repeat', opacity: 0.25 }} />
                )}
                <div style={{ position: 'absolute', inset: 0, background: !patternSrc && comBorda ? `${mainColor}12` : 'transparent' }} />
              </div>
            )}
            {activeSpread === 2 && (
              <div style={{ padding: '12px 14px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', background: '#fff', textAlign: 'center', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  {/* Cute Sun Character */}
                  <svg viewBox="0 0 100 100" style={{ width: '34px', height: '34px', marginBottom: '8px', marginTop: '9px' }}>
                    {/* Rays */}
                    <path d="M50 12 C44 26 56 26 50 12 Z" fill="#bce1eb" transform="rotate(0 50 50)" />
                    <path d="M50 12 C44 26 56 26 50 12 Z" fill="#fcd7d9" transform="rotate(40 50 50)" />
                    <path d="M50 12 C44 26 56 26 50 12 Z" fill="#ebc298" transform="rotate(80 50 50)" />
                    <path d="M50 12 C44 26 56 26 50 12 Z" fill="#c39d84" transform="rotate(120 50 50)" />
                    <path d="M50 12 C44 26 56 26 50 12 Z" fill="#ad8376" transform="rotate(160 50 50)" />
                    <path d="M50 12 C44 26 56 26 50 12 Z" fill="#ebac88" transform="rotate(200 50 50)" />
                    <path d="M50 12 C44 26 56 26 50 12 Z" fill="#a7c3ce" transform="rotate(240 50 50)" />
                    <path d="M50 12 C44 26 56 26 50 12 Z" fill="#eac7df" transform="rotate(280 50 50)" />
                    <path d="M50 12 C44 26 56 26 50 12 Z" fill="#e6af2e" transform="rotate(320 50 50)" />
                    
                    {/* Central Circle */}
                    <circle cx="50" cy="50" r="23" fill="#e4ca9b" />
                    
                    {/* Cheeks */}
                    <circle cx="40" cy="51" r="2.8" fill="#f7999b" opacity="0.8" />
                    <circle cx="60" cy="51" r="2.8" fill="#f7999b" opacity="0.8" />
                    
                    {/* Eyes */}
                    <circle cx="42" cy="46" r="1.6" fill="#333" />
                    <circle cx="58" cy="46" r="1.6" fill="#333" />
                    <circle cx="43" cy="45" r="0.5" fill="#fff" />
                    <circle cx="59" cy="45" r="0.5" fill="#fff" />
                    
                    {/* Smile */}
                    <path d="M 46 52 Q 50 55 54 52" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>

                  <div style={{ fontFamily: "'Amelie', cursive", fontSize: '11.5px', color: mainColor, marginBottom: '6px' }}>
                    Carta aos Pais
                  </div>

                  {/* Paragraphs in clean, standard font */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    width: '95%',
                    fontSize: '3.5px',
                    lineHeight: 1.4,
                    fontFamily: "'Montserrat', sans-serif",
                    color: '#000',
                    textAlign: 'justify',
                    fontWeight: 500
                  }}>
                    <p style={{ margin: 0 }}>
                      Ser pai ou mãe é uma jornada cheia de momentos únicos, alegrias e também desafios. Este livrinho foi feito para ser um companheiro, oferecendo informações e orientações práticas para os primeiros anos de vida do seu filho.
                    </p>
                    <p style={{ margin: 0 }}>
                      Aqui, vocês encontrarão dicas de cuidados, desenvolvimento, saúde e amor, sempre com o objetivo de tornar esse processo mais leve e informativo.
                    </p>
                    <p style={{ margin: 0 }}>
                      Lembrem-se de que cada gesto de carinho conta e que vocês não estão sozinhos.
                    </p>
                  </div>
                </div>

                <div style={{
                  fontSize: '3px',
                  color: '#aaa',
                  marginBottom: '4px',
                  fontFamily: "'Montserrat', sans-serif"
                }}>
                  Este arquivo foi criado pela sonhodepapel.com
                </div>
              </div>
            )}
            {activeSpread === 3 && (
              /* Photo Album Page 6 - Print format only */
              <div style={{
                  padding: '10px 12px',
                  height: '100%',
                  boxSizing: 'border-box',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#fff',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Spiral border dots top */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '5px', backgroundImage: `radial-gradient(circle, #ccc 1px, transparent 1px)`, backgroundSize: '5px 5px', backgroundRepeat: 'repeat-x' }} />
                {/* Spiral border dots bottom */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '5px', backgroundImage: `radial-gradient(circle, #ccc 1px, transparent 1px)`, backgroundSize: '5px 5px', backgroundRepeat: 'repeat-x' }} />
                {/* Spiral border dots left */}
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '5px', backgroundImage: `radial-gradient(circle, #ccc 1px, transparent 1px)`, backgroundSize: '5px 5px', backgroundRepeat: 'repeat-y' }} />
                {/* Spiral border dots right */}
                <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '5px', backgroundImage: `radial-gradient(circle, #ccc 1px, transparent 1px)`, backgroundSize: '5px 5px', backgroundRepeat: 'repeat-y' }} />

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: '9px' }}>
                  {/* Dashed photo frame */}
                  <div style={{
                    width: '85%',
                    height: '100px',
                    border: '1px dashed #bbb',
                    borderRadius: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    background: '#fafafa'
                  }}>
                    {/* Vintage camera SVG */}
                    <svg viewBox="0 0 100 80" style={{ width: '42px', height: '34px' }}>
                      {/* Camera body */}
                      <rect x="8" y="22" width="84" height="50" rx="6" fill="#f0e0c0" />
                      <rect x="8" y="22" width="84" height="50" rx="6" fill="none" stroke="#c8a870" strokeWidth="1.5" />
                      {/* Camera top bump / viewfinder */}
                      <rect x="28" y="13" width="28" height="12" rx="4" fill="#c8aa80" />
                      <rect x="28" y="13" width="28" height="12" rx="4" fill="none" stroke="#b09060" strokeWidth="1" />
                      {/* Shutter button */}
                      <circle cx="68" cy="18" r="4" fill="#c8aa80" stroke="#b09060" strokeWidth="1" />
                      {/* Flash */}
                      <rect x="66" y="24" width="16" height="10" rx="3" fill="#e8d8b0" stroke="#c8a870" strokeWidth="0.8" />
                      {/* Lens outer ring */}
                      <circle cx="44" cy="48" r="18" fill="#555" />
                      <circle cx="44" cy="48" r="14" fill="#333" />
                      <circle cx="44" cy="48" r="10" fill="#1a1a1a" />
                      <circle cx="44" cy="48" r="6" fill="#111" />
                      {/* Lens highlight */}
                      <circle cx="40" cy="44" r="2" fill="#666" opacity="0.7" />
                      <circle cx="39" cy="43" r="0.8" fill="#aaa" opacity="0.8" />
                      {/* Flash lines */}
                      <line x1="86" y1="20" x2="90" y2="16" stroke="#bbb" strokeWidth="1.2" strokeLinecap="round" />
                      <line x1="88" y1="24" x2="93" y2="22" stroke="#bbb" strokeWidth="1.2" strokeLinecap="round" />
                      <line x1="87" y1="28" x2="92" y2="28" stroke="#bbb" strokeWidth="1.2" strokeLinecap="round" />
                      {/* Strap loops */}
                      <rect x="8" y="30" width="5" height="8" rx="2" fill="#d4b890" />
                      <rect x="87" y="30" width="5" height="8" rx="2" fill="#d4b890" />
                    </svg>
                    <div style={{ fontSize: '4.2px', color: '#aaa', textAlign: 'center', padding: '0 10px', marginTop: '6px', lineHeight: 1.5, fontFamily: "'Solea', 'Montserrat', sans-serif", fontStyle: 'italic', fontWeight: 600 }}>
                      Cole sua foto aqui 🤍
                    </div>
                  </div>

                  {/* Body text */}
                  <div style={{ width: '88%', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <p style={{ margin: 0, fontSize: '4.5px', lineHeight: 1.45, fontFamily: "'Solea', 'Montserrat', sans-serif", color: '#333', textAlign: 'justify' }}>
                      Este é o momento que marcou o início de uma grande aventura! Cole aqui a primeira foto tirada logo quando cheguei ao mundo. Um dia inesquecível cheio de amor, emoção e descobertas.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ fontSize: '3px', color: '#ccc', fontFamily: "'Solea', 'Montserrat', sans-serif", bottom: '6px', marginBottom: '2px' }}>Este arquivo foi criado pela sonhodepapel.com</div>
              </div>
            )}
            {activeSpread === 4 && (
              /* Page 8 - Section divider: Para a família e Cuidadores */
              <div style={{ position: 'absolute', inset: 0, background: !comBorda ? mainColor : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {/* Brand pattern at low opacity */}
                {comBorda && patternSrc && (
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${patternScale * 1.2}px`, backgroundRepeat: 'repeat', opacity: 0.25 }} />
                )}
                {/* Solid color wash if no pattern */}
                {comBorda && !patternSrc && (
                  <div style={{ position: 'absolute', inset: 0, background: `${mainColor}18` }} />
                )}
                {/* Center text in a premium capsule etiquetinha */}
                <div style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '4.8px',
                  fontWeight: 700,
                  color: '#2C2A29',
                  textAlign: 'center',
                  lineHeight: 1.4,
                  zIndex: 1,
                  background: 'rgba(255, 255, 255, 0.92)',
                  border: '0.4px solid rgba(0, 0, 0, 0.05)',
                  borderRadius: '20px',
                  padding: '5px 12px',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.03)',
                  backdropFilter: 'blur(1px)',
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase'
                }}>
                  Para a família e<br/>Cuidadores
                </div>
                {/* Footer */}
                <div style={{ position: 'absolute', bottom: '8px', fontSize: '3.2px', color: comBorda ? '#aaa' : `${textColor(mainColor)}99`, fontFamily: "'Montserrat', sans-serif", zIndex: 1 }}>
                  Este arquivo foi criado pela sonhodepapel.com
                </div>
              </div>
            )}
            {activeSpread === 5 && (
              /* Page 10 - Registro Civil de Nascimento */
              <div style={{ padding: '8px 10px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', background: '#fff', overflow: 'hidden', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  {/* Breadcrumb */}
                  <div style={{ fontSize: '3.0px', color: '#888', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '0.3px solid #eee', paddingBottom: '2.5px', marginBottom: '4px', textAlign: 'left' }}>
                    Para a família e Cuidadores
                  </div>
                  
                  {/* Title + Intro + Illustration Row */}
                  <div style={{ display: 'flex', gap: '6px', width: '100%', alignItems: 'flex-start', marginTop: '2px' }}>
                    <div style={{ flex: 1.25, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div style={{ fontSize: '6.8px', fontWeight: 700, color: '#000', fontFamily: "'Amelie', cursive", textAlign: 'left', lineHeight: 1.1 }}>
                        Registro Civil de Nascimento <span style={{ fontSize: '4.8px' }}>(RCN)</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '2.7px', color: '#000', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.35, textAlign: 'justify', fontWeight: 500 }}>
                        O RCN é o documento que garante a cidadania do bebê, assegurada pela Constituição Federal de 1988 (art. 5º, inciso LXXVI, alínea a) e reafirmada pela Lei nº 9.534, de 1997, que tornou o registro gratuito para todos. Você pode registrar seu filho na maternidade/hospital onde ele nasceu ou no Cartório de Registro Civil da cidade onde a família mora.
                      </p>
                    </div>
                    <div style={{ flex: 0.75, height: '48px', borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea', flexShrink: 0 }}>
                      <img
                        src="/carderneta img/101-103-103.png"
                        alt="Registro Civil de Nascimento"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Section 1: Atenção! */}
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '3px' }}>
                  <div style={{ fontSize: '3.8px', fontWeight: 700, color: mainColor, fontFamily: "'Montserrat', sans-serif" }}>
                    Atenção!
                  </div>
                  <p style={{ margin: 0, fontSize: '2.7px', color: '#000', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, textAlign: 'justify', fontWeight: 500 }}>
                    A mãe ou o pai, juntos ou separados, podem registrar o bebê. Se um dos pais não puder, o outro terá até 45 dias para fazer o registro (Lei nº 13.112, de 2015).
                  </p>
                  <p style={{ margin: 0, fontSize: '2.7px', color: '#000', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, textAlign: 'justify', fontWeight: 500 }}>
                    Para fazer o registro, é preciso apresentar a via amarela da Declaração de Nascido Vivo (DNV), fornecida pela maternidade ou hospital. Além disso:
                  </p>
                  
                  {/* Bullet list */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4px', textAlign: 'left', paddingLeft: '4px' }}>
                    {[
                      'Se os pais forem casados, é preciso a Certidão de Casamento.',
                      'Se não forem casados, basta um documento de identificação válido (Carteira de Identidade, CNH ou Carteira de Trabalho).',
                      'Pais menores de 16 anos precisam ir com um dos avós do bebê.'
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '2px', alignItems: 'flex-start', textAlign: 'left' }}>
                        <span style={{ fontSize: '3.3px', color: mainColor, lineHeight: 1, flexShrink: 0, marginTop: '0.5px' }}>•</span>
                        <span style={{ fontSize: '2.7px', color: '#000', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Row: Illustration + Importante */}
                <div style={{ display: 'flex', gap: '6px', width: '100%', alignItems: 'center' }}>
                  <div style={{ flex: 0.9, height: '48px', borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea', flexShrink: 0 }}>
                    <img
                      src="/carderneta img/AI_Image71.jpg"
                      alt="Importante RCN"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ flex: 1.1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ fontSize: '3.8px', fontWeight: 700, color: mainColor, fontFamily: "'Montserrat', sans-serif" }}>
                      Importante!
                    </div>
                    <p style={{ margin: 0, fontSize: '2.7px', color: '#000', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, textAlign: 'justify', fontWeight: 500 }}>
                      Se o bebê nasceu em casa ou fora do hospital, sem DNV, os pais devem comparecer ao cartório com duas testemunhas maiores de 18 anos que possam confirmar a gravidez e o parto.
                     </p>
                   </div>
                 </div>
               </div>
             )}
             {activeSpread === 6 && (
               /* Page 12 - Direitos da Mãe */
               <div style={{ padding: '8px 10px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', background: '#fff', overflow: 'hidden', justifyContent: 'space-between' }}>
                 {/* Header Section */}
                 <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                   {/* Breadcrumb */}
                   <div style={{ fontSize: '3.0px', color: '#888', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '0.3px solid #eee', paddingBottom: '2.5px', marginBottom: '4px', textAlign: 'left' }}>
                     Para a família e Cuidadores
                   </div>
                 </div>
 
                 {/* Main Content Area - 2 Columns */}
                 <div style={{ display: 'flex', gap: '4px', flex: 1, overflow: 'hidden', marginTop: '2px' }}>
                   {/* Left Column: Bullets (~58% width) */}
                   <div style={{ flex: 1.15, display: 'flex', flexDirection: 'column', height: '100%' }}>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                       <div style={{ fontSize: '4.2px', fontWeight: 700, color: mainColor, fontFamily: "'Montserrat', sans-serif", marginBottom: '2px', textAlign: 'left' }}>
                         São direitos da mãe:
                       </div>
                       
                       {/* Bullet list of all 14 mother rights in compact Montserrat */}
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9px', textAlign: 'left' }}>
                         {[
                           'Escolher um acompanhante que ficará ao seu lado durante o pré-parto, o parto e o pós-parto.',
                           'Permanecer na maternidade ou no hospital em alojamento conjunto com o filho.',
                           'Receber orientações e aconselhamento sobre amamentação.',
                           'Receber, ao momento da alta, orientações sobre quando e onde deverá fazer suas consultas de pós-parto e as consultas de acompanhamento de seu filho.',
                           'Ter licença-maternidade de 120 dias ou mais. Para as mães adotivas a duração da licença-maternidade varia conforme a idade da criança adotada.',
                           'Ter estabilidade no emprego até cinco meses após o parto.',
                           'Ter dois períodos de meia hora por dia para amamentar durante a jornada de trabalho, até que o bebê complete 6 meses. Se a saúde do bebê exigir, esses períodos poderão ser mantidos por mais tempo, conforme recomendação do médico.',
                           'Acompanhar o filho durante todo o tempo em que ele permanecer hospitalizado em enfermaria ou em unidade de terapia intensiva ou semi-intensiva.',
                           'Acompanhar o filho em creche ou pré-escola durante o período de adaptação.',
                           'Ter acesso às informações sobre serviços, programas de transferência de renda e benefícios assistenciais a que o filho possa ter direito.',
                           'Acompanhar a participação do filho nos serviços de assistência social prestados pela rede socioassistencial do Sistema Único de Assistência Social (SUAS).',
                           'Conhecer e participar do projeto pedagógico da creche, da pré-escola e da escola que o filho frequenta.',
                           'Ter ampliada a licença-maternidade para 180 dias, no caso de empresa privada que tenha aderido à Lei da Empresa Cidadã.',
                           'Ter acesso a creche no local de trabalho, ou a creche conveniada pela empresa, caso esta possua mais de 30 mulheres com mais de 16 anos de idade.'
                         ].map((item, i) => (
                           <div key={i} style={{ display: 'flex', gap: '1.5px', alignItems: 'flex-start' }}>
                             <span style={{ fontSize: '3.6px', color: mainColor, lineHeight: 1, flexShrink: 0, marginTop: '0.3px' }}>•</span>
                              <span style={{ fontSize: '2.5px', color: '#000', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.15, fontWeight: 500, letterSpacing: '0.3px', textAlign: 'left' }}>{item}</span>
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
 
                   {/* Right Column: Pregnant reading illustration + "Importante!" box (~42% width) */}
                   <div style={{ flex: 0.85, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                     {/* Top Right: Pregnant reading in armchair illustration */}
                     <div style={{ height: '76px', width: '100%', borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                       <img
                         src="/carderneta img/troca de fraldas.jpg"
                         alt="Direitos da Mãe Gestante"
                         style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                       />
                     </div>
 
                     {/* Bottom Right: "Importante!" amamentação callout box */}
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left', background: '#fafafa', padding: '5px 8px', borderRadius: '4px', border: '0.5px solid #eee' }}>
                       <div style={{ fontSize: '4.2px', fontWeight: 800, color: mainColor, fontFamily: "'Montserrat', sans-serif", textTransform: 'uppercase' }}>
                         Importante!
                       </div>
                       <p style={{ margin: 0, fontSize: '3.5px', color: '#000', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, textAlign: 'left', fontWeight: 500 }}>
                         Muitas empresas já oferecem lugar apropriado para amamentação com privacidade, conforto e higiene, para que a mãe possa amamentar ou retirar seu leite e armazená-lo durante toda a jornada de trabalho.
                       </p>
                     </div>
                   </div>
                 </div>
               </div>
             )}
            {activeSpread === 7 && (
              /* Page 14 - Prevenir Doenças pela Triagem Neonatal e Vacinação */
              <div style={{ padding: '14px 10px 8px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', background: '#fff', overflow: 'hidden', position: 'relative' }}>
                {/* Breadcrumb — fixed at top */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, fontSize: '3.0px', color: '#888', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '0.3px solid #eee', padding: '3px 10px 2.5px', textAlign: 'right' }}>
                  Cuidando da Saúde da Criança
                </div>

                {/* Section title */}
                <div style={{ fontSize: '3.8px', fontWeight: 800, color: '#000', fontFamily: "'Montserrat', sans-serif", textAlign: 'left', lineHeight: 1.2, marginBottom: '4px', letterSpacing: '0.2px' }}>
                  Prevenir Doenças pela Triagem Neonatal e Vacinação
                </div>

                {/* Intro text full width */}
                <p style={{ margin: '0 0 3px', fontSize: '2.5px', color: '#000', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500, letterSpacing: '0.3px' }}>
                  A triagem neonatal é uma ação preventiva que permite identificar, em tempo oportuno, distúrbios e doenças congênitas, e realizar acompanhamento e tratamento para diminuir ou eliminar os danos associados a eles. A triagem neonatal inclui os testes do pezinho, do olhinho, da orelhinha e do coraçãozinho, que devem ser realizados nos primeiros dias de vida para verificar a presença de doenças que, se descobertas bem cedo, podem ser tratadas com sucesso.
                </p>

                {/* 2-column: image left, tips right */}
                <div style={{ display: 'flex', gap: '4px', flex: 1, minHeight: 0 }}>
                  {/* Left: image */}
                  <div style={{ width: '38%', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                    <img
                      src="/carderneta img/AI_Image62.jpg"
                      alt="Médica e mãe com bebê"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }}
                    />
                  </div>

                  {/* Right: tips + texts */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ background: '#f5f7fa', borderRadius: '4px', padding: '4px 6px', border: `0.5px solid ${mainColor}`, marginTop: '15px' }}>
                      <p style={{ margin: 0, fontSize: '2.5px', fontWeight: 700, color: mainColor, fontFamily: "'Montserrat', sans-serif", lineHeight: 1.4, letterSpacing: '0.3px', textAlign: 'center' }}>
                        Pergunte ao profissional de saúde sobre esses testes.
                      </p>
                    </div>

                    <p style={{ margin: 0, fontSize: '2.5px', color: '#000', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500, letterSpacing: '0.3px' }}>
                      A vacinação é essencial para manter a criança saudável. Na maioria das vezes, mesmo com febre, gripada ou com outros sintomas, a criança pode ser vacinada. Na dúvida, converse com a equipe de saúde.
                    </p>

                    <div style={{ background: '#f5f7fa', borderRadius: '4px', padding: '4px 6px', border: `0.5px solid ${mainColor}` }}>
                      <p style={{ margin: 0, fontSize: '2.5px', fontWeight: 700, color: mainColor, fontFamily: "'Montserrat', sans-serif", lineHeight: 1.4, letterSpacing: '0.3px', textAlign: 'center' }}>
                        Amamente o bebê durante a aplicação das injeções.
                      </p>
                    </div>

                    <p style={{ margin: 0, fontSize: '2.5px', color: '#000', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500, letterSpacing: '0.3px' }}>
                      O Calendário Nacional de Vacinação traz os nomes de todas as vacinas que seu filho precisa tomar para ficar protegido de doenças. As vacinas são de graça e estão sempre disponíveis nas unidades básicas e durante as campanhas de vacinação.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {activeSpread === 8 && (
              /* Page 16 - Os Primeiros Dias: Alimentação + Sono */
              <div style={{ padding: '14px 10px 8px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', background: '#fff', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, fontSize: '3.0px', color: '#888', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '0.3px solid #eee', padding: '3px 10px 2.5px', textAlign: 'right' }}>
                  Os Primeiros Dias de Vida
                </div>

                <div style={{ fontSize: '3.5px', fontWeight: 800, color: mainColor, fontFamily: "'Montserrat', sans-serif", marginBottom: '2px', textAlign: 'left' }}>A alimentação</div>
                <p style={{ margin: '0 0 3px', fontSize: '2.5px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                  O leite materno contém tudo de que o bebê precisa para se nutrir. Além de ser a principal fonte de alimento, o peito é também uma fonte de proteção. Os bebês que se alimentam só no peito adoecem menos do que os demais. No início, o bebê precisa sugar tanto para se alimentar quanto para se sentir seguro no novo ambiente.
                </p>
                <p style={{ margin: '0 0 4px', fontSize: '2.5px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                  Pode ser que, nos primeiros dias, o leite demore a descer, mas isso não significa que há um problema. É normal os bebês perderem peso, mas por volta do décimo dia eles recuperam o peso de nascimento. É importante ter paciência e colocar o bebê no peito, pois mamar é o principal estímulo para a descida do leite. Deve-se evitar o uso de leites artificiais, que podem prejudicar a amamentação.
                </p>

                <div style={{ fontSize: '3.5px', fontWeight: 800, color: mainColor, fontFamily: "'Montserrat', sans-serif", marginBottom: '2px', textAlign: 'left' }}>O sono do bebê</div>

                {/* 2 colunas: texto esquerda, imagem direita — altura fixa */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px', alignItems: 'center' }}>
                  <p style={{ flex: 1, margin: 0, fontSize: '2.5px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                    O bebê recém-nascido dorme muito. Por isso, ele precisa de um lugar tranquilo, arejado e limpo para dormir. Cuide para que ele permaneça de barriga para cima. Observe se sua boca e nariz estão descobertos. Não use travesseiro e cobertor e agasalhe-o com roupa adequada à temperatura do ambiente. Para facilitar os cuidados e a amamentação durante a noite, nos primeiros meses de vida, coloque o berço ou a rede do bebê ao lado da cama ou da rede dos pais ou cuidadores. Durante o dia o sono do bebê pode ser em ambiente normalmente iluminado e com exposição ao barulho normal e à noite em ambiente escuro e silencioso.
                  </p>
                  <div style={{ width: '38%', height: '50px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                    <img src="/carderneta img/sono.jpg" alt="Bebê dormindo" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                </div>

                {/* O banho */}
                <div style={{ fontSize: '3.5px', fontWeight: 800, color: mainColor, fontFamily: "'Montserrat', sans-serif", marginBottom: '2px', textAlign: 'left' }}>O banho</div>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <div style={{ width: '35%', height: '45px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                    <img src="/carderneta img/banho.jpg" alt="Mãe dando banho no bebê" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                  <p style={{ flex: 1, margin: 0, fontSize: '2.5px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                    A hora do banho pode ser um momento muito relaxante. Faça seu filho sentir-se seguro: segure-o com firmeza e fale com ele. Prefira uma banheira, bacia ou balde. Use água morna e sabonete neutro. Nunca coloque seu filho na água sem antes experimentar a temperatura com a própria mão. Seque bem as dobrinhas da pele e o umbigo antes de vestir a roupinha.
                  </p>
                </div>
              </div>
            )}
            {activeSpread === 9 && (
              /* Page 18 - As fezes + A limpeza de roupas */
              <div style={{ padding: '14px 10px 8px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', background: '#fff', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, fontSize: '3.0px', color: '#888', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '0.3px solid #eee', padding: '3px 10px 2.5px', textAlign: 'right' }}>
                  Os Primeiros Dias de Vida
                </div>

                <div style={{ fontSize: '3.5px', fontWeight: 800, color: mainColor, fontFamily: "'Montserrat', sans-serif", marginBottom: '2px', textAlign: 'left' }}>As fezes</div>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px', alignItems: 'center' }}>
                  <p style={{ flex: 1, margin: 0, fontSize: '2.5px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                    Observe as fezes do seu filho. A quantidade de vezes que a criança faz cocô varia muito: ela pode fazer várias vezes ao dia (especialmente após as mamadas) ou ficar até dois ou três dias sem fazer cocô, ou mais, se estiver mamando só no peito. Nos primeiros dias de vida, as fezes costumam ser escuras, tornando-se amareladas durante a primeira semana. Também podem ser líquidas e, às vezes, esverdeadas. Se a criança estiver bem, se não apresentar nenhum outro sintoma, isso não é diarreia.
                  </p>
                  <div style={{ width: '35%', height: '52px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                    <img src="/carderneta img/101-103-101.png" alt="Mãe com bebê" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                </div>
                <p style={{ margin: '0 0 4px', fontSize: '2.5px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                  É mais importante observar o estado geral do seu filho e o esforço dele para fazer cocô, antes de pensar que há algo anormal.
                </p>

                <div style={{ fontSize: '3.5px', fontWeight: 800, color: mainColor, fontFamily: "'Montserrat', sans-serif", marginBottom: '2px', textAlign: 'left' }}>A limpeza de roupas e objetos</div>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px', alignItems: 'center' }}>
                  <div style={{ width: '35%', height: '40px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                    <img src="/carderneta img/101-103-102.png" alt="Limpeza de roupas" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                  <p style={{ flex: 1, margin: 0, fontSize: '2.5px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                    As roupas, os objetos e os brinquedos de seu filho devem ser lavados com água e sabão neutro e estar bem secos quando forem usados por ele. Evite o uso de produtos perfumados, de sabão em pó e amaciante. Procure usar produtos de limpeza como sabão neutro, álcool ou vinagre.
                  </p>
                </div>

                <div style={{ fontSize: '3.5px', fontWeight: 800, color: mainColor, fontFamily: "'Montserrat', sans-serif", marginBottom: '2px', textAlign: 'left' }}>Os cuidados especiais com o ambiente</div>
                <p style={{ margin: '0 0 2px', fontSize: '2.5px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500, textAlign: 'left' }}>
                  Os recém-nascidos são muito sensíveis. Portanto, procure evitar:
                </p>
                <div style={{ display: 'flex', gap: '4px', flex: 1, minHeight: 0 }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {[
                      'Sair com seu filho para lugares com muita gente, barulho e poluição — prefira locais mais tranquilos;',
                      'Fumaça e cheiro de cigarro no ambiente de casa — fazem mal à saúde de todos, principalmente dos bebês;',
                      'Produtos com cheiro muito forte e ambientes com pouca ventilação;',
                      'Brinquedos de pelúcia ou contato direto com roupas de lã;',
                      'Aproximar o bebê de animais, considerando as reações inesperadas que podem machucar.',
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '2px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '3px', color: mainColor, flexShrink: 0, marginTop: '0.5px' }}>•</span>
                        <span style={{ fontSize: '2.5px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500, textAlign: 'left' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ width: '35%', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                    <img src="/carderneta img/101-103-103.png" alt="Mãe com carrinho" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                </div>
              </div>
            )}
            {activeSpread === 10 && (
              /* Page 20 - Cuidados: Diarreia (LEFT) */
              <div style={{ padding: '14px 10px 6px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '2px', justifyContent: 'space-between', background: '#fff', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, fontSize: '3.0px', color: '#888', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '0.3px solid #eee', padding: '3px 10px 2.5px', textAlign: 'right', fontStyle: 'italic' }}>Cuidados a saúde do bebê</div>
                <div style={{ fontSize: '5.5px', fontWeight: 900, color: '#333', fontFamily: "'Montserrat', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cuidados</div>
                {/* Linha superior: 2 colunas */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ fontSize: '2.8px', fontWeight: 800, color: mainColor, fontFamily: "'Montserrat', sans-serif" }}>Para evitar a diarreia</div>
                    {['Amamente seu filho até os 2 anos ou mais. Nos primeiros seis meses, dê somente leite materno.','Lave bem as mãos antes de preparar os alimentos, depois de usar o banheiro e antes e depois de lidar com o bebê, principalmente depois das trocas de fraldas.','Prepare os alimentos até duas horas antes de oferecê-los ao bebê.','Só ofereça alimentos guardados na geladeira por, no máximo, 24 horas.','Mantenha a criança alimentada.'].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '1.5px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '3px', color: mainColor, flexShrink: 0 }}>•</span>
                        <span style={{ fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500, textAlign: 'left' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <p style={{ margin: 0, fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500 }}>
                      Se o seu bebê estiver utilizando outro tipo de leite em algum utensílio, todos os materiais devem ser bem lavados com bastante água, detergente ou sabão e uma escova apropriada. Depois de lavados, devem ser fervidos durante 15 minutos. Após a higienização e fervura, deixe secar naturalmente.
                    </p>
                    <div style={{ height: '42px', borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea', flexShrink: 0 }}>
                      <img src="/carderneta img/101-103-101.png" alt="Criança doente" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                    </div>
                  </div>
                </div>

                {/* Card unificado: ofereça + não ofereça */}
                <div style={{ background: `${mainColor}10`, border: `0.5px solid ${mainColor}40`, borderRadius: '3px', padding: '2px 4px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5px' }}>
                    <div style={{ fontSize: '2.8px', fontWeight: 800, color: mainColor, fontFamily: "'Montserrat', sans-serif" }}>Durante a diarreia, ofereça:</div>
                    {['O peito quantas vezes a criança pedir.','Alimentos que a criança já come, em pequenas quantidades para evitar vômitos.','Se não estiver só no peito: água, chás, sucos, água de coco (sem açúcar).'].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '1.5px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '3px', color: mainColor, flexShrink: 0 }}>•</span>
                        <span style={{ fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5px' }}>
                    <div style={{ fontSize: '2.8px', fontWeight: 800, color: mainColor, fontFamily: "'Montserrat', sans-serif" }}>Não ofereça:</div>
                    {['Alimentos ricos em gordura e fibras (verduras, laranja, mamão etc.).','Refrigerantes, bebidas com açúcar, balas, bombons, pirulitos, chicletes.'].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '1.5px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '3px', color: mainColor, flexShrink: 0 }}>•</span>
                        <span style={{ fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500 }}>{item}</span>
                      </div>
                    ))}
                    <p style={{ margin: 0, fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500 }}>
                      Se isso acontecer, leve ao serviço de saúde. Se vomitando e fezes muito líquidas, ofereça o soro de reidratação oral antes de chegar ao serviço.
                    </p>
                  </div>
                </div>

                {/* IMPORTANTE */}
                <div style={{ background: `${mainColor}15`, border: `0.5px solid ${mainColor}40`, borderRadius: '3px', padding: '2px 3px' }}>
                  <div style={{ fontSize: '2.8px', fontWeight: 900, color: mainColor, fontStyle: 'italic' }}>IMPORTANTE! — São sinais de desidratação:</div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[['Estar com os olhos fundos','Sentir muita sede','Chorar sem lágrimas'],['Ter pouca saliva','Urinar pouco']].map((col, ci) => (
                      <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                        {col.map((s, i) => (
                          <div key={i} style={{ display: 'flex', gap: '1.5px' }}>
                            <span style={{ fontSize: '3px', color: mainColor }}>•</span>
                            <span style={{ fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25 }}>{s}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeSpread === 11 && (
              /* Page 22 - Amamentando o Bebê (LEFT) */
              <div style={{ padding: '14px 10px 6px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '2px', justifyContent: 'space-between', background: '#fff', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, fontSize: '3.0px', color: '#888', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '0.3px solid #eee', padding: '3px 10px 2.5px', textAlign: 'right', fontStyle: 'italic' }}>Amamentando o bebê</div>

                <div style={{ fontSize: '5.5px', fontWeight: 900, color: '#333', fontFamily: "'Montserrat', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amamentando o Bebê</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ fontSize: '2.8px', fontWeight: 800, color: '#333', fontFamily: "'Montserrat', sans-serif" }}>Importância do Leite Materno</div>
                  <p style={{ margin: 0, fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                    O leite materno é um alimento completo. É o alimento recomendado para as crianças até os 2 anos ou mais. Até os 6 meses, deve ser o único alimento. Seu filho não precisa de chá, suco, água ou outro leite. O uso de água ou chá antes do 6° mês pode atrapalhar o aleitamento e aumenta o risco de o bebê ficar doente.
                  </p>
                  <p style={{ margin: 0, fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                    Em clima quente, ofereça o peito mais vezes. Inicialmente o bebê mama de 8 a 12 vezes por dia, e com o tempo vai fazendo seu próprio horário. Não é necessário fixar horários. Quanto mais seu filho mamar, melhor será a sua produção de leite.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ fontSize: '2.8px', fontWeight: 800, color: '#333', fontFamily: "'Montserrat', sans-serif" }}>Melhor para a criança</div>
                  <p style={{ margin: 0, fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                    O leite materno é de fácil digestão, limpo, gratuito, sempre pronto e quentinho. Protege o bebê de diarreia, infecções respiratórias, alergias, pressão alta, colesterol, diabetes e obesidade na vida adulta. Sugar o peito fortalece os músculos da face e ajuda o bebê a desenvolver a respiração, a fala e a ter dentes saudáveis.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ fontSize: '2.8px', fontWeight: 800, color: '#333', fontFamily: "'Montserrat', sans-serif" }}>Melhor para a mãe</div>
                  <p style={{ margin: 0, fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                    Ajuda a reduzir o peso adquirido durante a gravidez. Ajuda o útero a recuperar seu tamanho normal, diminuindo o risco de hemorragia e anemia. Reduz o risco de doenças como diabetes, câncer de mama e de ovário.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                  <div style={{ flex: 1, background: `${mainColor}15`, border: `0.5px solid ${mainColor}40`, borderRadius: '3px', padding: '2px 4px' }}>
                    <div style={{ fontSize: '2.8px', fontWeight: 900, color: mainColor, fontStyle: 'italic' }}>IMPORTANTE!</div>
                    <p style={{ margin: 0, fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                      Além de garantir os nutrientes necessários ao crescimento saudável, a amamentação favorece a comunicação entre a mãe e o bebê. O contato corporal, a troca de olhares e as carícias durante as mamadas ajudam mãe e filho a se conhecerem.
                    </p>
                  </div>
                  <div style={{ width: '35%', height: '45px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                    <img src="/carderneta img/amamentar.jpg" alt="Mãe amamentando" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                  </div>
                </div>
              </div>
            )}
            {activeSpread === 12 && (
              /* Page 24 - Tempo de mamada + Leite + Dificuldades */
              <div style={{ padding: '14px 10px 6px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '2px', background: '#fff', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, fontSize: '3.0px', color: '#888', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '0.3px solid #eee', padding: '3px 10px 2.5px', textAlign: 'right', fontStyle: 'italic' }}>Amamentando o bebê</div>

                {/* Tempo de mamada — imagem DIREITA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                  <div style={{ fontSize: '2.8px', fontWeight: 800, color: '#333', fontFamily: "'Montserrat', sans-serif", textAlign: 'left' }}>Tempo de mamada</div>
                  <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 3px', flex: 1 }}>
                      {['Cada bebê tem seu ritmo — deixe mamar até ficar satisfeito.','Não tenha pressa. Converse e faça carinho durante a mamada.','Depois, coloque-o na vertical para arrotar.','Banho diário e sutiã limpo são suficientes para os mamilos.','Alimente-se bem, hidrate-se e evite álcool, cigarro e drogas.','Não faça dietas para emagrecer durante a amamentação.','Remédios em geral não impedem a amamentação — consulte a equipe de saúde.','Para evitar nova gravidez, procure orientação no serviço de saúde.'].map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1.5px', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '3px', color: mainColor, flexShrink: 0 }}>•</span>
                          <span style={{ fontSize: '2.2px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500, textAlign: 'left' }}>{item}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ width: '30%', height: '50px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                      <img src="/carderneta img/A mother breastfeeding her newborn.jpeg" alt="Mãe amamentando" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                    </div>
                  </div>
                </div>

                {/* Qualidade do leite — imagem ESQUERDA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', marginTop: '4px' }}>
                  <div style={{ fontSize: '2.8px', fontWeight: 800, color: '#333', fontFamily: "'Montserrat', sans-serif", textAlign: 'right' }}>Quantidade e qualidade do leite</div>
                  <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                    <div style={{ width: '30%', height: '44px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                      <img src="/carderneta img/A glass bottle of milk .jpeg" alt="Banco de leite" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <p style={{ margin: 0, fontSize: '2.2px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500, textAlign: 'left' }}>
                        Todo leite materno é forte e bom. Quanto mais seu filho suga, mais leite você produz. O leite do início mata a sede; o do fim tem mais gordura e faz o bebê ganhar peso.
                      </p>
                      <div style={{ background: `${mainColor}15`, border: `0.5px solid ${mainColor}40`, borderRadius: '3px', padding: '2px 3px', marginTop: '4px' }}>
                        <div style={{ fontSize: '2.5px', fontWeight: 900, color: mainColor, fontStyle: 'italic', textAlign: 'left' }}>IMPORTANTE!</div>
                        <p style={{ margin: 0, fontSize: '2.2px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500, textAlign: 'left' }}>
                          Se o bebê dorme bem e ganha peso, o leite está sendo suficiente. Se sobra leite, você pode doar a um banco de leite humano — informe-se em rblh.fiocruz.br.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dificuldades — sem imagem */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginTop: '9px' }}>
                  <div style={{ fontSize: '2.8px', fontWeight: 800, color: '#333', fontFamily: "'Montserrat', sans-serif", textAlign: 'left' }}>Dificuldades na Amamentação</div>
                  <p style={{ margin: 0, fontSize: '2.2px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500, textAlign: 'left' }}>
                    Retire um pouco de leite antes de cada mamada para amaciar a mama. Se o bico rachar, passe seu próprio leite na rachadura. Mamas empedradas devem ser esvaziadas — aumente a frequência das mamadas, inclusive à noite. Se não melhorar, procure um profissional ou banco de leite humano.
                  </p>
                </div>

                {/* ATENÇÃO HIV */}
                <div style={{ background: `${mainColor}15`, border: `0.5px solid ${mainColor}40`, borderRadius: '3px', padding: '2px 3px', marginTop: '10px' }}>
                  <div style={{ fontSize: '2.5px', fontWeight: 900, color: mainColor, fontStyle: 'italic', textAlign: 'left' }}>ATENÇÃO!</div>
                  <p style={{ margin: 0, fontSize: '2.2px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500, textAlign: 'left' }}>
                    Mães com HIV positivo não devem amamentar. Logo após o parto, o bebê deve ser colocado em contato pele a pele (sem mamar). Mãe e bebê devem ficar em alojamento conjunto.
                  </p>
                </div>
              </div>
            )}
            {activeSpread === -1 && (
              /* Page 26 - Retorno ao Trabalho (LEFT) */
              <div style={{ padding: '14px 10px 6px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '3px', justifyContent: 'space-between', background: '#fff', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, fontSize: '3.0px', color: '#888', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '0.3px solid #eee', padding: '3px 10px 2.5px', textAlign: 'right', fontStyle: 'italic' }}>Retirando, armazenando e oferecendo o leite</div>

                <div style={{ fontSize: '4px', fontWeight: 900, color: '#333', fontFamily: "'Montserrat', sans-serif", textTransform: 'uppercase', letterSpacing: '0.3px', lineHeight: 1.2 }}>Retorno da Mãe ao Trabalho ou à Escola</div>

                <p style={{ margin: 0, fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                  Se você precisar voltar ao trabalho ou à escola antes de seu filho completar 6 meses, organize-se pelo menos 15 dias antes para retirar e guardar o leite. Caso o leite vá à creche, ele precisa estar identificado com o nome da criança e a data.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5px' }}>
                  <div style={{ fontSize: '2.8px', fontWeight: 800, color: '#333', fontFamily: "'Montserrat', sans-serif", textAlign: 'left', marginBottom: '1px' }}>Preparo do frasco para guardar o leite</div>
                  <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5px' }}>
                      {['Escolha um frasco de vidro incolor com tampa plástica.','Retire o rótulo e o papel de dentro da tampa.','Lave bem com água e sabão; ferva a tampa e o frasco por 15 minutos.','Coloque sobre pano limpo para secar.','Feche sem tocar na parte interna da tampa.','Identifique com nome, data e hora da retirada.'].map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1.5px', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '3px', color: mainColor, flexShrink: 0 }}>•</span>
                          <span style={{ fontSize: '2.2px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ width: '32%', height: '40px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                      <img src="/carderneta img/washing glass bottle.jpeg" alt="Preparo frasco" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                  <div style={{ width: '32%', height: '38px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                    <img src="/carderneta img/Woman with hair cap.jpeg" alt="Higiene coleta" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5px' }}>
                    <div style={{ fontSize: '2.8px', fontWeight: 800, color: '#333', fontFamily: "'Montserrat', sans-serif", textAlign: 'left', marginBottom: '1px' }}>Higiene pessoal para a coleta</div>
                    {['Retire anéis, aliança, pulseiras e relógio.','Coloque touca ou lenço no cabelo.','Lave mãos e braços até o cotovelo com água e sabão.','Lave as mamas apenas com água limpa.','Seque com toalha ou pano limpo.'].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '1.5px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '3px', color: mainColor, flexShrink: 0 }}>•</span>
                        <span style={{ fontSize: '2.2px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
            {activeSpread === 13 && (
              /* Page 28 - Conservar → Descongelar e Oferecer → Atenção/Saiba que */
              <div style={{ padding: '14px 10px 6px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '3px', background: '#fff', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, fontSize: '3.0px', color: '#888', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '0.3px solid #eee', padding: '3px 10px 2.5px', textAlign: 'right', fontStyle: 'italic' }}>Retirando, armazenando e oferecendo o leite</div>

                {/* 1. Como conservar — imagem esquerda */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                  <div style={{ fontSize: '2.8px', fontWeight: 800, color: '#333', fontFamily: "'Montserrat', sans-serif", textAlign: 'left' }}>Como conservar o leite</div>
                  <div style={{ display: 'flex', gap: '3px', alignItems: 'center', marginTop: '3px' }}>
                    <div style={{ width: '28%', height: '34px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                      <img src="/carderneta img/Glass bottle with breast milk in refrigerator.jpeg" alt="Conservar leite" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      {['Geladeira: até 12h · Freezer/congelador: até 15 dias.','Guarde imediatamente após a retirada.','Se o frasco não ficar cheio, complete na próxima coleta do mesmo dia.','Para doação, faça-o até 10 dias após a retirada.'].map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1.5px', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '3px', color: mainColor, flexShrink: 0 }}>•</span>
                          <span style={{ fontSize: '2.2px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500, textAlign: 'left' }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Como descongelar e oferecer — imagem direita */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                  <div style={{ fontSize: '2.8px', fontWeight: 800, color: '#333', fontFamily: "'Montserrat', sans-serif", textAlign: 'left' }}>Como descongelar e oferecer</div>
                  <div style={{ display: 'flex', gap: '3px', alignItems: 'center', marginTop: '3px' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      {['Ofereça de preferência em copo, xícara ou colher.','Aqueça em banho-maria (água morna, fogo desligado). Nunca ferva nem use micro-ondas.','Amorne apenas a quantidade que o bebê for tomar — o que sobrar descarte.','O leite descongelado e não aquecido pode ser guardado na geladeira por até 12 horas.'].map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1.5px', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '3px', color: mainColor, flexShrink: 0 }}>•</span>
                          <span style={{ fontSize: '2.2px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500, textAlign: 'left' }}>{item}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ width: '28%', height: '40px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                      <img src="/carderneta img/soro.jpg" alt="Banho-maria" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                    </div>
                  </div>
                </div>

                {/* 3. Atenção + Saiba que */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
                  <div style={{ background: `${mainColor}15`, border: `0.5px solid ${mainColor}40`, borderRadius: '3px', padding: '2px 3px' }}>
                    <div style={{ fontSize: '3px', fontWeight: 900, color: mainColor, fontFamily: "'Amelie', cursive" }}>Atenção!</div>
                    <p style={{ margin: '2px 0 0', fontSize: '2.2px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500, textAlign: 'left' }}>
                      O leite levado para a creche precisa ser transportado em caixa de isopor ou bolsa térmica. Certifique-se de que está sendo oferecido corretamente.
                    </p>
                  </div>
                  <div style={{ padding: '2px 3px' }}>
                    <p style={{ margin: 0, fontSize: '2.2px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500, textAlign: 'left' }}>
                      <span style={{ fontFamily: "'Amelie', cursive", fontSize: '3.5px', color: mainColor }}>Saiba que </span>os profissionais de creche podem apoiar as mães no retorno ao trabalho, planejando os cuidados com o leite retirado e formas de alimentar os bebês sem mamadeira.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* CENTRAL SPIRAL BINDING */}
          <div style={{
            width: '6px',
            height: '100%',
            background: 'linear-gradient(to right, #ccc, #f5f5f5 30%, #e0e0e0 50%, #b8b8b8 80%, #999)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            padding: '2px 0',
            boxShadow: '0 0 4px rgba(0,0,0,0.2)'
          }}>
            {Array.from({ length: 28 }).map((_, i) => (
              <div key={i} style={{
                height: '1.2px',
                width: '100%',
                background: 'linear-gradient(to bottom, #eaeaea, #ffffff 40%, #a3a3a3 70%, #666)',
                borderBottom: '0.2px solid #555',
                borderRadius: '0.5px'
              }} />
            ))}
          </div>

          {/* RIGHT PAGE */}
          <div style={{
            flex: 1,
            height: '100%',
            background: '#fff',
            borderTopRightRadius: '3px',
            borderBottomRightRadius: '3px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '3px 0 8px rgba(0,0,0,0.05) inset'
          }}>
            {activeSpread === 0 && renderCover()}
            {activeSpread === 1 && (
              <div style={{ padding: '18px 14px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', background: '#fff', textAlign: 'center', position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: '6px' }}>
                  <div style={{
                    fontFamily: "'Amelie', cursive",
                    fontSize: '15px',
                    fontWeight: 700,
                    color: mainColor,
                    lineHeight: 1.1,
                    marginBottom: '8px'
                  }}>
                    Guia de Amor<br/>e Proteção
                  </div>
                  
                  <div style={{
                    fontSize: '5.8px',
                    fontWeight: 700,
                    color: '#2C2A29',
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px',
                    fontFamily: "'Solea', 'Montserrat', sans-serif",
                    marginBottom: '10px'
                  }}>
                    Acompanhe o Desenvolvimento<br/>do seu bebê
                  </div>

                  <p style={{
                    fontSize: '4.5px',
                    color: '#444',
                    lineHeight: 1.5,
                    width: '95%',
                    margin: '0 0 12px 0',
                    fontFamily: "'Solea', 'Montserrat', sans-serif",
                    textAlign: 'justify'
                  }}>
                    Este livrinho é mais do que um simples registro – é um guia para acompanhar os primeiros passos e aprendizagens do seu pequeno. Aqui, cada página traz informações valiosas para cuidar com amor e entender melhor cada fase do desenvolvimento. Que este seja um companheiro nessa jornada cheia de descobertas e desafios, ajudando a transformar momentos simples em grandes aprendizados.
                  </p>
                </div>

                <div style={{
                  fontFamily: "'Amelie', cursive",
                  fontSize: '6.5px',
                  fontWeight: 600,
                  color: secondaryColor,
                  lineHeight: 1.3,
                  marginBottom: '8px',
                  width: '90%'
                }}>
                  Crescer é aprender a cada dia, e você faz parte dessa incrível aventura.
                </div>
              </div>
            )}
            {activeSpread === 2 && (
              <div style={{ padding: '12px 14px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fff', position: 'relative', overflow: 'hidden' }}>
                {comBorda && patternSrc && (
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${patternScale * 1.2}px`, backgroundRepeat: 'repeat', opacity: 0.05 }} />
                )}
                <div style={{ zIndex: 1, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{
                    fontFamily: "'Amelie', cursive",
                    fontSize: '11.0px',
                    fontWeight: 700,
                    color: '#000',
                    marginBottom: '6px',
                    textAlign: 'center'
                  }}>
                    Sumário
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '96%', flex: 1, justifyContent: 'center' }}>
                    {[
                      { title: "dados de nascimento", page: 7 },
                      { title: "para a família e cuidadores", page: 8 },
                      { title: "promovendo a saúde da criança", page: 13 },
                      { title: "cuidados nos primeiros dias de vida", page: 16 },
                      { title: "prematuros", page: 21 },
                      { title: "cuidados com a saúde do bebê", page: 23 },
                      { title: "amamentando", page: 27 },
                      { title: "retirando e armazenando o leite", page: 32 },
                      { title: "introdução alimentar", page: 43 },
                      { title: "desenvolvimento infantil mês a mês", page: 63 },
                      { title: "sinais de alerta", page: 67 },
                      { title: "saúde bucal", page: 70 },
                      { title: "uso dos eletrônicos e o consumo", page: 72 },
                      { title: "prevenindo acidentes", page: 75 },
                      { title: "protegendo a criança da violência", page: 76 },
                      { title: "registros", page: 93 },
                      { title: "gráficos de crescimento", page: 96 },
                      { title: "marcos de desenvolvimento", page: 107 },
                      { title: "vacinas", page: 112 }
                    ].map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', width: '100%', height: '6.0px' }}>
                        <span style={{ fontSize: '2.7px', fontWeight: 600, color: '#000', fontFamily: "'Montserrat', sans-serif" }}>{item.title}</span>
                        <div style={{ flex: 1, borderBottom: '0.5px dotted #ccc', margin: '0 4px', height: '3px' }} />
                        <span style={{ fontSize: '2.8px', fontWeight: 700, color: mainColor, fontFamily: "'Montserrat', sans-serif" }}>{item.page}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeSpread === 3 && (
              /* Page 7 - O Início da Nossa Jornada */
              <div style={{ padding: '8px 10px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', background: '#fff', position: 'relative', overflow: 'hidden', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  {/* Title */}
                  <div style={{ fontFamily: "'Amelie', cursive", fontSize: '6.8px', fontWeight: 700, color: '#222', lineHeight: 1.2, marginBottom: '4px', textAlign: 'center' }}>
                    O Início da Nossa Jornada
                  </div>

                  {/* Blue-gray data box */}
                  <div style={{ background: '#d8dde8', borderRadius: '4px', padding: '5px 8px', marginTop: '6px', marginBottom: '6px', display: 'flex', flexDirection: 'column', gap: '2.2px', textAlign: 'left', width: '100%', boxSizing: 'border-box' }}>
                    {[
                      'Nascido às _______ H, do dia ____/____/____',
                      'Maternidade/UF: ________________________________',
                      'Idade gestacional: _______ semanas _______ dias',
                    ].map((line, i) => (
                      <div key={i} style={{ fontSize: '3px', color: '#2C2A29', fontFamily: "'Solea', 'Montserrat', sans-serif", fontWeight: 700, letterSpacing: '0.1px', textTransform: 'uppercase' }}>{line}</div>
                    ))}
                    <div style={{ fontSize: '3px', color: '#2C2A29', fontFamily: "'Solea', 'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '2.5px', flexWrap: 'wrap' }}>
                      Tipo de parto:
                      {['Normal','Cesárea','Induzido'].map(t => (
                        <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: '1px' }}>
                          <svg viewBox="0 0 10 10" width="5" height="5"><circle cx="5" cy="5" r="4" fill="none" stroke="#555" strokeWidth="1.2"/></svg>{t}
                        </span>
                      ))}
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '1px' }}>
                        <svg viewBox="0 0 10 10" width="5" height="5"><circle cx="5" cy="5" r="4" fill="none" stroke="#555" strokeWidth="1.2"/></svg>Outro: __
                      </span>
                    </div>
                    <div style={{ fontSize: '3px', color: '#2C2A29', fontFamily: "'Solea', 'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      Sexo:
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '1px' }}><svg viewBox="0 0 10 10" width="5" height="5"><circle cx="5" cy="5" r="4" fill="none" stroke="#555" strokeWidth="1.2"/></svg>Masculino</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '1px' }}><svg viewBox="0 0 10 10" width="5" height="5"><circle cx="5" cy="5" r="4" fill="none" stroke="#555" strokeWidth="1.2"/></svg>Feminino</span>
                    </div>
                    {[
                      'Peso ao nascer: _______ Comprimento: _______',
                      'Tipagem: Bebê: _______ Da mamãe: _______',
                      'Quem estava no parto? _______________________',
                      'Médico(a) obstetra: __________________________',
                      'Quem cortou o cordão? _______________________',
                      'Alta: Mamãe: _________ Bebê: _________',
                    ].map((line, i) => (
                      <div key={i} style={{ fontSize: '3px', color: '#2C2A29', fontFamily: "'Solea', 'Montserrat', sans-serif", fontWeight: 700, letterSpacing: '0.1px', textTransform: 'uppercase' }}>{line}</div>
                    ))}
                  </div>

                  {/* Pain scale - Fully centered and spaced */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', textAlign: 'center', marginTop: '6px', marginBottom: '6px', width: '100%' }}>
                    <div style={{ fontSize: '3px', fontWeight: 700, color: '#333', fontFamily: "'Montserrat', sans-serif" }}>Como você avaliaria o parto? (Escala 0 a 10)</div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2.2px', margin: '2px 0' }}>
                      {Array.from({length: 11}, (_, i) => (
                        <svg key={i} viewBox="0 0 10 10" width="6.5" height="6.5">
                          <circle cx="5" cy="5" r="4" fill="none" stroke="#555" strokeWidth="1.2"/>
                        </svg>
                      ))}
                    </div>
                    <div style={{ fontSize: '2.4px', color: '#736E6A', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, textAlign: 'center', width: '100%' }}>
                      *0: Tranquilo, sem dor ou dificuldades.  *10: Complicado, com dores intensas.
                    </div>
                  </div>
                </div>

                {/* Bottom two columns */}
                <div style={{ display: 'flex', gap: '6px', width: '100%', marginBottom: '4px' }}>
                  {/* Triagem neonatal */}
                  <div style={{ flex: 1.1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '3.6px', fontWeight: 700, color: '#333', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.2px' }}>Triagem Neonatal</div>
                    {['Teste do Olhinho','Teste da Orelhinha','Teste da Linguinha','Teste do Coraçãozinho','Teste do Pezinho','Teste Ortolani'].map((t, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '2.2px', marginBottom: '1.5px' }}>
                        <svg viewBox="0 0 10 10" width="4.5" height="4.5"><rect x="1" y="1" width="8" height="8" rx="1.5" fill="none" stroke="#888" strokeWidth="1.2"/></svg>
                        <span style={{ fontSize: '2.8px', fontFamily: "'Montserrat', sans-serif", color: '#333', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1px' }}>{t}</span>
                      </div>
                    ))}
                  </div>

                  {/* Quem te visitou */}
                  <div style={{ flex: 0.9, border: '0.5px solid #bbb', borderRadius: '3px', padding: '4px', display: 'flex', flexDirection: 'column', background: '#fafafa' }}>
                    <div style={{ fontSize: '3px', fontWeight: 700, fontFamily: "'Montserrat', sans-serif", color: '#333', textAlign: 'center', marginBottom: '3px', lineHeight: 1.2 }}>Visitas na<br/>Maternidade</div>
                    {Array.from({length: 4}).map((_, i) => (
                      <div key={i} style={{ borderBottom: '0.4px solid #ccc', height: '7.5px' }} />
                    ))}
                  </div>
                </div>

                {/* Final word */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', width: '100%', marginBottom: '2px' }}>
                  <div style={{ fontSize: '2.8px', fontWeight: 700, fontFamily: "'Montserrat', sans-serif", color: '#333', lineHeight: 1.3, flexShrink: 0 }}>Palavra que define como se sentiu:</div>
                  <div style={{ flex: 1, borderBottom: '0.5px solid #888', height: '8px' }} />
                </div>
              </div>
            )}
            {activeSpread === 4 && (
              /* Page 9 - Direitos da Criança */
              <div style={{ padding: '8px 10px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', background: '#fff', overflow: 'hidden', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  {/* Breadcrumb */}
                  <div style={{ fontSize: '3.0px', color: '#888', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '0.3px solid #eee', paddingBottom: '2.5px', marginBottom: '4px', textAlign: 'left' }}>
                    Para a família e Cuidadores
                  </div>
                  {/* Title */}
                  <div style={{ fontSize: '8.2px', fontWeight: 700, color: '#000', fontFamily: "'Amelie', cursive", textAlign: 'center', marginBottom: '3px' }}>
                    Direitos da Criança
                  </div>
                  {/* Intro paragraph */}
                  <p style={{ margin: '0 0 4px 0', fontSize: '3.0px', color: '#000', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.35, textAlign: 'justify', fontWeight: 500 }}>
                    Toda criança tem os direitos à vida, à liberdade, à igualdade, à segurança, à dignidade e à proteção integral garantidos pela Constituição Federal de 1988, pelo Estatuto da Criança e do Adolescente (ECA) e por outras leis. As medidas para garantir e defender esses direitos são responsabilidade do governo, da sociedade e da família.
                  </p>
                </div>

                {/* Two columns */}
                <div style={{ display: 'flex', gap: '6px', flex: 1, overflow: 'hidden', width: '100%' }}>
                  {/* Left bullets */}
                  <div style={{ flex: 1.05, display: 'flex', flexDirection: 'column', gap: '1.4px', textAlign: 'left' }}>
                    <div style={{ fontSize: '3.8px', fontWeight: 700, color: mainColor, fontFamily: "'Montserrat', sans-serif", marginBottom: '2.0px', lineHeight: 1.3 }}>São direitos da criança:</div>
                    {[
                      'Receber identificação neonatal, por meio da Declaração de Nascido Vivo (DNV).',
                      'Receber o Registro Civil de Nascimento (RCN), que é gratuito e entregue, se possível, na maternidade.',
                      'Ser chamada pelo nome desde o nascimento.',
                      'Realizar gratuitamente os exames de triagem neonatal.',
                      'Ser acompanhada em seu crescimento e desenvolvimento.',
                      'Ter garantida a vacinação de acordo com a recomendação do Ministério da Saúde (MS).',
                      'Viver em um ambiente afetuoso e sem violência.',
                      'Ser acompanhada pelos pais e responsáveis, em período integral, durante a sua internação em hospitais.',
                      'Brincar e aprender.',
                      'Ter acesso à água potável e à alimentação saudável.',
                      'Ter acesso a serviços de saúde e de assistência social de qualidade.',
                      'Ter acesso a creches e escolas públicas de qualidade, localizadas próximo à sua residência.'
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '2px', alignItems: 'flex-start', textAlign: 'left' }}>
                        <span style={{ fontSize: '3.3px', color: mainColor, lineHeight: 1, flexShrink: 0, marginTop: '0.5px' }}>•</span>
                        <span style={{ fontSize: '2.7px', color: '#000', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500 }}>{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Right: illustration + more bullets */}
                  <div style={{ flex: 0.95, display: 'flex', flexDirection: 'column', gap: '1.4px', textAlign: 'left' }}>
                    {/* Illustration - Actual JPG Image from the customer! */}
                    <div style={{ width: '100%', height: '42px', borderRadius: '4px', overflow: 'hidden', marginBottom: '3px', flexShrink: 0, border: '0.5px solid #eaeaea' }}>
                      <img
                        src="/carderneta img/AI_Image72.jpg"
                        alt="Direitos da Criança"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    {[
                      'Ter acesso ao lazer e à prática de esportes.',
                      'Ter convivência familiar e comunitária. No caso de criança afastada da convivência familiar – por medida judicial para garantir a sua proteção –, é preciso viabilizar o seu retorno seguro ao convívio familiar, no menor tempo possível, prioritariamente na família de origem e excepcionalmente em família substituta.',
                      'Ter transferência de renda por meio do Programa Bolsa Família, quando a família está em situação de pobreza ou de extrema pobreza.',
                      'Receber o Benefício de Prestação Continuada da Assistência Social, no caso de crianças com deficiência e cuja família tenha renda familiar inferior a 1/4 (um quarto) do salário mínimo vigente e não possua meios para garantir o seu sustento.'
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '2px', alignItems: 'flex-start', textAlign: 'left' }}>
                        <span style={{ fontSize: '3.3px', color: mainColor, lineHeight: 1, flexShrink: 0, marginTop: '0.5px' }}>•</span>
                        <span style={{ fontSize: '2.7px', color: '#000', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500 }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeSpread === 5 && (
              /* Page 11 - Direitos dos Responsáveis */
              <div style={{ padding: '8px 10px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', background: '#fff', overflow: 'hidden', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  {/* Breadcrumb */}
                  <div style={{ fontSize: '3.0px', color: '#888', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '0.3px solid #eee', paddingBottom: '2.5px', marginBottom: '4px', textAlign: 'right' }}>
                    Para a família e Cuidadores
                  </div>
                  
                  {/* Title & Section 1 (São direitos do pai) */}
                  <div style={{ display: 'flex', gap: '6px', width: '100%', alignItems: 'flex-start', marginTop: '2px' }}>
                    <div style={{ flex: 1.1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div style={{ fontSize: '6.8px', fontWeight: 700, color: '#000', fontFamily: "'Amelie', cursive", textAlign: 'left', lineHeight: 1.1 }}>
                        Direitos dos Responsáveis
                      </div>
                      
                      <div style={{ fontSize: '3.8px', fontWeight: 700, color: mainColor, fontFamily: "'Montserrat', sans-serif", marginTop: '2px', textAlign: 'left' }}>
                        São direitos do pai:
                      </div>
                      
                      {/* First 5 father rights bullets */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4px', textAlign: 'left' }}>
                        {[
                          'Participar das consultas e exames de pré-natal durante a gravidez.',
                          'Estar ao lado no nascimento do filho.',
                          'Ficar junto ao filho sempre que ele estiver internado, seja em enfermaria ou em UTI.',
                          'Participar das consultas e exames de acompanhamento da saúde do filho.',
                          'Ter licença-paternidade de 5 dias a partir do nascimento do filho, prorrogáveis por mais 15 dias nas empresas cidadãs. A licença-paternidade é um direito de todos os pais, sejam biológicos ou adotivos.'
                        ].map((item, i) => (
                          <div key={i} style={{ display: 'flex', gap: '2px', alignItems: 'flex-start', textAlign: 'left' }}>
                            <span style={{ fontSize: '3.3px', color: mainColor, lineHeight: 1, flexShrink: 0, marginTop: '0.5px' }}>•</span>
                            <span style={{ fontSize: '2.7px', color: '#000', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500 }}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div style={{ flex: 0.9, height: '62px', borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea', flexShrink: 0 }}>
                      <img
                        src="/carderneta img/AI_Image44.jpg"
                        alt="Direitos do Pai"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Remaining 3 bullets (full width under top row) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4px', textAlign: 'left', width: '100%' }}>
                  {[
                    'Conhecer e participar do projeto pedagógico da creche, pré-escola ou escola onde o filho estuda.',
                    'Ter acesso às informações sobre programas de benefícios e assistência a que o filho tenha direito.',
                    'Acompanhar o filho nos serviços de assistência social da rede do SUAS (Sistema Único de Assistência Social).'
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '2px', alignItems: 'flex-start', textAlign: 'left' }}>
                      <span style={{ fontSize: '3.3px', color: mainColor, lineHeight: 1, flexShrink: 0, marginTop: '0.5px' }}>•</span>
                      <span style={{ fontSize: '2.7px', color: '#000', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500 }}>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom Row: Illustration + Atenção */}
                <div style={{ display: 'flex', gap: '6px', width: '100%', alignItems: 'center' }}>
                  <div style={{ flex: 0.9, height: '48px', borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea', flexShrink: 0 }}>
                    <img
                      src="/carderneta img/101-103-101.png"
                      alt="Atenção Responsáveis"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ flex: 1.1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ fontSize: '3.8px', fontWeight: 700, color: mainColor, fontFamily: "'Montserrat', sans-serif" }}>
                      Atenção!
                    </div>
                    <p style={{ margin: 0, fontSize: '2.7px', color: '#000', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, textAlign: 'justify', fontWeight: 500 }}>
                      Pais, estejam presentes e participem da rotina de saúde, creche/escola e assistência social do filho. Conversem com os profissionais para tirar dúvidas e entender os cuidados e estímulos que ele precisa em cada fase do desenvolvimento.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {activeSpread === 6 && (
              /* Page 13 - Cuidando da Saúde da Criança */
              <div style={{ padding: '8px 10px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', background: '#fff', overflow: 'hidden', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  {/* Breadcrumb */}
                  <div style={{ fontSize: '3.0px', color: '#888', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '0.3px solid #eee', paddingBottom: '2.5px', marginBottom: '4px', textAlign: 'right' }}>
                    Cuidando da Saúde da Criança
                  </div>
                  
                  {/* Main cursive title */}
                  <div style={{ fontSize: '6.8px', fontWeight: 700, color: '#000', fontFamily: "'Amelie', cursive", textAlign: 'left', lineHeight: 1.1, marginBottom: '2px' }}>
                    Cuidando da Saúde da Criança
                  </div>
                  
                  {/* Section Title */}
                  <div style={{ fontSize: '3.8px', fontWeight: 700, color: mainColor, fontFamily: "'Montserrat', sans-serif", marginBottom: '2px', textAlign: 'left' }}>
                    Promover a Saúde
                  </div>

                  <p style={{ margin: '0 0 3px 0', fontSize: '2.5px', color: '#000', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 600, letterSpacing: '0.3px', textAlign: 'left' }}>
                    Você deve levar a criança para fazer as consultas de rotina nas idades:
                  </p>

                  {/* Consultation schedule list */}
                  <div style={{ background: '#f5f7fa', borderRadius: '4px', padding: '3px 6px', marginBottom: '3px', border: '0.5px solid #eaeaea', textAlign: 'center', width: '100%', boxSizing: 'border-box' }}>
                    <p style={{ margin: 0, fontSize: '2.4px', fontWeight: 800, fontStyle: 'italic', color: '#2C2A29', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.45, letterSpacing: '0.1px' }}>
                      Primeira semana - Segunda semana - 1 mês - 2 meses - 3 meses - 4 meses - 5 meses - 6 meses - 7 meses - 8 meses - 9 meses - 10 meses - 12 meses - 13 meses - 14 meses - 15 meses - 16 meses - 17 meses - 18 meses - 24 meses
                    </p>
                  </div>

                  <p style={{ margin: '8px 0 4px 0', fontSize: '2.5px', color: '#000', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, textAlign: 'left', fontWeight: 500, letterSpacing: '0.3px' }}>
                    A partir dos 2 anos de idade, as consultas de rotina devem ser feitas uma vez ao ano, de acordo com a necessidade de cuidados de seu filho. Nas consultas de rotina, você pode esclarecer dúvidas e pedir orientações sobre os cuidados que você precisa ter para que seu filho tenha uma boa saúde. Peçam ao profissional para anotar as informações sobre o atendimento nos espaços próprios.
                  </p>
                </div>

                {/* Middle Row: Pediatrician illustration + Atenção callout */}
                <div style={{ display: 'flex', gap: '6px', width: '100%', alignItems: 'center' }}>
                  <div style={{ flex: 0.9, height: '44px', borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea', flexShrink: 0 }}>
                    <img
                      src="/carderneta img/AI_Image65.jpg"
                      alt="Consulta Pediátrica Rotina"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ flex: 1.1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ fontSize: '3.5px', fontWeight: 700, color: mainColor, fontFamily: "'Montserrat', sans-serif" }}>
                      ATENÇÃO!
                    </div>
                    <p style={{ margin: 0, fontSize: '2.4px', color: '#000', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, textAlign: 'left', fontWeight: 500, letterSpacing: '0.3px' }}>
                      Mesmo que a criança não esteja doente, é fundamental levá-la ao serviço de saúde para saber como ela está crescendo e se desenvolvendo. Algumas crianças precisam de uma atenção maior e devem ser acompanhadas pelos serviços de saúde com mais frequência.
                    </p>
                  </div>
                </div>

                {/* Bottom Row paragraphs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', width: '100%', marginTop: '0px' }}>
                  <p style={{ margin: 0, fontSize: '2.4px', color: '#000', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, textAlign: 'left', fontWeight: 500, letterSpacing: '0.3px' }}>
                    A consulta da primeira semana de vida é muito importante para saber como estão a mãe e o bebê. Essa consulta pode ser realizada pelo profissional da medicina ou da enfermagem tanto no domicílio quanto na unidade de saúde. Nessa consulta, devem-se avaliar as condições de saúde da mãe e do recém-nascido, a comunicação e o vínculo entre os dois, a amamentação, a vacinação e outros cuidados. É um momento oportuno para que a mãe receba todas as orientações e, quando for o caso, para que a mãe e o bebê sejam encaminhados para os testes de triagem ou outros cuidados.
                  </p>
                  <p style={{ margin: 0, fontSize: '2.4px', color: '#000', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, textAlign: 'left', fontWeight: 500, letterSpacing: '0.3px' }}>
                    A consulta da segunda semana é essencial para avaliação da massa corporal da criança e para continuar a avaliação geral da saúde do recém-nascido.
                  </p>
                </div>
              </div>
            )}
            {activeSpread === 7 && (
              /* Page 15 - Os Primeiros Dias de Vida */
              <div style={{ padding: '14px 10px 8px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', background: '#fff', overflow: 'hidden', position: 'relative' }}>
                {/* Breadcrumb — fixed at top */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, fontSize: '3.0px', color: '#888', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '0.3px solid #eee', paddingBottom: '2.5px', padding: '3px 10px 2.5px', textAlign: 'right' }}>
                  Os Primeiros Dias de Vida
                </div>

                {/* Cursive title */}
                <div style={{ fontSize: '6.8px', fontWeight: 700, color: '#000', fontFamily: "'Amelie', cursive", textAlign: 'left', lineHeight: 1.1, marginBottom: '3px' }}>
                  Os Primeiros Dias de Vida
                </div>

                {/* Intro paragraph */}
                <p style={{ margin: '0 0 4px 0', fontSize: '2.5px', color: '#000', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, textAlign: 'left', fontWeight: 500, letterSpacing: '0.3px' }}>
                  O nascimento de um filho traz muitas novidades para a rotina da família. O bebê já nasce com um comportamento próprio: uns são mais quietos, outros solicitam os pais toda hora e outros são mais chorões. Cada um do seu modo. Procurem entender o seu filho, o que ele gosta ou não gosta, respeitando o seu jeito – vai ser muito mais fácil lidar com ele! É preciso que todos estejam dispostos a acolher e responder às suas necessidades, pois o recém-nascido precisa de muito carinho, amor, atenção e de um ambiente confortável e seguro.
                </p>

                {/* Two-column: text + illustration */}
                <div style={{ display: 'flex', gap: '6px', flex: 1 }}>
                  {/* Left: sections */}
                  <div style={{ flex: 1.1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <div style={{ fontSize: '3.5px', fontWeight: 700, color: mainColor, fontFamily: "'Montserrat', sans-serif", marginBottom: '1px' }}>
                      O contato com o bebê
                    </div>
                    <p style={{ margin: 0, fontSize: '2.5px', color: '#000', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, textAlign: 'left', fontWeight: 500, letterSpacing: '0.3px' }}>
                      Os bebês gostam de sentir que os pais estão junto dele e de ouvir as vozes da mãe e do pai. Então, conversem com seu filho, cantem canções de ninar, falem seu nome e façam carinho tocando-o suavemente. O contato físico com seu bebê e o toque são muito importantes para criar laços afetivos e ajudar o desenvolvimento emocional e social da sua criança. Deixe o seu filho em contato com o seu corpo. Quanto mais tempo ficar no colo, mais ele se sentirá calmo e seguro.
                    </p>

                    <div style={{ fontSize: '3.5px', fontWeight: 700, color: mainColor, fontFamily: "'Montserrat', sans-serif", marginBottom: '1px', marginTop: '2px' }}>
                      O choro do bebê
                    </div>
                    <p style={{ margin: 0, fontSize: '2.5px', color: '#000', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, textAlign: 'left', fontWeight: 500, letterSpacing: '0.3px' }}>
                      O choro é um comportamento normal para os bebês, é uma das maneiras que eles têm de se expressar. Na maioria das vezes, eles se acalmam quando aconchegados ao colo ou colocados no peito. Não se preocupe, bebês não ficam viciados em colo. Para se tornar independente, seu filho precisa se sentir seguro e cuidado, por isso evite deixar seu filho chorando sozinho.
                    </p>
                  </div>

                  {/* Right: single illustration */}
                  <div style={{ flex: 0.8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '100%', height: '80px', borderRadius: '6px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                      <img
                        src="/carderneta img/amamentar.jpg"
                        alt="Mãe com recém-nascido"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeSpread === 8 && (
              /* Page 17 - Os Primeiros Dias: O Banho */
              <div style={{ padding: '14px 10px 8px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#fff', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, fontSize: '3.0px', color: '#888', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '0.3px solid #eee', padding: '3px 10px 2.5px', textAlign: 'right' }}>
                  Os Primeiros Dias de Vida
                </div>

                {/* Os cuidados com o umbigo: imagem esquerda, texto direita */}
                <div style={{ fontSize: '3.5px', fontWeight: 800, color: mainColor, fontFamily: "'Montserrat', sans-serif", marginBottom: '2px', textAlign: 'left' }}>Os cuidados com o umbigo</div>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px', alignItems: 'center' }}>
                  <div style={{ width: '35%', height: '52px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                    <img src="/carderneta img/umbigo.jpg" alt="Cuidados com o umbigo" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                  <p style={{ flex: 1, margin: 0, fontSize: '2.5px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                    Para limpar o umbigo, após o banho seque a região e passe apenas álcool a 70% no local. Evite que o álcool pingue na pele ao redor do umbigo ou em outras partes do corpo do bebê. Se a área ao redor do umbigo ficar vermelha ou se aparecer secreção amarelada, com pus e mau cheiro, pode ser sinal de infecção. Leve seu filho imediatamente a um profissional de saúde. O coto costuma cair até o final da segunda semana. Não coloque faixas, moedas ou qualquer objeto sobre o coto.
                  </p>
                </div>

                {/* A cor da pele: largura total */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ fontSize: '3.5px', fontWeight: 800, color: mainColor, fontFamily: "'Montserrat', sans-serif", textAlign: 'left' }}>A cor da pele</div>
                  <p style={{ margin: 0, fontSize: '2.5px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                    Preste atenção à cor da pele do bebê. A cor amarelada significa icterícia, doença conhecida como amarelão. Se a cor amarela aparecer nas primeiras 24 horas de vida, se for muito forte, se estiver espalhada por todo o corpo ou se durar mais de duas semanas, é necessário que seu filho seja avaliado com urgência pelo profissional de saúde.
                  </p>
                </div>

                {/* A troca de fraldas: agrupado para não separar título do conteúdo */}
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ fontSize: '3.5px', fontWeight: 800, color: mainColor, fontFamily: "'Montserrat', sans-serif", textAlign: 'left' }}>A troca de fraldas</div>
                    <p style={{ margin: 0, fontSize: '2.5px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                      As assaduras são muito dolorosas para o bebê. Procure trocar as fraldas sempre que estiverem molhadas ou sujas. Limpe o bebê preferencialmente com água. Não use talco. Antes e depois da troca, lave suas mãos com água e sabão, se não for possível, use álcool em gel. A vermelhidão nas áreas cobertas pela fralda pode ser assadura ou alergia. Procure orientação do profissional de saúde sobre os cuidados.
                    </p>
                  </div>
                  <div style={{ width: '35%', height: '50px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                    <img src="/carderneta img/troca de fraldas.jpg" alt="Troca de fraldas" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                </div>
              </div>
            )}
            {activeSpread === 9 && (
              /* Page 19 - Prematuros (completo) */
              <div style={{ padding: '14px 10px 6px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '2px', justifyContent: 'space-between', background: '#fff', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, fontSize: '3.0px', color: '#888', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '0.3px solid #eee', padding: '3px 10px 2.5px', textAlign: 'right' }}>Prematuros</div>

                <div style={{ fontSize: '5.5px', fontWeight: 900, color: '#333', fontFamily: "'Montserrat', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px' }}>Prematuros</div>
                <div style={{ fontSize: '3px', fontWeight: 800, color: mainColor, fontFamily: "'Montserrat', sans-serif" }}>Cuidados Especiais com o Bebê Prematuro</div>

                <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                  <p style={{ flex: 1, margin: 0, fontSize: '2.4px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                    Quando o bebê nasce antes do prazo esperado (menos de 37 semanas de gestação), ele é considerado prematuro ou pré-termo. Há prematuros que necessitam ficar internados assim que nascem e outros por muito tempo. Por não ter completado seu amadurecimento durante a gravidez, seu organismo é mais sensível e, por isso, o prematuro pode adoecer com mais facilidade. Ele também é mais sensível às condições do ambiente, como os ruídos e a luminosidade. O excesso de estímulos do ambiente pode deixá-lo estressado.
                  </p>
                  <div style={{ width: '36%', height: '45px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                    <img src="/carderneta img/prematuro.jpg" alt="Bebê prematuro" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '2.4px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                  Você certamente já foi orientado em relação aos cuidados com o seu filho prematuro no momento da alta do hospital. É muito importante seguir essas orientações. Todos os prematuros devem ser acompanhados por profissionais que possam ajudar a atender às suas necessidades e a promover seu desenvolvimento.
                </p>

                <div style={{ background: `${mainColor}15`, border: `0.5px solid ${mainColor}40`, borderRadius: '3px', padding: '2px 4px' }}>
                  <div style={{ fontSize: '2.8px', fontWeight: 900, color: mainColor, fontFamily: "'Montserrat', sans-serif", fontStyle: 'italic' }}>IMPORTANTE!</div>
                  <p style={{ margin: 0, fontSize: '2.4px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                    Os prematuros muitas vezes precisam que as primeiras consultas sejam semanais. Não deixem de procurar por esse acompanhamento em sua unidade de saúde de referência e nunca tenham vergonha de perguntar o que não entenderam na consulta — vocês são os pais e responsáveis!
                  </p>
                </div>

                <p style={{ margin: 0, fontSize: '2.4px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                  Os prematuros também precisam ser estimulados. Por isso precisam de um ambiente calmo, de carinho, e de serem tocados com a palma da mão para se acalmar. Às vezes o bebê precisa de um tempo para descansar e mostra isso com sinais simples como soluçar, esticar o corpo para trás ou chorar.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
                  <div style={{ background: `${mainColor}15`, border: `0.5px solid ${mainColor}40`, borderRadius: '3px', padding: '2px 4px' }}>
                    <div style={{ fontSize: '2.8px', fontWeight: 900, color: mainColor, fontFamily: "'Montserrat', sans-serif", fontStyle: 'italic' }}>ATENÇÃO!</div>
                    <p style={{ margin: 0, fontSize: '2.4px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                      Para estimular seu bebê, você precisa corrigir a idade do seu filho. Basta diminuir da idade atual o tempo que faltou para ele completar 9 meses. Ex: nasceu 2 meses antes e tem 6 meses → idade corrigida = 4 meses.
                    </p>
                  </div>
                  <p style={{ margin: 0, fontSize: '2.4px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                    O bebê prematuro é pequeno e, às vezes, parece frágil. A superproteção deixa a criança dependente dos adultos e faz com que ela se sinta incapaz de fazer as coisas que uma criança da mesma idade faz. Não deixe que isso aconteça.
                  </p>
                </div>
              </div>
            )}
            {activeSpread === -1 && (
              /* Page 20 - Cuidados: Diarreia */
              <div style={{ padding: '14px 10px 6px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '2px', background: '#fff', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, fontSize: '3.0px', color: '#888', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '0.3px solid #eee', padding: '3px 10px 2.5px', textAlign: 'right', fontStyle: 'italic' }}>Cuidados a saúde do bebê</div>

                <div style={{ fontSize: '5.5px', fontWeight: 900, color: '#333', fontFamily: "'Montserrat', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cuidados</div>

                {/* 2 colunas principais */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px', flex: 1, minHeight: 0 }}>
                  {/* Coluna esquerda */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <div style={{ fontSize: '2.8px', fontWeight: 800, color: mainColor, fontFamily: "'Montserrat', sans-serif" }}>Para evitar a diarreia</div>
                    {['Amamente seu filho até os 2 anos ou mais. Nos primeiros seis meses, dê somente leite materno.','Lave bem as mãos antes de preparar os alimentos, depois de usar o banheiro e antes e depois de lidar com o bebê, principalmente depois das trocas de fraldas.','Prepare os alimentos até duas horas antes de oferecê-los ao bebê.','Só ofereça alimentos guardados na geladeira por, no máximo, 24 horas.','Mantenha a criança alimentada.'].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '1.5px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '3px', color: mainColor, flexShrink: 0 }}>•</span>
                        <span style={{ fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500 }}>{item}</span>
                      </div>
                    ))}

                    <div style={{ fontSize: '2.8px', fontWeight: 800, color: mainColor, fontFamily: "'Montserrat', sans-serif", marginTop: '2px' }}>Para evitar desnutrição e desidratação na diarreia:</div>
                    {['O peito quantas vezes a criança pedir.','Alimentos que a criança já come e dos quais ela goste, desde que saudáveis; oferte em pequenas quantidades para evitar vômitos.','Se a criança não estiver só no peito, ofereça água, chás, sucos, água de coco (sem açúcar).'].map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '1.5px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '3px', color: mainColor, flexShrink: 0 }}>•</span>
                        <span style={{ fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500 }}>{item}</span>
                      </div>
                    ))}

                    <div style={{ background: `${mainColor}15`, border: `0.5px solid ${mainColor}40`, borderRadius: '3px', padding: '2px 3px', marginTop: '2px' }}>
                      <div style={{ fontSize: '2.8px', fontWeight: 900, color: mainColor, fontStyle: 'italic' }}>IMPORTANTE!</div>
                      <div style={{ fontSize: '2.3px', fontWeight: 700, color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, marginBottom: '1px' }}>São sinais de desidratação:</div>
                      {['Estar com os olhos fundos','Sentir muita sede','Chorar sem lágrimas','Ter pouca saliva','Urinar pouco'].map((s, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1.5px' }}>
                          <span style={{ fontSize: '3px', color: mainColor }}>•</span>
                          <span style={{ fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25 }}>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Coluna direita */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <p style={{ margin: 0, fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500 }}>
                      Se o seu bebê estiver utilizando outro tipo de leite em algum utensílio, todos os materiais devem ser bem lavados com bastante água, detergente ou sabão e uma escova apropriada. Depois de lavados, devem ser fervidos durante 15 minutos. Após a higienização e fervura, deixe secar naturalmente.
                    </p>
                    <div style={{ height: '45px', borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea', flexShrink: 0 }}>
                      <img src="/carderneta img/101-103-101.png" alt="Criança doente" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                    </div>
                    <div style={{ background: `${mainColor}15`, border: `0.5px solid ${mainColor}40`, borderRadius: '3px', padding: '2px 4px', display: 'flex', flexDirection: 'column', gap: '1.5px' }}>
                      <div style={{ fontSize: '2.8px', fontWeight: 800, color: mainColor, fontFamily: "'Montserrat', sans-serif" }}>Não ofereça:</div>
                      {['Alimentos ricos em gordura e fibras (verduras, laranja, mamão etc.).','Refrigerantes, bebidas com açúcar, balas, bombons, pirulitos, chicletes.'].map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1.5px', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '3px', color: mainColor, flexShrink: 0 }}>•</span>
                          <span style={{ fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500 }}>{item}</span>
                        </div>
                      ))}
                      <p style={{ margin: 0, fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500 }}>
                        Se isso acontecer, leve seu filho ao serviço de saúde. Se ele estiver vomitando e suas fezes estiverem muito líquidas, ofereça o soro de reidratação oral, mesmo antes de chegar ao serviço de saúde.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeSpread === 10 && (
              /* Page 21 - Soro de Reidratação */
              <div style={{ padding: '14px 10px 6px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '2px', justifyContent: 'space-between', background: '#fff', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, fontSize: '3.0px', color: '#888', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '0.3px solid #eee', padding: '3px 10px 2.5px', textAlign: 'right', fontStyle: 'italic' }}>Cuidados com bebê</div>

                <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                  <div style={{ width: '40%', height: '50px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                    <img src="/carderneta img/lavar as maos.jpg" alt="Lavar as mãos" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                  <div style={{ flex: 1, background: `${mainColor}15`, border: `0.5px solid ${mainColor}40`, borderRadius: '3px', padding: '2px 4px' }}>
                    <div style={{ fontSize: '2.8px', fontWeight: 900, color: mainColor, fontStyle: 'italic' }}>IMPORTANTE!</div>
                    <p style={{ margin: 0, fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                      Evite a diarreia lavando bem as mãos após trocar as fraldas das crianças e antes de oferecer a elas as refeições.
                    </p>
                  </div>
                </div>

                <div style={{ fontSize: '2.8px', fontWeight: 800, color: '#333', fontFamily: "'Montserrat', sans-serif" }}>Como preparar o soro de sais de reidratação oral?</div>
                <p style={{ margin: 0, fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                  Em 1 litro de água fervida ou filtrada, despeje todo o pó de um envelope de sais de reidratação, fornecido pela Unidade Básica de Saúde ou comprado em farmácia. Após preparar, o soro só pode ser usado por 24 horas. Não coloque açúcar nem sal. Não ferva o soro depois de pronto. Caso seja impossível conseguir o envelope, uma alternativa emergencial é fazer o soro caseiro.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
                  <div style={{ background: `${mainColor}10`, borderRadius: '3px', padding: '2px 4px', border: `0.5px solid ${mainColor}30` }}>
                    <div style={{ fontSize: '2.8px', fontWeight: 800, color: mainColor, marginBottom: '1px' }}>• Com a colher</div>
                    {['1 copo 200ml de água fervida ou filtrada','1 medida (a menor) rasa de sal','2 medidas (a maior) rasas de açúcar'].map((l, i) => (
                      <div key={i} style={{ fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 700 }}>{l}</div>
                    ))}
                  </div>
                  <div style={{ background: `${mainColor}10`, borderRadius: '3px', padding: '2px 4px', border: `0.5px solid ${mainColor}30` }}>
                    <div style={{ fontSize: '2.8px', fontWeight: 800, color: mainColor, marginBottom: '1px' }}>• Com a mão</div>
                    {['1 copo 200ml de água fervida ou filtrada','1 pitada de 3 dedos de sal','1 punhado pequeno de açúcar'].map((l, i) => (
                      <div key={i} style={{ fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 700 }}>{l}</div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                  <div style={{ width: '38%', height: '38px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                    <img src="/carderneta img/soro.jpg" alt="Soro caseiro" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                  <div style={{ flex: 1, background: `${mainColor}15`, border: `0.5px solid ${mainColor}40`, borderRadius: '3px', padding: '2px 4px' }}>
                    <div style={{ fontSize: '2.8px', fontWeight: 900, color: mainColor, fontStyle: 'italic' }}>ATENÇÃO!</div>
                    <p style={{ margin: 0, fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                      O soro oral não cura a diarreia, mas evita a desidratação, que pode matar.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {activeSpread === 11 && (
              /* Page 23 - Amamentando o Bebê (RIGHT) */
              <div style={{ padding: '14px 10px 6px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '2px', justifyContent: 'space-between', background: '#fff', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, fontSize: '3.0px', color: '#888', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '0.3px solid #eee', padding: '3px 10px 2.5px', textAlign: 'right', fontStyle: 'italic' }}>Amamentando o bebê</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ fontSize: '2.8px', fontWeight: 800, color: '#333', fontFamily: "'Montserrat', sans-serif", textAlign: 'left' }}>Tornando a Amamentação Mais Prazerosa</div>
                  <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <p style={{ margin: 0, fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                        Durante o período de amamentação, é importante que a mãe e o bebê recebam o apoio da família e das pessoas mais próximas.
                      </p>
                      <p style={{ margin: 0, fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                        A participação do pai é importante em todos os momentos possíveis dos cuidados com o bebê.
                      </p>
                      <p style={{ margin: 0, fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                        O pai, os avós, outros parentes, amigos e vizinhos devem valorizar e apoiar a amamentação, ajudando nos cuidados com a casa, com as outras crianças e também com o bebê.
                      </p>
                    </div>
                    <div style={{ width: '36%', height: '52px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                      <img src="/carderneta img/amamentar 2.jpg" alt="Família com bebê" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                    A tranquilidade de mãe e filho na hora da amamentação ajuda a tornar as mamadas momentos de alegria e prazer.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ fontSize: '2.8px', fontWeight: 800, color: '#333', fontFamily: "'Montserrat', sans-serif", textAlign: 'left' }}>Posição do bebê</div>
                  <p style={{ margin: 0, fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                    A melhor posição para amamentar é aquela em que você e seu filho ficam confortáveis. Você mesma deve buscar um jeito fácil e aconchegante de colocar o bebê no peito. O bebê deve estar virado de frente para você, bem junto do seu corpo (barriga com barriga), bem apoiado e com os braços livres.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ fontSize: '2.8px', fontWeight: 800, color: '#333', fontFamily: "'Montserrat', sans-serif", textAlign: 'left' }}>Pega da mama</div>
                  <p style={{ margin: 0, fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                    Só coloque seu filho para sugar quando ele abrir bem a boca. O bebê pega bem o peito quando o queixo encosta na mama, os lábios ficam virados para fora, o nariz fica livre e a aréola aparece mais na parte de cima do que na parte de baixo da boca. Para tirar o bebê do peito sem machucar a mama, coloque seu dedo mínimo entre as gengivas dele, no canto dos lábios, assim ele abrirá a boca e soltará a mama.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                  <div style={{ width: '36%', height: '45px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                    <img src="/carderneta img/amamentar 3.jpg" alt="Bebê com mamadeira" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                  <div style={{ flex: 1, background: `${mainColor}15`, border: `0.5px solid ${mainColor}40`, borderRadius: '3px', padding: '2px 4px' }}>
                    <div style={{ fontSize: '2.8px', fontWeight: 900, color: mainColor, fontStyle: 'italic' }}>ATENÇÃO!</div>
                    <p style={{ margin: 0, fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                      Não ofereça mamadeiras e chupetas. Elas atrapalham a amamentação. Além disso, podem causar doenças e problemas na dentição e na fala do bebê!
                    </p>
                  </div>
                </div>
              </div>
            )}
            {activeSpread === 12 && (
              /* Page 25 - Retorno ao Trabalho */
              <div style={{ padding: '14px 10px 6px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '2px', background: '#fff', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, fontSize: '3.0px', color: '#888', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '0.3px solid #eee', padding: '3px 10px 2.5px', textAlign: 'right', fontStyle: 'italic' }}>Retirando, armazenando e oferecendo o leite</div>

                <div style={{ fontSize: '4px', fontWeight: 900, color: '#333', fontFamily: "'Montserrat', sans-serif", textTransform: 'uppercase', letterSpacing: '0.3px', lineHeight: 1.2 }}>Retorno da Mãe ao Trabalho ou à Escola</div>

                <p style={{ margin: 0, fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                  Se você precisar voltar ao trabalho ou à escola antes de seu filho completar 6 meses, organize-se pelo menos 15 dias antes para retirar e guardar o leite. Caso o leite vá à creche, ele precisa estar identificado com o nome da criança e a data.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                  <div style={{ fontSize: '2.8px', fontWeight: 800, color: '#333', fontFamily: "'Montserrat', sans-serif", textAlign: 'left' }}>Preparo do frasco para guardar o leite</div>
                  <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      {['Escolha um frasco de vidro incolor com tampa plástica.','Retire o rótulo e o papel de dentro da tampa.','Lave bem com água e sabão; ferva a tampa e o frasco por 15 minutos.','Coloque sobre pano limpo para secar.','Feche sem tocar na parte interna da tampa.','Identifique com nome, data e hora da retirada.'].map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1px', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '3px', color: mainColor, flexShrink: 0 }}>•</span>
                          <span style={{ fontSize: '2.2px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500, textAlign: 'left' }}>{item}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ width: '32%', height: '40px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                      <img src="/carderneta img/washing glass bottle.jpeg" alt="Preparo frasco" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  <div style={{ fontSize: '2.8px', fontWeight: 800, color: '#333', fontFamily: "'Montserrat', sans-serif", textAlign: 'left', marginBottom: '1px' }}>Higiene pessoal para a coleta</div>
                  {['Retire anéis, aliança, pulseiras e relógio.','Coloque touca ou lenço no cabelo.','Lave mãos e braços até o cotovelo com água e sabão.','Lave as mamas apenas com água limpa.','Seque com toalha ou pano limpo.'].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1.5px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '3px', color: mainColor, flexShrink: 0 }}>•</span>
                      <span style={{ fontSize: '2.2px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500, textAlign: 'left' }}>{item}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  <div style={{ display: 'flex', gap: '3px', alignItems: 'center', marginTop: '3px' }}>
                    <div style={{ width: '30%', height: '36px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                      <img src="/carderneta img/breast milk with bottle, professional environment.jpeg" alt="Local adequado" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <div style={{ fontSize: '2.8px', fontWeight: 800, color: '#333', fontFamily: "'Montserrat', sans-serif", textAlign: 'left' }}>Local adequado para a coleta</div>
                      {['Escolha um lugar confortável, limpo e tranquilo. Algumas empresas têm sala de apoio à amamentação.','Forre uma mesa com pano limpo para o frasco e a tampa.','Evite conversar — sua saliva pode contaminar o leite.'].map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1.5px', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '3px', color: mainColor, flexShrink: 0 }}>•</span>
                          <span style={{ fontSize: '2.2px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500, textAlign: 'left' }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', marginTop: '5px' }}>
                  <div style={{ fontSize: '2.8px', fontWeight: 800, color: '#333', fontFamily: "'Montserrat', sans-serif", textAlign: 'left' }}>Como fazer a coleta do leite</div>
                  {['Massageie o peito com a ponta dos dedos, fazendo movimentos circulares da aréola em direção ao corpo. Os movimentos devem ser contínuos e firmes, mas delicados.','Coloque o polegar acima da linha onde acaba a aréola e os dedos indicador e médio abaixo. Firme e empurre em direção ao corpo.','Aperte o polegar contra os outros dedos até sair o leite. Não deslize sobre a pele — a manobra não dói quando feita corretamente.','Despreze os primeiros jatos ou gotas do leite.','Coloque o frasco debaixo da aréola. Mude a posição dos dedos ao redor para esvaziar todas as áreas.','Mude de mama quando o fluxo diminuir e repita o processo. Feche bem o frasco ao terminar.'].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1.5px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '3px', color: mainColor, flexShrink: 0 }}>•</span>
                      <span style={{ fontSize: '2.2px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500, textAlign: 'left' }}>{item}</span>
                    </div>
                  ))}
                </div>

              </div>
            )}
            {activeSpread === -1 && (
              /* Page 25 antiga - desativada */
              <div style={{ padding: '14px 10px 6px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '2px', justifyContent: 'space-between', background: '#fff', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, fontSize: '3.0px', color: '#888', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '0.3px solid #eee', padding: '3px 10px 2.5px', textAlign: 'right', fontStyle: 'italic' }}>Amamentando o bebê</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ fontSize: '2.8px', fontWeight: 800, color: '#333', fontFamily: "'Montserrat', sans-serif", textAlign: 'left' }}>Quantidade e qualidade do leite materno</div>
                  <p style={{ margin: 0, fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                    Todo leite materno é forte e bom. A cor do leite pode variar, mas ele nunca é fraco. O ato de sugar é o maior estímulo à produção: quanto mais seu filho suga, mais leite você produz.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                  <div style={{ flex: 1, background: `${mainColor}15`, border: `0.5px solid ${mainColor}40`, borderRadius: '3px', padding: '2px 4px' }}>
                    <div style={{ fontSize: '2.8px', fontWeight: 900, color: mainColor, fontStyle: 'italic' }}>IMPORTANTE!</div>
                    <p style={{ margin: 0, fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                      Se seu filho dorme bem e está ganhando peso, a quantidade de leite está sendo suficiente. Se ainda tem muito leite, você pode doar a um banco de leite humano. Informe-se nos serviços de saúde ou em rblh.fiocruz.br.
                    </p>
                  </div>
                  <div style={{ width: '36%', height: '44px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                    <img src="/carderneta img/A glass bottle of milk .jpeg" alt="Banco de leite" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                  O leite do início da mamada tem mais água e mata a sede. Já o leite do fim tem mais gordura, satisfaz a fome e faz o bebê ganhar peso.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ fontSize: '2.8px', fontWeight: 800, color: '#333', fontFamily: "'Montserrat', sans-serif", textAlign: 'left' }}>Dificuldades na Amamentação</div>
                  <p style={{ margin: 0, fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                    Pequenos problemas podem causar muito desconforto. Para evitá-los, retire um pouco do leite antes de cada mamada para amaciar a mama e facilitar a pega do bico pelo bebê. As rachaduras no bico do peito podem indicar que é preciso melhorar o jeito do bebê de pegar o peito. Se rachar, você pode passar seu próprio leite na rachadura. Quando as mamas ficam empedradas, é preciso esvaziá-las ao máximo. Aumente a frequência das mamadas, inclusive à noite.
                  </p>
                  <p style={{ margin: 0, fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                    Se as mamas não melhorarem, procure imediatamente um profissional de saúde ou um banco de leite humano: rblh.fiocruz.br.
                  </p>
                </div>

                <div style={{ background: `${mainColor}15`, border: `0.5px solid ${mainColor}40`, borderRadius: '3px', padding: '2px 4px' }}>
                  <div style={{ fontSize: '2.8px', fontWeight: 900, color: mainColor, fontStyle: 'italic' }}>ATENÇÃO!</div>
                  <p style={{ margin: 0, fontSize: '2.3px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.3, fontWeight: 500 }}>
                    Mães com HIV positivo devem receber orientações especiais e não devem amamentar, pois as chances da transmissão aumentam a cada mamada. Logo após o parto, o bebê deve ser colocado sobre o peito em contato pele a pele (sem, entretanto, mamar). Depois do parto, mãe e bebê devem ficar em alojamento conjunto, estabelecendo uma relação íntima propiciada pelos momentos em que ela começa a cuidar da criança.
                  </p>
                </div>
              </div>
            )}
            {activeSpread === -1 && (
              /* Page 27 - Coleta e Conservação do leite (RIGHT) */
              <div style={{ padding: '14px 10px 6px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '2px', background: '#fff', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, fontSize: '3.0px', color: '#888', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '0.3px solid #eee', padding: '3px 10px 2.5px', textAlign: 'right', fontStyle: 'italic' }}>Retirando, armazenando e oferecendo o leite</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5px' }}>
                  <div style={{ fontSize: '2.8px', fontWeight: 800, color: '#333', fontFamily: "'Montserrat', sans-serif", textAlign: 'left', marginBottom: '1px' }}>Como fazer a coleta do leite?</div>
                  <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5px' }}>
                      {['Massageie o peito com a ponta dos dedos, fazendo movimentos circulares da aréola em direção ao corpo. Os movimentos devem ser contínuos e firmes, mas delicados.','Coloque o polegar acima da linha onde acaba a aréola e os dedos indicador e médio abaixo. Firme e empurre em direção ao corpo.','Aperte o polegar contra os outros dedos até sair o leite. Não deslize sobre a pele — a manobra não dói quando feita corretamente.','Despreze os primeiros jatos ou gotas do leite.','Abra o frasco e coloque a tampa virada para cima sobre pano limpo.','Coloque o frasco debaixo da aréola para receber o leite.','Mude a posição dos dedos ao redor da aréola para esvaziar todas as áreas.','Mude de mama quando o fluxo diminuir e repita o processo.','Feche bem o frasco ao terminar.'].map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1px', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '3px', color: mainColor, flexShrink: 0 }}>•</span>
                          <span style={{ fontSize: '2.2px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ width: '32%', height: '44px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                      <img src="/carderneta img/AI_Image33.jpg" alt="Coleta do leite" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  <div style={{ fontSize: '2.8px', fontWeight: 800, color: '#333', fontFamily: "'Montserrat', sans-serif", textAlign: 'left', marginBottom: '1px' }}>Como conservar o leite</div>
                  <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5px' }}>
                      {['O leite retirado pode ser conservado em geladeira por até 12 horas e no freezer/congelador por até 15 dias.','Após a retirada, guarde imediatamente na geladeira, freezer ou congelador.','Se o frasco não ficar cheio, complete-o em outra coleta no mesmo dia, deixando espaço de dois dedos entre a boca e o leite. No dia seguinte, use outro frasco.','Se tiver leite suficiente para doação, faça-o até 10 dias após a retirada.'].map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1px', alignItems: 'flex-start' }}>
                          <span style={{ fontSize: '3px', color: mainColor, flexShrink: 0 }}>•</span>
                          <span style={{ fontSize: '2.2px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500 }}>{item}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ width: '32%', height: '38px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                      <img src="/carderneta img/Glass bottle with breast milk in refrigerator.jpeg" alt="Conservar leite" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeSpread === -1 && (
              /* Page - Como oferecer o leite coletado */
              <div style={{ padding: '14px 10px 6px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '2px', background: '#fff', overflow: 'hidden', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, fontSize: '3.0px', color: '#888', fontFamily: "'Montserrat', sans-serif", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '0.3px solid #eee', padding: '3px 10px 2.5px', textAlign: 'right', fontStyle: 'italic' }}>Retirando, armazenando e oferecendo o leite</div>

                <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                  <div style={{ width: '32%', height: '42px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                    <img src="/carderneta img/AI_Image33.jpg" alt="Bebê com frutas" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <div style={{ fontSize: '3px', fontWeight: 900, color: mainColor, fontFamily: "'Amelie', cursive" }}>Importante!</div>
                    <p style={{ margin: 0, fontSize: '2.2px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500, textAlign: 'left' }}>
                      A partir dos 6 meses, a amamentação deve ser complementada com alimentos saudáveis, mas mantida até os 2 anos ou mais. Se não for possível amamentar, converse com o pediatra sobre outro tipo de leite e alimentação complementar.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                  <div style={{ fontSize: '2.8px', fontWeight: 800, color: '#333', fontFamily: "'Montserrat', sans-serif", textAlign: 'left' }}>Como oferecer o leite coletado à criança</div>
                  <p style={{ margin: '3px 0 0', fontSize: '2.2px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500, textAlign: 'left' }}>
                    O leite retirado deve ser oferecido de preferência em copo, xícara ou colher. Esquente a água, desligue o fogo e coloque o frasco imerso na água morna (banho-maria), agitando-o lentamente até não restar nenhuma pedra de gelo.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <p style={{ margin: 0, fontSize: '2.2px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500, textAlign: 'left' }}>Para manter seus fatores de proteção, o leite materno não deve ser fervido nem aquecido em micro-ondas.</p>
                    <p style={{ margin: 0, fontSize: '2.2px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500, textAlign: 'left' }}>Amorne apenas a quantidade que o bebê for tomar. O leite morno que sobrar deve ser jogado fora.</p>
                    <p style={{ margin: 0, fontSize: '2.2px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500, textAlign: 'left' }}>O leite descongelado e não aquecido pode ser guardado na primeira prateleira da geladeira por até 12 horas.</p>
                  </div>
                  <div style={{ width: '32%', height: '42px', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '0.5px solid #eaeaea' }}>
                    <img src="/carderneta img/soro.jpg" alt="Banho-maria" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px', flex: 1, minHeight: 0 }}>
                  <div style={{ background: `${mainColor}15`, border: `0.5px solid ${mainColor}40`, borderRadius: '3px', padding: '2px 3px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <div style={{ fontSize: '3px', fontWeight: 900, color: mainColor, fontFamily: "'Amelie', cursive" }}>Atenção!</div>
                    <p style={{ margin: 0, fontSize: '2.2px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500, textAlign: 'left' }}>
                      O leite levado para a creche precisa ser transportado em caixa de isopor ou bolsa térmica. Certifique-se de que está sendo oferecido corretamente.
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <p style={{ margin: 0, fontSize: '2.2px', color: '#333', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.25, fontWeight: 500, textAlign: 'left' }}>
                      <span style={{ fontFamily: "'Amelie', cursive", fontSize: '3.5px', color: mainColor }}>Saiba que </span>os profissionais de creche também podem apoiar as mães no retorno ao trabalho, planejando com o serviço de saúde os cuidados com o leite retirado e desenvolvendo formas de alimentar os bebês sem o uso de mamadeira.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {activeSpread === 13 && renderBackCover()}
          </div>
        </div>

        {/* Navigation spread controls */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '14px' }}>
          <button
            onClick={() => setActiveSpread(prev => Math.max(0, prev - 1))}
            disabled={activeSpread === 0}
            style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid #ddd', background: activeSpread === 0 ? '#fafafa' : '#fff', color: activeSpread === 0 ? '#ccc' : '#666', cursor: activeSpread === 0 ? 'not-allowed' : 'pointer', fontSize: '10px', fontWeight: 700 }}
          >
            ◀ Anterior
          </button>
          <span style={{ fontSize: '10px', color: '#888', alignSelf: 'center', fontWeight: 600 }}>Spread {activeSpread + 1} de 15</span>
          <button
            onClick={() => setActiveSpread(prev => Math.min(14, prev + 1))}
            disabled={activeSpread === 14}
            style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid #ddd', background: activeSpread === 14 ? '#fafafa' : '#fff', color: activeSpread === 14 ? '#ccc' : '#666', cursor: activeSpread === 14 ? 'not-allowed' : 'pointer', fontSize: '10px', fontWeight: 700 }}

          >
            Avançar ▶
          </button>
        </div>
      </div>

      {/* Editor Accordion Panel */}
      <div style={{ width: '100%', maxWidth: '420px', background: '#fafafa', borderRadius: '10px', border: '1px solid #eee', overflow: 'hidden' }}>
        <button onClick={() => setEditingContacts(v => !v)} style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#666', fontFamily: 'Montserrat,sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Editar Identidade Visual e Dados da Caderneta</span>
          <span style={{ fontSize: '14px', color: '#aaa', fontWeight: 700 }}>{editingContacts ? '▲' : '▼'}</span>
        </button>

        {editingContacts && (
          <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Color pickers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '10px', fontWeight: 700, color: '#888' }}>CORES DA CADERNETA</label>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '9px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                  <input
                    type="color"
                    value={mainColor}
                    onChange={(e) => handleColorChange(0, e.target.value)}
                    style={{ width: '32px', height: '24px', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                  />
                  <span style={{ fontSize: '8px', color: '#aaa', fontWeight: 600 }}>Principal</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => handleColorChange(1, e.target.value)}
                    style={{ width: '32px', height: '24px', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                  />
                  <span style={{ fontSize: '8px', color: '#aaa', fontWeight: 600 }}>Secundária</span>
                </div>
              </div>
            </div>

            {/* Custom logo upload */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
              <label style={{ fontSize: '10px', fontWeight: 700, color: '#888' }}>LOGOTIPO DA CLÍNICA</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                style={{ fontSize: '10px', color: '#777', marginTop: '4px' }}
              />
              <span style={{ fontSize: '8px', color: '#aaa' }}>Suba uma imagem PNG com fundo transparente.</span>
            </div>

            {/* Text inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <label style={{ fontSize: '9px', fontWeight: 700, color: '#999' }}>TITULO DO SLOGAN / PILULA</label>
                <input
                  value={personalLocalSlogan}
                  onChange={(e) => { setPersonalLocalSlogan(e.target.value); if (setLocalSlogan) setLocalSlogan(e.target.value); }}
                  placeholder="Ex: Nutrição Pediátrica"
                  style={{ padding: '6px 8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '11px', color: '#333' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <label style={{ fontSize: '9px', fontWeight: 700, color: '#999' }}>NOME DA CLÍNICA / PEDIATRA</label>
                <input
                  value={personalClinicaNome}
                  onChange={(e) => { setPersonalClinicaNome(e.target.value); if (setClinicaNome) setClinicaNome(e.target.value); }}
                  placeholder="Ex: Dra. Amanda Pires"
                  style={{ padding: '6px 8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '11px', color: '#333' }}
                />
              </div>

              {isSaude && (
                <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', width: '30%' }}>
                    <label style={{ fontSize: '9px', fontWeight: 700, color: '#999' }}>UF</label>
                    <input
                      value={crmData?.uf || ''}
                      onChange={(e) => setCrmData(d => ({ ...d, uf: e.target.value.toUpperCase().slice(0, 2) }))}
                      placeholder="UF"
                      style={{ padding: '6px 8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '11px', color: '#333', textAlign: 'center' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
                    <label style={{ fontSize: '9px', fontWeight: 700, color: '#999' }}>NÚMERO CRM</label>
                    <input
                      value={crmData?.crm || ''}
                      onChange={(e) => setCrmData(d => ({ ...d, crm: e.target.value }))}
                      placeholder="CRM"
                      style={{ padding: '6px 8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '11px', color: '#333' }}
                    />
                  </div>
                </div>
              )}

              {/* Dynamic contacts */}
              {['telefone', 'whatsapp', 'endereco'].map(field => (
                <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <label style={{ fontSize: '9px', fontWeight: 700, color: '#999' }}>{field.toUpperCase()}</label>
                  <input
                    value={cartaoContacts?.[field] || ''}
                    onChange={(e) => setCartaoContacts(c => ({ ...c, [field]: e.target.value }))}
                    placeholder={`Seu ${field}`}
                    style={{ padding: '6px 8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '11px', color: '#333' }}
                  />
                </div>
              ))}

            </div>

          </div>
        )}
      </div>

    </div>
  );
}
