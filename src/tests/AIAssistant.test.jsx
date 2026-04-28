import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
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
