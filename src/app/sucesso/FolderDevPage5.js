import React from 'react';

export default function FolderDevPage5({ accentColor, palette = [] }) {
  const mainColor = palette[0] || accentColor;
  const secondaryColor = palette[1] || accentColor;

  const linguagemData = [
    { assunto: 'Choro', idade: '0-6 semanas', resposta: 'Choros diferenciados para várias necessidades.' },
    { assunto: 'Sons de vogal', idade: '2 meses', resposta: 'Aparecem sons de vogal (V).' },
    { assunto: 'Vira-se para a fonte', idade: '3 meses', resposta: 'Primeiras consoantes (C): ouve-se sons p, b, m.' },
    { assunto: 'Tom melódico', idade: '6 meses', resposta: 'Inicia balbucios. Balbucia sequência de CVCV (ex: "dadada").' },
    { assunto: 'Atenção visual', idade: '9 meses', resposta: 'Imita sons, jargão. Balbucia não-reduplicativo (CVC ou VCV).' },
    { assunto: 'Primeiras palavras', idade: '12 meses', resposta: 'Começa a dizer as primeiras palavras (ex: "mama", "papa").' },
    { assunto: 'Vocabulário inicial', idade: '18 meses', resposta: 'Vocabulário de 20 a 50 palavras. Começa a combinar duas palavras ("dá papai").' },
    { assunto: 'Expansão', idade: '24 meses', resposta: 'Vocabulário de cerca de 150 palavras. Usa combinações de duas ou três.' },
    { assunto: 'Miniaturas', idade: '30 meses', resposta: 'Vocabulário de cerca de 450 palavras. Brincadeira simbólica.' },
    { assunto: 'Gramática', idade: '36 meses', resposta: 'Inicia o uso de artigos, plurais, preposições e verbos auxiliares.' },
    { assunto: 'Frases complexas', idade: '48 meses', resposta: 'Formula frases corretas, faz perguntas, usa negação e fala do passado.' },
  ];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      padding: '5px',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Montserrat', sans-serif"
    }}>
      <div style={{
        fontSize: '10px',
        fontWeight: 900,
        color: mainColor,
        textAlign: 'center',
        marginBottom: '10px',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        Marcos da Linguagem
      </div>

      <div style={{
        width: '100%',
        border: `0.5px solid ${mainColor}30`,
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          background: mainColor,
          padding: '4px 6px',
          color: '#fff',
          fontSize: '5.5px',
          fontWeight: 700,
          textTransform: 'uppercase'
        }}>
          <div style={{ flex: 1 }}>Assunto</div>
          <div style={{ flex: 1, textAlign: 'center' }}>Idade</div>
          <div style={{ flex: 2 }}>Resposta Esperada</div>
        </div>

        {/* Rows */}
        {linguagemData.map((item, idx) => (
          <div key={idx} style={{
            display: 'flex',
            padding: '4px 6px',
            background: idx % 2 === 0 ? '#fff' : `${mainColor}08`,
            borderBottom: idx === linguagemData.length - 1 ? 'none' : `0.1px solid ${mainColor}15`,
            fontSize: '4.8px',
            color: '#444',
            lineHeight: '1.2'
          }}>
            <div style={{ flex: 1, fontWeight: 700, color: mainColor }}>{item.assunto}</div>
            <div style={{ flex: 1, textAlign: 'center' }}>{item.idade}</div>
            <div style={{ flex: 2 }}>{item.resposta}</div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 'auto',
        textAlign: 'center',
        fontSize: '4px',
        color: '#999',
        fontStyle: 'italic',
        padding: '5px'
      }}>
        * Fonte: Protocolo de Observação do Desenvolvimento da Linguagem (PODL).
      </div>
    </div>
  );
}
