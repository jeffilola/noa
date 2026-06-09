import type { Metadata } from 'next';

import { ThemedClerkProvider } from '@/components/themed-clerk-provider';
import { ThemeProvider } from '@/components/theme-provider';
import { WorldBackground } from '@/components/world-background';

import './globals.css';

export const metadata: Metadata = {
  title: 'Noa — Credential Platform',
  description: 'Privacy-first credential orchestration with PACS-led corporate access.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ThemedClerkProvider>
            <WorldBackground />
            <div className="site-content">{children}</div>
          </ThemedClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
