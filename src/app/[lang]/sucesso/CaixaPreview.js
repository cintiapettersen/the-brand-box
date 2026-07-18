import React, { useState, useEffect } from 'react';
import { LogoPreviewHTML, BordaToggle } from './page';
import { useScaleToFit } from './useScaleToFit';

export default function CaixaPreview({
  accentColor, paletteColors = [], editData, logoColor, logoLayout,
  comBorda, setComBorda, patternSrc, patternScale, setPatternScale, borderColor, setBorderColor
}) {
  const solidColor = borderColor || accentColor;

  // Dimensões físicas aproximadas em cm
  // Luva: L 13,5 x A 7 x P 18,5 cm (Arte 43,45 x 18,45 cm)
  // Caixa (gaveta): L 13,4 x A 6,9 x P 18,3 cm (Arte 49,2 x 35,2 cm)

  useEffect(() => {
    // Força a estampa e o tamanho da estampa por padrão para a Caixa
    if (setComBorda) setComBorda(true);
    if (setPatternScale) setPatternScale(140);
  }, []);
  
  // Para a Luva Flat (43.45 x 18.45)
  const FLAT_LUVA_W = 434.5;
  const FLAT_LUVA_H = 184.5;

  // Painéis da Luva (Total ~43.45):
  // Cola (~2.45) + Lateral (7) + Tampa (13.5) + Lateral (7) + Fundo (13.5)
  const pCola = 24.5;
  const pLat1 = 70;
  const pTampa = 135;
  const pLat2 = 70;
  const pFundo = 135;

  const scaleLuvaFlat = useScaleToFit(FLAT_LUVA_W, FLAT_LUVA_H + 36);

  // 3D Mockup dimensions
  const MOCKUP_W = 520;
  const MOCKUP_H = 380;
  const scaleMockup = useScaleToFit(MOCKUP_W, MOCKUP_H + 36);
  const snapshotRef = React.useRef(null);
  const [takingSnapshot, setTakingSnapshot] = useState(false);
  const [b64Pattern, setB64Pattern] = useState(null);
  const [b64Logo, setB64Logo] = useState(null);

  useEffect(() => {
    const fetchB64 = (url, setter) => {
      if (!url || url.startsWith('data:')) {
        setter(url);
        return;
      }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width || 1000;
          canvas.height = img.height || 1000;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setter(canvas.toDataURL('image/png'));
        } catch (e) {
          console.warn('Failed to convert via canvas', e);
          setter(url);
        }
      };
      img.onerror = () => {
        console.warn('Failed to load image for b64', url);
        setter(url);
      };
      // Prevent browser from giving us a cached non-CORS version
      img.src = url + (url.includes('?') ? '&' : '?') + 'cb=' + Date.now();
    };
    fetchB64(patternSrc, setB64Pattern);
    fetchB64(editData?.customLogoSrc, setB64Logo);
  }, [patternSrc, editData?.customLogoSrc]);

  const [angle, setAngle] = useState(-25);
  const defaultDrawerColor = paletteColors[1] || '#e5e5e5';
  const [bgColor, setBgColor] = useState(defaultDrawerColor);
  const bgOptions = [...new Set(['#ffffff', '#f8f9fa', '#222222', defaultDrawerColor, ...paletteColors])];

  const takeSnapshot = async () => {
    if (!snapshotRef.current) return;
    setTakingSnapshot(true);
    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(snapshotRef.current, { 
        cacheBust: true, 
        pixelRatio: 2,
        skipFonts: true 
      });
      const link = document.createElement('a');
      link.download = `mockup-caixa-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Erro ao gerar print:', err);
    } finally {
      setTakingSnapshot(false);
    }
  };

  const boxW = 185; // Profundidade (comprimento) da caixa
  const boxH = 70;  // Altura
  const boxD = 135; // Largura da tampa
  
  const sleeveColor = solidColor;
  const drawerColor = bgColor;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', width: '100%', padding: '20px 0' }}>

      {/* Painel Inteligente de Controles */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px', background: '#fff', padding: '20px 24px', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', width: '100%', maxWidth: '420px', marginTop: '-10px' }}>
        
        {/* Controle da Luva (Externa) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Parte Externa (Luva)</span>
          <BordaToggle 
            comBorda={comBorda} setComBorda={setComBorda} 
            accentColor={accentColor} paletteColors={paletteColors} 
            borderColor={borderColor} setBorderColor={setBorderColor} 
            patternScale={patternScale} setPatternScale={setPatternScale} 
          />
        </div>

        <div style={{ width: '80%', height: '1px', background: '#f0f0f0' }} />

        {/* Controle da Gaveta (Interna) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
          <span style={{ fontSize: '10px', fontWeight: 800, color: '#999', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cor da Gaveta (Interna)</span>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {bgOptions.map((c, i) => (
              <button
                key={i}
                onClick={() => setBgColor(c)}
                style={{
                  width: '24px', height: '24px', borderRadius: '50%', background: c,
                  border: bgColor === c ? `2px solid ${accentColor || '#000'}` : '1px solid rgba(0,0,0,0.1)',
                  cursor: 'pointer', padding: 0, transition: 'all 0.2s',
                  boxShadow: bgColor === c ? '0 0 0 3px #fff inset' : '0 2px 5px rgba(0,0,0,0.05)'
                }}
                title="Mudar Cor da Gaveta"
              />
            ))}
          </div>
        </div>

      </div>

      <div style={{ fontSize: '12px', color: '#888', fontFamily: 'Montserrat,sans-serif', fontWeight: 600, textAlign: 'center', marginBottom: '5px' }}>
        Tamanho Padrão: L 13,5 cm × A 7,0 cm × P 18,5 cm
      </div>
      
      {/* 3D Mockup */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
        <span style={{ fontSize: '10px', fontWeight: 800, color: '#999', textTransform: 'uppercase' }}>Mockup 3D Interativo</span>
        <div ref={scaleMockup.wrapperRef} style={scaleMockup.wrapperStyle}>
          <div style={scaleMockup.innerStyle}>
            <div ref={snapshotRef} style={{
              width: MOCKUP_W, height: MOCKUP_H, position: 'relative', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: '#f5f5f5', borderRadius: 12, boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.03)',
              perspective: '1000px', transition: 'background 0.3s ease'
            }}>
              <div style={{
                position: 'relative',
                width: boxW, height: boxH,
                transformStyle: 'preserve-3d',
                transform: `scale(1.35) rotateX(-30deg) rotateY(${angle}deg)`,
                transition: 'transform 0.1s linear',
                marginTop: '-20px' // Sobe a caixa um pouquinho para dar mais espaço pro slider embaixo
              }}>
                {/* Sombra no chão (Luva) */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  width: boxW + 4, height: boxD + 4,
                  transform: `translate(-50%, -50%) rotateX(90deg) translateZ(${-boxH/2 - 1}px) translate(4px, 4px)`,
                  background: 'rgba(0,0,0,0.3)',
                  filter: 'blur(5px)',
                  borderRadius: '4px'
                }} />
                {/* Sombra no chão (Gaveta) */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  width: boxW, height: boxD,
                  transform: `translate(-50%, -50%) translateX(40px) rotateX(90deg) translateZ(${-boxH/2 - 1}px) translate(4px, 4px)`,
                  background: 'rgba(0,0,0,0.25)',
                  filter: 'blur(5px)',
                  borderRadius: '4px'
                }} />

                {/* Drawer (Caixa Interna) - Deslizando para a direita */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  width: 0, height: 0,
                  transformStyle: 'preserve-3d',
                  transform: 'translateX(40px)', // Puxado um pouco para fora ao longo do eixo X
                }}>
                  {/* Fundo gaveta (dentro) */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', width: boxW - 2, height: boxD - 2, background: drawerColor, transform: `translate(-50%, -50%) rotateX(-90deg) translateZ(${boxH/2 - 1}px)`, border: '1px solid rgba(0,0,0,0.1)', boxShadow: 'inset 0 10px 40px rgba(0,0,0,0.4)' }} />
                  {/* Frente gaveta */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', width: boxW - 2, height: boxH - 2, background: drawerColor, transform: `translate(-50%, -50%) rotateY(0deg) translateZ(${boxD/2 - 1}px)`, border: '1px solid rgba(0,0,0,0.1)', filter: 'brightness(0.85)' }} />
                  {/* Trás gaveta */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', width: boxW - 2, height: boxH - 2, background: drawerColor, transform: `translate(-50%, -50%) rotateY(180deg) translateZ(${boxD/2 - 1}px)`, border: '1px solid rgba(0,0,0,0.1)', filter: 'brightness(0.7)' }} />
                  {/* Lado Direito gaveta (Ponta que puxa) */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', width: boxD - 2, height: boxH - 2, background: drawerColor, transform: `translate(-50%, -50%) rotateY(90deg) translateZ(${boxW/2 - 1}px)`, border: '1px solid rgba(0,0,0,0.1)', filter: 'brightness(0.95)' }} />
                  {/* Lado Esquerdo gaveta (Fundo da gaveta) */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', width: boxD - 2, height: boxH - 2, background: drawerColor, transform: `translate(-50%, -50%) rotateY(-90deg) translateZ(${boxW/2 - 1}px)`, border: '1px solid rgba(0,0,0,0.1)', filter: 'brightness(0.6)' }} />
                </div>

                {/* Sleeve (Luva) */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  width: 0, height: 0,
                  transformStyle: 'preserve-3d',
                }}>
                  {/* Topo (Tampa) */}
                  <div style={{ 
                    position: 'absolute', top: '50%', left: '50%', width: boxW, height: boxD, background: comBorda && patternSrc ? '#fff' : sleeveColor,
                    transform: `translate(-50%, -50%) rotateX(90deg) translateZ(${boxH/2}px)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden'
                  }}>
                    {comBorda && patternSrc && (
                      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${b64Pattern || patternSrc})`, backgroundSize: `${patternScale * 3.5}px`, opacity: 0.9 }} />
                    )}
                    <div style={{ transform: 'rotate(-90deg)', width: boxD, height: boxW, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <LogoPreviewHTML editData={{...editData, customLogoSrc: b64Logo || editData?.customLogoSrc}} color={comBorda && patternSrc ? logoColor : '#fff'} layout={logoLayout} scaleFactor={0.35} maxWidth={110} hideTagline={false} withBackground={comBorda && !!patternSrc} />
                    </div>
                  </div>
                  {/* Fundo */}
                  <div style={{ 
                    position: 'absolute', top: '50%', left: '50%', width: boxW, height: boxD, background: sleeveColor,
                    transform: `translate(-50%, -50%) rotateX(-90deg) translateZ(${boxH/2}px)`, filter: 'brightness(0.7)'
                  }} />
                  {/* Frente (Lateral 1) */}
                  <div style={{ 
                    position: 'absolute', top: '50%', left: '50%', width: boxW, height: boxH, background: comBorda && patternSrc ? '#fff' : sleeveColor,
                    transform: `translate(-50%, -50%) rotateY(0deg) translateZ(${boxD/2}px)`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden', filter: 'brightness(0.9)'
                  }}>
                    {comBorda && patternSrc && (
                      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${patternScale * 3.5}px`, opacity: 0.9 }} />
                    )}
                  </div>
                  {/* Trás (Lateral 2) */}
                  <div style={{ 
                    position: 'absolute', top: '50%', left: '50%', width: boxW, height: boxH, background: sleeveColor,
                    transform: `translate(-50%, -50%) rotateY(180deg) translateZ(${boxD/2}px)`, filter: 'brightness(0.8)'
                  }}>
                    {comBorda && patternSrc && (
                      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${patternSrc})`, backgroundSize: `${patternScale * 3.5}px`, opacity: 0.9 }} />
                    )}
                  </div>

                  {/* ---------- LADO DE DENTRO DA LUVA (Branco / Papel Cru) ---------- */}
                  {/* Topo interno */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', width: boxW, height: boxD, background: '#fff', transform: `translate(-50%, -50%) rotateX(-90deg) translateZ(${boxH/2 - 0.5}px)`, filter: 'brightness(0.8)' }} />
                  {/* Fundo interno */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', width: boxW, height: boxD, background: '#fff', transform: `translate(-50%, -50%) rotateX(90deg) translateZ(${boxH/2 - 0.5}px)`, filter: 'brightness(0.95)' }} />
                  {/* Frente interna */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', width: boxW, height: boxH, background: '#fff', transform: `translate(-50%, -50%) rotateY(180deg) translateZ(${boxD/2 - 0.5}px)`, filter: 'brightness(0.9)' }} />
                  {/* Trás interna */}
                  <div style={{ position: 'absolute', top: '50%', left: '50%', width: boxW, height: boxH, background: '#fff', transform: `translate(-50%, -50%) rotateY(0deg) translateZ(${boxD/2 - 0.5}px)`, filter: 'brightness(0.85)' }} />

                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Controles totalmente fora do container cinza e do scaleMockup */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '8px', width: '100%', maxWidth: '300px' }}>
          <input type="range" min="-80" max="80" value={angle} onChange={(e) => setAngle(e.target.value)} style={{ width: '100%', cursor: 'ew-resize', accentColor: accentColor }} />
        </div>
      </div>

      {/* Flat Arte - Luva */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%' }}>
        <span style={{ fontSize: '10px', fontWeight: 800, color: '#999', textTransform: 'uppercase' }}>Arte Flat - Luva (Externa)</span>
        <div ref={scaleLuvaFlat.wrapperRef} style={scaleLuvaFlat.wrapperStyle}>
          <div style={scaleLuvaFlat.innerStyle}>
            <div style={{
              width: FLAT_LUVA_W, height: FLAT_LUVA_H, position: 'relative',
              display: 'flex', border: '1px solid #ddd', background: '#fff',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
            }}>
              {comBorda && patternSrc && (
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${b64Pattern || patternSrc})`, backgroundSize: `${patternScale * 3.5}px`, opacity: 0.9 }} />
              )}
              {!comBorda && (
                <div style={{ position: 'absolute', inset: 0, background: sleeveColor }} />
              )}
              
              {/* Linhas de dobra */}
              <div style={{ position: 'absolute', left: pCola, top: 0, bottom: 0, borderLeft: '1px dashed rgba(0,0,0,0.3)' }} />
              <div style={{ position: 'absolute', left: pCola + pLat1, top: 0, bottom: 0, borderLeft: '1px dashed rgba(0,0,0,0.3)' }} />
              <div style={{ position: 'absolute', left: pCola + pLat1 + pTampa, top: 0, bottom: 0, borderLeft: '1px dashed rgba(0,0,0,0.3)' }} />
              <div style={{ position: 'absolute', left: pCola + pLat1 + pTampa + pLat2, top: 0, bottom: 0, borderLeft: '1px dashed rgba(0,0,0,0.3)' }} />

              {/* Labels das partes */}
              <div style={{ position: 'absolute', left: 0, width: pCola, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 8, color: 'rgba(0,0,0,0.4)', transform: 'rotate(-90deg)' }}>Cola</span>
              </div>
              <div style={{ position: 'absolute', left: pCola, width: pLat1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 10, color: comBorda ? '#333' : '#fff', opacity: 0.6, transform: 'rotate(-90deg)' }}>Lateral</span>
              </div>
              <div style={{ position: 'absolute', left: pCola + pLat1, width: pTampa, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ transform: 'rotate(-90deg)', width: FLAT_LUVA_H, height: pTampa, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LogoPreviewHTML editData={editData} color={comBorda ? logoColor : '#fff'} layout={logoLayout} scaleFactor={0.45} maxWidth={160} hideTagline={false} withBackground={comBorda && !!patternSrc} />
                </div>
                <span style={{ position: 'absolute', bottom: 10, fontSize: 10, color: comBorda ? '#333' : '#fff', opacity: 0.6 }}>Tampa</span>
              </div>
              <div style={{ position: 'absolute', left: pCola + pLat1 + pTampa, width: pLat2, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 10, color: comBorda ? '#333' : '#fff', opacity: 0.6, transform: 'rotate(-90deg)' }}>Lateral</span>
              </div>
              <div style={{ position: 'absolute', left: pCola + pLat1 + pTampa + pLat2, width: pFundo, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 10, color: comBorda ? '#333' : '#fff', opacity: 0.6, transform: 'rotate(-90deg)' }}>Fundo</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ fontSize: '11px', color: '#999', fontFamily: 'Montserrat,sans-serif', fontWeight: 600 }}>
          Arte Luva: 43,45 x 18,45 cm
        </div>
      </div>

      {/* Flat Arte - Gaveta */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '100%', marginTop: '20px' }}>
        <span style={{ fontSize: '10px', fontWeight: 800, color: '#999', textTransform: 'uppercase' }}>Arte Flat - Gaveta (Interna)</span>
        <div style={{
          width: '300px', height: '220px', position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#fcfcfc', borderRadius: 8, border: '1px solid #eee'
        }}>
          {/* Gabarito em Cruz da Gaveta */}
          <div style={{ position: 'relative', width: '135px', height: '185px', background: drawerColor, border: '1px dashed rgba(0,0,0,0.3)' }}>
            {/* Aba Superior (Trás) */}
            <div style={{ position: 'absolute', top: '-70px', left: 0, width: '135px', height: '70px', background: drawerColor, border: '1px dashed rgba(0,0,0,0.3)', borderBottom: 'none' }} />
            {/* Aba Inferior (Frente) */}
            <div style={{ position: 'absolute', bottom: '-70px', left: 0, width: '135px', height: '70px', background: drawerColor, border: '1px dashed rgba(0,0,0,0.3)', borderTop: 'none' }} />
            {/* Aba Esquerda (Lateral Esquerda) */}
            <div style={{ position: 'absolute', top: 0, left: '-70px', width: '70px', height: '185px', background: drawerColor, border: '1px dashed rgba(0,0,0,0.3)', borderRight: 'none' }} />
            {/* Aba Direita (Lateral Direita) */}
            <div style={{ position: 'absolute', top: 0, right: '-70px', width: '70px', height: '185px', background: drawerColor, border: '1px dashed rgba(0,0,0,0.3)', borderLeft: 'none' }} />
            
            <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: 10, color: 'rgba(0,0,0,0.4)', fontWeight: 600 }}>Fundo</span>
          </div>
        </div>
        <div style={{ fontSize: '11px', color: '#999', fontFamily: 'Montserrat,sans-serif', fontWeight: 600 }}>
          Arte Gaveta: Aprox. 27,5 x 32,5 cm
        </div>
      </div>

    </div>
  );
}
