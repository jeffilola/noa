'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

function subscribe(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

function getDarkFromDom() {
  return document.documentElement.classList.contains('dark');
}

function getServerDarkFromDom() {
  return false;
}

/** Resolves light/dark from next-themes, falling back to the html class set by ThemeInitScript. */
export function useResolvedThemeMode(): 'light' | 'dark' {
  const { resolvedTheme } = useTheme();
  const isDarkDom = useSyncExternalStore(subscribe, getDarkFromDom, getServerDarkFromDom);

  if (resolvedTheme === 'dark' || resolvedTheme === 'light') {
    return resolvedTheme;
  }

  return isDarkDom ? 'dark' : 'light';
}
