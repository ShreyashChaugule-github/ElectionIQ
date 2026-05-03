import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, vi } from 'vitest';

vi.mock('../hooks/useAuth', () => ({ useAuth: vi.fn() }));

import App from '../App.jsx';
import { useAuth } from '../hooks/useAuth';

window.HTMLElement.prototype.scrollIntoView = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  global.fetch = vi.fn();
});

it('renders landing page when the user is not authenticated', () => {
  useAuth.mockReturnValue({
    user: null,
    loading: false,
    authError: null,
    loginWithGoogle: vi.fn(),
    logout: vi.fn(),
  });

  render(<App />);

  expect(screen.getByRole('button', { name: /Continue with Google/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Get Started Free/i })).toBeInTheDocument();
});

it('renders the main app when the user is authenticated and can switch tabs', async () => {
  const mockUser = { displayName: 'Test User', photoURL: 'avatar.png', getIdToken: vi.fn().mockResolvedValue('token') };
  const logout = vi.fn();

  useAuth.mockReturnValue({
    user: mockUser,
    loading: false,
    authError: null,
    loginWithGoogle: vi.fn(),
    logout,
  });

  render(<App />);

  expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: /Dashboard/i })).toBeInTheDocument();

  await userEvent.click(screen.getByRole('tab', { name: /AI Assistant/i }));
  expect(screen.getByRole('tabpanel', { name: /AI Assistant/i })).toBeVisible();
});

it('renders the auth loading screen while auth is initializing', () => {
  useAuth.mockReturnValue({
    user: null,
    loading: true,
    authError: null,
    loginWithGoogle: vi.fn(),
    logout: vi.fn(),
  });

  render(<App />);

  expect(screen.getByText(/ElectionIQ/i)).toBeInTheDocument();
  expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
});

it('shows an auth error banner when authError is present', () => {
  const mockUser = { displayName: 'Test User', photoURL: 'avatar.png', getIdToken: vi.fn().mockResolvedValue('token') };
  useAuth.mockReturnValue({
    user: mockUser,
    loading: false,
    authError: 'Authentication failed',
    loginWithGoogle: vi.fn(),
    logout: vi.fn(),
  });

  render(<App />);

  expect(screen.getByText(/Authentication failed/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
});

it('opens the roadmap modal when the process panel roadmap button is clicked', async () => {
  const mockUser = { displayName: 'Test User', photoURL: 'avatar.png', getIdToken: vi.fn().mockResolvedValue('token') };
  useAuth.mockReturnValue({
    user: mockUser,
    loading: false,
    authError: null,
    loginWithGoogle: vi.fn(),
    logout: vi.fn(),
  });

  render(<App />);

  await userEvent.click(screen.getByRole('tab', { name: /Process/i }));
  await userEvent.click(screen.getByRole('button', { name: /View First Vote Roadmap/i }));

  expect(screen.getByText(/First Vote - Complete Roadmap/i)).toBeInTheDocument();
});

it('submits a chat message and renders the AI response', async () => {
  const mockUser = { displayName: 'Test User', photoURL: 'avatar.png', getIdToken: vi.fn().mockResolvedValue('token') };
  useAuth.mockReturnValue({
    user: mockUser,
    loading: false,
    authError: null,
    loginWithGoogle: vi.fn(),
    logout: vi.fn(),
  });

  global.fetch.mockResolvedValue({
    ok: true,
    json: async () => ({ text: 'AI response text' }),
  });

  render(<App />);

  await userEvent.click(screen.getByRole('tab', { name: /AI Assistant/i }));
  await userEvent.type(screen.getByPlaceholderText(/Ask about voting/i), 'What is voting?');
  await userEvent.click(screen.getByRole('button', { name: /Send message/i }));

  await waitFor(() => {
    expect(screen.getByText(/AI response text/i)).toBeInTheDocument();
  });

  expect(global.fetch).toHaveBeenCalledWith('/api/ai', expect.objectContaining({
    method: 'POST',
    headers: expect.objectContaining({
      Authorization: 'Bearer token',
    }),
  }));
});

it('opens the roadmap modal when a form card is clicked from the process tab', async () => {
  const mockUser = { displayName: 'Test User', photoURL: 'avatar.png', getIdToken: vi.fn().mockResolvedValue('token') };
  useAuth.mockReturnValue({
    user: mockUser,
    loading: false,
    authError: null,
    loginWithGoogle: vi.fn(),
    logout: vi.fn(),
  });

  render(<App />);

  await userEvent.click(screen.getByRole('tab', { name: /Process/i }));
  const formButtons = screen.getAllByRole('button', { name: /Learn about/i });
  await userEvent.click(formButtons[0]);

  const dialog = await screen.findByRole('dialog');
  expect(dialog).toBeInTheDocument();
  expect(dialog).toHaveTextContent(/Detailed Guide|Information|Learn More/i);
});

it('shows a friendly error message when the AI endpoint returns a failure', async () => {
  const mockUser = { displayName: 'Test User', photoURL: 'avatar.png', getIdToken: vi.fn().mockResolvedValue('token') };
  useAuth.mockReturnValue({
    user: mockUser,
    loading: false,
    authError: null,
    loginWithGoogle: vi.fn(),
    logout: vi.fn(),
  });

  global.fetch.mockResolvedValue({
    ok: false,
    json: async () => ({ error: 'Server unavailable' }),
  });

  render(<App />);
  await userEvent.click(screen.getByRole('tab', { name: /AI Assistant/i }));
  await userEvent.type(screen.getByPlaceholderText(/Ask about voting/i), 'Test error prompt');
  await userEvent.click(screen.getByRole('button', { name: /Send message/i }));

  await waitFor(() => expect(screen.getByText(/⚠ Server unavailable/i)).toBeInTheDocument());
});
