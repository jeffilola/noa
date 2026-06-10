import type { Metadata, Viewport } from 'next';

import { ThemedClerkProvider } from '@/components/themed-clerk-provider';
import { ThemeInitScript } from '@/components/theme-init-script';
import { ThemeProvider } from '@/components/theme-provider';

import './globals.css';

export const metadata: Metadata = {
  title: 'Noa — Credential Platform',
  description: 'Privacy-first credential orchestration with PACS-led corporate access.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f7f8' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeInitScript />
      </head>
      <body>
        <ThemeProvider>
          <ThemedClerkProvider>
            <div className="site-content">{children}</div>
          </ThemedClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
