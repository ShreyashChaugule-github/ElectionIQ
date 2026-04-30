import { generateResponse } from '../config/google-ai.js';
import { db } from '../config/firebase.js';

const DEFAULT_RULES = 'Follow Election Commission of India (ECI) guidelines. Encourage all citizens to vote.';
const DEFAULT_USER_CONTEXT = { progress: { roadmapStep: 'Start' } };
const USERS_COLLECTION = 'users';
const ELECTION_COLLECTION = 'election_data';
const GUIDELINES_DOC = 'voter_registration_rules';
const CHATS_COLLECTION = 'chats';
const MAX_PROMPT_LENGTH = 2000;
const RULES_CACHE_TTL_MS = 60_000;
let cachedRules = null;
let rulesCacheExpires = 0;

const buildSystemInstruction = ({ language, rulesData, roadmapStep }) => `
  You are ElectionIQ, a senior AI assistant specialized in Indian elections.
  Respond in ${language}.
  
  CORE GUIDELINES:
  - Base your answers ONLY on the following Election Commission of India (ECI) guidelines:
    ${rulesData}
  - Always encourage citizens to participate in the democratic process.
  - Maintain a neutral, professional, and helpful tone.
  
  USER CONTEXT:
  - The user is currently at this stage of their election journey: ${roadmapStep}.
  - Respond appropriately to their current progress.
`;

const getErrorMessage = (error) => {
  if (error.status === 429) {
    return 'Too many requests. Please wait a moment before asking another question.';
  }

  if (error.status === 400) {
    return 'There was an issue with your request. Please try rephrasing your question.';
  }

  if (error.message?.includes('API_KEY')) {
    return 'There is a configuration issue with the AI service. Please contact support.';
  }

  return 'Sorry, I\'m experiencing technical difficulties. Please try again in a moment.';
};

const fetchUserContext = async (userId) => {
  if (!userId) {
    return DEFAULT_USER_CONTEXT;
  }

  try {
    const snapshot = await db.collection(USERS_COLLECTION).doc(userId).get();
    return snapshot.exists ? snapshot.data() : DEFAULT_USER_CONTEXT;
  } catch (error) {
    console.warn(`Unable to fetch user context for userId=${userId}:`, error.message);
    return DEFAULT_USER_CONTEXT;
  }
};

const fetchElectionGuidelines = async () => {
  const now = Date.now();
  if (cachedRules && now < rulesCacheExpires) {
    return cachedRules;
  }

  try {
    const snapshot = await db.collection(ELECTION_COLLECTION).doc(GUIDELINES_DOC).get();
    cachedRules = snapshot.exists ? snapshot.data().content : DEFAULT_RULES;
  } catch (error) {
    console.warn('Election guidelines not found in Firestore, using default fallback.', error.message);
    cachedRules = DEFAULT_RULES;
  }

  rulesCacheExpires = Date.now() + RULES_CACHE_TTL_MS;
  return cachedRules;
};

const saveChatHistory = async (userId, prompt, responseText) => {
  if (!userId) {
    return;
  }

  try {
    await db.collection(USERS_COLLECTION)
      .doc(userId)
      .collection(CHATS_COLLECTION)
      .add({ prompt, response: responseText, timestamp: new Date() });
  } catch (error) {
    console.error('Error saving chat history:', error.message);
  }
};

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

    const fullPrompt = `${systemInstruction}\n\nUser Query: ${trimmedPrompt}`;

    console.log(`[Google AI] Generating response for user: ${userId || 'Anonymous'}`);

    const aiResponseText = await generateResponse(fullPrompt);

    saveChatHistory(userId, trimmedPrompt, aiResponseText);

    return res.json({ text: aiResponseText });
  } catch (error) {
    console.error('AI SDK Chat Error:', error);
    return res.status(error.status || 500).json({ error: getErrorMessage(error) });
  }
};

