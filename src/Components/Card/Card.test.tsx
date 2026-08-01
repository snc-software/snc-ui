import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Card from './Card';

describe('Card', () => {
  it('renders only the root element when header, content, and actions are omitted', () => {
    const { container } = render(<Card data-testid="card" />);

    expect(screen.getByTestId('card')).toBeEmptyDOMElement();
    expect(container.firstElementChild?.children).toHaveLength(0);
  });

  it('renders header content when supplied', () => {
    render(<Card header={<span>Card title</span>} />);

    expect(screen.getByText('Card title')).toBeInTheDocument();
  });

  it('renders content when supplied', () => {
    render(<Card content={<p>Card body</p>} />);

    expect(screen.getByText('Card body')).toBeInTheDocument();
  });

  it('renders actions when supplied', () => {
    render(<Card actions={<button type="button">Save</button>} />);

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('renders header, content, and actions together when all three are supplied', () => {
    render(
      <Card
        header={<span>Card title</span>}
        content={<p>Card body</p>}
        actions={<button type="button">Save</button>}
      />,
    );

    expect(screen.getByText('Card title')).toBeInTheDocument();
    expect(screen.getByText('Card body')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('defaults actionsAlign to right', () => {
    render(<Card actions={<button type="button">Save</button>} />);

    expect(screen.getByRole('button', { name: 'Save' }).parentElement).toHaveClass(
      'snc:justify-end',
    );
  });

  it('applies the correct alignment class for each actionsAlign value', () => {
    const { rerender } = render(
      <Card actions={<button type="button">Save</button>} actionsAlign="left" />,
    );
    expect(screen.getByRole('button', { name: 'Save' }).parentElement).toHaveClass(
      'snc:justify-start',
    );

    rerender(<Card actions={<button type="button">Save</button>} actionsAlign="center" />);
    expect(screen.getByRole('button', { name: 'Save' }).parentElement).toHaveClass(
      'snc:justify-center',
    );

    rerender(<Card actions={<button type="button">Save</button>} actionsAlign="right" />);
    expect(screen.getByRole('button', { name: 'Save' }).parentElement).toHaveClass(
      'snc:justify-end',
    );
  });

  it('passes through standard HTML attributes and data-* props to the root element', () => {
    render(<Card data-testid="card" aria-label="Summary" />);

    expect(screen.getByTestId('card')).toHaveAttribute('aria-label', 'Summary');
  });

  it('applies a custom className alongside the root element default classes', () => {
    render(<Card data-testid="card" className="custom-class" />);

    expect(screen.getByTestId('card')).toHaveClass('custom-class');
  });

  it('forwards ref to the root element', () => {
    let rootElement: HTMLDivElement | null = null;
    render(
      <Card
        data-testid="card"
        ref={(node) => {
          rootElement = node;
        }}
      />,
    );

    expect(rootElement).toBe(screen.getByTestId('card'));
  });
});
