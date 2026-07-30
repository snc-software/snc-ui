import { useEffect } from 'react';

import type { RefObject } from 'react';

/**
 * Calls `onClickOutside` when a pointer press or focus move lands outside every supplied element.
 *
 * Listens on `pointerdown` rather than `click` so a dismissal fires before the press completes — this
 * matches how native menus behave and avoids the trigger's own click re-opening a just-closed panel.
 * Refs holding `null` are ignored, so a conditionally rendered panel can share the same hook call.
 *
 * @param refs Elements considered "inside". A press within any of them is ignored.
 * @param onClickOutside Invoked when the press or focus lands outside all of them.
 * @param isEnabled Set false to detach the listeners entirely (e.g. while the panel is closed).
 */
export function useClickOutside(
  refs: Array<RefObject<HTMLElement | null>>,
  onClickOutside: () => void,
  isEnabled = true,
) {
  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const isInside = (target: EventTarget | null) =>
      target instanceof Node && refs.some((ref) => ref.current?.contains(target));

    const handleEvent = (event: Event) => {
      if (!isInside(event.target)) {
        onClickOutside();
      }
    };

    document.addEventListener('pointerdown', handleEvent);
    document.addEventListener('focusin', handleEvent);

    return () => {
      document.removeEventListener('pointerdown', handleEvent);
      document.removeEventListener('focusin', handleEvent);
    };
    // `refs` is a new array literal on most renders while the ref objects inside it are stable, so the
    // effect is keyed on the entries rather than the wrapper's identity. That spread is what the rule
    // cannot verify statically; keying on `refs` itself would re-attach the listeners every render.
    // eslint-disable-next-line react-x/exhaustive-deps, react-hooks/exhaustive-deps
  }, [...refs, onClickOutside, isEnabled]);
}
