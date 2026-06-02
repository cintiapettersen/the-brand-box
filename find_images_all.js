const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function analyzeImage(filePath) {
  const fileData = fs.readFileSync(filePath);
  const base64Data = fileData.toString('base64');
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      `Analyze this illustration and tell me if it fits any of the following 4 descriptions:
1. Mother in a hospital bed holding a newborn baby, with a doctor/person in scrubs standing by looking at a paper.
2. Father and mother in bed holding a sleeping newborn baby together, smiling warmly.
3. Father holding/embracing a baby (toddler) outdoors or in a warm home setting, smiling.
4. Father, mother, and a baby/child at a wooden table looking at documents/papers.

Please reply with the number (e.g. "FIT: 1" or "FIT: 2" or "FIT: 3" or "FIT: 4") followed by a 1-sentence explanation, or "NONE" if it does not match.`,
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
  const dirPath = '/Users/cintiapettersen/.gemini/antigravity/scratch/next-app/public/carderneta img';
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  
  files.sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, '')) || 0;
    const numB = parseInt(b.replace(/\D/g, '')) || 0;
    return numA - numB;
  });

  console.log(`Analyzing ${files.length} images for the 4 illustrations...`);
  
  const batchSize = 10;
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    console.log(`Checking batch ${i / batchSize + 1}...`);
    
    const promises = batch.map(async (file) => {
      const filePath = path.join(dirPath, file);
      try {
        const desc = await analyzeImage(filePath);
        if (desc.toUpperCase().includes('FIT:')) {
          console.log(`\n🎉 MATCH FOUND in ${file}:\n${desc}\n`);
        }
      } catch (e) {
        // quiet error
      }
    });
    
    await Promise.all(promises);
  }
  console.log('Search completed!');
}

run().catch(console.error);
