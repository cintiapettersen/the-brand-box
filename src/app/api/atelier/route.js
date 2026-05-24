import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    if (!body.prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const apiKey = (process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.replace(/['"]/g, '') : undefined);
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY não encontrada no servidor.");
    }

    // A mágica de bater no endpoint focado em Imagem da Google!
    let partesPrompt = [{ text: body.prompt }];
    
    // Se ela subiu arquivo, acopla a imagem de referência no cérebro do Gemini
    if (body.imagemRef) {
      partesPrompt.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: body.imagemRef
        }
      });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: partesPrompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errData = await response.text();
      console.error("Erro na API do Gemini:", errData);
      
      // FALLBACK PARA 429 (QUOTA EXCEEDED)
      if (response.status === 429 || errData.includes('Quota exceeded')) {
         console.log("Cota da API do Google atingida.");
         return NextResponse.json({
            error: "cota_atingida",
            alertaDemo: "Você superou a cota do plano gratuito do Google! Aguarde alguns instantes e tente novamente."
         }, { status: 429 });
      }
      
      throw new Error(`Recusa da API do Google: ${errData}`);
    }

    const data = await response.json();

    // Parse na resposta complexa da Google e extrai o Base64 Data
    let base64Image = null;
    if (data.candidates && data.candidates[0].content.parts) {
      for (const part of data.candidates[0].content.parts) {
         if (part.inlineData && part.inlineData.data) {
           base64Image = part.inlineData.data;
           break;
         }
      }
    }

    if (!base64Image) {
      throw new Error(`O payload não continha imagem. Resposta completa: ${JSON.stringify(data).substring(0, 500)}`);
    }

    return NextResponse.json({ base64: base64Image, success: true });
    
  } catch (error) {
    console.error("Ateelier Error:", error);
    return NextResponse.json(
      { error: error.message || "A Varinha falhou.", details: error.stack },
      { status: 500 }
    );
  }
}
