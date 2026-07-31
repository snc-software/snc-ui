import { describe, expect, it } from 'vitest';

import { getFocusableElements } from './Modal.utils';

function createContainer(html: string): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = html;
  return container;
}

describe('getFocusableElements', () => {
  it('returns all natively focusable, non-disabled descendants in DOM order', () => {
    const container = createContainer(`
      <a href="#">Link</a>
      <button>First</button>
      <input type="text" />
      <textarea></textarea>
      <select><option>a</option></select>
      <button>Last</button>
    `);

    const elements = getFocusableElements(container);

    expect(elements.map((element) => element.tagName)).toEqual([
      'A',
      'BUTTON',
      'INPUT',
      'TEXTAREA',
      'SELECT',
      'BUTTON',
    ]);
  });

  it('excludes disabled form elements', () => {
    const container = createContainer(`
      <button disabled>Disabled</button>
      <input type="text" disabled />
      <button>Enabled</button>
    `);

    const elements = getFocusableElements(container);

    expect(elements).toHaveLength(1);
    expect(elements[0].textContent).toBe('Enabled');
  });

  it('excludes elements with tabindex="-1"', () => {
    const container = createContainer(`
      <div tabindex="-1">Not focusable</div>
      <div tabindex="0">Focusable</div>
    `);

    const elements = getFocusableElements(container);

    expect(elements).toHaveLength(1);
    expect(elements[0].textContent).toBe('Focusable');
  });
});
