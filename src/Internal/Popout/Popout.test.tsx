import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import Popout from './Popout';

function Harness({
  onClose,
  hasAdaptiveWidth,
  shouldReturnFocusOnClose,
}: {
  onClose?: () => void;
  hasAdaptiveWidth?: boolean;
  shouldReturnFocusOnClose?: boolean;
}) {
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <div>
      <button ref={anchorRef} type="button" onClick={() => setIsOpen(true)}>
        Open
      </button>
      <button type="button">Outside</button>
      <Popout
        isOpen={isOpen}
        anchorRef={anchorRef}
        onClose={handleClose}
        hasAdaptiveWidth={hasAdaptiveWidth}
        shouldReturnFocusOnClose={shouldReturnFocusOnClose}
        data-testid="popout"
      >
        <button type="button">Inside panel</button>
      </Popout>
    </div>
  );
}

/**
 * Two popouts, the inner one opened from inside the outer one's panel — the arrangement the table's
 * filter menu and its `Select` end up in.
 */
function NestedHarness({ onOuterClose }: { onOuterClose?: () => void }) {
  const outerAnchorRef = useRef<HTMLButtonElement | null>(null);
  const innerAnchorRef = useRef<HTMLButtonElement | null>(null);
  const [isOuterOpen, setIsOuterOpen] = useState(false);
  const [isInnerOpen, setIsInnerOpen] = useState(false);

  return (
    <div>
      <button ref={outerAnchorRef} type="button" onClick={() => setIsOuterOpen(true)}>
        Open outer
      </button>
      <button type="button">Outside</button>
      <Popout
        isOpen={isOuterOpen}
        anchorRef={outerAnchorRef}
        onClose={() => {
          setIsOuterOpen(false);
          onOuterClose?.();
        }}
        data-testid="outer-popout"
      >
        <button ref={innerAnchorRef} type="button" onClick={() => setIsInnerOpen(true)}>
          Open inner
        </button>
        <Popout
          isOpen={isInnerOpen}
          anchorRef={innerAnchorRef}
          onClose={() => setIsInnerOpen(false)}
          data-testid="inner-popout"
        >
          <button type="button">Inner content</button>
        </Popout>
      </Popout>
    </div>
  );
}

