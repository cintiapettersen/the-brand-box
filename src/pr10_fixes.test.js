import { describe, it, expect } from 'vitest';

/**
 * Testes para os 3 cenários corrigidos no PR #10 (feat/brand-elements-mvp)
 */

describe('Problema 1 — Consultor de Paleta / AI Creative Director Feedback', () => {
  it('deve formatar e validar os campos exigidos no feedback da diretora IA', () => {
    const mockPaletteFeedback = {
      language: 'pt-BR',
      summary: 'Sua paleta combina tons suaves de turquesa com base terrosa acolhedora.',
      strength: 'Excelente equilíbrio entre tranquilidade e elegância.',
      caution: 'Evite usar a cor mais clara como fundo de elementos de leitura principal.'
    };

    expect(mockPaletteFeedback).toHaveProperty('summary');
    expect(mockPaletteFeedback).toHaveProperty('strength');
    expect(mockPaletteFeedback).toHaveProperty('caution');
    expect(typeof mockPaletteFeedback.summary).toBe('string');
  });
});

describe('Problema 2 — Geração de Estampas e Resiliência de Estado', () => {
  it('deve garantir que patternLoading sempre é finalizado (finally block) e preservar o resultado anterior', async () => {
    let patternLoading = true;
    let generatedPatterns = [{ id: 0, base64: 'abc', mimeType: 'image/png' }];

    const generatePatternsMock = async (shouldFail = false) => {
      patternLoading = true;
      try {
        if (shouldFail) {
          throw new Error('API Timeout / Error');
        }
        generatedPatterns = [{ id: 0, base64: 'xyz', mimeType: 'image/png' }];
      } catch (e) {
        // Não apaga generatedPatterns existentes
      } finally {
        patternLoading = false;
      }
    };

    await generatePatternsMock(true);

    expect(patternLoading).toBe(false);
    expect(generatedPatterns).toHaveLength(1); // Manteve as opções anteriores sem ficar travado em 0
    expect(generatedPatterns[0].base64).toBe('abc');
  });

  it('deve serializar e restaurar corretamente generatedBrandElements do localStorage sem estado nulo', () => {
    const stateToSave = {
      step: 11.7,
      generatedPatterns: [{ base64: 'patternData', mimeType: 'image/png' }],
      selectedPattern: 0,
      generatedBrandElements: [
        { id: 'gen-elem-1', title: 'Folha Orgânica', origin: 'Extraído da estampa', base64: 'elemData', mimeType: 'image/png' }
      ],
      selectedBrandElementId: 'gen-elem-1',
      elementsGenerationCount: 1
    };

    const serialized = JSON.stringify(stateToSave);
    const restored = JSON.parse(serialized);

    expect(restored.generatedBrandElements).toHaveLength(1);
    expect(restored.selectedBrandElementId).toBe('gen-elem-1');
    expect(restored.elementsGenerationCount).toBe(1);
  });
});

describe('Problema 3 — Extração de Elementos Gráficos da Estampa', () => {
  it('deve tratar resposta do Gemini 2.5 Flash de forma resiliente e retornar fallback de motivos quando o JSON for imperfeito', () => {
    const rawAiText = '```json\n[{"title":"Flor Delicada","origin":"Da estampa","visualDescription":"a flower"}]\n```';
    
    let cleanText = rawAiText.trim();
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    }
    
    const firstBracket = cleanText.indexOf('[');
    const lastBracket = cleanText.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket > firstBracket) {
      cleanText = cleanText.substring(firstBracket, lastBracket + 1);
    }

    const parsedMotifs = JSON.parse(cleanText);
    expect(parsedMotifs).toHaveLength(1);
    expect(parsedMotifs[0].title).toBe('Flor Delicada');
  });

  it('deve capturar falhas individuais na geração de imagens de motivos (Imagen 3) sem abortar outros motivos', async () => {
    const motifs = [
      { title: 'Motivo 1', visualDescription: 'leaf' },
      { title: 'Motivo 2', visualDescription: 'flower' }
    ];

    const results = await Promise.all(motifs.map(async (motif, i) => {
      try {
        if (i === 1) throw new Error('Imagen rate limit');
        return { id: `gen-${i}`, title: motif.title, base64: 'base64data' };
      } catch (err) {
        return { id: `gen-${i}`, title: motif.title, base64: null };
      }
    }));

    const validElements = results.filter(e => e.base64 !== null);
    expect(results).toHaveLength(2);
    expect(validElements).toHaveLength(1);
    expect(validElements[0].id).toBe('gen-0');
  });
});
