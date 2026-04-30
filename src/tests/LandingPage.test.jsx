import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import LandingPage from '../pages/LandingPage.jsx';

it('renders the landing page hero and login buttons', () => {
  render(<LandingPage onLogin={() => {}} loading={false} authError={null} />);

  expect(screen.getByText(/Your Intelligent Guide to/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Continue with Google/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Get Started Free/i })).toBeInTheDocument();
});

it('shows auth error when provided', () => {
  render(<LandingPage onLogin={() => {}} loading={false} authError="Invalid login" />);

  expect(screen.getByText(/Invalid login/i)).toBeInTheDocument();
});
