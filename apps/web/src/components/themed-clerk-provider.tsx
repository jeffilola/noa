'use client';

import { ClerkProvider } from '@clerk/nextjs';
import type { ReactNode } from 'react';
import { useResolvedThemeMode } from '@/hooks/use-resolved-theme-mode';
import { getClerkAppearance } from '@/lib/clerk-appearance';

export function ThemedClerkProvider({ children }: { children: ReactNode }) {
  const mode = useResolvedThemeMode();

  return <ClerkProvider appearance={getClerkAppearance(mode)}>{children}</ClerkProvider>;
}
