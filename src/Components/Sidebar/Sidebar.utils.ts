import { SIDEBAR_COOKIE_MAX_AGE_SECONDS, SIDEBAR_COOKIE_NAME } from './Sidebar.constants';

/**
 * Reads the persisted desktop open/collapsed state. Returns `undefined` when the cookie is absent
 * or holds anything other than the two literal values this component ever writes.
 */
export function getSidebarCookie(): boolean | undefined {
  const match = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${SIDEBAR_COOKIE_NAME}=`));

  if (match === undefined) {
    return undefined;
  }

  const value = match.slice(SIDEBAR_COOKIE_NAME.length + 1);

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return undefined;
}

export function setSidebarCookie(open: boolean): void {
  document.cookie = `${SIDEBAR_COOKIE_NAME}=${open}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE_SECONDS}`;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Natively focusable, non-disabled descendants in DOM order — used by the mobile sheet's focus
 * trap. Mirrors `Modal.utils.ts`'s own helper of the same name; not imported from there since
 * `Modal` doesn't export it publicly and the two overlays are otherwise independent.
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}
