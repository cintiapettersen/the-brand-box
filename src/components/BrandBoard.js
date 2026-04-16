import React from 'react';
import BrandTemplateSVG from './BrandTemplateSVG';

const getColorName = (hex) => {
  // Uma lógica simples de "batismo" de cores baseada em tons aproximados
  const names = {
    '#4EB0B5': 'Azul Turquesa',
    '#C03B66': 'Rosa Fandango',
    '#F2CBDC': 'Rosa Suave',
    '#FBDA86': 'Amarelo Ouro',
    '#9AD1A0': 'Verde Menta',
    // Fallback dinâmico para outras cores (simulação)
  };

  if (names[hex.toUpperCase()]) return names[hex.toUpperCase()];
  
  // Se não tiver no mapa, gera um nome afetivo baseado no tom
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  
  if (r > 200 && g < 150) return 'Dose de Amor';
  if (b > 200) return 'Céu Sereno';
  if (g > 180) return 'Folha Fresca';
  return 'Tom Especial';
};

const SectionHeader = ({ title }) => (
  <div style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '25px 0 15px 0' }}>
    <div style={{ height: '1px', background: '#333', flex: 1 }}></div>
    <span style={{ margin: '0 15px', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
      {title}
    </span>
    <div style={{ height: '1px', background: '#333', flex: 1 }}></div>
  </div>
);

const BrandBoard = ({ data, palette, color }) => {
  const { marca, tagline } = data;
  const activeColor = color || '#d22f5a';

  return (
    <div id="brand-board-canvas" style={{ 
      width: '595px', // Proporção A4
      height: '842px',
      background: '#fff',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
      position: 'relative',
      fontFamily: "'Montserrat', sans-serif"
    }}>
      {/* Margem decorativa opcional */}
      <div style={{ position: 'absolute', top: '15px', left: '15px', right: '15px', bottom: '15px', border: '1px solid #efefef', pointerEvents: 'none' }}></div>

      {/* LOGO PRINCIPAL */}
      <SectionHeader title="Logomarca Principal" />
      <div style={{ height: '180px', width: '300px' }}>
         <BrandTemplateSVG data={data} color={color} side="frente" hideBackground={true} />
      </div>

      {/* PALETA DE CORES */}
      <SectionHeader title="Paleta de Cores" />
      <div style={{ display: 'flex', width: '100%', gap: '5px', height: '100px' }}>
         {(palette && palette.length > 0 ? palette : ['#eee','#ddd','#ccc','#bbb','#aaa']).map((hex, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
               <div style={{ backgroundColor: hex, flex: 1, borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '0.55rem', fontWeight: 'bold', color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>{hex}</span>
               </div>
               <p style={{ fontSize: '0.5rem', textAlign: 'center', marginTop: '5px', fontWeight: 600 }}>{getColorName(hex)}</p>
            </div>
         ))}
      </div>

      {/* TIPOGRAFIA / SUBMARCA */}
      <SectionHeader title="Tipografia" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', width: '100%', marginTop: '10px' }}>
         <div style={{ textAlign: 'center', borderRight: '1px solid #eee' }}>
            <h5 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', marginBottom: '10px' }}>Playfair Display</h5>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.65rem', lineHeight: '1.4', color: '#666' }}>
               abcdefghijklm<br/>nopqrstuvxzA<br/>BCDEFGHIJKLM<br/>NOPQRSTUVXZ
            </p>
         </div>
         <div style={{ textAlign: 'center' }}>
            <h5 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '10px' }}>Montserrat</h5>
            <p style={{ fontSize: '0.6rem', lineHeight: '1.4', color: '#666', fontWeight: 600 }}>
               abcdefghijklm<br/>nopqrstuvxzA<br/>BCDEFGHIJKLM<br/>NOPQRSTUVXZ
            </p>
         </div>
      </div>

      {/* SUBMARCA E ESTAMPA */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', width: '100%', flex: 1, marginTop: '20px' }}>
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SectionHeader title="Submarca" />
            <div style={{ width: '130px', height: '130px' }}>
               <BrandTemplateSVG data={data} color={color} side="verso" hideBackground={true} />
            </div>
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SectionHeader title="Estampa" />
            <div style={{ width: '100%', height: '100px', background: '#f9f9f9', borderRadius: '8px', border: '1px dashed #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <span style={{ fontSize: '0.5rem', color: '#999' }}>EM BREVE: SUA ESTAMPA EXCLUSIVA</span>
            </div>
         </div>
      </div>

      {/* RODAPÉ */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
         <p style={{ fontSize: '0.45rem', letterSpacing: '4px', opacity: 0.4 }}>THE BRAND BOX • EXPLORE YOUR IDENTITY</p>
      </div>
    </div>
  );
};

export default BrandBoard;
