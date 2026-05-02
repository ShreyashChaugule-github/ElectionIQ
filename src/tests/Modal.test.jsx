import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Modal from '../components/Modal.jsx';

it('renders modal content when open and closes when clicking outside', async () => {
  const onClose = vi.fn();

  render(
    <Modal isOpen onClose={onClose} title="Test Modal" footer={<button type="button">Close</button>}>
      <p>Modal content</p>
    </Modal>
  );

  expect(screen.getByText(/Modal content/i)).toBeInTheDocument();
  await userEvent.click(screen.getByRole('presentation'));
  expect(onClose).toHaveBeenCalled();
});

it('returns null when closed', () => {
  const { container } = render(
    <Modal isOpen={false} onClose={() => {}} title="Hidden Modal">
      <p>Hidden content</p>
    </Modal>
  );

  expect(container).toBeEmptyDOMElement();
});
