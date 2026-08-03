import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import MiniDonut from './MiniDonut';

describe('MiniDonut', () => {
  it('renders the rounded percentage centered inside the ring', () => {
    render(<MiniDonut value={59.6} color="#123456" />);

    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  it('renders two arc segments', () => {
    const { container } = render(<MiniDonut value={60} color="#123456" />);

    expect(container.querySelectorAll('.recharts-pie-sector')).toHaveLength(2);
  });

  it('applies the color and trackColor to the value and track segments', () => {
    const { container } = render(<MiniDonut value={60} color="#123456" trackColor="#abcdef" />);

    const sectors = container.querySelectorAll('.recharts-pie-sector path');

    expect(sectors[0]).toHaveAttribute('fill', '#123456');
    expect(sectors[1]).toHaveAttribute('fill', '#abcdef');
  });
});
