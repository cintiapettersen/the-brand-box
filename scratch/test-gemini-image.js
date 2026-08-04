import 'dotenv/config';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY.replace(/['"]/g, '') });

async function run() {
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: "draw a cat",
    });
    console.log(JSON.stringify(res.candidates[0].content, null, 2));
  } catch(e) {
    console.log("Error:", e.message);
  }
}
run();
