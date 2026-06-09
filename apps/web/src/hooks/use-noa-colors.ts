'use client';

import { useTheme } from 'next-themes';
import { noaColorsDark, noaColorsLight } from '@/components/relume/shared/theme';

export function useNoaColors() {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'light' ? noaColorsLight : noaColorsDark;
}
