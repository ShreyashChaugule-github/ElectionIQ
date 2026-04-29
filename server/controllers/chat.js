import { googleModel } from '../config/google-ai.js';
import { db } from '../config/firebase.js';

export const handleChat = async (req, res) => {
  try {
    const { userId, prompt, language = 'English' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    // 1. Fetch User Context from Firestore (Optional)
    let userData = { progress: { roadmapStep: 'Start' } };
    if (userId) {
      const userDoc = await db.collection('users').doc(userId).get();
      if (userDoc.exists) {
        userData = userDoc.data();
      }
    }

    // 2. Fetch Relevant Election Data / Guidelines
    let rulesData = "Follow Election Commission of India (ECI) guidelines. Encourage all citizens to vote.";
    try {
      const rulesDoc = await db.collection('election_data').doc('voter_registration_rules').get();
      if (rulesDoc.exists) {
        rulesData = rulesDoc.data().content;
      }
    } catch (e) {
      console.warn('Election guidelines not found in Firestore, using default fallback.');
    }

    // 3. Construct Context-Aware System Instruction
    const systemInstruction = `
      You are ElectionIQ, a senior AI assistant specialized in Indian elections.
      Respond in ${language}.
      
      CORE GUIDELINES:
      - Base your answers ONLY on the following Election Commission of India (ECI) guidelines:
        ${rulesData}
      - Always encourage citizens to participate in the democratic process.
      - Maintain a neutral, professional, and helpful tone.
      
      USER CONTEXT:
      - The user is currently at this stage of their election journey: ${userData.progress?.roadmapStep || 'Unknown'}.
      - Respond appropriately to their current progress.
    `;

    // 4. Generate Content via Google AI SDK (Reliable for hackathons)
    console.log(`[Google AI] Generating response for user: ${userId || 'Anonymous'}`);
    
    const fullPrompt = `${systemInstruction}\n\nUser Query: ${prompt}`;
    const result = await googleModel.generateContent(fullPrompt);
    const aiResponseText = result.response.text();

    // 5. Store Chat History in Firestore (Non-blocking)
    if (userId) {
      db.collection('users').doc(userId).collection('chats').add({
        prompt,
        response: aiResponseText,
        timestamp: new Date()
      }).catch(err => console.error('Error saving chat history:', err));
    }

    res.json({ text: aiResponseText });
  } catch (error) {
    console.error('AI SDK Chat Error:', error);
    res.status(500).json({ error: `AI Service Error: ${error.message}` });
  }
};

