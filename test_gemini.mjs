import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';

const envStr = fs.readFileSync('.env.local', 'utf8');
const key = envStr.split('=')[1].split('\n')[0].trim().replace(/"/g, '');

console.log("Iniciando teste com a chave que começa com:", key.substring(0, 5) + "...");

const genAI = new GoogleGenerativeAI(key);

async function readModels() {
  try {
     const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
     const data = await response.json();
     console.log("Modelos disponíveis:", data.models?.map(m => m.name).slice(0, 5));
     
     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
     const result = await model.generateContent("Fale 'Olá Cíntia' em uma palavra.");
     console.log("SUCCESS GERATION:", result.response.text());
  } catch(e) {
     console.error("ERROR API:", e.message);
  }
}

readModels();
