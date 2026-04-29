import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

app.post('/api/ai', async (req, res) => {
  const { prompt, language } = req.body;
  
  // Security: Prioritize server-side key, fallback to client header
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY || req.headers['x-gemini-api-key'];

  if (!apiKey) {
    return res.status(401).json({ error: 'Gemini API key is missing. Please provide it in the server environment or via the "x-gemini-api-key" header.' });
  }

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    // Using Gemini 2.5 Flash as per available models list
    const model = 'gemini-2.5-flash';
    // Using v1 for stability
    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;

    console.log(`[Server] Proxying request to Gemini (${model}) using v1 API...`);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are ElectionIQ, a helpful AI assistant for Indian elections. 
                Respond in ${language}. 
                Provide accurate, neutral information based on Election Commission of India (ECI) guidelines.
                Always encourage citizens to vote.
                
                User query: ${prompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800,
        },
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('[Gemini Error]', data.error);
      throw new Error(data.error?.message || 'Gemini API error');
    }

    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
    return res.json({ text: aiResponse });
  } catch (error) {
    console.error('[Server Error]', error.message);
    return res.status(500).json({ error: `Backend Error: ${error.message}` });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`Election IQ backend running on http://localhost:${port}`);
});
