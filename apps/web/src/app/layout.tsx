import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { WorldBackground } from '@/components/world-background';
import { clerkAppearance } from '@/lib/clerk-appearance';
import './globals.css';

export const metadata: Metadata = {
  title: 'Noa — Credential Platform',
  description: 'Privacy-first credential orchestration with PACS-led corporate access.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <ClerkProvider appearance={clerkAppearance}>
          <WorldBackground />
          <div className="site-content">{children}</div>
        </ClerkProvider>
      </body>
    </html>
  );
}
