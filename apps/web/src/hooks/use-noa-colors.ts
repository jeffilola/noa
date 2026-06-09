'use client';

import { useTheme } from 'next-themes';
import { noaColorsDark, noaColorsLight } from '@/components/relume/shared/theme';

/** Defaults to light palette when theme is unknown (SSR) to match :root CSS tokens. */
export function useNoaColors() {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'dark' ? noaColorsDark : noaColorsLight;
}
