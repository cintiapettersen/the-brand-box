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

async function analyzeImage(filePath) {
  const fileData = fs.readFileSync(filePath);
  const base64Data = fileData.toString('base64');
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      `Does this illustration show a man and a woman (a mother and a father) holding or looking at a newborn baby together in bed?
      
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

  console.log(`Checking ${files.length} images for ANY mother and father holding newborn in bed...`);
  
  const batchSize = 10;
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    console.log(`Batch ${i / batchSize + 1}...`);
    
    const promises = batch.map(async (file) => {
      const filePath = path.join(dirPath, file);
      try {
        const desc = await analyzeImage(filePath);
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
