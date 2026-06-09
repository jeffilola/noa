'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import type { ReactNode } from 'react';
import { getClerkAppearance } from '@/lib/clerk-appearance';

export function ThemedClerkProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const mode = resolvedTheme === 'light' ? 'light' : 'dark';

  return <ClerkProvider appearance={getClerkAppearance(mode)}>{children}</ClerkProvider>;
}
