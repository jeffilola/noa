'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import type { ReactNode } from 'react';
import { getClerkAppearance } from '@/lib/clerk-appearance';

export function ThemedClerkProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const mode = resolvedTheme === 'dark' ? 'dark' : 'light';

  return <ClerkProvider appearance={getClerkAppearance(mode)}>{children}</ClerkProvider>;
}
