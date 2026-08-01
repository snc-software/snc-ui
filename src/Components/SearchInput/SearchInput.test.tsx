import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import SearchInput from './SearchInput';

import type { SearchInputOption, SearchInputProps } from './SearchInput.types';

const options = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'archived', label: 'Archived' },
];

const getTrigger = () => screen.getByRole('combobox', { name: 'Search' });
const noop = () => {};

afterEach(() => {
  vi.useRealTimers();
});

/**
 * Drives a full search-completed cycle with real timers (`debounceMs={0}` plus `waitFor`, per the
 * unit-test standard's guidance to prefer `waitFor`/`findBy*` over fake-timer gymnastics): types
 * "a", waits for the debounced `onSearch` to fire, then rerenders with `resultOptions` to simulate
 * the consumer supplying results — which is what actually reveals the listbox, per the component's
 * "only open once a search has completed" behaviour.
 */
async function openWithOptions(
  resultOptions: SearchInputOption[],
  extraProps: Partial<SearchInputProps> = {},
) {
  const user = userEvent.setup();
  const onSearch = vi.fn();
  const { rerender } = render(
    <SearchInput
      aria-label="Search"
      options={[]}
      debounceMs={0}
      {...extraProps}
      onSearch={onSearch}
    />,
  );

  await user.type(getTrigger(), 'a');
  await waitFor(() => expect(onSearch).toHaveBeenCalled());

  rerender(
    <SearchInput
      aria-label="Search"
      options={resultOptions}
      debounceMs={0}
      {...extraProps}
      onSearch={onSearch}
    />,
  );

  return { user, onSearch, rerender };
}

