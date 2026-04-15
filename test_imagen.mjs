import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
dotenv.config({path: './.env.local'});

async function testar() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("Iniciando requisicao com API KEY length: ", apiKey ? apiKey.length : 0);

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: "Desenhe um abacaxi sorridente." }]
      }]
    })
  });

  if (!response.ok) {
    console.error("HTTP Status Erro:", response.status);
    const errText = await response.text();
    console.error("Mensagem Google:", errText);
    return;
  }

  const data = await response.json();
  console.log("SUCESSO Google Payload Keys:", Object.keys(data));
  if (data.candidates && data.candidates[0].content.parts[0].inlineData) {
      console.log("MIMETYPE:", data.candidates[0].content.parts[0].inlineData.mimeType);
      console.log("BYTES LENGTH:", data.candidates[0].content.parts[0].inlineData.data.length);
  } else {
      console.log("Payload nao continha os dados que esperavamos:", JSON.stringify(data, null, 2));
  }
}

testar();
