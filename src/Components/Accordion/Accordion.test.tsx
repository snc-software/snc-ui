import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import Accordion from './Accordion';

import type { AccordionItem } from './Accordion.types';

const items: AccordionItem[] = [
  { id: 'billing', header: 'Billing', content: 'Billing details' },
  { id: 'shipping', header: 'Shipping', content: 'Shipping details' },
];

describe('Accordion', () => {
  it('renders a header and no visible content for each item by default', () => {
    render(<Accordion items={items} />);

    expect(screen.getByRole('button', { name: 'Billing' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Shipping' })).toBeInTheDocument();
    expect(screen.getByText('Billing details')).not.toBeVisible();
    expect(screen.getByText('Shipping details')).not.toBeVisible();
  });

  it("expands a section's content when its header is clicked", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);

    await user.click(screen.getByRole('button', { name: 'Billing' }));

    expect(screen.getByText('Billing details')).toBeVisible();
  });

  it("collapses an open section's content when its header is clicked again", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} defaultOpenItems={['billing']} />);

    await user.click(screen.getByRole('button', { name: 'Billing' }));

    expect(screen.getByText('Billing details')).not.toBeVisible();
  });

  it('toggles one section without affecting the open/closed state of another', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);

    await user.click(screen.getByRole('button', { name: 'Billing' }));

    expect(screen.getByText('Billing details')).toBeVisible();
    expect(screen.getByText('Shipping details')).not.toBeVisible();
  });

  it("exposes aria-expanded reflecting each section's open state", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);

    const billingHeader = screen.getByRole('button', { name: 'Billing' });
    expect(billingHeader).toHaveAttribute('aria-expanded', 'false');

    await user.click(billingHeader);

    expect(billingHeader).toHaveAttribute('aria-expanded', 'true');
  });

  it('associates the header and content panel via aria-controls/aria-labelledby and role="region"', () => {
    render(<Accordion items={items} defaultOpenItems={['billing']} />);

    const header = screen.getByRole('button', { name: 'Billing' });
    const region = screen.getByRole('region', { name: 'Billing' });

    expect(header).toHaveAttribute('aria-controls', region.id);
    expect(region).toHaveAttribute('aria-labelledby', header.id);
  });

  it('applies the sky-accent header treatment when a section is open', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);

    const billingHeader = screen.getByRole('button', { name: 'Billing' });
    await user.click(billingHeader);

    expect(billingHeader.className).toContain('snc:bg-snc-accent-subtle-bg');
    expect(billingHeader.className).toContain('snc:text-snc-accent');
  });

  it('calls onOpenItemsChanged with the updated array of open ids when a section is toggled', async () => {
    const user = userEvent.setup();
    const onOpenItemsChanged = vi.fn();
    render(<Accordion items={items} onOpenItemsChanged={onOpenItemsChanged} />);

    await user.click(screen.getByRole('button', { name: 'Billing' }));

    expect(onOpenItemsChanged).toHaveBeenCalledWith(['billing']);
  });

  it('supports controlled usage via the openItems prop', () => {
    const { rerender } = render(
      <Accordion items={items} openItems={[]} onOpenItemsChanged={vi.fn()} />,
    );

    expect(screen.getByText('Billing details')).not.toBeVisible();

    rerender(<Accordion items={items} openItems={['billing']} onOpenItemsChanged={vi.fn()} />);

    expect(screen.getByText('Billing details')).toBeVisible();
  });

  it('supports uncontrolled usage via defaultOpenItems', () => {
    render(<Accordion items={items} defaultOpenItems={['shipping']} />);

    expect(screen.getByText('Shipping details')).toBeVisible();
    expect(screen.getByText('Billing details')).not.toBeVisible();
  });

  it('toggles a section via the keyboard', async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);

    await user.tab();
    await user.keyboard('{Enter}');

    expect(screen.getByText('Billing details')).toBeVisible();
  });

  it('merges a consumer-supplied className onto the root', () => {
    const { container } = render(<Accordion items={items} className="custom-class" />);

    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });
});