describe('SearchInput', () => {
  it('renders a collapsed combobox input with no listbox visible', () => {
    render(<SearchInput aria-label="Search" options={[]} onSearch={noop} />);

    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('renders a search icon inside the input when not loading', () => {
    const { container } = render(<SearchInput aria-label="Search" options={[]} onSearch={noop} />);

    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('renders no placeholder attribute when placeholder is not supplied', () => {
    render(<SearchInput aria-label="Search" options={[]} onSearch={noop} />);

    expect(getTrigger()).not.toHaveAttribute('placeholder');
  });

  it('shows the given placeholder when supplied and nothing is selected', () => {
    render(
      <SearchInput aria-label="Search" options={[]} onSearch={noop} placeholder="Search users" />,
    );

    expect(getTrigger()).toHaveAttribute('placeholder', 'Search users');
  });

  it("displays the selected option's label in the input by default", () => {
    render(<SearchInput aria-label="Search" options={options} onSearch={noop} value="active" />);

    expect(getTrigger()).toHaveValue('Active');
  });

  it('starts from defaultValue when left uncontrolled', () => {
    render(
      <SearchInput aria-label="Search" options={options} onSearch={noop} defaultValue="archived" />,
    );

    expect(getTrigger()).toHaveValue('Archived');
  });

  it("updates the input's displayed text immediately on each keystroke, without waiting for the debounce", async () => {
    const user = userEvent.setup();
    render(<SearchInput aria-label="Search" options={[]} onSearch={noop} />);

    await user.type(getTrigger(), 'ab');

    expect(getTrigger()).toHaveValue('ab');
  });

  it('does not open the listbox merely by focusing or clicking the input', async () => {
    const user = userEvent.setup();
    render(<SearchInput aria-label="Search" options={options} onSearch={noop} />);

    await user.click(getTrigger());

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'false');
  });

  it('does not open the listbox merely by typing, before the debounced search completes', async () => {
    const user = userEvent.setup();
    render(<SearchInput aria-label="Search" options={[]} onSearch={noop} />);

    await user.type(getTrigger(), 'a');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  // These use `fireEvent` rather than `userEvent` — combining `userEvent`'s own internal timers
  // with Vitest's fake timers is a known source of hangs, and a plain `change` event is sufficient
  // to drive the debounce logic under test here.
  it('calls onSearch with the typed text once, after debounceMs of inactivity', () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();
    render(<SearchInput aria-label="Search" options={[]} onSearch={onSearch} />);

    fireEvent.change(getTrigger(), { target: { value: 'ab' } });
    expect(onSearch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(300);

    expect(onSearch).toHaveBeenCalledExactlyOnceWith('ab');
  });

  it('does not call onSearch while keystrokes are still arriving within the debounce window', () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();
    render(<SearchInput aria-label="Search" options={[]} onSearch={onSearch} />);

    fireEvent.change(getTrigger(), { target: { value: 'a' } });
    vi.advanceTimersByTime(200);
    fireEvent.change(getTrigger(), { target: { value: 'ab' } });
    vi.advanceTimersByTime(200);

    expect(onSearch).not.toHaveBeenCalled();
  });

  it('restarts the debounce timer on each keystroke, so only the final value is searched for', () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();
    render(<SearchInput aria-label="Search" options={[]} onSearch={onSearch} />);

    fireEvent.change(getTrigger(), { target: { value: 'a' } });
    vi.advanceTimersByTime(200);
    fireEvent.change(getTrigger(), { target: { value: 'ab' } });
    vi.advanceTimersByTime(300);

    expect(onSearch).toHaveBeenCalledExactlyOnceWith('ab');
  });

  it('respects a custom debounceMs value', () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();
    render(<SearchInput aria-label="Search" options={[]} onSearch={onSearch} debounceMs={1000} />);

    fireEvent.change(getTrigger(), { target: { value: 'a' } });
    vi.advanceTimersByTime(300);
    expect(onSearch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(700);
    expect(onSearch).toHaveBeenCalledExactlyOnceWith('a');
  });

  it('does not call onSearch after the component unmounts while a debounce timer is still pending', () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();
    const { unmount } = render(
      <SearchInput aria-label="Search" options={[]} onSearch={onSearch} />,
    );

    fireEvent.change(getTrigger(), { target: { value: 'a' } });
    unmount();
    vi.advanceTimersByTime(300);

    expect(onSearch).not.toHaveBeenCalled();
  });

  it('shows the Spinner in place of the search icon and sets aria-busy when isLoading is true', () => {
    render(<SearchInput aria-label="Search" options={[]} onSearch={noop} isLoading />);

    expect(screen.getAllByRole('status').length).toBeGreaterThan(0);
    expect(getTrigger()).toHaveAttribute('aria-busy', 'true');
  });

  it('does not open the listbox while isLoading is true, regardless of options', () => {
    render(<SearchInput aria-label="Search" options={options} onSearch={noop} isLoading />);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('opens the listbox with results once a search completes', async () => {
    await openWithOptions(options);

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(getTrigger()).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders each entry from options as a listbox option once a search completes', async () => {
    await openWithOptions(options);

    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('shows the default "No results found" row once a search completes with no matches', async () => {
    await openWithOptions([]);

    expect(screen.getByText('No results found')).toBeInTheDocument();
  });

  it('shows a custom noResultsMessage once a search completes with no matches', async () => {
    await openWithOptions([], { noResultsMessage: 'Nothing matches' });

    expect(screen.getByText('Nothing matches')).toBeInTheDocument();
  });

  it('applies the size-based padding to the no-results row, matching option rows', async () => {
    await openWithOptions([], { size: 'sm' });

    expect(screen.getByText('No results found').className).toContain('snc:pl-3.5');
  });

  it('closes the listbox as soon as the user starts typing again', async () => {
    const { user } = await openWithOptions(options);

    await user.type(getTrigger(), 'z');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('reopens automatically once a subsequent search completes, staying closed while it is loading', async () => {
    const { onSearch, rerender } = await openWithOptions(options);

    rerender(
      <SearchInput
        aria-label="Search"
        options={options}
        onSearch={onSearch}
        debounceMs={0}
        isLoading
      />,
    );
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    rerender(
      <SearchInput
        aria-label="Search"
        options={[options[1]]}
        onSearch={onSearch}
        debounceMs={0}
        isLoading={false}
      />,
    );

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(1);
  });

  it('selects an option and calls onChange with its value when clicked', async () => {
    const onChange = vi.fn();
    const { user } = await openWithOptions(options, { onChange });

    await user.click(screen.getByRole('option', { name: 'Active' }));

    expect(onChange).toHaveBeenCalledExactlyOnceWith('active');
  });

  it("updates the input's text to the selected option's label after selecting", async () => {
    const { user } = await openWithOptions(options);

    await user.click(screen.getByRole('option', { name: 'Active' }));

    expect(getTrigger()).toHaveValue('Active');
  });

  it('closes the panel after selecting an option', async () => {
    const { user } = await openWithOptions(options);

    await user.click(screen.getByRole('option', { name: 'Active' }));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('does not change a controlled value on its own after selecting', async () => {
    const { user } = await openWithOptions(options, { value: 'draft' });

    await user.click(screen.getByRole('option', { name: 'Active' }));

    expect(getTrigger()).toHaveValue('Active');
  });

  it('keeps the typed text in the input when the panel closes without a selection (outside click)', async () => {
    const { user } = await openWithOptions(options);

    await user.click(document.body);

    expect(getTrigger()).toHaveValue('a');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('does not open with ArrowDown before any search has completed', async () => {
    const user = userEvent.setup();
    render(<SearchInput aria-label="Search" options={options} onSearch={noop} />);

    await user.click(getTrigger());
    await user.keyboard('{ArrowDown}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('reopens with ArrowDown after being dismissed, once a search has completed', async () => {
    const { user } = await openWithOptions(options);

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

    await user.keyboard('{ArrowDown}');

    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('moves the highlighted option with ArrowDown/ArrowUp, updating aria-activedescendant, without moving DOM focus off the input', async () => {
    const { user } = await openWithOptions(options);

    // A completed search already highlights the first result, so the assertions below start from
    // Draft already highlighted.
    expect(getTrigger()).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Draft' }).id,
    );
    expect(getTrigger()).toHaveFocus();

    await user.keyboard('{ArrowDown}');

    expect(getTrigger()).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Active' }).id,
    );
    expect(getTrigger()).toHaveFocus();
  });

  it('wraps highlighting around the ends of the options list', async () => {
    const { user } = await openWithOptions(options);

    // A completed search already highlights the first option (Draft); moving up from there should
    // wrap to the end.
    await user.keyboard('{ArrowUp}');

    expect(getTrigger()).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Archived' }).id,
    );
  });

  it('jumps to the first/last option with Home/End', async () => {
    const { user } = await openWithOptions(options);

    await user.keyboard('{ArrowDown}{End}');

    expect(getTrigger()).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Archived' }).id,
    );

    await user.keyboard('{Home}');

    expect(getTrigger()).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Draft' }).id,
    );
  });

  it('selects the highlighted option with Enter', async () => {
    const onChange = vi.fn();
    const { user } = await openWithOptions(options, { onChange });

    // A completed search already highlights Draft; one ArrowDown moves to Active.
    await user.keyboard('{ArrowDown}{Enter}');

    expect(onChange).toHaveBeenCalledExactlyOnceWith('active');
  });

  it('skips disabled options when moving the highlight', async () => {
    const { user } = await openWithOptions([
      options[0],
      { value: 'deleted', label: 'Deleted', disabled: true },
      options[1],
    ]);

    // Draft (index 0) is already highlighted; one ArrowDown skips the disabled option and lands on
    // Active.
    await user.keyboard('{ArrowDown}');

    expect(getTrigger()).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Active' }).id,
    );
  });

  it('does not select a disabled option when clicked', async () => {
    const onChange = vi.fn();
    const { user } = await openWithOptions(
      [...options, { value: 'deleted', label: 'Deleted', disabled: true }],
      { onChange },
    );

    await user.click(screen.getByRole('option', { name: 'Deleted' }));

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('resets the highlighted option to the first enabled entry when options changes while open', async () => {
    const { rerender, onSearch } = await openWithOptions(options);

    const user = userEvent.setup();
    await user.keyboard('{ArrowDown}{ArrowDown}');

    expect(getTrigger()).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'Archived' }).id,
    );

    rerender(
      <SearchInput
        aria-label="Search"
        options={[{ value: 'new', label: 'New result' }]}
        onSearch={onSearch}
        debounceMs={0}
      />,
    );

    expect(getTrigger()).toHaveAttribute(
      'aria-activedescendant',
      screen.getByRole('option', { name: 'New result' }).id,
    );
  });

  it('closes on Escape and keeps focus on the input', async () => {
    const { user } = await openWithOptions(options);

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(getTrigger()).toHaveFocus();
  });

  it('closes when clicking outside the panel', async () => {
    const { user } = await openWithOptions(options);

    await user.click(document.body);

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('applies the medium size classes by default', () => {
    render(<SearchInput aria-label="Search" options={[]} onSearch={noop} />);

    expect(getTrigger().className).toContain('snc:h-12');
  });

  it('applies the small size classes when size="sm"', () => {
    render(<SearchInput aria-label="Search" options={[]} onSearch={noop} size="sm" />);

    expect(getTrigger().className).toContain('snc:h-8');
  });

  it('applies error styling and sets aria-invalid when hasError is true', () => {
    render(<SearchInput aria-label="Search" options={[]} onSearch={noop} hasError />);

    expect(getTrigger()).toHaveAttribute('aria-invalid', 'true');
    expect(getTrigger().className).toContain('snc:border-snc-error-border');
  });

  it('caps the panel height at the requested number of visible options', async () => {
    await openWithOptions(options, { visibleOptions: 2 });

    // The cap sits on the Popout panel, which is the scrolling element.
    expect(screen.getByRole('listbox').parentElement).toHaveStyle({ maxHeight: '5.5rem' });
  });

  it('does not open when disabled, even after a search completes', () => {
    const onSearch = vi.fn();
    const { rerender } = render(
      <SearchInput aria-label="Search" options={[]} onSearch={onSearch} debounceMs={0} disabled />,
    );

    expect(getTrigger()).toBeDisabled();

    rerender(
      <SearchInput
        aria-label="Search"
        options={options}
        onSearch={onSearch}
        debounceMs={0}
        disabled
      />,
    );

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('mirrors the selection into a hidden input when a name is supplied', () => {
    const { container } = render(
      <SearchInput
        aria-label="Search"
        options={options}
        onSearch={noop}
        name="user"
        value="active"
      />,
    );

    expect(container.querySelector('input[type="hidden"]')).toHaveValue('active');
    expect(container.querySelector('input[type="hidden"]')).toHaveAttribute('name', 'user');
  });

  it('forwards a callback ref to the input', () => {
    const ref = vi.fn();
    render(<SearchInput aria-label="Search" options={[]} onSearch={noop} ref={ref} />);

    expect(ref).toHaveBeenCalled();
  });

  it('forwards an object ref to the input', () => {
    const ref = createRef<HTMLInputElement>();
    render(<SearchInput aria-label="Search" options={[]} onSearch={noop} ref={ref} />);

    expect(ref.current).toBe(getTrigger());
  });

  it('merges a consumer-supplied className onto the wrapper', () => {
    const { container } = render(
      <SearchInput aria-label="Search" options={[]} onSearch={noop} className="custom-class" />,
    );

    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('renders no label element when label is omitted', () => {
    render(<SearchInput aria-label="Search" options={[]} onSearch={noop} />);

    expect(screen.queryByText('Search', { selector: 'label' })).not.toBeInTheDocument();
  });

  it('renders the accessible name from the label prop', () => {
    render(<SearchInput label="Search" options={[]} onSearch={noop} />);

    expect(screen.getByRole('combobox', { name: 'Search' })).toBeInTheDocument();
  });
});
