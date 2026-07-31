import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import StatusPill from './StatusPill';

describe('StatusPill', () => {
  it('renders the provided text content', () => {
    render(<StatusPill variant="info">Active</StatusPill>);

    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies the info variant triad classes', () => {
    render(<StatusPill variant="info">Active</StatusPill>);

    expect(screen.getByText('Active').className).toContain('snc:bg-snc-info-bg');
    expect(screen.getByText('Active').className).toContain('snc:border-snc-info-border');
    expect(screen.getByText('Active').className).toContain('snc:text-snc-info-text');
  });

  it('applies the warning variant triad classes', () => {
    render(<StatusPill variant="warning">Pending</StatusPill>);

    expect(screen.getByText('Pending').className).toContain('snc:bg-snc-warning-bg');
    expect(screen.getByText('Pending').className).toContain('snc:border-snc-warning-border');
    expect(screen.getByText('Pending').className).toContain('snc:text-snc-warning-text');
  });

  it('applies the error variant triad classes', () => {
    render(<StatusPill variant="error">Failed</StatusPill>);

    expect(screen.getByText('Failed').className).toContain('snc:bg-snc-error-bg');
    expect(screen.getByText('Failed').className).toContain('snc:border-snc-error-border');
    expect(screen.getByText('Failed').className).toContain('snc:text-snc-error-text');
  });

  it('applies the success variant triad classes', () => {
    render(<StatusPill variant="success">Complete</StatusPill>);

    expect(screen.getByText('Complete').className).toContain('snc:bg-snc-success-bg');
    expect(screen.getByText('Complete').className).toContain('snc:border-snc-success-border');
    expect(screen.getByText('Complete').className).toContain('snc:text-snc-success-text');
  });

  it('renders text in the heading font', () => {
    render(<StatusPill variant="info">Active</StatusPill>);

    expect(screen.getByText('Active').className).toContain('snc:font-snc-heading');
  });

  it('renders the pill text in full caps via text-transform', () => {
    render(<StatusPill variant="info">Active</StatusPill>);

    expect(screen.getByText('Active').className).toContain('snc:uppercase');
  });

  it('merges a consumer-supplied className with the base classes', () => {
    render(
      <StatusPill variant="info" className="custom-class">
        Active
      </StatusPill>,
    );

    expect(screen.getByText('Active').className).toContain('custom-class');
  });

  it('forwards additional HTML attributes to the root element', () => {
    render(
      <StatusPill variant="info" data-testid="status-pill">
        Active
      </StatusPill>,
    );

    expect(screen.getByTestId('status-pill')).toBeInTheDocument();
  });
});
