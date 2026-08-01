import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import MasterDetailsTablePanel from './MasterDetailsTablePanel';

function renderPanel(overrides: Partial<Parameters<typeof MasterDetailsTablePanel>[0]> = {}) {
  const props = {
    onClose: vi.fn(),
    children: <p>Message body</p>,
    ...overrides,
  };

  render(<MasterDetailsTablePanel {...props} />);

  return props;
}

describe('MasterDetailsTablePanel', () => {
  it('renders its children', () => {
    renderPanel();

    expect(screen.getByText('Message body')).toBeInTheDocument();
  });

  it('renders the title when supplied', () => {
    renderPanel({ title: 'Quarterly report' });

    expect(screen.getByRole('heading', { name: 'Quarterly report' })).toBeInTheDocument();
  });

  it('omits the title element when no title is supplied', () => {
    renderPanel();

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('calls onClose when the close control is clicked', async () => {
    const user = userEvent.setup();
    const { onClose } = renderPanel();

    await user.click(screen.getByRole('button', { name: 'Close detail' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('uses closeLabel as the close control accessible name', () => {
    renderPanel({ closeLabel: 'Close message' });

    expect(screen.getByRole('button', { name: 'Close message' })).toBeInTheDocument();
  });
});
