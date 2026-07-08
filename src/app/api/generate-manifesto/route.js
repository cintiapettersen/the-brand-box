import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    const { marca, tagline, estiloNome, atuacao, contextoExtra, respostas, lang = 'pt-BR' } = await req.json();

    const ai = new GoogleGenAI({ apiKey: (process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.replace(/['"]/g, '') : undefined) });
    const isEng = lang === 'en';

    const prompt = `Você é uma copywriter especialista em branding emocional para pequenos negócios femininos.

Crie um **Manifesto de Marca** único e poético para a marca "${marca}"${tagline ? ` (tagline: "${tagline}")` : ''}.

Estilo visual da marca: ${estiloNome || 'elegante e atemporal'}.

Contexto da marca:
${atuacao ? `- Área de atuação: ${atuacao}` : ''}
${contextoExtra ? `- Informações extras da fundadora: "${contextoExtra}"` : ''}

Respostas da fundadora sobre sua marca:
${respostas.map(r => `- ${r.pergunta}: "${r.resposta}"`).join('\n')}

${isEng ? `Write a manifesto in English with:` : `Escreva um manifesto em português do Brasil com:`}
${isEng ? `- 3 to 4 short paragraphs (max 3 sentences each)` : `- 3 a 4 parágrafos curtos (máximo 3 frases cada)`}
${isEng ? `- Warm, intimate, and inspiring language — like a conversation between friends` : `- Linguagem calorosa, íntima e inspiradora — como uma conversa entre amigas`}
${isEng ? `- Use the brand name naturally in at least one paragraph` : `- Use o nome da marca naturalmente em pelo menos um parágrafo`}
${isEng ? `- First paragraph: the "why" — the essence and purpose of the brand` : `- Primeiro parágrafo: o "porquê" — a essência e propósito da marca`}
${isEng ? `- Second paragraph: who is the woman/client that this brand serves` : `- Segundo parágrafo: quem é a mulher/cliente que essa marca serve`}
${isEng ? `- Third paragraph: the brand's promise — what it delivers beyond the product/service` : `- Terceiro parágrafo: a promessa da marca — o que ela entrega além do produto/serviço`}
${isEng ? `- Optional fourth paragraph: emotional call to action` : `- Opcional quarto parágrafo: chamada emocional para ação`}

${isEng ? `Return ONLY the text of the manifesto, no title, no introduction, no explanation. Just the manifesto.` : `Retorne APENAS o texto do manifesto, sem título, sem introdução, sem explicação. Só o manifesto.`}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ text: prompt }],
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!text) {
      return Response.json({ success: false, error: 'Sem resposta do modelo' }, { status: 500 });
    }

    return Response.json({ success: true, manifesto: text.trim() });

  } catch (error) {
    console.error("Erro ao gerar manifesto:", error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
