import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Quiz from '../pages/Quiz.jsx';
import { QUIZ } from '../data/electionData.js';
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

it('finishes the quiz and allows restarting after completing all questions', async () => {
  render(<Quiz />);

  for (let i = 0; i < QUIZ.length - 1; i++) {
    const optionButtons = screen.getAllByRole('button').filter((btn) => btn.className.includes('opt-btn'));
    expect(optionButtons.length).toBeGreaterThan(0);
    await userEvent.click(optionButtons[0]);

    const nextButton = screen.getByRole('button', { name: /Next →/i });
    await userEvent.click(nextButton);
  }

  const finalOptionButtons = screen.getAllByRole('button').filter((btn) => btn.className.includes('opt-btn'));
  expect(finalOptionButtons.length).toBeGreaterThan(0);
  await userEvent.click(finalOptionButtons[0]);

  const finishButton = screen.getByRole('button', { name: /Finish/i });
  expect(finishButton).toBeEnabled();
  await userEvent.click(finishButton);

  expect(screen.getByText(/out of/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Retake Quiz/i })).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: /Retake Quiz/i }));
  expect(screen.getByText(/Question 1 of/i)).toBeInTheDocument();
});
