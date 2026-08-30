import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import Tooltip from './Tooltip';
import * as TooltipUtils from './Tooltip.utils';

// `TooltipGap` is hardcoded here (rather than spread from the real module) to avoid an inline
// `import()` type, which this repo's lint config forbids — it must be kept in sync with the real
// value exported by `Tooltip.utils.ts`.
vi.mock('./Tooltip.utils', () => ({
  TooltipGap: 8,
  getTooltipPosition: vi.fn(() => ({ top: 42, left: 24 })),
}));

const DefaultShowDelayMs = 1000;

describe('Tooltip', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the trigger without showing tooltip content by default', () => {
    render(
      <Tooltip content="Helpful hint">
        <button type="button">Trigger</button>
      </Tooltip>,
    );

    expect(screen.getByRole('button', { name: 'Trigger' })).toBeInTheDocument();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('does not show the tooltip immediately on mouse enter, before the default delay elapses', () => {
    render(
      <Tooltip content="Helpful hint">
        <button type="button">Trigger</button>
      </Tooltip>,
    );

    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Trigger' }));

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows the tooltip content after the default delay following mouse enter of the trigger', () => {
    render(
      <Tooltip content="Helpful hint">
        <button type="button">Trigger</button>
      </Tooltip>,
    );

    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Trigger' }));
    act(() => {
      vi.advanceTimersByTime(DefaultShowDelayMs);
    });

    expect(screen.getByRole('tooltip')).toHaveTextContent('Helpful hint');
  });

  it('shows the tooltip after a custom showDelayMs elapses, not the default', () => {
    render(
      <Tooltip content="Helpful hint" showDelayMs={500}>
        <button type="button">Trigger</button>
      </Tooltip>,
    );

    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Trigger' }));
    act(() => {
      vi.advanceTimersByTime(499);
    });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByRole('tooltip')).toHaveTextContent('Helpful hint');
  });

  it('cancels a pending show if the mouse leaves before the delay elapses', () => {
    render(
      <Tooltip content="Helpful hint">
        <button type="button">Trigger</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    fireEvent.mouseEnter(trigger);
    fireEvent.mouseLeave(trigger);
    act(() => {
      vi.advanceTimersByTime(DefaultShowDelayMs);
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('hides the tooltip content on mouse leave of the trigger', () => {
    render(
      <Tooltip content="Helpful hint">
        <button type="button">Trigger</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    fireEvent.mouseEnter(trigger);
    act(() => {
      vi.advanceTimersByTime(DefaultShowDelayMs);
    });
    fireEvent.mouseLeave(trigger);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows the tooltip content after the default delay following focus of the trigger', () => {
    render(
      <Tooltip content="Helpful hint">
        <button type="button">Trigger</button>
      </Tooltip>,
    );

    fireEvent.focus(screen.getByRole('button', { name: 'Trigger' }));
    act(() => {
      vi.advanceTimersByTime(DefaultShowDelayMs);
    });

    expect(screen.getByRole('tooltip')).toHaveTextContent('Helpful hint');
  });

  it('hides the tooltip content on blur of the trigger', () => {
    render(
      <Tooltip content="Helpful hint">
        <button type="button">Trigger</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    fireEvent.focus(trigger);
    act(() => {
      vi.advanceTimersByTime(DefaultShowDelayMs);
    });
    fireEvent.blur(trigger);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('hides an open tooltip when Escape is pressed', () => {
    render(
      <Tooltip content="Helpful hint">
        <button type="button">Trigger</button>
      </Tooltip>,
    );

    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Trigger' }));
    act(() => {
      vi.advanceTimersByTime(DefaultShowDelayMs);
    });
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('hides an already-open tooltip immediately on pointerdown of the trigger', () => {
    render(
      <Tooltip content="Helpful hint">
        <button type="button">Trigger</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    fireEvent.mouseEnter(trigger);
    act(() => {
      vi.advanceTimersByTime(DefaultShowDelayMs);
    });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    fireEvent.pointerDown(trigger);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('cancels a pending (not-yet-shown) tooltip on pointerdown of the trigger, so it never appears', () => {
    render(
      <Tooltip content="Helpful hint">
        <button type="button">Trigger</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    fireEvent.mouseEnter(trigger);
    fireEvent.pointerDown(trigger);
    act(() => {
      vi.advanceTimersByTime(DefaultShowDelayMs);
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it("still calls the trigger's own onClick after the tooltip dismiss logic runs", () => {
    const handleClick = vi.fn();

    render(
      <Tooltip content="Helpful hint">
        <button type="button" onClick={handleClick}>
          Trigger
        </button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    fireEvent.mouseEnter(trigger);
    act(() => {
      vi.advanceTimersByTime(DefaultShowDelayMs);
    });

    fireEvent.pointerDown(trigger);
    fireEvent.click(trigger);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('does not show the tooltip when isDisabled is true', () => {
    render(
      <Tooltip content="Helpful hint" isDisabled>
        <button type="button">Trigger</button>
      </Tooltip>,
    );

    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Trigger' }));
    act(() => {
      vi.advanceTimersByTime(DefaultShowDelayMs);
    });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('defaults placement to bottom', () => {
    render(
      <Tooltip content="Helpful hint">
        <button type="button">Trigger</button>
      </Tooltip>,
    );

    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Trigger' }));
    act(() => {
      vi.advanceTimersByTime(DefaultShowDelayMs);
    });

    expect(TooltipUtils.getTooltipPosition).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      'bottom',
      TooltipUtils.TooltipGap,
    );
  });

  it('passes the placement prop through to the position calculation', () => {
    render(
      <Tooltip content="Helpful hint" placement="left">
        <button type="button">Trigger</button>
      </Tooltip>,
    );

    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Trigger' }));
    act(() => {
      vi.advanceTimersByTime(DefaultShowDelayMs);
    });

    expect(TooltipUtils.getTooltipPosition).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      'left',
      TooltipUtils.TooltipGap,
    );
  });

  it('positions the panel using the value returned by the position calculation', () => {
    render(
      <Tooltip content="Helpful hint">
        <button type="button">Trigger</button>
      </Tooltip>,
    );

    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Trigger' }));
    act(() => {
      vi.advanceTimersByTime(DefaultShowDelayMs);
    });

    expect(screen.getByRole('tooltip')).toHaveStyle({ top: '42px', left: '24px' });
  });

  it('sets aria-describedby on the trigger to the tooltip id while open, and removes it when closed', () => {
    render(
      <Tooltip content="Helpful hint" id="hint-tooltip">
        <button type="button">Trigger</button>
      </Tooltip>,
    );

    const trigger = screen.getByRole('button', { name: 'Trigger' });
    expect(trigger).not.toHaveAttribute('aria-describedby');

    fireEvent.mouseEnter(trigger);
    act(() => {
      vi.advanceTimersByTime(DefaultShowDelayMs);
    });
    expect(trigger).toHaveAttribute('aria-describedby', 'hint-tooltip');
    expect(screen.getByRole('tooltip')).toHaveAttribute('id', 'hint-tooltip');

    fireEvent.mouseLeave(trigger);
    expect(trigger).not.toHaveAttribute('aria-describedby');
  });

  it('renders custom content passed via the content prop', () => {
    render(
      <Tooltip
        content={
          <span>
            Rich <strong>content</strong>
          </span>
        }
      >
        <button type="button">Trigger</button>
      </Tooltip>,
    );

    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Trigger' }));
    act(() => {
      vi.advanceTimersByTime(DefaultShowDelayMs);
    });

    expect(screen.getByRole('tooltip')).toHaveTextContent('Rich content');
  });

  it('applies a custom className to the tooltip panel', () => {
    render(
      <Tooltip content="Helpful hint" className="custom-class">
        <button type="button">Trigger</button>
      </Tooltip>,
    );

    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Trigger' }));
    act(() => {
      vi.advanceTimersByTime(DefaultShowDelayMs);
    });

    expect(screen.getByRole('tooltip')).toHaveClass('custom-class');
  });

  it('passes through data-* attributes to the tooltip panel', () => {
    render(
      <Tooltip content="Helpful hint" data-testid="hint">
        <button type="button">Trigger</button>
      </Tooltip>,
    );

    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Trigger' }));
    act(() => {
      vi.advanceTimersByTime(DefaultShowDelayMs);
    });

    expect(screen.getByTestId('hint')).toBeInTheDocument();
  });

  it('forwards a ref supplied on the trigger element to its underlying DOM node', () => {
    let buttonNode: HTMLButtonElement | null = null;

    render(
      <Tooltip content="Helpful hint">
        <button
          type="button"
          ref={(node) => {
            buttonNode = node;
          }}
        >
          Trigger
        </button>
      </Tooltip>,
    );

    expect(buttonNode).toBe(screen.getByRole('button', { name: 'Trigger' }));
  });
});
