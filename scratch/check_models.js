import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`);
    const data = await response.json();
    console.log('Available Models:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

listModels();
