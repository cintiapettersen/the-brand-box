import React from 'react';
import { LogoPreviewHTML, BordaToggle } from './page';
import MeuPratinhoSVG from './MeuPratinhoSVG';

export default function MeuPratinhoPreview({
  accentColor, paletteColors = [], editData, logoColor, logoLayout,
  cartaoContacts, crmLine, clinicaNome, comBorda, setComBorda,
  patternSrc, patternScale, setPatternScale, borderColor, setBorderColor
}) {
  const BORDER = 10;
  const effectiveSrc = comBorda ? patternSrc : null;
  const solidColor = borderColor || accentColor;
  const c0 = paletteColors[0] || solidColor;
  const c1 = paletteColors[1] || solidColor;
  const c2 = paletteColors[2] || c0;
  const c3 = paletteColors[3] || c1;

  const Page = ({ children, label }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '10px', fontWeight: 800, color: '#999', textTransform: 'uppercase' }}>{label}</span>
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', width: '100%', padding: '20px 0' }}>
      <BordaToggle comBorda={comBorda} setComBorda={setComBorda} accentColor={accentColor} paletteColors={paletteColors} borderColor={borderColor} setBorderColor={setBorderColor} patternScale={patternScale} setPatternScale={setPatternScale} />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>

        {/* ── FRENTE ── */}
        <Page label="Frente">
          <div style={{ display: 'flex', height: '100%', gap: '0', padding: '0' }}>

            {/* Coluna esquerda: título + campos + steps */}
            <div style={{ flex: '0 0 190px', display: 'flex', flexDirection: 'column', padding: '10px 10px 20px 10px', borderRight: `0.5px solid ${solidColor}15` }}>

              {/* Título */}
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '5px', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.5px' }}>passo a passo</div>
                <div style={{ fontSize: '15px', fontWeight: 900, color: solidColor, textTransform: 'uppercase', lineHeight: 1 }}>ALIMENTAÇÃO</div>
                <div style={{ fontSize: '13px', fontWeight: 900, color: solidColor, textTransform: 'uppercase', lineHeight: 1 }}>COMPLEMENTAR</div>
              </div>

              {/* Campos */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '10px', padding: '5px 7px', background: solidColor + '08', borderRadius: '3px', border: `0.3px solid ${solidColor}20` }}>
                {[['NOME', '100%'], ['DATA DE NASCIMENTO', '100%']].map(([label, w]) => (
                  <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <span style={{ fontSize: '5px', fontWeight: 800, color: '#666' }}>{label}:</span>
                    <div style={{ width: w, borderBottom: `0.4px solid ${solidColor}50`, height: '5px' }} />
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '10px', fontSize: '5px', fontWeight: 800, color: '#666', marginTop: '1px' }}>
                  {['MENINO','MENINA'].map(s => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <div style={{ width: '6px', height: '6px', border: `0.4px solid ${solidColor}60`, borderRadius: '50%' }} /> {s}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                  <span style={{ fontSize: '5px', fontWeight: 800, color: '#666' }}>NOME DO RESPONSÁVEL:</span>
                  <div style={{ borderBottom: `0.4px solid ${solidColor}50`, height: '5px' }} />
                </div>
              </div>

              {/* Steps — espaçados para preencher a altura */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <Step n="1" title="Idade" color={c0}>6 meses, com os sinais de prontidão presentes.</Step>
                <Step n="2" title="Consistência" color={c1}>Proibido mixer, liquidificador, peneira ou redinha. O que não amassar, ofereça em pedaços para estimular a mastigação e o desenvolvimento orofacial.</Step>
                <Step n="3" title="Escolha o tamanho da colher" color={c2}>Tamanho adequado ao diâmetro da boca da criança. Prefira silicone ou plástico.</Step>
                <Step n="4" title="Montar o prato" color={c3}>Siga a proporção da imagem dando preferência a alimentos ricos, frescos e variados.</Step>
              </div>
            </div>

            {/* Coluna direita: logo canto direito + prato */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '4px 8px 10px 6px' }}>
              {/* Logo alinhada à direita */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '4px', marginTop: '6px' }}>
                <LogoPreviewHTML item="Meu Pratinho" editData={editData} color={logoColor} layout={logoLayout} scaleFactor={0.6} hideTagline={false} />
              </div>
              {/* Prato com anel colorido da paleta */}
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'relative', width: '195px', height: '195px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Anel externo */}
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: `conic-gradient(${c0} 0deg 180deg, ${c1} 180deg 360deg)` }} />
                  {/* Espaço branco entre anel e prato */}
                  <div style={{ position: 'absolute', inset: '5px', borderRadius: '50%', background: '#fff' }} />
                  {/* Prato centralizado */}
                  <div style={{ position: 'absolute', inset: '8px', borderRadius: '50%', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MeuPratinhoSVG width="100%" accentColor={accentColor} c0={c0} c1={c1} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ position: 'absolute', bottom: 4, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', borderTop: '0.4px solid #f0f0f0', paddingTop: '3px' }}>
            <span style={{ fontSize: '5px', color: '#bbb' }}>{clinicaNome}{cartaoContacts?.telefone ? ` · ${cartaoContacts.telefone}` : ''}</span>
            <span style={{ fontSize: '5px', fontWeight: 800, color: solidColor }}>GUIA ALIMENTAR: MEU PRATINHO</span>
          </div>
        </Page>

        {/* ── VERSO ── */}
        <Page label="Verso">
          <div style={{ padding: '6px 8px 18px', display: 'flex', flexDirection: 'column', height: '100%', background: '#f5f5f5' }}>
            <div style={{ fontSize: '9px', fontWeight: 900, color: solidColor, textTransform: 'uppercase', textAlign: 'center', marginBottom: '1px' }}>MEU PRATINHO</div>
            <div style={{ fontSize: '5px', color: '#999', textAlign: 'center', marginBottom: '5px' }}>Como montar um prato equilibrado para as crianças</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px', flex: 1, alignContent: 'space-between' }}>
              <FoodCard title="Legumes e Verduras" color={c0}>
                Ricos em vitaminas, minerais, fibras e ferro não-heme. Aposte na variedade — quanto mais colorido, melhor! Beterraba, chuchu, abobrinha, cenoura, alface, brócolis, couve-flor, espinafre, acelga, rúcula, agrião. Devem ocupar metade do pratinho.
              </FoodCard>
              <FoodCard title="Proteínas" color={c1}>
                Fonte de proteína, gordura, ferro, zinco e vitamina B12. Inclui carne, ovo, peixe e frango. Opte por carnes e aves magras ou com baixo teor de gordura. Escolha 1 opção por refeição e varie ao longo da semana.
              </FoodCard>
              <FoodCard title="Água" color={c2}>
                Oferte sempre após cada refeição e lanches. Hidrate-se constantemente! A água é fundamental para o bom funcionamento do organismo. Evite bebidas açucaradas, sucos e chás.
              </FoodCard>
              <FoodCard title="Leguminosas" color={c3}>
                Proteínas, fibras, ferro, zinco e vitaminas do complexo B. Feijão, grão de bico, ervilha, lentilha, soja. Escolha 1 opção por refeição e varie a proteína vegetal ao longo da semana.
              </FoodCard>
              <FoodCard title="Frutas" color={c0}>
                Fonte de vitaminas, minerais, fibras e energia. Ótimas para sobremesa e lanchinhos. Abacate, abacaxi, acerola, banana, caqui, goiaba, kiwi, laranja, maçã, mamão, melancia, morango, pêra, uva e muito mais.
              </FoodCard>
              <FoodCard title="Cereais, Raízes e Tubérculos" color={c1}>
                Fontes de vitaminas, minerais e energia. Arroz, macarrão, batata, mandioca, inhame, cará. Varie ao longo da semana e prefira os integrais pela maior presença de fibras e nutrientes.
              </FoodCard>
              <FoodCard title="Óleos e Gorduras" color={c2}>
                Importantes para o desenvolvimento saudável do bebê e absorção de vitaminas lipossolúveis. Use pequenas quantidades de azeite de oliva ou óleo de canola. Evite gorduras saturadas, trans, margarina e frituras.
              </FoodCard>
              <FoodCard title="Leite e Derivados" color={c3}>
                Fonte de proteína, gordura, cálcio e vitamina A. Leite, coalhadas, iogurtes naturais sem açúcar e queijos. Ótimos para incluir no café da manhã e lanches. Prefira versões integrais e sem adição de açúcar.
              </FoodCard>
              <FoodCard title="Oleaginosas" color={c0}>
                Fontes de vitaminas, fibras, gorduras saudáveis e substâncias antioxidantes. Amêndoas, amendoim, avelã, castanha-de-caju, castanha-do-brasil, noz-pecã e pistache. Ótimas opções para os lanchinhos.
              </FoodCard>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '0.4px solid #ddd', paddingTop: '3px', marginTop: '3px' }}>
              <span style={{ fontSize: '5px', color: '#999' }}>{clinicaNome}</span>
              <span style={{ fontSize: '5px', fontWeight: 800, color: solidColor }}>GUIA ALIMENTAR: MEU PRATINHO (VERSO)</span>
            </div>
          </div>
        </Page>

      </div>
    </div>
  );
}
