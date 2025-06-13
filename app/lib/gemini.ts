// ========== GEMINI CONFIG (lib/gemini.ts) ==========
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeCommission(imageBase64: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
  
  const prompt = `Analyze this Shopee product screenshot and extract the commission rates for each product. 
    Return the results as a JSON array with format: [{"productIndex": 1, "commission": "5%"}, ...]
    If you cannot read the commission for any product, mark it as "error".`;
  
  const result = await model.generateContent([prompt, imageBase64]);
  const response = await result.response;
  return JSON.parse(response.text());
}