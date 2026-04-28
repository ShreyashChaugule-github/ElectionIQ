import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Quiz from '../pages/Quiz.jsx';
import { vi } from 'vitest';

// Mock scrollIntoView as it's not implemented in jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();

it('renders the quiz and advances after selecting an answer and clicking next', async () => {
  render(<Quiz />);

  // Check for the first question
  expect(screen.getByText(/The Lok Sabha has how many total seats/i)).toBeInTheDocument();
  
  // Initially, the Next button should be disabled
  const nextBtn = screen.getByRole('button', { name: /Next →/i });
  expect(nextBtn).toBeDisabled();

  // Select an option
  const option = screen.getByRole('button', { name: /543/i });
  await userEvent.click(option);

  // Next button should be enabled now
  expect(nextBtn).toBeEnabled();
  
  // Explanation should appear
  expect(screen.getByText(/Correct!/i)).toBeInTheDocument();

  // Advance to next question
  await userEvent.click(nextBtn);

  // Should be on Question 2
  expect(screen.getByText(/Question 2 of/i)).toBeInTheDocument();
});
