import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Topbar from '../components/Topbar.jsx';

it('renders login button when no user is present', () => {
  render(<Topbar language="en" setLanguage={() => {}} user={null} login={() => {}} logout={() => {}} />);

  expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
});

it('renders logout button and user name when user is present', async () => {
  const mockUser = { displayName: 'Test User', photoURL: 'avatar.png' };
  const logout = vi.fn();

  render(<Topbar language="en" setLanguage={() => {}} user={mockUser} login={() => {}} logout={logout} />);

  expect(screen.getByText(/Test User/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
});

it('calls setLanguage when selecting a new language', async () => {
  const setLanguage = vi.fn();

  render(<Topbar language="en" setLanguage={setLanguage} user={null} login={() => {}} logout={() => {}} />);

  const select = screen.getByLabelText(/Select Language/i);
  await userEvent.selectOptions(select, 'hi');

  expect(setLanguage).toHaveBeenCalledWith('hi');
});
