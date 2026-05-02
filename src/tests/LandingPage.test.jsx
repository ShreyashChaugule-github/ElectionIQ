import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

it('disables login buttons while loading and does not call onLogin when clicked', async () => {
  const onLogin = vi.fn();

  render(<LandingPage onLogin={onLogin} loading={true} authError={null} />);

  const signInButtons = screen.getAllByRole('button', { name: /Signing in…/i });
  expect(signInButtons[0]).toBeDisabled();
  expect(screen.getByRole('button', { name: /Get Started Free →/i })).toBeDisabled();

  await userEvent.click(signInButtons[0]);
  expect(onLogin).not.toHaveBeenCalled();
});

it('applies hover styles to feature cards on mouse enter', async () => {
  const { container } = render(<LandingPage onLogin={() => {}} loading={false} authError={null} />);

  const featureCards = container.querySelectorAll('.landing-feature-card');
  expect(featureCards.length).toBeGreaterThan(0);

  await userEvent.hover(featureCards[0]);
  expect(featureCards[0]).toHaveClass('hovered');
});
