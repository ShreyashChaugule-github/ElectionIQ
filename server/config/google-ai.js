import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("❌ GOOGLE_GEMINI_API_KEY is missing in .env file.");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Gemini 2.0 Flash – fast, capable, and cost-effective
export const googleModel = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite-preview",
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 0.2,
  },
});
