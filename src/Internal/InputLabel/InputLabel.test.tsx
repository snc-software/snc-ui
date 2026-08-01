import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import InputLabel from './InputLabel';

describe('InputLabel', () => {
  it('renders as a <label> element and displays its children', () => {
    render(<InputLabel>Email</InputLabel>);

    const label = screen.getByText('Email');

    expect(label.tagName).toBe('LABEL');
  });

  it('associates with a form control via htmlFor/id', () => {
    render(
      <>
        <InputLabel htmlFor="email">Email</InputLabel>
        <input id="email" />
      </>,
    );

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('applies the shared label typography classes', () => {
    render(<InputLabel>Email</InputLabel>);

    const label = screen.getByText('Email');

    expect(label.className).toContain('snc:font-snc-body');
    expect(label.className).toContain('snc:text-sm');
  });

  it('merges a consumer-supplied className with the base classes', () => {
    render(<InputLabel className="custom-class">Email</InputLabel>);

    const label = screen.getByText('Email');

    expect(label.className).toContain('custom-class');
    expect(label.className).toContain('snc:font-snc-body');
  });

  it('forwards standard attributes (e.g. data-testid) via passthrough', () => {
    render(<InputLabel data-testid="email-label">Email</InputLabel>);

    expect(screen.getByTestId('email-label')).toBeInTheDocument();
  });
});
