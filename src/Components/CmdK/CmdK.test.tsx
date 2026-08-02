import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import CmdK from './CmdK';

import type { Options } from '@/Components/OptionsList';

const getInput = () => screen.getByRole('combobox', { name: 'Command palette search' });
const noop = () => {};

afterEach(() => {
  vi.useRealTimers();
});

describe('CmdK', () => {
  it('renders nothing while isOpen is false', () => {
    render(<CmdK isOpen={false} onClose={noop} options={[]} onSearch={noop} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders the dialog with a visible, focused search input when isOpen is true', () => {
    render(<CmdK isOpen onClose={noop} options={[]} onSearch={noop} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(getInput()).toHaveFocus();
  });

  it('calls onSearch with the typed text once, after debounceMs of inactivity', () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();
    render(<CmdK isOpen onClose={noop} options={[]} onSearch={onSearch} />);

    fireEvent.change(getInput(), { target: { value: 'ab' } });
    expect(onSearch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);

    expect(onSearch).toHaveBeenCalledExactlyOnceWith('ab');
  });

  it('does not call onSearch while keystrokes are still arriving within the debounce window', () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();
    render(<CmdK isOpen onClose={noop} options={[]} onSearch={onSearch} />);

    fireEvent.change(getInput(), { target: { value: 'a' } });
    vi.advanceTimersByTime(200);
    fireEvent.change(getInput(), { target: { value: 'ab' } });
    vi.advanceTimersByTime(200);

    expect(onSearch).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(onSearch).toHaveBeenCalledExactlyOnceWith('ab');
  });

  it('renders a flat options array via role="option", with no checkboxes visible', () => {
    const options: Options = [
      { id: 'one', title: 'One' },
      { id: 'two', title: 'Two' },
    ];
    render(<CmdK isOpen onClose={noop} options={options} onSearch={noop} />);

    expect(screen.getByRole('option', { name: 'One' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Two' })).toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('renders a grouped options collection with each group heading and its items', () => {
    const options: Options = {
      Fruits: [{ id: 'apple', title: 'Apple' }],
      Vegetables: [{ id: 'carrot', title: 'Carrot' }],
    };
    render(<CmdK isOpen onClose={noop} options={options} onSearch={noop} />);

    expect(screen.getByText('Fruits')).toBeInTheDocument();
    expect(screen.getByText('Vegetables')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Carrot' })).toBeInTheDocument();
  });

  it('does not render the emptyText message before any search has been triggered', () => {
    render(<CmdK isOpen onClose={noop} options={[]} onSearch={noop} />);

    expect(screen.queryByText('No results found')).not.toBeInTheDocument();
  });

  it('renders the emptyText message once a search has run and found nothing', () => {
    vi.useFakeTimers();
    render(<CmdK isOpen onClose={noop} options={[]} onSearch={noop} />);

    fireEvent.change(getInput(), { target: { value: 'xyz' } });
    act(() => vi.advanceTimersByTime(300));

    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('renders a custom emptyText message once a search has run and found nothing', () => {
    vi.useFakeTimers();
    render(<CmdK isOpen onClose={noop} options={[]} onSearch={noop} emptyText="Nothing matches" />);

    fireEvent.change(getInput(), { target: { value: 'xyz' } });
    act(() => vi.advanceTimersByTime(300));

    expect(screen.getByText('Nothing matches')).toBeInTheDocument();
  });

  it('swaps in a loading spinner and sets aria-busy when isLoading is true', () => {
    render(<CmdK isOpen onClose={noop} options={[]} onSearch={noop} isLoading />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(getInput()).toHaveAttribute('aria-busy', 'true');
  });

  it('highlights the first option by default, tracked via aria-activedescendant', () => {
    const options: Options = [
      { id: 'one', title: 'One' },
      { id: 'two', title: 'Two' },
    ];
    render(<CmdK isOpen onClose={noop} options={options} onSearch={noop} />);

    expect(getInput()).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'One' }).id,
    );
  });

  it('moves the highlight with ArrowDown/ArrowUp, including across a group boundary', async () => {
    const user = userEvent.setup();
    const options: Options = {
      Fruits: [{ id: 'apple', title: 'Apple' }],
      Vegetables: [{ id: 'carrot', title: 'Carrot' }],
    };
    render(<CmdK isOpen onClose={noop} options={options} onSearch={noop} />);

    await user.click(getInput());
    await user.keyboard('{ArrowDown}');

    expect(getInput()).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Carrot' }).id,
    );

    await user.keyboard('{ArrowUp}');

    expect(getInput()).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Apple' }).id,
    );
  });

  it('wraps the highlight around both ends of the option list', async () => {
    const user = userEvent.setup();
    const options: Options = [
      { id: 'one', title: 'One' },
      { id: 'two', title: 'Two' },
    ];
    render(<CmdK isOpen onClose={noop} options={options} onSearch={noop} />);

    await user.click(getInput());
    await user.keyboard('{ArrowUp}');

    expect(getInput()).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Two' }).id,
    );
  });

  it('skips a disabled item when moving the highlight with the keyboard', async () => {
    const user = userEvent.setup();
    const options: Options = [
      { id: 'one', title: 'One' },
      { id: 'two', title: 'Two', disabled: true },
      { id: 'three', title: 'Three' },
    ];
    render(<CmdK isOpen onClose={noop} options={options} onSearch={noop} />);

    await user.click(getInput());
    await user.keyboard('{ArrowDown}');

    expect(getInput()).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Three' }).id,
    );
  });

  it('does not activate a disabled item on click', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onClose = vi.fn();
    const options: Options = [{ id: 'one', title: 'One', disabled: true, onClick }];
    render(<CmdK isOpen onClose={onClose} options={options} onSearch={noop} />);

    await user.click(screen.getByRole('option', { name: 'One' }));

    expect(onClick).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("activates the highlighted item's onClick and then closes when Enter is pressed", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onClose = vi.fn();
    const options: Options = [{ id: 'one', title: 'One', onClick }];
    render(<CmdK isOpen onClose={onClose} options={options} onSearch={noop} />);

    await user.click(getInput());
    await user.keyboard('{Enter}');

    expect(onClick).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('activates an item on click the same way, without leaving it toggled on afterward', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onClose = vi.fn();
    const options: Options = [{ id: 'one', title: 'One', onClick }];
    render(<CmdK isOpen onClose={onClose} options={options} onSearch={noop} />);

    await user.click(screen.getByRole('option', { name: 'One' }));

    expect(onClick).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('renders an item with href as an anchor', () => {
    const options: Options = [{ id: 'one', title: 'One', href: '/settings' }];
    render(<CmdK isOpen onClose={noop} options={options} onSearch={noop} />);

    const option = screen.getByRole('option', { name: 'One' });
    expect(option.tagName).toBe('A');
    expect(option).toHaveAttribute('href', '/settings');
  });

  it('renders an item without href as a button', () => {
    const options: Options = [{ id: 'one', title: 'One' }];
    render(<CmdK isOpen onClose={noop} options={options} onSearch={noop} />);

    expect(screen.getByRole('option', { name: 'One' }).tagName).toBe('BUTTON');
  });

  it('calls onClose on Escape, delegated to Modal', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<CmdK isOpen onClose={onClose} options={[]} onSearch={noop} />);

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onClose on a backdrop click, delegated to Modal', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<CmdK isOpen onClose={onClose} options={[]} onSearch={noop} />);

    const overlay = screen.getByRole('dialog').parentElement;
    expect(overlay).not.toBeNull();

    if (overlay) {
      await user.click(overlay);
    }

    expect(onClose).toHaveBeenCalledOnce();
  });
});
