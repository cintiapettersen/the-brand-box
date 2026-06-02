const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

// Load API key from env or .env.local
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

async function describeImage(filePath) {
  const fileData = fs.readFileSync(filePath);
  const base64Data = fileData.toString('base64');
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      'Describe what is in this image briefly (characters, setting, actions). Focus on whether it depicts a father and mother in bed holding a newborn baby together, or any other details.',
      {
        inlineData: {
          data: base64Data,
          mimeType: 'image/jpeg'
        }
      }
    ]
  });
  return response.text.trim();
}

async function run() {
  const file = 'AI_Image69.jpg';
  const filePath = path.join(__dirname, 'public/carderneta img', file);
  console.log(`Analyzing ${file}...`);
  const desc = await describeImage(filePath);
  console.log(`Result: ${desc}`);
}

run().catch(console.error);
