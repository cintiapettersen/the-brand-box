const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function describeImage(filePath) {
  const fileData = fs.readFileSync(filePath);
  const base64Data = fileData.toString('base64');
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      'Describe what is in this image briefly (e.g., characters, setting, actions). Is there a child walking along a path towards mountains?',
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
  
  // Let's sort files numerically if they have numbers
  files.sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, '')) || 0;
    const numB = parseInt(b.replace(/\D/g, '')) || 0;
    return numA - numB;
  });

  console.log(`Found ${files.length} images. Checking first 20...`);
  
  for (let i = 0; i < Math.min(25, files.length); i++) {
    const file = files[i];
    const filePath = path.join(dirPath, file);
    try {
      console.log(`Analyzing ${file}...`);
      const desc = await describeImage(filePath);
      console.log(`Result for ${file}: ${desc}`);
      console.log('-----------------------------------');
      if (desc.toLowerCase().includes('walking') || desc.toLowerCase().includes('mountain') || desc.toLowerCase().includes('caminhando') || desc.toLowerCase().includes('montanha')) {
        console.log(`>>> POSSIBLE MATCH FOUND: ${file} <<<`);
      }
    } catch (e) {
      console.error(`Error analyzing ${file}:`, e.message);
    }
  }
}

run().catch(console.error);
