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

async function describeImage(file) {
  const filePath = path.join(__dirname, 'public/carderneta img', file);
  if (!fs.existsSync(filePath)) {
    console.log(`${file} does not exist.`);
    return;
  }
  const fileData = fs.readFileSync(filePath);
  const base64Data = fileData.toString('base64');
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      'What characters and actions are shown in this illustration? Keep it extremely brief (1-2 sentences). Mention if it shows a mother and father in bed with a baby.',
      {
        inlineData: {
          data: base64Data,
          mimeType: 'image/jpeg'
        }
      }
    ]
  });
  console.log(`\n📷 ${file}:\n${response.text.trim()}\n`);
}

async function run() {
  const files = ['AI_Image65.jpg', 'AI_Image66.jpg', 'AI_Image67.jpg', 'AI_Image68.jpg', 'AI_Image69.jpg'];
  console.log('Describing surrounding images directly...');
  for (const file of files) {
    await describeImage(file);
  }
}

run().catch(console.error);
