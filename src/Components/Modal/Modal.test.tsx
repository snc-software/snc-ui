import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import Modal from './Modal';

import type { ModalProps } from './Modal.types';

type HarnessProps = Partial<
  Pick<ModalProps, 'onClose' | 'shouldCloseOnOverlayClick' | 'closeLabel' | 'className'>
> & {
  onCloseCallback?: () => void;
};

function Harness({
  onCloseCallback,
  shouldCloseOnOverlayClick,
  closeLabel,
  className,
}: HarnessProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    onCloseCallback?.();
  };

  return (
    <div>
      <button type="button" onClick={() => setIsOpen(true)}>
        Open
      </button>
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        shouldCloseOnOverlayClick={shouldCloseOnOverlayClick}
        closeLabel={closeLabel}
        className={className}
        data-testid="modal"
      >
        <button type="button">Inside</button>
      </Modal>
    </div>
  );
}

describe('Modal', () => {
  it('renders nothing while isOpen is false', () => {
    render(<Harness />);

    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('renders its content when isOpen is true', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(screen.getByRole('button', { name: 'Inside' })).toBeInTheDocument();
  });

  it('renders the dialog into a portal on document.body', async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(container.querySelector('[data-testid="modal"]')).toBeNull();
    expect(document.body.querySelector('[data-testid="modal"]')).not.toBeNull();
  });

  it('exposes role="dialog" and aria-modal="true"', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it("applies a consumer-supplied aria-label as the dialog's accessible name", () => {
    render(
      <Modal isOpen onClose={() => {}} aria-label="Custom dialog">
        content
      </Modal>,
    );

    expect(screen.getByRole('dialog', { name: 'Custom dialog' })).toBeInTheDocument();
  });

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup();
    const onCloseCallback = vi.fn();
    render(<Harness onCloseCallback={onCloseCallback} />);

    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.keyboard('{Escape}');

    expect(onCloseCallback).toHaveBeenCalled();
  });

  it('calls onClose when the backdrop is clicked', async () => {
    const user = userEvent.setup();
    const onCloseCallback = vi.fn();
    render(<Harness onCloseCallback={onCloseCallback} />);

    await user.click(screen.getByRole('button', { name: 'Open' }));
    const overlay = screen.getByRole('dialog').parentElement as HTMLElement;
    await user.click(overlay);

    expect(onCloseCallback).toHaveBeenCalled();
  });

  it('does not call onClose when the card content is clicked', async () => {
    const user = userEvent.setup();
    const onCloseCallback = vi.fn();
    render(<Harness onCloseCallback={onCloseCallback} />);

    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(screen.getByRole('button', { name: 'Inside' }));

    expect(onCloseCallback).not.toHaveBeenCalled();
  });

  it('does not call onClose on backdrop click when shouldCloseOnOverlayClick is false', async () => {
    const user = userEvent.setup();
    const onCloseCallback = vi.fn();
    render(<Harness onCloseCallback={onCloseCallback} shouldCloseOnOverlayClick={false} />);

    await user.click(screen.getByRole('button', { name: 'Open' }));
    const overlay = screen.getByRole('dialog').parentElement as HTMLElement;
    await user.click(overlay);

    expect(onCloseCallback).not.toHaveBeenCalled();
  });

  it('renders a close button with the default "Close" accessible label', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it("uses a custom closeLabel as the close button's accessible label", async () => {
    const user = userEvent.setup();
    render(<Harness closeLabel="Dismiss dialog" />);

    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(screen.getByRole('button', { name: 'Dismiss dialog' })).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', async () => {
    const user = userEvent.setup();
    const onCloseCallback = vi.fn();
    render(<Harness onCloseCallback={onCloseCallback} />);

    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(onCloseCallback).toHaveBeenCalled();
  });

  it('moves focus into the dialog when opened', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(screen.getByRole('dialog')).toHaveFocus();
  });

  it('returns focus to the previously focused element when closed', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus();
  });

  it('traps Tab focus from the last focusable element back to the first', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Open' }));
    screen.getByRole('button', { name: 'Inside' }).focus();
    await user.tab();

    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
  });

  it('traps Shift+Tab focus from the first focusable element back to the last', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Open' }));
    screen.getByRole('button', { name: 'Close' }).focus();
    await user.tab({ shift: true });

    expect(screen.getByRole('button', { name: 'Inside' })).toHaveFocus();
  });

  it('merges a consumer-supplied className with the base panel classes', async () => {
    const user = userEvent.setup();
    render(<Harness className="custom-class" />);

    await user.click(screen.getByRole('button', { name: 'Open' }));

    const dialog = screen.getByRole('dialog');

    expect(dialog).toHaveClass('custom-class');
    expect(dialog.className).toContain('snc:rounded-xl');
  });

  it('forwards additional HTML attributes to the dialog element', async () => {
    const user = userEvent.setup();
    function AttrHarness() {
      const [isOpen, setIsOpen] = useState(false);

      return (
        <div>
          <button type="button" onClick={() => setIsOpen(true)}>
            Open
          </button>
          <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} aria-describedby="extra-id">
            content
          </Modal>
        </div>
      );
    }
    render(<AttrHarness />);

    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(screen.getByRole('dialog')).toHaveAttribute('aria-describedby', 'extra-id');
  });
});
