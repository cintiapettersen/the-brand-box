import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    const { marca, tagline, estiloNome, respostas } = await req.json();

    const ai = new GoogleGenAI({ apiKey: (process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.replace(/['"]/g, '') : undefined) });

    const prompt = `Você é uma copywriter especialista em branding emocional para pequenos negócios femininos no Brasil.

Crie um **Manifesto de Marca** único e poético para a marca "${marca}"${tagline ? ` (tagline: "${tagline}")` : ''}.

Estilo visual da marca: ${estiloNome || 'elegante e atemporal'}.

Respostas da fundadora sobre sua marca:
${respostas.map(r => `- ${r.pergunta}: "${r.resposta}"`).join('\n')}

Escreva um manifesto em português do Brasil com:
- 3 a 4 parágrafos curtos (máximo 3 frases cada)
- Linguagem calorosa, íntima e inspiradora — como uma conversa entre amigas
- Use o nome da marca naturalmente em pelo menos um parágrafo
- Primeiro parágrafo: o "porquê" — a essência e propósito da marca
- Segundo parágrafo: quem é a mulher/cliente que essa marca serve
- Terceiro parágrafo: a promessa da marca — o que ela entrega além do produto/serviço
- Opcional quarto parágrafo: chamada emocional para ação

Retorne APENAS o texto do manifesto, sem título, sem introdução, sem explicação. Só o manifesto.`;

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
