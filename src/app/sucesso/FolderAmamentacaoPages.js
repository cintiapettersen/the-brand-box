'use client';
import React from 'react';

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

// Quadrants for the generated image:
// 1: Top-Left (Mother)
// 2: Top-Right (Latch)
// 3: Bottom-Left (Manual)
// 4: Bottom-Right (Storage)
const Illustration = ({ quadrant, src }) => {
  const positions = [
    '0% 0%',   // 1
    '100% 0%', // 2
    '0% 100%', // 3
    '100% 100%' // 4
  ];
  if (!src) return <div style={{ width: '100%', height: '80px', background: '#f9f9f9', borderRadius: '4px', border: '1px dashed #ddd' }} />;
  return (
    <div style={{ 
      width: '100%', 
      aspectRatio: '1 / 1',
      margin: '0 auto',
      backgroundImage: `url(${src})`,
      backgroundSize: '200% 200%',
      backgroundPosition: positions[quadrant - 1],
      backgroundRepeat: 'no-repeat',
      borderRadius: '4px',
      position: 'relative'
    }} />
  );
};

export function FolderAmamentacaoPage1({ accentColor, borderColor, palette = [], logoComponent, illustrationsSrc }) {
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 8px', boxSizing: 'border-box', background: '#fff' }}>
      <div style={{ transform: 'scale(1.0)', marginBottom: '5px' }}>{logoComponent}</div>
      <div style={{ width: '30px', height: '1.5px', background: mainColor }} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '6px', fontWeight: 400, color: '#888', letterSpacing: '2px', textTransform: 'uppercase' }}>GUIA DE</div>
        <div style={{ fontSize: '9px', fontWeight: 900, color: '#333', letterSpacing: '0.5px', textTransform: 'uppercase', lineHeight: 1.1 }}>AMAMENTAÇÃO</div>
      </div>
      <div style={{ width: '100%', marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
           <span style={{ fontSize: '5px', fontWeight: 700, color: mainColor }}>NOME:</span>
           <div style={{ flex: 1, borderBottom: `0.3px solid ${mainColor}40`, height: '6px' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px' }}>
           <span style={{ fontSize: '5px', fontWeight: 700, color: mainColor }}>NASCIMENTO:</span>
           <div style={{ width: '8mm', borderBottom: `0.3px solid ${mainColor}40`, height: '6px' }} />
           <span style={{ fontSize: '5px', color: mainColor }}>/</span>
           <div style={{ width: '8mm', borderBottom: `0.3px solid ${mainColor}40`, height: '6px' }} />
           <span style={{ fontSize: '5px', color: mainColor }}>/</span>
           <div style={{ width: '8mm', borderBottom: `0.3px solid ${mainColor}40`, height: '6px' }} />
        </div>
      </div>
      <div style={{ marginTop: 'auto', width: '55px' }}>
        <Illustration quadrant={1} src={illustrationsSrc} />
      </div>
    </div>
  );
}

export function FolderAmamentacaoPage2({ accentColor, borderColor, palette = [] }) {
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', height: '100%', padding: '8px 6px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px' }}>
      <div style={{ background: mainColor, color: '#fff', padding: '3px 6px', fontWeight: 800, marginBottom: '6px', borderRadius: '1px' }}>
        ALIMENTAÇÃO DA MÃE NO PERÍODO DE AMAMENTAÇÃO
      </div>
      <p style={{ color: '#555', lineHeight: 1.4, marginBottom: '6px' }}>
        Recomenda-se que a mãe mantenha uma alimentação balanceada, com proteínas, gorduras boas, fibras, nutrientes e vitaminas. O ideal é que ela se alimente diversas vezes ao dia em porções pequenas.
      </p>
      <p style={{ color: '#555', lineHeight: 1.4, marginBottom: '10px' }}>
        <strong>Água:</strong> o recomendado é que sejam consumidos, no mínimo, dois litros por dia. A dica para manter o corpo hidratado durante todo o dia é deixar copos ou garrafas d’água nos cômodos em que a mãe costuma passar a maior parte do tempo. Bebidas com cafeína devem ser consumidas com moderação.
      </p>
      
      <div style={{ border: `0.3px solid ${mainColor}40`, padding: '6px', borderRadius: '4px' }}>
        <div style={{ fontWeight: 800, color: mainColor, marginBottom: '6px', textAlign: 'center', fontSize: '5px' }}>COMPOSIÇÃO DO LEITE MATERNO</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {[
            { label: 'Agentes de proteção', w: '100%', c: mainColor },
            { label: 'Crescimento', w: '90%', c: palette[1] || mainColor },
            { label: 'Microbiota intestinal', w: '80%', c: palette[2] || mainColor },
            { label: 'Energia, imunidade', w: '70%', c: palette[3] || mainColor },
            { label: 'Desenvolvimento cerebral', w: '60%', c: palette[4] || mainColor },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '40px', textAlign: 'right', fontSize: '3.5px' }}>{item.label}</div>
              <div style={{ flex: 1, height: '4px', background: `${item.c}20`, borderRadius: '10px', overflow: 'hidden' }}>
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
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', height: '100%', padding: '8px 6px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px' }}>
      <div style={{ background: mainColor, color: '#fff', padding: '3px 6px', fontWeight: 800, marginBottom: '6px', borderRadius: '1px' }}>
        PROBLEMAS QUE PODEM OCORRER
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <section>
          <div style={{ fontWeight: 800, color: mainColor, borderBottom: `0.2px solid ${mainColor}20`, marginBottom: '2px' }}>Fissuras nos Mamilos</div>
          <p style={{ lineHeight: 1.3 }}><strong>Causa:</strong> Má posição do bebê e técnica incorreta de sucção.</p>
          <p style={{ lineHeight: 1.3 }}><strong>Prevenção:</strong> Posicione o bebê corretamente, evite o uso de bicos e chupetas.</p>
          <p style={{ lineHeight: 1.3 }}><strong>Tratamento:</strong> Corrija a técnica, aplique leite materno após as mamadas.</p>
        </section>
        <section>
          <div style={{ fontWeight: 800, color: mainColor, borderBottom: `0.2px solid ${mainColor}20`, marginBottom: '2px' }}>Ingurgitamento Mamário</div>
          <p style={{ lineHeight: 1.3 }}><strong>Causa:</strong> Desequilíbrio entre a produção de leite e sua drenagem.</p>
          <p style={{ lineHeight: 1.3 }}><strong>Alívio:</strong> Esvazie a mama manualmente, massageie para facilitar a pega.</p>
          <p style={{ lineHeight: 1.3 }}><strong>Prevenção:</strong> Faça auto-ordenha quando necessário, mantenha as mamas elevadas.</p>
        </section>
        
        <div style={{ display: 'flex', gap: '3px', marginTop: '4px', padding: '0 8px' }}>
          <div style={{ flex: 1, background: '#f8f8f8', padding: '6px 4px', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ fontWeight: 800, color: '#333', marginBottom: '4px', lineHeight: 1.1 }}>Antes do retorno<br/>ao trabalho:</div>
            <ul style={{ padding: 0, margin: 0, listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <li style={{ display: 'flex', gap: '2px', textAlign: 'left' }}><span style={{ color: mainColor }}>•</span> <span style={{ fontSize: '3.8px' }}>Manter aleitamento exclusivo;</span></li>
              <li style={{ display: 'flex', gap: '2px', textAlign: 'left' }}><span style={{ color: mainColor }}>•</span> <span style={{ fontSize: '3.8px' }}>Retirada no local.</span></li>
            </ul>
          </div>
          <div style={{ flex: 1, background: '#f8f8f8', padding: '6px 4px', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ fontWeight: 800, color: '#333', marginBottom: '4px', lineHeight: 1.1 }}>Após o retorno<br/>ao trabalho:</div>
            <ul style={{ padding: 0, margin: 0, listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <li style={{ display: 'flex', gap: '2px', textAlign: 'left' }}><span style={{ color: mainColor }}>•</span> <span style={{ fontSize: '3.8px' }}>Amamentar em casa;</span></li>
              <li style={{ display: 'flex', gap: '2px', textAlign: 'left' }}><span style={{ color: mainColor }}>•</span> <span style={{ fontSize: '3.8px' }}>Ordenha no trabalho.</span></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FolderAmamentacaoPage4({ accentColor, borderColor, palette = [], clinicaNome, endereco, allPhones, brand }) {
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', height: '100%', padding: '8px 6px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: mainColor, color: '#fff', padding: '3px 6px', fontWeight: 800, marginBottom: '6px', borderRadius: '1px' }}>
        APOIO EMOCIONAL
      </div>
      <p style={{ fontWeight: 700, marginBottom: '4px' }}>O que devo saber sobre o apoio emocional da família?</p>
      <ul style={{ paddingLeft: '8px', marginBottom: '8px', lineHeight: 1.4 }}>
        <li>Todos os familiares são importantes para o desenvolvimento do bebê.</li>
        <li>O ambiente no lar influencia na prática da amamentação.</li>
        <li>A mãe precisa ter apoio em sua decisão de amamentar.</li>
      </ul>
      <div style={{ background: '#f9f9f9', padding: '6px', borderRadius: '4px', border: `0.2px solid ${mainColor}30` }}>
        <div style={{ fontWeight: 800, color: mainColor, marginBottom: '4px' }}>Como Posso Ajudar?</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {['Conversar com a mãe sobre o desejo de amamentar', 'Buscar ajuda profissional quando necessário', 'Deixar o ambiente organizado e confortável', 'Realizar tarefas domésticas para que a mãe tenha tempo livre'].map((text, i) => (
            <div key={i} style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <div style={{ width: '5px', height: '5px', border: `0.3px solid ${mainColor}`, borderRadius: '1px' }} />
              <span style={{ fontSize: '4px' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ marginTop: 'auto', textAlign: 'center', borderTop: `0.2px solid ${mainColor}20`, paddingTop: '8px' }}>
        <div style={{ fontSize: '5px', fontWeight: 800, color: mainColor }}>{clinicaNome}</div>
        <div style={{ fontSize: '4px', color: '#999' }}>{endereco}</div>
        <div style={{ fontSize: '4.5px', fontWeight: 800, color: '#444', marginTop: '2px' }}>{allPhones}</div>
        <div style={{ fontSize: '3.8px', color: '#aaa' }}>{brand?.email}</div>
      </div>
    </div>
  );
}

export function FolderAmamentacaoPage5({ accentColor, borderColor, palette = [], illustrationsSrc }) {
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', height: '100%', padding: '8px 6px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px' }}>
      <p style={{ lineHeight: 1.4, marginBottom: '8px' }}>
        <strong>Amamentar é muito mais do que nutrir a criança.</strong> É um processo que envolve interação profunda entre mãe e filho, com repercussões no estado nutricional da criança, em sua habilidade de se defender de infecções, em sua fisiologia e no seu desenvolvimento cognitivo e emocional.
      </p>
      <div style={{ background: `${mainColor}10`, padding: '6px', borderRadius: '4px', marginBottom: '10px' }}>
        <p style={{ margin: 0, lineHeight: 1.3 }}>
          A OMS e Ministério da Saúde recomendam aleitamento materno exclusivo nos primeiros seis meses. Não há vantagens em se introduzir alimentos complementares antes disso.
        </p>
      </div>
      
      <div style={{ fontWeight: 800, color: mainColor, marginBottom: '6px', textTransform: 'uppercase', fontSize: '5px' }}>BENEFÍCIOS DO ALEITAMENTO MATERNO</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {[
          { t: 'Para o Bebê:', c: 'Maior contato com a mãe, melhor digestão, reduz riscos de doenças alérgicas e infecciosas.' },
          { t: 'Para a Mamãe:', c: 'Diminui sangramento pós-parto, auxilia na perda de peso e reduz incidência de câncer de mama.' },
          { t: 'Para a Família:', c: 'Melhora e aprofunda os vínculos afetivos. Menor custo financeiro e melhor qualidade de vida.' },
        ].map((box, i) => (
          <div key={i} style={{ borderLeft: `2px solid ${mainColor}`, paddingLeft: '6px' }}>
            <div style={{ fontWeight: 800, color: mainColor }}>{box.t}</div>
            <div style={{ fontSize: '4px', color: '#666' }}>{box.c}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FolderAmamentacaoPage6({ accentColor, borderColor, palette = [], illustrationsSrc }) {
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', height: '100%', padding: '8px 6px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px' }}>
      <div style={{ background: mainColor, color: '#fff', padding: '3px 6px', fontWeight: 800, marginBottom: '6px', borderRadius: '1px' }}>
        A PEGA CORRETA
      </div>
      <p style={{ lineHeight: 1.3, marginBottom: '8px' }}>
        A pega correta do bebê é crucial. Uma pega inadequada pode levar a mamilos doloridos, fissuras, ingurgitamento e baixo ganho de peso do bebê.
      </p>
      
      <div style={{ position: 'relative', width: '60px', margin: '0 auto', border: '0.3px solid #eee', borderRadius: '4px', overflow: 'hidden' }}>
        <img src="/pega-correta.png" style={{ width: '100%', display: 'block' }} />
      </div>
      
      <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
        <div style={{ flex: 1, background: `${mainColor}15`, padding: '4px 3px', borderRadius: '4px', border: `0.3px solid ${mainColor}20` }}>
          <div style={{ fontWeight: 800, color: mainColor, marginBottom: '3px', textAlign: 'center', fontSize: '4.5px' }}>Certo:</div>
          <div style={{ fontSize: '3.6px', lineHeight: 1.2, display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div>✓ Boca bem aberta</div>
            <div>✓ Lábios para fora</div>
            <div>✓ Queixo na mama</div>
          </div>
        </div>
        <div style={{ flex: 1, background: '#ffebee', padding: '4px 3px', borderRadius: '4px', border: '0.3px solid #ffcdd2' }}>
          <div style={{ fontWeight: 800, color: '#c62828', marginBottom: '3px', textAlign: 'center', fontSize: '4.5px' }}>Errado:</div>
          <div style={{ fontSize: '3.6px', lineHeight: 1.2, display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div>✗ Boca pouco aberta</div>
            <div>✗ Bochechas encovadas</div>
            <div>✗ Dor ao amamentar</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FolderAmamentacaoPage7({ accentColor, borderColor, palette = [], illustrationsSrc }) {
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', height: '100%', padding: '8px 6px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px' }}>
      <div style={{ background: mainColor, color: '#fff', padding: '3px 6px', fontWeight: 800, marginBottom: '6px', borderRadius: '1px' }}>
        PASSO A PASSO DA ORDENHA MANUAL
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px', gap: '6px', alignItems: 'center' }}>
        <div style={{ fontSize: '3.8px', lineHeight: 1.2 }}>
          <div style={{ display: 'flex', gap: '3px', marginBottom: '3px' }}>
            <span style={{ fontWeight: 800, color: mainColor }}>1.</span>
            <span>Lave bem as mãos e antebraços com água e sabão.</span>
          </div>
          <div style={{ display: 'flex', gap: '3px', marginBottom: '3px' }}>
            <span style={{ fontWeight: 800, color: mainColor }}>2.</span>
            <span>Massageie a mama suavemente com movimentos circulares.</span>
          </div>
          <div style={{ display: 'flex', gap: '3px', marginBottom: '3px' }}>
            <span style={{ fontWeight: 800, color: mainColor }}>3.</span>
            <span>Posicione o polegar acima da aréola e os dedos abaixo.</span>
          </div>
          <div style={{ display: 'flex', gap: '3px', marginBottom: '3px' }}>
            <span style={{ fontWeight: 800, color: mainColor }}>4.</span>
            <span>Pressione levemente em direção ao tórax e solte.</span>
          </div>
        </div>
        <div style={{ width: '100%', border: '0.3px solid #eee', borderRadius: '3px', overflow: 'hidden' }}>
          <img src="/ordenha.png" style={{ width: '100%', display: 'block' }} />
        </div>
      </div>
      <div style={{ marginTop: '10px', fontSize: '3.8px', lineHeight: 1.2 }}>
        <p style={{ margin: '2px 0' }}><strong>Importante:</strong> Use um frasco de vidro esterilizado com tampa plástica. Despreze os primeiros jatos para higienizar os ductos.</p>
      </div>
    </div>
  );
}

export function FolderAmamentacaoPage8({ accentColor, borderColor, palette = [], illustrationsSrc }) {
  const mainColor = borderColor || palette[0] || accentColor;
  return (
    <div style={{ width: '100%', height: '100%', padding: '8px 6px', boxSizing: 'border-box', background: '#fff', fontSize: '4.2px' }}>
      <div style={{ background: mainColor, color: '#fff', padding: '3px 6px', fontWeight: 800, marginBottom: '6px', borderRadius: '1px' }}>
        ARMAZENAMENTO E USO
      </div>
      
      <section style={{ marginBottom: '8px' }}>
        <div style={{ fontWeight: 800, color: mainColor, marginBottom: '2px' }}>Conservação:</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '3.8px' }}>
          <tbody>
            <tr style={{ borderBottom: '0.1px solid #eee' }}>
              <td style={{ padding: '2px' }}>Geladeira</td>
              <td style={{ padding: '2px', textAlign: 'right' }}>Até 12 horas</td>
            </tr>
            <tr style={{ borderBottom: '0.1px solid #eee' }}>
              <td style={{ padding: '2px' }}>Congelador</td>
              <td style={{ padding: '2px', textAlign: 'right' }}>Até 15 dias</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section style={{ marginBottom: '8px' }}>
        <div style={{ fontWeight: 800, color: mainColor, marginBottom: '2px' }}>Aquecimento:</div>
        <p style={{ lineHeight: 1.2, margin: 0 }}>Deve ser feito em banho-maria (água quente, mas com fogo desligado). Não use micro-ondas, pois destrói nutrientes.</p>
      </section>

      <div style={{ width: '65px', margin: '0 auto', position: 'relative' }}>
        <img src="/armazenamento.png" style={{ width: '100%', display: 'block' }} />
      </div>
      
      <div style={{ marginTop: 'auto', background: `${mainColor}05`, padding: '4px', borderRadius: '2px', border: `0.2px solid ${mainColor}20` }}>
        <p style={{ fontSize: '3.5px', color: '#777', margin: 0, fontStyle: 'italic', textAlign: 'center' }}>"O leite materno é o melhor alimento para o seu bebê."</p>
      </div>
    </div>
  );
}
