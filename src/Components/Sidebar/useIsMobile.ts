import { useEffect, useState } from 'react';

import { SIDEBAR_BREAKPOINT_PX } from './Sidebar.constants';

/** Tracks whether the viewport is below the sidebar's mobile breakpoint. */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    () => window.matchMedia(`(max-width: ${SIDEBAR_BREAKPOINT_PX - 1}px)`).matches,
  );

  useEffect(() => {
    const query = window.matchMedia(`(max-width: ${SIDEBAR_BREAKPOINT_PX - 1}px)`);

    const handleChange = () => setIsMobile(query.matches);

    query.addEventListener('change', handleChange);

    return () => query.removeEventListener('change', handleChange);
  }, []);

  return isMobile;
}
