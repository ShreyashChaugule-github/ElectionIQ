import '@testing-library/jest-dom';
import { act, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Dashboard from '../pages/Dashboard.jsx';

test('renders dashboard overview and party standings table', () => {
  render(<Dashboard />);

  expect(screen.getByText(/Live Dashboard Overview/i)).toBeInTheDocument();
  expect(screen.getByRole('table', { name: /Political party standings/i })).toBeInTheDocument();
  expect(screen.getByText(/Registered Voters/i)).toBeInTheDocument();
  expect(screen.getByText(/Active Vote Monitoring Bots/i)).toBeInTheDocument();
});

test('updates the last sync time periodically', async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2024-01-01T12:00:00Z'));
  render(<Dashboard />);

  const initialTime = screen.getByText(/Last Sync:/i).textContent;
  vi.setSystemTime(new Date('2024-01-01T12:00:01Z'));

  await act(async () => {
    vi.advanceTimersByTime(1000);
  });

  expect(screen.getByText(/Last Sync:/i).textContent).not.toBe(initialTime);

  vi.useRealTimers();
});
