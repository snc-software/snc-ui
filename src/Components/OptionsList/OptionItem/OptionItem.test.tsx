import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import OptionItem from './OptionItem';

describe('OptionItem', () => {
  it('renders the title', () => {
    render(<OptionItem id="one" title="One" />);

    expect(screen.getByText('One')).toBeInTheDocument();
  });

  it('renders a prefix and suffix', () => {
    render(
      <OptionItem id="one" title="One" prefix={<span>pre</span>} suffix={<span>post</span>} />,
    );

    expect(screen.getByText('pre')).toBeInTheDocument();
    expect(screen.getByText('post')).toBeInTheDocument();
  });

  it('renders a string description', () => {
    render(<OptionItem id="one" title="One" description="A single line" />);

    expect(screen.getByText('A single line')).toBeInTheDocument();
  });

  it('renders each line of an array description', () => {
    render(<OptionItem id="one" title="One" description={['Line one', 'Line two']} />);

    expect(screen.getByText('Line one')).toBeInTheDocument();
    expect(screen.getByText('Line two')).toBeInTheDocument();
  });

  it('renders a function description reflecting selected/disabled state', () => {
    render(
      <OptionItem
        id="one"
        title="One"
        selected
        disabled
        description={({ selected, disabled }) => `selected:${selected} disabled:${disabled}`}
      />,
    );

    expect(screen.getByText('selected:true disabled:true')).toBeInTheDocument();
  });

  it('applies disabled styling and prevents toggling by click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<OptionItem id="one" title="One" disabled onChange={onChange} />);

    const label = screen.getByText('One').closest('label');
    expect(label?.className).toContain('snc:opacity-60');

    await user.click(screen.getByText('One'));

    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders a checkbox by default and toggles it on click, firing onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<OptionItem id="one" title="One" onChange={onChange} />);

    expect(screen.getByRole('checkbox')).toBeInTheDocument();

    await user.click(screen.getByRole('checkbox'));

    expect(onChange).toHaveBeenCalledExactlyOnceWith(true);
  });

  it('renders as a button, with no checkbox, when checkbox is false and no href is given', () => {
    render(<OptionItem id="one" title="One" checkbox={false} />);

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'One' }).tagName).toBe('BUTTON');
  });

  it('fires onChange when the button-rendered row is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<OptionItem id="one" title="One" checkbox={false} onChange={onChange} />);

    await user.click(screen.getByRole('option', { name: 'One' }));

    expect(onChange).toHaveBeenCalledExactlyOnceWith(true);
  });

  it('renders as an anchor with the given href when checkbox is false and href is set', () => {
    render(<OptionItem id="one" title="One" checkbox={false} href="/settings" />);

    const link = screen.getByRole('option', { name: 'One' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/settings');
  });

  it('does not set href and prevents activation on a disabled anchor row', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <OptionItem
        id="one"
        title="One"
        checkbox={false}
        href="/settings"
        disabled
        onChange={onChange}
      />,
    );

    const link = screen.getByRole('option', { name: 'One' });
    expect(link).not.toHaveAttribute('href');

    await user.click(link);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('reflects isActive via aria-selected', () => {
    render(<OptionItem id="one" title="One" checkbox={false} isActive />);

    expect(screen.getByRole('option', { name: 'One' })).toHaveAttribute('aria-selected', 'true');
  });

  it('applies greater left padding for a deeper indent', () => {
    render(<OptionItem id="one" title="One" indent={2} />);

    expect(screen.getByText('One').closest('label')).toHaveStyle({ paddingLeft: '56px' });
  });

  it('does not call the domain onClick prop itself on click — activation is resolved by the parent', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onChange = vi.fn();
    render(
      <OptionItem id="one" title="One" checkbox={false} onClick={onClick} onChange={onChange} />,
    );

    await user.click(screen.getByRole('option', { name: 'One' }));

    expect(onClick).not.toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledExactlyOnceWith(true);
  });

  it('merges a consumer-supplied className onto the root', () => {
    render(<OptionItem id="one" title="One" className="custom-class" />);

    expect(screen.getByText('One').closest('label')).toHaveClass('custom-class');
  });
});
