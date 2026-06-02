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
  const fileData = fs.readFileSync(filePath);
  const base64Data = fileData.toString('base64');
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      'Describe this illustration in 1 short sentence (e.g. "A mother in yellow holding a baby in a rocking chair").',
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

  console.log(`Generating catalog for ${files.length} images...`);
  
  const catalog = [];
  const batchSize = 10;
  
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    console.log(`Processing batch ${i / batchSize + 1}...`);
    
    const promises = batch.map(async (file) => {
      try {
        const desc = await describeImage(file);
        catalog.push({ file, desc });
        console.log(`- ${file}: ${desc}`);
      } catch (e) {
        catalog.push({ file, desc: `Error: ${e.message}` });
      }
    });
    
    await Promise.all(promises);
  }
  
  // Sort catalog by numerical order
  catalog.sort((a, b) => {
    const numA = parseInt(a.file.replace(/\D/g, '')) || 0;
    const numB = parseInt(b.file.replace(/\D/g, '')) || 0;
    return numA - numB;
  });
  
  // Write to catalog.json
  fs.writeFileSync(path.join(__dirname, 'catalog.json'), JSON.stringify(catalog, null, 2));
  console.log('Catalog generated successfully inside catalog.json!');
}

run().catch(console.error);
