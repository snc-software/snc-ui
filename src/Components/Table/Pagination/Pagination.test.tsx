import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import Pagination from './Pagination';

function renderPagination(overrides: Partial<Parameters<typeof Pagination>[0]> = {}) {
  const props = {
    page: 5,
    pageSize: 10,
    total: 100,
    onChange: vi.fn(),
    ...overrides,
  };

  render(<Pagination {...props} />);

  return props;
}

describe('Pagination', () => {
  it('renders nothing when there are no pages', () => {
    renderPagination({ total: 0 });

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('renders a labelled navigation landmark', () => {
    renderPagination();

    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
  });

  it('renders a control per page in the current window', () => {
    renderPagination();

    expect(screen.getByRole('button', { name: 'Go to page 3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go to page 7' })).toBeInTheDocument();
  });

  it('marks the current page for assistive technology', () => {
    renderPagination();

    expect(screen.getByRole('button', { name: 'Go to page 5' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('calls onChange with the selected page number', async () => {
    const user = userEvent.setup();
    const props = renderPagination();

    await user.click(screen.getByRole('button', { name: 'Go to page 6' }));

    expect(props.onChange).toHaveBeenCalledWith(6);
  });

  it('does not call onChange when the current page is re-selected', async () => {
    const user = userEvent.setup();
    const props = renderPagination();

    await user.click(screen.getByRole('button', { name: 'Go to page 5' }));

    expect(props.onChange).not.toHaveBeenCalled();
  });

  it('moves to the first page via the jump control', async () => {
    const user = userEvent.setup();
    const props = renderPagination();

    await user.click(screen.getByRole('button', { name: 'Go to first page' }));

    expect(props.onChange).toHaveBeenCalledWith(1);
  });

  it('moves to the last page via the jump control', async () => {
    const user = userEvent.setup();
    const props = renderPagination();

    await user.click(screen.getByRole('button', { name: 'Go to last page' }));

    expect(props.onChange).toHaveBeenCalledWith(10);
  });

  it('moves to the previous page', async () => {
    const user = userEvent.setup();
    const props = renderPagination();

    await user.click(screen.getByRole('button', { name: 'Go to previous page' }));

    expect(props.onChange).toHaveBeenCalledWith(4);
  });

  it('moves to the next page', async () => {
    const user = userEvent.setup();
    const props = renderPagination();

    await user.click(screen.getByRole('button', { name: 'Go to next page' }));

    expect(props.onChange).toHaveBeenCalledWith(6);
  });

  it('hides the backward controls on the first page', () => {
    renderPagination({ page: 1 });

    expect(screen.queryByRole('button', { name: 'Go to first page' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Go to previous page' })).not.toBeInTheDocument();
  });

  it('hides the forward controls on the final page', () => {
    renderPagination({ page: 10 });

    expect(screen.queryByRole('button', { name: 'Go to next page' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Go to last page' })).not.toBeInTheDocument();
  });
});
