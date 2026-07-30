import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import TableFilterPopover from './TableFilterPopover';

function Harness({
  onClose,
  hasAdaptiveWidth,
}: {
  onClose?: () => void;
  hasAdaptiveWidth?: boolean;
}) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <div>
      <button ref={triggerRef} type="button" onClick={() => setIsOpen(true)}>
        Filter
      </button>
      <button type="button">Outside</button>
      <TableFilterPopover
        isOpen={isOpen}
        triggerRef={triggerRef}
        onClose={handleClose}
        hasAdaptiveWidth={hasAdaptiveWidth}
      >
        <button type="button">Inside panel</button>
      </TableFilterPopover>
    </div>
  );
}

describe('TableFilterPopover', () => {
  it('renders nothing while closed', () => {
    render(<Harness />);

    expect(screen.queryByTestId('table-filter-popover')).not.toBeInTheDocument();
  });

  it('renders its panel content when opened', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Filter' }));

    expect(screen.getByRole('button', { name: 'Inside panel' })).toBeInTheDocument();
  });

  it('renders the panel into a portal on document.body', async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Filter' }));

    expect(container.querySelector('[data-testid="table-filter-popover"]')).toBeNull();
    expect(document.body.querySelector('[data-testid="table-filter-popover"]')).not.toBeNull();
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Filter' }));
    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Filter' })).toHaveFocus();
  });

  it('closes when a pointer event occurs outside the panel', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Filter' }));
    await user.click(screen.getByRole('button', { name: 'Outside' }));

    expect(onClose).toHaveBeenCalled();
  });

  it('stays open when a pointer event occurs inside the panel', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Filter' }));
    await user.click(screen.getByRole('button', { name: 'Inside panel' }));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('matches the trigger width when hasAdaptiveWidth is true', async () => {
    const user = userEvent.setup();
    render(<Harness hasAdaptiveWidth />);

    await user.click(screen.getByRole('button', { name: 'Filter' }));

    expect(screen.getByTestId('table-filter-popover').style.width).not.toBe('');
  });

  it('does not set a width when hasAdaptiveWidth is false', async () => {
    const user = userEvent.setup();
    render(<Harness hasAdaptiveWidth={false} />);

    await user.click(screen.getByRole('button', { name: 'Filter' }));

    expect(screen.getByTestId('table-filter-popover').style.width).toBe('');
  });
});
