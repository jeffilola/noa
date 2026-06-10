'use client';

import { noaColorsThemed } from '@/components/relume/shared/theme';

/** Theme-aware palette backed by CSS variables (follows system dark mode immediately). */
export function useNoaColors() {
  return noaColorsThemed;
}
