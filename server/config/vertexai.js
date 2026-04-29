import { VertexAI } from '@google-cloud/vertexai';
import dotenv from 'dotenv';

dotenv.config();

const project = process.env.GCP_PROJECT_ID || 'pw-challenge-2-494710';
const location = process.env.GCP_REGION || 'us-central1';

const vertex_ai = new VertexAI({ project: project, location: location });

// Using Gemini 1.5 Flash for low latency and high context
export const generativeModel = vertex_ai.getGenerativeModel({
  model: 'gemini-1.5-flash',
  generationConfig: {
    maxOutputTokens: 8192,
    temperature: 0.2, // Low temperature for factual, grounded ECI responses
  },
});
