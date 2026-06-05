import React from 'react';
import { LogoPreviewHTML, BordaToggle } from './page';
import { useScaleToFit } from './useScaleToFit';
import { useTranslation } from '../../LanguageContext';

export default function MeuPratinhoPreview({
  accentColor, paletteColors = [], editData, logoColor, logoLayout,
  cartaoContacts, crmLine, clinicaNome, comBorda, setComBorda,
  patternSrc, patternScale, setPatternScale, borderColor, setBorderColor
}) {
  const { dictionary } = useTranslation();
  const pTranslation = dictionary?.meu_pratinho;

  const formatLabelWithBr = (text, fallback) => {
    if (!text) return fallback;
    const parts = text.split(' (');
    if (parts.length > 1) {
      return <>{parts[0]}<br/>({parts[1]}</>;
    }
    return text;
  };

  const BORDER = 10;
  const effectiveSrc = comBorda ? patternSrc : null;
  const solidColor = borderColor || accentColor;
  const c0 = paletteColors[0] || solidColor;
  const c1 = paletteColors[1] || solidColor;
  const c2 = paletteColors[2] || c0;
  const c3 = paletteColors[3] || c1;

  const Page = ({ children, label }) => {
    const displayLabel = label === 'Frente' 
      ? (dictionary?.geral?.frente || 'Frente') 
      : label === 'Verso' 
        ? (dictionary?.geral?.verso || 'Verso') 
        : label;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '10px', fontWeight: 800, color: '#999', textTransform: 'uppercase' }}>{displayLabel}</span>
        <div style={{ width: '453px', height: '320px', position: 'relative', boxShadow: '0 6px 30px rgba(0,0,0,0.12)', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
          {effectiveSrc
            ? <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${effectiveSrc})`, backgroundSize: `${(patternScale || 150) / 2.5}px`, backgroundRepeat: 'repeat' }} />
            : <div style={{ position: 'absolute', inset: 0, background: solidColor }} />}
          <div style={{ position: 'absolute', top: BORDER, left: BORDER, right: BORDER, bottom: BORDER, background: '#fff', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {children}
          </div>
        </div>
      </div>
    );
  };

  const Step = ({ n, title, children, color }) => (
    <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-start', marginBottom: '5px' }}>
      <div style={{ width: '13px', height: '13px', borderRadius: '50%', background: color || solidColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '7px', fontWeight: 900, flexShrink: 0, marginTop: '1px' }}>{n}</div>
      <div>
        <div style={{ fontSize: '7px', fontWeight: 900, color: color || solidColor, textTransform: 'uppercase', lineHeight: 1.1, marginBottom: '1px' }}>{title}</div>
        <div style={{ fontSize: '5.5px', color: '#444', lineHeight: 1.25 }}>{children}</div>
      </div>
    </div>
  );

  const FoodCard = ({ title, color, children }) => (
    <div style={{ background: '#fff', borderRadius: '5px', boxShadow: `0 1.5px 5px rgba(0,0,0,0.10)`, overflow: 'hidden', border: `0.5px solid ${color}30` }}>
      <div style={{ background: color, padding: '3px 6px' }}>
        <span style={{ fontSize: '6px', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{title}</span>
      </div>
      <div style={{ padding: '4px 6px' }}>
        <span style={{ fontSize: '5.2px', color: '#555', lineHeight: 1.35, display: 'block' }}>{children}</span>
      </div>
    </div>
  );

  // Each Page is 453 × 320 px — scale to fit on mobile
  const PAGE_W = 453;
  const PAGE_H = 320;
  const scaleA = useScaleToFit(PAGE_W, PAGE_H + 24); // +24 for label
  const scaleB = useScaleToFit(PAGE_W, PAGE_H + 24);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', width: '100%', padding: '20px 0' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%' }}>

        {/* ── FRENTE ── */}
        <div ref={scaleA.wrapperRef} style={scaleA.wrapperStyle}>
        <div style={scaleA.innerStyle}>
        <Page label="Frente">
          <div style={{ display: 'flex', height: '100%', gap: '0', padding: '0' }}>

            {/* Coluna esquerda: título + campos + steps */}
            <div style={{ flex: '0 0 190px', display: 'flex', flexDirection: 'column', padding: '10px 10px 20px 10px', borderRight: `0.5px solid ${solidColor}15` }}>

              {/* Título */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '5px', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{pTranslation?.passo_a_passo || 'passo a passo'}</div>
                <div style={{ fontSize: '15px', fontWeight: 900, color: solidColor, textTransform: 'uppercase', lineHeight: 1 }}>{pTranslation?.alimentacao || 'ALIMENTAÇÃO'}</div>
                <div style={{ fontSize: '13px', fontWeight: 900, color: solidColor, textTransform: 'uppercase', lineHeight: 1 }}>{pTranslation?.complementar || 'COMPLEMENTAR'}</div>
              </div>

              {/* Campos */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '10px', padding: '5px 7px', background: solidColor + '08', borderRadius: '3px', border: `0.3px solid ${solidColor}20` }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  <span style={{ fontSize: '5px', fontWeight: 800, color: '#666' }}>{pTranslation?.nome || 'NOME'}:</span>
                  <div style={{ width: '100%', borderBottom: `0.4px solid ${solidColor}50`, height: '5px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  <span style={{ fontSize: '5px', fontWeight: 800, color: '#666' }}>{pTranslation?.data_nascimento || 'DATA DE NASCIMENTO'}:</span>
                  <div style={{ width: '100%', borderBottom: `0.4px solid ${solidColor}50`, height: '5px' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', fontSize: '5px', fontWeight: 800, color: '#666', marginTop: '1px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <div style={{ width: '6px', height: '6px', border: `0.4px solid ${solidColor}60`, borderRadius: '50%' }} /> {pTranslation?.menino || 'MENINO'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <div style={{ width: '6px', height: '6px', border: `0.4px solid ${solidColor}60`, borderRadius: '50%' }} /> {pTranslation?.menina || 'MENINA'}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  <span style={{ fontSize: '5px', fontWeight: 800, color: '#666' }}>{pTranslation?.responsavel || 'NOME DO RESPONSÁVEL'}:</span>
                  <div style={{ borderBottom: `0.4px solid ${solidColor}50`, height: '5px' }} />
                </div>
              </div>

              {/* Steps — espaçados para preencher a altura */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <Step n="1" title={pTranslation?.idade_titulo || 'Idade'} color={c0}>{pTranslation?.idade_desc || '6 meses, com os sinais de prontidão presentes.'}</Step>
                <Step n="2" title={pTranslation?.consistencia_titulo || 'Consistência'} color={c1}>{pTranslation?.consistencia_desc || 'Proibido mixer, liquidificador, peneira ou redinha. O que não amassar, ofereça em pedaços para estimular a mastigação e o desenvolvimento orofacial.'}</Step>
                <Step n="3" title={pTranslation?.colher_titulo || 'Escolha o tamanho da colher'} color={c2}>{pTranslation?.colher_desc || 'Tamanho adequado ao diâmetro da boca da criança. Prefira silicone ou plástico.'}</Step>
                <Step n="4" title={pTranslation?.montar_titulo || 'Montar o prato'} color={c3}>{pTranslation?.montar_desc || 'Siga a proporção da imagem dando preferência a alimentos ricos, frescos e variados.'}</Step>
              </div>
            </div>

            {/* Coluna direita: logo canto direito + prato */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '4px 8px 10px 6px' }}>
              {/* Logo alinhada à direita */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px', marginTop: '4px', height: '48px', width: '100%', alignItems: 'center', overflow: 'hidden' }}>
                <LogoPreviewHTML item="Meu Pratinho" editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.52} hideTagline={false} withBackground={false} maxWidth="100%" maxHeight="100%" />
              </div>
              {/* Prato com anel colorido da paleta */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'relative', width: '195px', height: '195px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Anel externo */}
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `conic-gradient(${c0} 0deg 180deg, ${c1} 180deg 360deg)` }} />
                  {/* Espaço branco entre anel e prato */}
                  <div style={{ position: 'absolute', inset: '5px', borderRadius: '50%', background: '#fff' }} />
                  {/* Prato CSS — igual FolderPage5Art */}
                  <div style={{ position: 'absolute', inset: '8px', borderRadius: '50%', overflow: 'hidden' }}>
                    <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', background: `conic-gradient(from 270deg, ${c1}e0 0deg 180deg, ${paletteColors[4]||c1}e0 180deg 225deg, ${paletteColors[3]||c1}e0 225deg 270deg, ${c0}e0 270deg 360deg)` }}>
                      <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: '#fff', transform: 'translateY(-50%)' }} />
                      <div style={{ position: 'absolute', left: '50%', top: '50%', bottom: 0, width: '1px', background: '#fff', transform: 'translateX(-50%)' }} />
                      <div style={{ position: 'absolute', left: '50%', top: '50%', width: '1px', height: '50%', background: '#fff', transformOrigin: 'top center', transform: 'translateX(-50%) rotate(-45deg)' }} />
                      <div style={{ position: 'absolute', top: '18%', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                        <span style={{ fontSize: '18px', lineHeight: 1 }}>🥦🥕🍅</span>
                        <span style={{ fontSize: '7px', fontWeight: 900, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.4)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{pTranslation?.hortalicas_label || 'Hortaliças (50%)'}</span>
                      </div>
                      <div style={{ position: 'absolute', bottom: '20%', left: '14%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                        <span style={{ fontSize: '18px', lineHeight: 1 }}>🍚🥔</span>
                        <span style={{ fontSize: '6.5px', fontWeight: 900, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.4)', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.2, width: '45px' }}>{pTranslation?.carbo_label || 'Carbo (25%)'}</span>
                      </div>
                      <div style={{ position: 'absolute', bottom: '14%', right: '27%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                        <span style={{ fontSize: '18px', lineHeight: 1 }}>🍗</span>
                        <span style={{ fontSize: '6.5px', fontWeight: 900, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.4)', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.2 }}>{formatLabelWithBr(pTranslation?.proteina_label, <>Proteína<br/>(12.5%)</>)}</span>
                      </div>
                      <div style={{ position: 'absolute', bottom: '27%', right: '12%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                        <span style={{ fontSize: '18px', lineHeight: 1 }}>🫘</span>
                        <span style={{ fontSize: '6.5px', fontWeight: 900, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.4)', textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.2 }}>{formatLabelWithBr(pTranslation?.graos_label, <>Grãos<br/>(12.5%)</>)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ position: 'absolute', bottom: 4, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', borderTop: '0.4px solid #f0f0f0', paddingTop: '3px' }}>
            <span style={{ fontSize: '5px', color: '#bbb' }}>{clinicaNome}{cartaoContacts?.telefone ? ` · ${cartaoContacts.telefone}` : ''}</span>
            <span style={{ fontSize: '5px', fontWeight: 800, color: solidColor }}>{pTranslation?.guia_alimentar_label || 'GUIA ALIMENTAR: MEU PRATINHO'}</span>
          </div>
        </Page>
        </div></div>

        {/* ── VERSO ── */}
        <div ref={scaleB.wrapperRef} style={scaleB.wrapperStyle}>
        <div style={scaleB.innerStyle}>
        <Page label="Verso">
          <div style={{ padding: '6px 8px 18px', display: 'flex', flexDirection: 'column', height: '100%', background: '#f5f5f5' }}>
            <div style={{ fontSize: '9px', fontWeight: 900, color: solidColor, textTransform: 'uppercase', textAlign: 'center', marginBottom: '1px' }}>{pTranslation?.guia_alimentar_label?.replace('GUIA ALIMENTAR: ', '') || 'MEU PRATINHO'}</div>
            <div style={{ fontSize: '5px', color: '#999', textAlign: 'center', marginBottom: '5px' }}>{pTranslation?.como_montar_subtitulo || 'Como montar um prato equilibrado para as crianças'}</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px', flex: 1, alignContent: 'space-between' }}>
              <FoodCard title={pTranslation?.legumes_verduras_titulo || 'Legumes e Verduras'} color={c0}>
                {pTranslation?.legumes_verduras_desc || 'Ricos em vitaminas, minerais, fibras e ferro não-heme. Aposte na variedade — quanto mais colorido, melhor! Beterraba, chuchu, abobrinha, cenoura, alface, brócolis, couve-flor, espinafre, acelga, rúcula, agrião. Devem ocupar metade do pratinho.'}
              </FoodCard>
              <FoodCard title={pTranslation?.proteinas_titulo || 'Proteínas'} color={c1}>
                {pTranslation?.proteinas_desc || 'Fonte de proteína, gordura, ferro, zinco e vitamina B12. Inclui carne, ovo, peixe e frango. Opte por carnes e aves magras ou com baixo teor de gordura. Escolha 1 opção por refeição e varie ao longo da semana.'}
              </FoodCard>
              <FoodCard title={pTranslation?.agua_titulo || 'Água'} color={c2}>
                {pTranslation?.agua_desc || 'Oferte sempre após cada refeição e lanches. Hidrate-se constantemente! A água é fundamental para o bom funcionamento do organismo. Evite bebidas açucaradas, sucos e chás.'}
              </FoodCard>
              <FoodCard title={pTranslation?.leguminosas_titulo || 'Leguminosas'} color={c3}>
                {pTranslation?.leguminosas_desc || 'Proteínas, fibras, ferro, zinco e vitaminas do complexo B. Feijão, grão de bico, ervilha, lentilha, soja. Escolha 1 opção por refeição e varie a proteína vegetal ao longo da semana.'}
              </FoodCard>
              <FoodCard title={pTranslation?.frutas_titulo || 'Frutas'} color={c0}>
                {pTranslation?.frutas_desc || 'Fonte de vitaminas, minerais, fibras e energia. Ótimas para sobremesa e lanchinhos. Abacate, abacaxi, acerola, banana, caqui, goiaba, kiwi, laranja, maçã, mamão, melancia, morango, pêra, uva e muito mais.'}
              </FoodCard>
              <FoodCard title={pTranslation?.cereais_titulo || 'Cereais, Raízes e Tubérculos'} color={c1}>
                {pTranslation?.cereais_desc || 'Fontes de vitaminas, minerais e energia. Arroz, macarrão, batata, mandioca, inhame, cará. Varie ao longo da semana e prefira os integrais pela maior presença de fibras e nutrientes.'}
              </FoodCard>
              <FoodCard title={pTranslation?.oleos_titulo || 'Óleos e Gorduras'} color={c2}>
                {pTranslation?.oleos_desc || 'Importantes para o desenvolvimento saudável do bebê e absorção de vitaminas lipossolúveis. Use pequenas quantidades de azeite de oliva ou óleo de canola. Evite gorduras saturadas, trans, margarina e frituras.'}
              </FoodCard>
              <FoodCard title={pTranslation?.leite_titulo || 'Leite e Derivados'} color={c3}>
                {pTranslation?.leite_desc || 'Fonte de proteína, gordura, cálcio e vitamina A. Leite, coalhadas, iogurtes naturais sem açúcar e queijos. Ótimos para incluir no café da manhã e lanches. Prefira versões integrais e sem adição de açúcar.'}
              </FoodCard>
              <FoodCard title={pTranslation?.oleaginosas_titulo || 'Oleaginosas'} color={c0}>
                {pTranslation?.oleaginosas_desc || 'Fontes de vitaminas, fibras, gorduras saudáveis e substâncias antioxidantes. Amêndoas, amendoim, avelã, castanha-de-caju, castanha-do-brasil, noz-pecã e pistache. Ótimas opções para os lanchinhos.'}
              </FoodCard>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '0.4px solid #ddd', paddingTop: '3px', marginTop: '3px' }}>
              <span style={{ fontSize: '5px', color: '#999' }}>{clinicaNome}</span>
              <span style={{ fontSize: '5px', fontWeight: 800, color: solidColor }}>{pTranslation?.guia_alimentar_verso_label || 'GUIA ALIMENTAR: MEU PRATINHO (VERSO)'}</span>
            </div>
          </div>
        </Page>
        </div></div>

      </div>
    </div>
  );
}
