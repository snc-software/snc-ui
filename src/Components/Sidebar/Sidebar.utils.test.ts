import { afterEach, describe, expect, it } from 'vitest';

import { SIDEBAR_COOKIE_NAME } from './Sidebar.constants';
import { getFocusableElements, getSidebarCookie, setSidebarCookie } from './Sidebar.utils';

function clearCookie() {
  document.cookie = `${SIDEBAR_COOKIE_NAME}=; path=/; max-age=0`;
}

describe('getSidebarCookie / setSidebarCookie', () => {
  afterEach(() => {
    clearCookie();
  });

  it('returns undefined when the cookie is absent', () => {
    expect(getSidebarCookie()).toBeUndefined();
  });

  it('round-trips true', () => {
    setSidebarCookie(true);

    expect(getSidebarCookie()).toBe(true);
  });

  it('round-trips false', () => {
    setSidebarCookie(false);

    expect(getSidebarCookie()).toBe(false);
  });

  it('returns undefined for a malformed cookie value', () => {
    document.cookie = `${SIDEBAR_COOKIE_NAME}=not-a-boolean; path=/`;

    expect(getSidebarCookie()).toBeUndefined();
  });
});

describe('getFocusableElements', () => {
  it('returns natively focusable, non-disabled descendants in DOM order', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <button disabled>Disabled</button>
      <a href="/somewhere">Link</a>
      <button>Enabled</button>
      <span tabindex="-1">Not focusable</span>
    `;

    const elements = getFocusableElements(container);

    expect(elements.map((element) => element.textContent)).toEqual(['Link', 'Enabled']);
  });
});
