const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function checkImage(filePath) {
  const fileData = fs.readFileSync(filePath);
  const base64Data = fileData.toString('base64');
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      'Does this image show a young child (specifically a boy with a blue backpack) walking down a dirt path/road towards distant mountains, hills, and a village/houses? Please answer with "YES: <brief description>" or "NO".',
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

  console.log(`Found ${files.length} images. Checking parallel batches...`);
  
  // We check in batches of 10 to avoid rate limits
  const batchSize = 10;
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    console.log(`Checking batch ${i / batchSize + 1} (${batch.join(', ')})...`);
    
    const promises = batch.map(async (file) => {
      const filePath = path.join(dirPath, file);
      try {
        const desc = await checkImage(filePath);
        if (desc.toUpperCase().startsWith('YES')) {
          console.log(`\n🎉 MATCH FOUND: ${file}\nResponse: ${desc}\n`);
        }
      } catch (e) {
        // quiet error
      }
    });
    
    await Promise.all(promises);
  }
  console.log('Batch search finished!');
}

run().catch(console.error);
