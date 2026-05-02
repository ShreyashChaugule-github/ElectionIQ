import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ElectionProcess from '../pages/ElectionProcess.jsx';

it('renders election process content and handles roadmap button click', async () => {
  const onRoadmapClick = vi.fn();

  render(<ElectionProcess onFormClick={() => {}} onRoadmapClick={onRoadmapClick} />);

  expect(screen.getByText(/Election roadmap — from announcement to result/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /View First Vote Roadmap/i })).toBeInTheDocument();

  await userEvent.click(screen.getByRole('button', { name: /View First Vote Roadmap/i }));
  expect(onRoadmapClick).toHaveBeenCalledWith('First Vote');
});

it('calls onFormClick when an election form card is clicked', async () => {
  const onFormClick = vi.fn();

  render(<ElectionProcess onFormClick={onFormClick} onRoadmapClick={() => {}} />);

  const formButtons = screen.getAllByRole('button', { name: /Learn about/i });
  await userEvent.click(formButtons[0]);

  expect(onFormClick).toHaveBeenCalledTimes(1);
});
