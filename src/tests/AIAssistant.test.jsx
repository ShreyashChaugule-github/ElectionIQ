import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AIAssistant from '../pages/AIAssistant.jsx';
import { vi } from 'vitest';

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

const mockMessages = [
  { role: 'ai', text: 'Welcome message' },
  { role: 'user', text: 'Hello' }
];

it('renders chat messages and suggestions', () => {
  render(
    <AIAssistant 
      chatMessages={mockMessages} 
      chatInput="" 
      setChatInput={() => {}} 
      handleChatSubmit={() => {}} 
      chatLoading={false} 
      handleSuggestion={() => {}} 
    />
  );

  expect(screen.getByText(/Welcome message/i)).toBeInTheDocument();
  expect(screen.getByText(/Hello/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Ask about voting/i)).toBeInTheDocument();
});

it('shows suggestion chips and disables send while loading', async () => {
  const handleSuggestion = vi.fn();

  render(
    <AIAssistant 
      chatMessages={mockMessages} 
      chatInput="Type something" 
      setChatInput={() => {}} 
      handleChatSubmit={() => {}} 
      chatLoading={true} 
      handleSuggestion={handleSuggestion} 
    />
  );

  expect(screen.getByRole('button', { name: /How do I register to vote in India\?/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Send message/i })).toBeDisabled();

  await userEvent.click(screen.getByRole('button', { name: /How do I register to vote in India\?/i }));
  expect(handleSuggestion).toHaveBeenCalled();
});
