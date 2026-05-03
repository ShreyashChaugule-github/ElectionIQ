import { generateResponse } from '../config/google-ai.js';
import {
  DEFAULT_USER_CONTEXT,
  buildSystemInstruction,
  getErrorMessage,
  fetchUserContext,
  fetchElectionGuidelines,
  saveChatHistory
} from '../utils/chatHelpers.js';

const MAX_PROMPT_LENGTH = 2000;

/**
 * Handles incoming chat requests, retrieves user context and guidelines, 
 * builds the system prompt, and calls the Google AI service.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<import('express').Response>} The response with AI text or error.
 */
export const handleChat = async (req, res) => {
  try {
    const { userId: requestUserId, prompt, language = 'English' } = req.body;
    const tokenUserId = req.user?.uid;
    const userId = typeof tokenUserId === 'string' ? tokenUserId : (typeof requestUserId === 'string' ? requestUserId : null);
    const trimmedPrompt = typeof prompt === 'string' ? prompt.trim() : '';

    if (!trimmedPrompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    if (trimmedPrompt.length > MAX_PROMPT_LENGTH) {
      return res.status(413).json({ error: `Prompt must be ${MAX_PROMPT_LENGTH} characters or less.` });
    }

    const [userData, rulesData] = await Promise.all([
      fetchUserContext(userId),
      fetchElectionGuidelines(),
    ]);

    const systemInstruction = buildSystemInstruction({
      language,
      rulesData,
      roadmapStep: userData.progress?.roadmapStep || DEFAULT_USER_CONTEXT.progress.roadmapStep,
    });

    const fullPrompt = `${systemInstruction}\\n\\nUser Query: ${trimmedPrompt}`;

    console.log(`[CHAT API] Generating response for user: ${userId || 'Anonymous'}`);

    const aiResponseText = await generateResponse(fullPrompt);

    await saveChatHistory(userId, trimmedPrompt, aiResponseText);

    return res.json({ text: aiResponseText });
  } catch (error) {
    console.error('[CHAT API] Error:', error);
    return res.status(error.status || 500).json({ error: getErrorMessage(error) });
  }
};
