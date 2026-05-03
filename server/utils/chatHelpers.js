import { db } from '../config/firebase.js';

const DEFAULT_RULES = 'Follow Election Commission of India (ECI) guidelines. Encourage all citizens to vote.';
export const DEFAULT_USER_CONTEXT = { progress: { roadmapStep: 'Start' } };
const USERS_COLLECTION = 'users';
const ELECTION_COLLECTION = 'election_data';
const GUIDELINES_DOC = 'voter_registration_rules';
const CHATS_COLLECTION = 'chats';
const RULES_CACHE_TTL_MS = 60_000;

let cachedRules = null;
let rulesCacheExpires = 0;

/**
 * Builds the system instruction prompt for the AI based on user context and rules.
 * @param {Object} params - Parameters for the prompt.
 * @param {string} params.language - The target language.
 * @param {string} params.rulesData - The election guidelines.
 * @param {string} params.roadmapStep - The user's roadmap progress.
 * @returns {string} The compiled system instruction string.
 */
export const buildSystemInstruction = ({ language, rulesData, roadmapStep }) => `
  You are ElectionIQ, a senior AI assistant specialized in Indian elections.
  Respond in ${language}.
  
  CORE GUIDELINES:
  - Base your answers ONLY on the following Election Commission of India (ECI) guidelines:
    ${rulesData}
  - Always encourage citizens to participate in the democratic process.
  - Maintain a neutral, professional, and helpful tone.
  - Keep responses brief and accurate.
  - Prefer 1-2 short sentences unless the user explicitly asks for more detail.
  - Avoid filler and unnecessary elaboration.
  
  USER CONTEXT:
  - The user is currently at this stage of their election journey: ${roadmapStep}.
  - Respond appropriately to their current progress.
`;

/**
 * Formats a user-friendly error message based on the thrown error.
 * @param {Error|Object} error - The error object.
 * @returns {string} The user-friendly error string.
 */
export const getErrorMessage = (error) => {
  if (error.status === 429) {
    return 'Too many requests. Please wait a moment before asking another question.';
  }

  if (error.status === 400) {
    return 'There was an issue with your request. Please try rephrasing your question.';
  }

  if (error.message?.includes('API_KEY')) {
    return 'There is a configuration issue with the AI service. Please contact support.';
  }

  return "Sorry, I'm experiencing technical difficulties. Please try again in a moment.";
};

/**
 * Fetches user context from Firestore.
 * @param {string|null} userId - The ID of the user.
 * @returns {Promise<Object>} The user context object.
 */
export const fetchUserContext = async (userId) => {
  if (!userId) {
    return DEFAULT_USER_CONTEXT;
  }

  try {
    const snapshot = await db.collection(USERS_COLLECTION).doc(userId).get();
    return snapshot.exists ? snapshot.data() : DEFAULT_USER_CONTEXT;
  } catch (error) {
    console.warn(`[CHAT API] Unable to fetch user context for userId=${userId}:`, error.message);
    return DEFAULT_USER_CONTEXT;
  }
};

/**
 * Fetches and caches election guidelines from Firestore.
 * @returns {Promise<string>} The election guidelines.
 */
export const fetchElectionGuidelines = async () => {
  const now = Date.now();
  if (cachedRules && now < rulesCacheExpires) {
    return cachedRules;
  }

  try {
    const snapshot = await db.collection(ELECTION_COLLECTION).doc(GUIDELINES_DOC).get();
    cachedRules = snapshot.exists ? snapshot.data().content : DEFAULT_RULES;
  } catch (error) {
    console.warn('[CHAT API] Election guidelines not found in Firestore, using default fallback.', error.message);
    cachedRules = DEFAULT_RULES;
  }

  rulesCacheExpires = Date.now() + RULES_CACHE_TTL_MS;
  return cachedRules;
};

/**
 * Saves chat history to the user's Firestore collection.
 * @param {string|null} userId - The user's ID.
 * @param {string} prompt - The user's prompt.
 * @param {string} responseText - The AI response.
 * @returns {Promise<void>}
 */
export const saveChatHistory = async (userId, prompt, responseText) => {
  if (!userId) {
    return;
  }

  try {
    await db.collection(USERS_COLLECTION)
      .doc(userId)
      .collection(CHATS_COLLECTION)
      .add({ prompt, response: responseText, timestamp: new Date() });
  } catch (error) {
    console.error('[CHAT API] Error saving chat history:', error.message);
  }
};
