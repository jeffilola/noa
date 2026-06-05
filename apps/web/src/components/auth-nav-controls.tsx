'use client';

import Link from 'next/link';
import { UserButton, useAuth } from '@clerk/nextjs';
import { marketingRoutes } from './relume/shared/routes';
import { noaColors as c } from './relume/shared/theme';

function AuthLink({
  href,
  children,
  variant = 'ghost',
}: {
  href: string;
  children: string;
  variant?: 'ghost' | 'primary';
}) {
  const isPrimary = variant === 'primary';

  return (
    <Link
      href={href}
      className="rounded-full px-5 py-2 text-sm font-semibold no-underline transition-opacity hover:opacity-90"
      style={
        isPrimary
          ? { background: c.accent, color: c.onAccent }
          : {
              border: `1px solid color-mix(in srgb, ${c.sage} 55%, transparent)`,
              background: 'transparent',
              color: c.sage,
            }
      }
    >
      {children}
    </Link>
  );
}

export function AuthNavControls({ compact = false }: { compact?: boolean }) {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return <div className="h-9 w-24 animate-pulse rounded-full bg-white/10" aria-hidden />;
  }

  if (isSignedIn) {
    return (
      <div className={`flex items-center ${compact ? 'flex-col gap-2' : 'gap-3'}`}>
        <AuthLink href={marketingRoutes.holderDashboard} variant="primary">
          Dashboard
        </AuthLink>
        <UserButton
          appearance={{
            elements: {
              userButtonPopoverCard: 'border border-white/10 bg-[#0a0a0a]',
              userButtonPopoverActionButton: 'text-white hover:bg-white/10',
            },
          }}
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center ${compact ? 'flex-col gap-2' : 'gap-3'}`}>
      <AuthLink href={marketingRoutes.signIn} variant="ghost">
        Sign in
      </AuthLink>
      <AuthLink href={marketingRoutes.signUp} variant="primary">
        {compact ? 'Create account' : 'Get started'}
      </AuthLink>
    </div>
  );
}
