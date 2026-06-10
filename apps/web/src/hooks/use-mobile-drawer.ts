'use client';

import { useEffect, useState } from 'react';

const MOBILE_DRAWER_QUERY = '(max-width: 900px)';

function readMobileDrawer() {
  return typeof window !== 'undefined' && window.matchMedia(MOBILE_DRAWER_QUERY).matches;
}

export function useMobileDrawer() {
  const [isMobileDrawer, setIsMobileDrawer] = useState(readMobileDrawer);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_DRAWER_QUERY);
    const sync = () => setIsMobileDrawer(media.matches);

    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return isMobileDrawer;
}
