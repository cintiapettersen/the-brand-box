const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

let apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  try {
    const envLocal = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
    const match = envLocal.match(/GEMINI_API_KEY\s*=\s*(.+)/);
    if (match) {
      apiKey = match[1].trim().replace(/['"]/g, '');
    }
  } catch (e) {}
}

const ai = new GoogleGenAI({ apiKey });

async function run() {
  const filePath = path.join(__dirname, 'public/carderneta img/AI_Image44.jpg');
  const fileData = fs.readFileSync(filePath);
  const base64Data = fileData.toString('base64');
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      'Describe what is in this image in detail. Mention the setting (e.g. bed, living room), the characters, what they are wearing, and what they are holding.',
      {
        inlineData: {
          data: base64Data,
          mimeType: 'image/jpeg'
        }
      }
    ]
  });
  console.log(response.text.trim());
}

run().catch(console.error);
