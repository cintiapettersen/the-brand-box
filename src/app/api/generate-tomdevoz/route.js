import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    const { marca, tagline, estiloNome, respostas } = await req.json();
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `Você é especialista em branding e comunicação para pequenos negócios femininos no Brasil.

Crie o TOM DE VOZ da marca "${marca}"${tagline ? ` (tagline: "${tagline}")` : ''}, estilo visual: ${estiloNome || 'elegante'}.

Respostas da fundadora:
${respostas.map(r => `- ${r.pergunta}: "${r.resposta}"`).join('\n')}

Retorne EXATAMENTE este JSON (sem markdown, sem explicação):
{
  "palavras": ["palavra1", "palavra2", "palavra3", "palavra4", "palavra5"],
  "frases": ["Use linguagem X", "Evite Y", "Sempre Z"],
  "descricao": "Uma frase descrevendo o tom de voz da marca em 1-2 sentenças."
}

As palavras devem ser adjetivos ou substantivos que descrevem a VOZ (ex: Acolhedora, Direta, Inspiradora, Próxima).
As frases devem ser orientações práticas de comunicação para a marca.`;

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
