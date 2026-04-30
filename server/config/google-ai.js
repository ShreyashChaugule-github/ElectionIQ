import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
const invalidApiKey = !apiKey || apiKey.includes('YOUR_GEMINI_API_KEY') || apiKey.trim().length === 0;

if (invalidApiKey) {
  throw new Error('Invalid or missing GOOGLE_GEMINI_API_KEY environment variable.');
}

const genAI = new GoogleGenerativeAI(apiKey);

const MODEL_FALLBACKS = [
  'gemini-2.0-flash-001',
  'gemini-1.5-flash',
  'gemini-3.1-flash-lite-preview',
];

const GENERATION_CONFIG = {
  maxOutputTokens: 8192,
  temperature: 0.2,
};

const MAX_RETRIES = 2;
const BASE_RETRY_DELAY_MS = 1000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableError = (error) => {
  if (!error) {
    return false;
  }

  return (
    error.status === 503 ||
    error.status === 429 ||
    (typeof error.message === 'string' && (
      error.message.includes('ECONNREFUSED') ||
      error.message.includes('ENOTFOUND') ||
      error.message.includes('timeout')
    ))
  );
};

const modelCache = new Map();

const buildModel = (modelId) => {
  if (modelCache.has(modelId)) {
    return modelCache.get(modelId);
  }

  const model = genAI.getGenerativeModel({
    model: modelId,
    generationConfig: GENERATION_CONFIG,
  });

  modelCache.set(modelId, model);
  return model;
};

const generateWithRetry = async (model, prompt) => {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      const attemptNumber = attempt + 1;
      console.error(`[Google AI] Attempt ${attemptNumber} failed for ${model.model}:`, error.message);

      if (!isRetryableError(error)) {
        throw error;
      }

      if (attempt < MAX_RETRIES) {
        const delay = BASE_RETRY_DELAY_MS * Math.pow(2, attempt);
        console.log(`[Google AI] Retrying ${model.model} in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  throw new Error('Max retries exceeded for model.');
};

export const generateResponse = async (prompt) => {
  for (const modelId of MODEL_FALLBACKS) {
    try {
      console.log(`[Google AI] Trying model: ${modelId}`);
      const model = buildModel(modelId);
      const responseText = await generateWithRetry(model, prompt);

      console.log(`[Google AI] Success with model: ${modelId}`);
      return responseText;
    } catch (error) {
      console.warn(`[Google AI] Model ${modelId} failed:`, error.message);
    }
  }

  console.error('[Google AI] All models failed.');
  return '⚠️ AI is busy right now. Please try again.';
};
