/**
 * @vitest-environment node
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockGenerateResponse = vi.fn();
const mockGet = vi.fn();
const mockAdd = vi.fn();
const mockSubCollection = vi.fn(() => ({ add: mockAdd }));
const mockDoc = vi.fn(() => ({ get: mockGet, collection: mockSubCollection }));
const mockCollection = vi.fn(() => ({ doc: mockDoc }));

vi.mock('../config/google-ai.js', () => ({
  generateResponse: mockGenerateResponse,
}));

vi.mock('../config/firebase.js', () => ({
  db: { collection: mockCollection },
}));

let handleChat;

beforeEach(async () => {
  vi.resetModules();
  mockGenerateResponse.mockReset();
  mockGet.mockReset();
  mockAdd.mockReset();
  mockDoc.mockReset();
  mockCollection.mockReset();
  mockGenerateResponse.mockResolvedValue('ai response');
  mockAdd.mockResolvedValue(undefined);
  const module = await import('../controllers/chat.js');
  handleChat = module.handleChat;
});

describe('chat controller', () => {
  const buildResponse = () => {
    const json = vi.fn();
    const res = { json, status: vi.fn(() => res) };
    return { res, json };
  };

  it('returns 400 when prompt is missing', async () => {
    const { res, json } = buildResponse();
    await handleChat({ body: {} }, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ error: 'Prompt is required.' });
  });

  it('returns 413 when prompt is too long', async () => {
    const longPrompt = 'a'.repeat(2001);
    const { res, json } = buildResponse();
    await handleChat({ body: { prompt: longPrompt } }, res);

    expect(res.status).toHaveBeenCalledWith(413);
    expect(json).toHaveBeenCalledWith({ error: 'Prompt must be 2000 characters or less.' });
  });

  it('generates AI response and returns JSON text for anonymous users without saving chat history', async () => {
    mockGet.mockResolvedValueOnce({ exists: false, data: () => ({}) });
    mockGet.mockRejectedValueOnce(new Error('Firestore unavailable'));

    const req = { body: { prompt: 'What is voting?' } };
    const { res, json } = buildResponse();

    await handleChat(req, res);

    expect(mockGenerateResponse).toHaveBeenCalled();
    expect(mockAdd).not.toHaveBeenCalled();
    expect(json).toHaveBeenCalledWith({ text: 'ai response' });
  });

  it('returns a readable error message for rate limiting', async () => {
    mockGenerateResponse.mockRejectedValueOnce({ status: 429, message: 'Too many requests' });

    const req = { body: { prompt: 'Rate limit test' }, user: { uid: 'user429' } };
    const { res, json } = buildResponse();

    await handleChat(req, res);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(json).toHaveBeenCalledWith({ error: 'Too many requests. Please wait a moment before asking another question.' });
  });

  it('returns a configuration error message when API key is missing', async () => {
    mockGenerateResponse.mockRejectedValueOnce({ message: 'Missing API_KEY in environment' });

    const req = { body: { prompt: 'Config test' }, user: { uid: 'user500' } };
    const { res, json } = buildResponse();

    await handleChat(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({ error: 'There is a configuration issue with the AI service. Please contact support.' });
  });
});