describe('Popout', () => {
  it('renders nothing while closed', () => {
    render(<Harness />);

    expect(screen.queryByTestId('popout')).not.toBeInTheDocument();
  });

  it('renders its panel content when opened', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(screen.getByRole('button', { name: 'Inside panel' })).toBeInTheDocument();
  });

  it('renders the panel into a portal on document.body', async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);

    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(container.querySelector('[data-testid="popout"]')).toBeNull();
    expect(document.body.querySelector('[data-testid="popout"]')).not.toBeNull();
  });

  it('closes on Escape and returns focus to the anchor', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus();
  });

  it('leaves focus alone on Escape when shouldReturnFocusOnClose is false', async () => {
    const user = userEvent.setup();
    render(<Harness shouldReturnFocusOnClose={false} />);

    await user.click(screen.getByRole('button', { name: 'Open' }));
    screen.getByRole('button', { name: 'Inside panel' }).focus();
    await user.keyboard('{Escape}');

    expect(screen.getByRole('button', { name: 'Open' })).not.toHaveFocus();
  });

  it('closes when a pointer event occurs outside the panel', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(screen.getByRole('button', { name: 'Outside' }));

    expect(onClose).toHaveBeenCalled();
  });

  it('stays open when a pointer event occurs inside the panel', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(screen.getByRole('button', { name: 'Inside panel' }));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('stays open when the anchor itself is interacted with', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Open' }));
    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('matches the anchor width when hasAdaptiveWidth is true', async () => {
    const user = userEvent.setup();
    render(<Harness hasAdaptiveWidth />);

    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(screen.getByTestId('popout').style.width).not.toBe('');
  });

  it('does not set a width when hasAdaptiveWidth is false', async () => {
    const user = userEvent.setup();
    render(<Harness hasAdaptiveWidth={false} />);

    await user.click(screen.getByRole('button', { name: 'Open' }));

    expect(screen.getByTestId('popout').style.width).toBe('');
  });

  it('positions and sizes the panel from positionRef when supplied, ignoring anchorRef’s own rect', async () => {
    const user = userEvent.setup();
    function PositionRefHarness() {
      const anchorRef = useRef<HTMLButtonElement | null>(null);
      const positionRef = useRef<HTMLDivElement | null>(null);
      const [isOpen, setIsOpen] = useState(false);

      return (
        <div>
          <div ref={positionRef} data-testid="cell">
            <button ref={anchorRef} type="button" onClick={() => setIsOpen(true)}>
              Open
            </button>
          </div>
          <Popout
            isOpen={isOpen}
            anchorRef={anchorRef}
            positionRef={positionRef}
            onClose={() => setIsOpen(false)}
            data-testid="popout"
          >
            content
          </Popout>
        </div>
      );
    }
    render(<PositionRefHarness />);

    screen.getByTestId('cell').getBoundingClientRect = () =>
      ({ bottom: 200, left: 40, right: 340, width: 300 }) as DOMRect;
    screen.getByRole('button', { name: 'Open' }).getBoundingClientRect = () =>
      ({ bottom: 60, left: 100, right: 220, width: 120 }) as DOMRect;

    await user.click(screen.getByRole('button', { name: 'Open' }));

    const panel = screen.getByTestId('popout');

    expect(panel).toHaveStyle({ top: '200px', left: '40px', width: '300px' });
  });

  it('merges a consumer style over the computed position without dropping it', async () => {
    const user = userEvent.setup();
    function StyledHarness() {
      const anchorRef = useRef<HTMLButtonElement | null>(null);
      const [isOpen, setIsOpen] = useState(false);

      return (
        <div>
          <button ref={anchorRef} type="button" onClick={() => setIsOpen(true)}>
            Open
          </button>
          <Popout
            isOpen={isOpen}
            anchorRef={anchorRef}
            onClose={() => setIsOpen(false)}
            style={{ maxHeight: '10rem' }}
            data-testid="popout"
          >
            content
          </Popout>
        </div>
      );
    }
    render(<StyledHarness />);

    await user.click(screen.getByRole('button', { name: 'Open' }));

    const panel = screen.getByTestId('popout');

    expect(panel).toHaveStyle({ maxHeight: '10rem' });
    expect(panel.style.position).toBe('');
    expect(panel.style.top).not.toBe('');
  });

  describe('nesting', () => {
    it('keeps the outer popout open while the inner one is opened', async () => {
      const user = userEvent.setup();
      const onOuterClose = vi.fn();
      render(<NestedHarness onOuterClose={onOuterClose} />);

      await user.click(screen.getByRole('button', { name: 'Open outer' }));
      await user.click(screen.getByRole('button', { name: 'Open inner' }));

      expect(screen.getByTestId('inner-popout')).toBeInTheDocument();
      expect(onOuterClose).not.toHaveBeenCalled();
    });

    it('keeps the outer popout open when the inner panel is clicked', async () => {
      const user = userEvent.setup();
      const onOuterClose = vi.fn();
      render(<NestedHarness onOuterClose={onOuterClose} />);

      await user.click(screen.getByRole('button', { name: 'Open outer' }));
      await user.click(screen.getByRole('button', { name: 'Open inner' }));
      await user.click(screen.getByRole('button', { name: 'Inner content' }));

      expect(onOuterClose).not.toHaveBeenCalled();
      expect(screen.getByTestId('outer-popout')).toBeInTheDocument();
    });

    it('dismisses one layer per Escape, innermost first', async () => {
      const user = userEvent.setup();
      render(<NestedHarness />);

      await user.click(screen.getByRole('button', { name: 'Open outer' }));
      await user.click(screen.getByRole('button', { name: 'Open inner' }));

      await user.keyboard('{Escape}');

      expect(screen.queryByTestId('inner-popout')).not.toBeInTheDocument();
      expect(screen.getByTestId('outer-popout')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      expect(screen.queryByTestId('outer-popout')).not.toBeInTheDocument();
    });

    it('closes both when the click lands outside every layer', async () => {
      const user = userEvent.setup();
      const onOuterClose = vi.fn();
      render(<NestedHarness onOuterClose={onOuterClose} />);

      await user.click(screen.getByRole('button', { name: 'Open outer' }));
      await user.click(screen.getByRole('button', { name: 'Open inner' }));
      await user.click(screen.getByRole('button', { name: 'Outside' }));

      expect(onOuterClose).toHaveBeenCalled();
      expect(screen.queryByTestId('inner-popout')).not.toBeInTheDocument();
    });
  });
});
