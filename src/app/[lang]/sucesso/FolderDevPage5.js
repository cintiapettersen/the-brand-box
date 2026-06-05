'use client';
import React from 'react';
import { useTranslation } from '../../LanguageContext';

export default function FolderDevPage5({ accentColor, palette = [] }) {
  const { lang } = useTranslation();
  const colors = [
    palette[0] || accentColor,
    palette[1] || accentColor,
    palette[2] || accentColor,
    palette[3] || palette[1] || accentColor,
  ];

  const linguagemDataPt = [
    { receptivo: 'Assusta-se. Aquieta-se ao som de voz.', idade: '0-6 semanas', expressivo: 'Choros diferenciados e sons primitivos. Aparecem os sons vogais (V).' },
    { receptivo: 'Vira-se para a fonte de voz. Observa com atenção objetos e fatos do ambiente.', idade: '3 meses', expressivo: 'Primeiras consoantes (C) ouvidas são p/b e k/g. Inicia balbucio.' },
    { receptivo: 'Responde com tons emotivos à voz materna.', idade: '6 meses', expressivo: 'Balbucio (sequências de CVCV sem mudar a consoante). Ex.: "Dudadá".' },
    { receptivo: 'Entende pedidos simples com dicas através de gestos. Entende "não" e "tchau".', idade: '9 meses', expressivo: 'Imita sons. Jargão. Balbucio não-reduplicativo (sequência CVC ou VCV).' },
    { receptivo: 'Entende muitas palavras familiares e ordens simples associadas a gestos. Ex.: "Vem com o papai".', idade: '12 meses', expressivo: 'Começa a dizer as primeiras palavras como "mamá", "papá" ou "dadá".' },
    { receptivo: 'Conhece algumas partes do corpo. Acha objetos a pedido. Brincadeira simbólica com miniaturas.', idade: '18 meses', expressivo: 'Poderá ter de 30 a 40 palavras ("mamá", "bebê", "miau", "pé", "ão-ão", "upa"). Começa a combinar duas palavras ("dá papá").' },
    { receptivo: 'Segue instruções envolvendo dois conceitos verbais (os quais são substantivos). Ex.: "Coloque o copo na caixa".', idade: '24 meses', expressivo: 'Tem um vocabulário de cerca de 150 palavras. Usa combinação de duas ou três.' },
    { receptivo: 'Entende primeiros verbos. Entende instruções envolvendo até três conceitos. Ex.: "Coloque a boneca grande na cadeira".', idade: '30 meses', expressivo: 'Usa habitualmente linguagem telegráfica ("bebê", "papá pão", "mamã vai papá").' },
    { receptivo: 'Conhece diversas cores. Reconhece plurais, pronomes que diferenciam os sexos, adjetivos.', idade: '36 meses', expressivo: 'Inicia o uso de artigos, plurais, preposições e verbos auxiliares.' },
    { receptivo: 'Começa a aprender conceitos abstratos (duro, mole, liso). Linguagem usada para raciocínio. Entende "se", "por que", "quanto". Compreende 1.500 a 2.000 palavras.', idade: '48 meses', expressivo: 'Formula frases corretas, faz perguntas, usa a negação, fala de acontecimentos no passado ou antecipa outros no futuro.' },
  ];

  const linguagemDataEn = [
    { receptivo: 'Startles. Quiets down to the sound of voice.', idade: '0-6 weeks', expressivo: 'Differentiated cries and primitive sounds. Vowel sounds (V) appear.' },
    { receptivo: 'Turns toward the voice source. Carefully observes objects and events.', idade: '3 months', expressivo: 'First consonants (C) heard are p/b and k/g. Starts babbling.' },
    { receptivo: 'Responds with emotional tones to mother\'s voice.', idade: '6 months', expressivo: 'Babbling (CVCV sequences without changing the consonant). e.g., "Dadada".' },
    { receptivo: 'Understands simple requests with gestural cues. Understands "no" and "bye-bye".', idade: '9 months', expressivo: 'Imitates sounds. Jargon. Non-reduplicative babbling (CVC or VCV sequence).' },
    { receptivo: 'Understands many familiar words and simple orders with gestures. e.g., "Come to daddy".', idade: '12 months', expressivo: 'Starts saying first words like "mama", "dada", or "papa".' },
    { receptivo: 'Knows some body parts. Finds objects on request. Symbolic play with miniatures.', idade: '18 months', expressivo: 'May have 30 to 40 words ("mama", "baby", "meow", "foot", "woof-woof", "up"). Starts combining two words ("give food").' },
    { receptivo: 'Follows instructions involving two verbal concepts (which are nouns). e.g., "Put the cup in the box".', idade: '24 months', expressivo: 'Has a vocabulary of about 150 words. Uses two or three-word combinations.' },
    { receptivo: 'Understands first verbs. Follows instructions with up to three concepts. e.g., "Put the big doll on the chair".', idade: '30 months', expressivo: 'Habitually uses telegraphic speech ("baby", "daddy bread", "mommy go bye-bye").' },
    { receptivo: 'Knows several colors. Recognizes plurals, gender-differentiating pronouns, adjectives.', idade: '36 months', expressivo: 'Starts using articles, plurals, prepositions, and auxiliary verbs.' },
    { receptivo: 'Begins to learn abstract concepts (hard, soft, smooth). Language used for reasoning. Understands "if", "why", "how much". Comprehends 1,500 to 2,000 words.', idade: '48 months', expressivo: 'Formulates correct sentences, asks questions, uses negation, talks about past events, or anticipates future ones.' },
  ];

  const linguagemData = lang === 'en' ? linguagemDataEn : linguagemDataPt;

  return (
    <div style={{ width: '100%', height: '100%', padding: '0 1px', display: 'flex', flexDirection: 'column', fontFamily: "'Montserrat', sans-serif", boxSizing: 'border-box' }}>
      <div style={{
        fontSize: '5.2px',
        fontWeight: 900,
        color: colors[0],
        textAlign: 'center',
        marginBottom: '3px',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        fontFamily: "'Playfair Display', serif",
        fontStyle: 'italic'
      }}>
        {lang === 'en' ? 'Language Development Table' : 'Tabela de Desenvolvimento da Linguagem'}
      </div>

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', flex: 1, position: 'relative' }}>
        {/* Timeline Center Line */}
        <div style={{
          position: 'absolute',
          top: '0',
          bottom: '0',
          left: '50%',
          width: '1px',
          background: '#fff',
          transform: 'translateX(-50%)',
          zIndex: 1,
          opacity: 0.6
        }} />

        {/* Header */}
        <div style={{
          display: 'flex',
          padding: '1px 0',
          color: colors[0],
          fontSize: '3.5px',
          fontWeight: 800,
          textTransform: 'uppercase',
          borderBottom: `0.5px solid ${colors[0]}50`,
          marginBottom: '1px',
          zIndex: 2,
          position: 'relative'
        }}>
          <div style={{ flex: 1, textAlign: 'right', paddingRight: '8px' }}>
            {lang === 'en' ? 'Receptive' : 'Receptivo'}
          </div>
          <div style={{ width: '26px', textAlign: 'center' }}>
            {lang === 'en' ? 'Age' : 'Idade'}
          </div>
          <div style={{ flex: 1, textAlign: 'left', paddingLeft: '8px' }}>
            {lang === 'en' ? 'Expressive' : 'Expressivo'}
          </div>
        </div>

        {/* Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5px', zIndex: 2 }}>
          {linguagemData.map((item, idx) => {
            const rowColor = colors[idx % colors.length];
            return (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'stretch',
                background: `${rowColor}15`,
                borderRadius: '2px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Left: Receptivo */}
                <div style={{
                  flex: 1,
                  padding: '1px 2px',
                  fontSize: '3.1px',
                  color: '#444',
                  lineHeight: '1.1',
                  textAlign: 'right',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end'
                }}>
                  {item.receptivo}
                </div>

                {/* Center: Idade (Pill) */}
                <div style={{
                  width: '26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    background: rowColor,
                    color: '#fff',
                    fontSize: '3.1px',
                    fontWeight: 800,
                    padding: '0.5px 2px',
                    borderRadius: '10px',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    zIndex: 3
                  }}>
                    {item.idade}
                  </div>
                </div>

                {/* Right: Expressivo */}
                <div style={{
                  flex: 1,
                  padding: '1px 2px',
                  fontSize: '3.1px',
                  color: '#444',
                  lineHeight: '1.1',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {item.expressivo}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
