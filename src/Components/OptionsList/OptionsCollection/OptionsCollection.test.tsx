import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import OptionsCollection from './OptionsCollection';

import type { OptionsCollection as OptionsCollectionType } from '../OptionsList.types';

const options: OptionsCollectionType = {
  Fruits: [
    { id: 'apple', title: 'Apple' },
    { id: 'banana', title: 'Banana' },
  ],
  Vegetables: [{ id: 'carrot', title: 'Carrot' }],
};

describe('OptionsCollection', () => {
  it('renders one heading per group key, in key order', () => {
    render(<OptionsCollection options={options} />);

    const headings = screen.getAllByText(/Fruits|Vegetables/);
    expect(headings.map((heading) => heading.textContent)).toEqual(['Fruits', 'Vegetables']);
  });

  it("renders each group's items", () => {
    render(<OptionsCollection options={options} />);

    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('Carrot')).toBeInTheDocument();
  });

  it('aggregates a selection change from one group with the currently selected ids of other groups', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<OptionsCollection options={options} selected={['carrot']} onChange={onChange} />);

    await user.click(screen.getByRole('checkbox', { name: /apple/i }));

    expect(onChange).toHaveBeenCalledExactlyOnceWith(expect.arrayContaining(['apple', 'carrot']));
    expect(onChange.mock.calls[0][0]).toHaveLength(2);
  });

  it('hides checkboxes across every group when checkbox is false', () => {
    render(<OptionsCollection options={options} checkbox={false} />);

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });
});
