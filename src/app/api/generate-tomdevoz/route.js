import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    const { marca, tagline, estiloNome, atuacao, contextoExtra, respostas, lang = 'pt-BR' } = await req.json();
    const ai = new GoogleGenAI({ apiKey: (process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.replace(/['"]/g, '') : undefined) });
    const isEng = lang === 'en';

    const prompt = `Você é especialista em branding e comunicação para pequenos negócios femininos.

Crie o TOM DE VOZ da marca "${marca}"${tagline ? ` (tagline: "${tagline}")` : ''}, estilo visual: ${estiloNome || 'elegante'}.

Respostas da fundadora:
${respostas.map(r => `- ${r.pergunta}: "${r.resposta}"`).join('\n')}

${isEng ? `Return EXACTLY this JSON in English (no markdown, no explanation):` : `Retorne EXATAMENTE este JSON (sem markdown, sem explicação):`}
{
  "palavras": ["${isEng ? 'word1' : 'palavra1'}", "${isEng ? 'word2' : 'palavra2'}", "${isEng ? 'word3' : 'palavra3'}", "${isEng ? 'word4' : 'palavra4'}", "${isEng ? 'word5' : 'palavra5'}"],
  "frases": ["${isEng ? 'Use X language' : 'Use linguagem X'}", "${isEng ? 'Avoid Y' : 'Evite Y'}", "${isEng ? 'Always Z' : 'Sempre Z'}"],
  "descricao": "${isEng ? 'A sentence describing the brand voice in 1-2 sentences.' : 'Uma frase descrevendo o tom de voz da marca em 1-2 sentenças.'}"
}

${isEng ? `The "palavras" must be adjectives or nouns describing the VOICE (e.g. Welcoming, Direct, Inspiring, Close).` : `As palavras devem ser adjetivos ou substantivos que descrevem a VOZ (ex: Acolhedora, Direta, Inspiradora, Próxima).`}
${isEng ? `The "frases" must be practical communication guidelines for the brand.` : `As frases devem ser orientações práticas de comunicação para a marca.`}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ text: prompt }],
    });

    let text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const data = JSON.parse(text);

    return Response.json({ success: true, ...data });
  } catch (error) {
    console.error("Erro ao gerar tom de voz:", error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
