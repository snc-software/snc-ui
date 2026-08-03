import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import OptionsList from './OptionsList';

import type { OptionsCollection, OptionsGroup as OptionsGroupType } from './OptionsList.types';

describe('OptionsList', () => {
  it('dispatches a bare OptionItem to a single option row', () => {
    render(<OptionsList options={{ id: 'one', title: 'One' }} />);

    expect(screen.getByText('One')).toBeInTheDocument();
  });

  it('dispatches an array of options to recursive rendering', () => {
    render(
      <OptionsList
        options={[
          { id: 'one', title: 'One' },
          { id: 'two', title: 'Two' },
        ]}
      />,
    );

    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
  });

  it('dispatches an OptionsGroup to a collapsible group header', () => {
    const group: OptionsGroupType = { title: 'Group', childOptions: { id: 'one', title: 'One' } };
    render(<OptionsList options={group} />);

    expect(screen.getByRole('button', { name: 'Group' })).toBeInTheDocument();
  });

  it('dispatches an OptionsCollection to Tag-headed groups', () => {
    const options: OptionsCollection = { Fruits: { id: 'apple', title: 'Apple' } };
    render(<OptionsList options={options} />);

    expect(screen.getByText('Fruits')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
  });

  it('hides every checkbox in the tree when checkbox is false', () => {
    render(
      <OptionsList
        checkbox={false}
        options={[
          { id: 'one', title: 'One' },
          { title: 'Group', childOptions: { id: 'two', title: 'Two' } },
        ]}
      />,
    );

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('selects every child option in one click when selectAll is used via a group', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const group: OptionsGroupType = {
      title: 'Group',
      childOptions: [
        { id: 'one', title: 'One' },
        { id: 'two', title: 'Two' },
      ],
    };
    render(<OptionsList options={group} selectAll onChange={onChange} />);

    await user.click(screen.getByRole('checkbox', { name: 'Select all Group' }));

    expect(onChange).toHaveBeenCalledExactlyOnceWith(['one', 'two']);
  });

  it('renders only selected items when selectedOnly is true', () => {
    render(
      <OptionsList
        options={[
          { id: 'one', title: 'One' },
          { id: 'two', title: 'Two' },
        ]}
        selected={['two']}
        selectedOnly
      />,
    );

    expect(screen.queryByText('One')).not.toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
  });

  it('filters the tree using the internal searchTerm', () => {
    render(
      <OptionsList
        options={[
          { id: 'one', title: 'One Fish' },
          { id: 'two', title: 'Two Cat' },
        ]}
        searchTerm="fish"
      />,
    );

    expect(screen.getByText('One Fish')).toBeInTheDocument();
    expect(screen.queryByText('Two Cat')).not.toBeInTheDocument();
  });

  it('renders the default emptyText when nothing matches', () => {
    render(<OptionsList options={{ id: 'one', title: 'One' }} searchTerm="nomatch" />);

    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('renders a custom emptyText when supplied', () => {
    render(
      <OptionsList
        options={{ id: 'one', title: 'One' }}
        searchTerm="nomatch"
        emptyText="Nothing here"
      />,
    );

    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('renders nothing (not the emptyText) when selectedOnly filters out everything', () => {
    const { container } = render(
      <OptionsList options={{ id: 'one', title: 'One' }} selected={[]} selectedOnly />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('highlights the option matching activeId via aria-selected', () => {
    render(
      <OptionsList
        checkbox={false}
        options={[
          { id: 'one', title: 'One' },
          { id: 'two', title: 'Two' },
        ]}
        activeId="two"
      />,
    );

    expect(screen.getByRole('option', { name: 'One' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('option', { name: 'Two' })).toHaveAttribute('aria-selected', 'true');
  });
});
