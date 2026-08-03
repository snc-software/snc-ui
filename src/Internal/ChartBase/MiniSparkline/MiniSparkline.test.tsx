import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import MiniSparkline from './MiniSparkline';

describe('MiniSparkline', () => {
  it('renders an area for the supplied data', () => {
    const { container } = render(<MiniSparkline data={[1, 4, 2, 8, 5]} color="#123456" />);

    expect(container.querySelector('.recharts-area-curve')).toBeInTheDocument();
  });

  it('applies the supplied color as the line stroke and a gradient fill', () => {
    const { container } = render(<MiniSparkline data={[1, 4, 2, 8, 5]} color="#123456" />);

    expect(container.querySelector('.recharts-area-curve')).toHaveAttribute('stroke', '#123456');
    expect(container.querySelector('.recharts-area-area')).toHaveAttribute(
      'fill',
      expect.stringMatching(/^url\(#/),
    );
  });
});
