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

  it('generates AI response and returns JSON text', async () => {
    mockGet.mockResolvedValueOnce({ exists: true, data: () => ({ progress: { roadmapStep: 'Start' } }) });
    mockGet.mockResolvedValueOnce({ exists: true, data: () => ({ content: 'Election guideline content' }) });

    const req = { body: { prompt: 'What is voting?' }, user: { uid: 'user123' } };
    const { res, json } = buildResponse();

    await handleChat(req, res);

    expect(mockGenerateResponse).toHaveBeenCalled();
    expect(json).toHaveBeenCalledWith({ text: 'ai response' });
  });
});
