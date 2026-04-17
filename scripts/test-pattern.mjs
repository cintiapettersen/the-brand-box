import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import dotenv from "dotenv";

dotenv.config({ path: '.env.local' });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function testStyleReference() {
  console.log("🎨 Testando geração COM referência de estilo...\n");

  // Novas cores (simulando outro cliente)
  const novaPaleta = ['#D4A5A5', '#E8C8C8', '#F5E6E0', '#A67B5B', '#6B4C3B'];

  // Tenta com Nano Banana (aceita imagem como input)
  try {
    console.log("📸 Usando Gemini Flash Image (Nano Banana)...\n");

    // Verifica se existe uma imagem de referência
    let refImageParts = [];
    const refPath = 'test-pattern-imagen4.png';
    
    if (fs.existsSync(refPath)) {
      console.log("  ✅ Imagem de referência encontrada! Usando como base de estilo.\n");
      const imgBuffer = fs.readFileSync(refPath);
      const base64 = imgBuffer.toString('base64');
      refImageParts = [{
        inlineData: {
          mimeType: 'image/png',
          data: base64
        }
      }];
    } else {
      console.log("  ⚠️ Sem imagem de referência, gerando do zero.\n");
    }

    const prompt = `Look at this pattern image as a STYLE REFERENCE. 
Create a NEW seamless pattern that follows the SAME visual style, density, and artistic approach as the reference image.

But change ALL the colors to use ONLY this new palette: ${novaPaleta.join(', ')}.

Keep the same type of elements (flowers, leaves, botanical), same level of detail, same spacing.
The result should look like it was designed by the same artist but with a completely different color scheme.

RULES:
- Seamless, tileable pattern
- Use ONLY the new colors specified above
- Same artistic style as the reference
- No text, no logos
- High quality, print-ready`;

    const contents = [
      ...refImageParts,
      { text: prompt }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: contents,
      config: {
        responseModalities: ['image', 'text'],
      }
    });

    let saved = false;
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const buffer = Buffer.from(part.inlineData.data, "base64");
        const ext = part.inlineData.mimeType?.includes('png') ? 'png' : 'webp';
        fs.writeFileSync(`test-style-transfer.${ext}`, buffer);
        console.log(`  ✅ SUCESSO! Estampa com estilo transferido salva: test-style-transfer.${ext}`);
        saved = true;
      }
      if (part.text) {
        console.log(`  💬 IA disse: ${part.text.substring(0, 200)}`);
      }
    }

    if (!saved) {
      console.log("  ⚠️ Nano Banana respondeu mas sem imagem. Tentando Imagen 4 sem referência...");
      throw new Error("No image in response");
    }

  } catch (err) {
    console.log(`  ❌ Nano Banana: ${err.message?.substring(0, 150)}`);
    
    // Fallback: Imagen 4 com prompt mais detalhado
    try {
      console.log("\n📸 Fallback: Imagen 4 com prompt refinado...");
      
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `Create a delicate, hand-drawn style seamless pattern inspired by artisanal Brazilian brand design.
Elements: small watercolor-style flowers, tiny leaves, gentle botanical motifs, subtle butterflies.
Use ONLY these colors: ${novaPaleta.join(', ')}. 
Style: soft, dreamy, romantic, like a luxury stationery brand. Watercolor texture.
Clean light background. No text, no logos. High quality, tileable pattern.`,
        config: { numberOfImages: 2 },
      });

      response.generatedImages.forEach((img, i) => {
        const buffer = Buffer.from(img.image.imageBytes, "base64");
        fs.writeFileSync(`test-refined-${i + 1}.png`, buffer);
        console.log(`  ✅ Variação ${i + 1} salva: test-refined-${i + 1}.png`);
      });

    } catch (e2) {
      console.log(`  ❌ Imagen 4: ${e2.message?.substring(0, 150)}`);
    }
  }

  console.log("\n🏁 Teste finalizado! Confira os arquivos gerados.");
}

testStyleReference().catch(console.error);
