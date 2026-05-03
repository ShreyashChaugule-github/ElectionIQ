/**
 * @vitest-environment node
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockGenerateContent = vi.fn();
const mockGetGenerativeModel = vi.fn(({ model }) => ({
  model,
  generateContent: mockGenerateContent,
}));
const mockGoogleGenerativeAI = vi.fn(function () {
  return {
    getGenerativeModel: mockGetGenerativeModel,
  };
});

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: mockGoogleGenerativeAI,
}));

let googleAI;

beforeEach(async () => {
  vi.useFakeTimers();
  vi.resetModules();
  process.env.GOOGLE_GEMINI_API_KEY = 'test-key';
  mockGenerateContent.mockReset();
  mockGetGenerativeModel.mockReset();
  googleAI = await import('../../server/config/google-ai.js');
});

afterEach(() => {
  vi.useRealTimers();
});

describe('google-ai generateResponse', () => {
  it('tries fallback models when the first model fails and succeeds on second', async () => {
    mockGenerateContent
      .mockRejectedValueOnce({ status: 503, message: 'Service unavailable' })
      .mockRejectedValueOnce({ status: 503, message: 'Service unavailable' })
      .mockRejectedValueOnce({ status: 503, message: 'Service unavailable' })
      .mockResolvedValueOnce({ response: { text: () => 'fallback response' } });

    const promise = googleAI.generateResponse('hello');
    await vi.advanceTimersByTimeAsync(4000);
    const response = await promise;

    expect(response).toBe('fallback response');
    expect(mockGetGenerativeModel).toHaveBeenCalledTimes(2);
    expect(mockGetGenerativeModel.mock.calls[0][0].model).toBe('gemini-2.0-flash-001');
    expect(mockGetGenerativeModel.mock.calls[1][0].model).toBe('gemini-1.5-flash');
  });

  it('returns fallback message when all models fail', async () => {
    mockGenerateContent.mockRejectedValue({ status: 503, message: 'Service unavailable' });

    const promise = googleAI.generateResponse('hello');
    await vi.advanceTimersByTimeAsync(10000);
    const response = await promise;

    expect(response).toContain('⚠️ AI is busy right now. Please try again.');
    expect(mockGetGenerativeModel).toHaveBeenCalledTimes(3);
  });
});
