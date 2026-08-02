import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import OptionsGroup from './OptionsGroup';

const childOptions = [
  { id: 'one', title: 'One' },
  { id: 'two', title: 'Two' },
];

describe('OptionsGroup', () => {
  it('renders the group title and is collapsed by default', () => {
    render(<OptionsGroup title="Group" childOptions={childOptions} />);

    expect(screen.getByRole('button', { name: 'Group' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText('One')).not.toBeVisible();
  });

  it('expands by default when defaultNestedExpanded is true', () => {
    render(<OptionsGroup title="Group" childOptions={childOptions} defaultNestedExpanded />);

    expect(screen.getByRole('button', { name: 'Group' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('One')).toBeVisible();
  });

  it('toggles child visibility when the header is clicked', async () => {
    const user = userEvent.setup();
    render(<OptionsGroup title="Group" childOptions={childOptions} />);

    await user.click(screen.getByRole('button', { name: 'Group' }));

    expect(screen.getByRole('button', { name: 'Group' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('One')).toBeVisible();
  });

  it('associates the header and panel via aria-controls/aria-labelledby', () => {
    render(<OptionsGroup title="Group" childOptions={childOptions} />);

    const header = screen.getByRole('button', { name: 'Group' });
    const region = screen.getByRole('region', { hidden: true });

    expect(header).toHaveAttribute('aria-controls', region.id);
    expect(region).toHaveAttribute('aria-labelledby', header.id);
  });

  it('selects all child options when the select-all checkbox is clicked', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <OptionsGroup
        title="Group"
        childOptions={childOptions}
        selectAll
        onSelectionChange={onSelectionChange}
      />,
    );

    await user.click(screen.getByRole('checkbox', { name: 'Select all Group' }));

    expect(onSelectionChange).toHaveBeenCalledExactlyOnceWith(['one', 'two']);
  });

  it('deselects all child options when the select-all checkbox is clicked while all are selected', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <OptionsGroup
        title="Group"
        childOptions={childOptions}
        selectAll
        selectedOptions={['one', 'two']}
        onSelectionChange={onSelectionChange}
      />,
    );

    await user.click(screen.getByRole('checkbox', { name: 'Select all Group' }));

    expect(onSelectionChange).toHaveBeenCalledExactlyOnceWith([]);
  });

  it('shows the select-all checkbox as indeterminate when only some children are selected', () => {
    render(
      <OptionsGroup title="Group" childOptions={childOptions} selectedOptions={['one']} />,
    );

    expect(screen.getByRole('checkbox', { name: 'Select all Group' })).toHaveAttribute('aria-checked', 'mixed');
  });

  it('does not toggle child visibility via the header when selectAll is true (legacy quirk, ported verbatim)', async () => {
    const user = userEvent.setup();
    render(<OptionsGroup title="Group" childOptions={childOptions} selectAll />);

    await user.click(screen.getByRole('button', { name: 'Group' }));

    expect(screen.getByText('One')).not.toBeVisible();
  });

  it('hides the checkbox when checkbox is false', () => {
    render(<OptionsGroup title="Group" childOptions={childOptions} checkbox={false} />);

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });
});
