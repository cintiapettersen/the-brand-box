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

async function analyzeImage(file) {
  const filePath = path.join(__dirname, 'public/carderneta img', file);
  const fileData = fs.readFileSync(filePath);
  const base64Data = fileData.toString('base64');
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      `Does this illustration show both a man and a woman (a couple)? Ignore if there is a baby or not.
      
      Respond with exactly "YES" or "NO" and a 1-sentence description.`,
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
  const dirPath = path.join(__dirname, 'public/carderneta img');
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  
  files.sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, '')) || 0;
    const numB = parseInt(b.replace(/\D/g, '')) || 0;
    return numA - numB;
  });

  console.log(`Checking all ${files.length} images for a man and a woman...`);
  
  const batchSize = 10;
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    console.log(`Batch ${i / batchSize + 1}...`);
    
    const promises = batch.map(async (file) => {
      try {
        const desc = await analyzeImage(file);
        if (desc.toUpperCase().startsWith('YES')) {
          console.log(`\n🎉 MATCH FOUND in ${file}: ${desc}\n`);
        }
      } catch (e) {
        // ignore
      }
    });
    
    await Promise.all(promises);
  }
  console.log('Search finished.');
}

run().catch(console.error);
