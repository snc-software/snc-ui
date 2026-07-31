import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import InformationPanel from './InformationPanel';

describe('InformationPanel', () => {
  it('renders the heading and subtext when provided', () => {
    render(<InformationPanel variant="info" heading="Heads up" subtext="Something happened" />);

    expect(screen.getByText('Heads up')).toBeInTheDocument();
    expect(screen.getByText('Something happened')).toBeInTheDocument();
  });

  it('does not render a heading element when heading is omitted', () => {
    render(<InformationPanel variant="info" subtext="Something happened" />);

    expect(screen.queryByText('Heads up')).not.toBeInTheDocument();
  });

  it('does not render a subtext element when subtext is omitted', () => {
    render(<InformationPanel variant="info" heading="Heads up" />);

    expect(screen.queryByText('Something happened')).not.toBeInTheDocument();
  });

  it('applies the info variant triad classes', () => {
    render(<InformationPanel variant="info" heading="Heads up" />);

    expect(screen.getByRole('status').className).toContain('snc:bg-snc-info-bg');
    expect(screen.getByRole('status').className).toContain('snc:border-snc-info-border');
    expect(screen.getByRole('status').className).toContain('snc:text-snc-info-text');
  });

  it('applies the warning variant triad classes', () => {
    render(<InformationPanel variant="warning" heading="Heads up" />);

    expect(screen.getByRole('status').className).toContain('snc:bg-snc-warning-bg');
    expect(screen.getByRole('status').className).toContain('snc:border-snc-warning-border');
    expect(screen.getByRole('status').className).toContain('snc:text-snc-warning-text');
  });

  it('applies the error variant triad classes', () => {
    render(<InformationPanel variant="error" heading="Heads up" />);

    expect(screen.getByRole('status').className).toContain('snc:bg-snc-error-bg');
    expect(screen.getByRole('status').className).toContain('snc:border-snc-error-border');
    expect(screen.getByRole('status').className).toContain('snc:text-snc-error-text');
  });

  it('applies the success variant triad classes', () => {
    render(<InformationPanel variant="success" heading="Heads up" />);

    expect(screen.getByRole('status').className).toContain('snc:bg-snc-success-bg');
    expect(screen.getByRole('status').className).toContain('snc:border-snc-success-border');
    expect(screen.getByRole('status').className).toContain('snc:text-snc-success-text');
  });

  it('uses role="status" regardless of variant', () => {
    const { rerender } = render(<InformationPanel variant="info" heading="Heads up" />);
    expect(screen.getByRole('status')).toBeInTheDocument();

    rerender(<InformationPanel variant="warning" heading="Heads up" />);
    expect(screen.getByRole('status')).toBeInTheDocument();

    rerender(<InformationPanel variant="error" heading="Heads up" />);
    expect(screen.getByRole('status')).toBeInTheDocument();

    rerender(<InformationPanel variant="success" heading="Heads up" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('does not render a dismiss button when onDismiss is not provided', () => {
    render(<InformationPanel variant="info" heading="Heads up" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders a dismiss button when onDismiss is provided', () => {
    render(<InformationPanel variant="info" heading="Heads up" onDismiss={() => {}} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onDismiss when the dismiss button is clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<InformationPanel variant="info" heading="Heads up" onDismiss={onDismiss} />);

    await user.click(screen.getByRole('button'));

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('uses the default "Dismiss" accessible label on the dismiss button', () => {
    render(<InformationPanel variant="info" heading="Heads up" onDismiss={() => {}} />);

    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('uses a custom dismissLabel as the accessible label when provided', () => {
    render(
      <InformationPanel
        variant="info"
        heading="Heads up"
        onDismiss={() => {}}
        dismissLabel="Close notification"
      />,
    );

    expect(screen.getByRole('button', { name: 'Close notification' })).toBeInTheDocument();
  });

  it('merges a consumer-supplied className with the base classes', () => {
    render(<InformationPanel variant="info" heading="Heads up" className="custom-class" />);

    expect(screen.getByRole('status').className).toContain('custom-class');
  });

  it('forwards additional HTML attributes to the root element', () => {
    render(<InformationPanel variant="info" heading="Heads up" data-testid="information-panel" />);

    expect(screen.getByTestId('information-panel')).toBeInTheDocument();
  });

  it('is visible by default when uncontrolled', () => {
    render(<InformationPanel variant="info" heading="Heads up" onDismiss={() => {}} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('respects defaultOpen when uncontrolled', () => {
    render(
      <InformationPanel
        variant="info"
        heading="Heads up"
        defaultOpen={false}
        onDismiss={() => {}}
      />,
    );

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('removes itself from the DOM when the dismiss button is clicked while uncontrolled', async () => {
    const user = userEvent.setup();
    render(<InformationPanel variant="info" heading="Heads up" onDismiss={() => {}} />);

    await user.click(screen.getByRole('button'));

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('still calls onDismiss when the dismiss button is clicked while uncontrolled', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<InformationPanel variant="info" heading="Heads up" onDismiss={onDismiss} />);

    await user.click(screen.getByRole('button'));

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not render when open is false', () => {
    render(<InformationPanel variant="info" heading="Heads up" open={false} />);

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('does not remove itself when the dismiss button is clicked while controlled (open=true)', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <InformationPanel variant="info" heading="Heads up" open onDismiss={onDismiss} />,
    );

    await user.click(screen.getByRole('button'));

    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('re-renders visible again if a controlled open prop goes from false back to true', () => {
    const { rerender } = render(
      <InformationPanel variant="info" heading="Heads up" open={false} />,
    );
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    rerender(<InformationPanel variant="info" heading="Heads up" open />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('lets an external toast manager dismiss the panel via a controlled open prop', async () => {
    const user = userEvent.setup();

    function ControlledToast() {
      const [open, setOpen] = useState(true);

      return (
        <InformationPanel
          variant="info"
          heading="Heads up"
          open={open}
          onDismiss={() => setOpen(false)}
        />
      );
    }

    render(<ControlledToast />);
    expect(screen.getByRole('status')).toBeInTheDocument();

    await user.click(screen.getByRole('button'));

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
