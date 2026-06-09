'use client';

import Link from 'next/link';
import { UserButton, useAuth } from '@clerk/nextjs';
import { DashboardSwitcher, type DashboardSwitcherLink } from '@/components/dashboard/dashboard-switcher';
import { useNoaColors } from '@/hooks/use-noa-colors';
import { getClerkAppearance } from '@/lib/clerk-appearance';
import { useTheme } from 'next-themes';
import { marketingRoutes } from './relume/shared/routes';

function AuthLink({
  href,
  children,
  variant = 'ghost',
}: {
  href: string;
  children: string;
  variant?: 'ghost' | 'primary';
}) {
  const c = useNoaColors();
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

export function AuthNavControls({
  compact = false,
  switcherLinks,
}: {
  compact?: boolean;
  switcherLinks?: DashboardSwitcherLink[];
}) {
  const { isSignedIn, isLoaded } = useAuth();
  const { resolvedTheme } = useTheme();
  const c = useNoaColors();
  const clerkMode = resolvedTheme === 'dark' ? 'dark' : 'light';

  if (!isLoaded) {
    return (
      <div
        className="h-9 w-24 animate-pulse rounded-full"
        style={{ background: `color-mix(in srgb, ${c.sage} 25%, transparent)` }}
        aria-hidden
      />
    );
  }

  if (isSignedIn) {
    return (
      <div className={`flex items-center ${compact ? 'flex-col gap-2' : 'gap-3'}`}>
        {switcherLinks?.length ? (
          <DashboardSwitcher links={switcherLinks} />
        ) : (
          <AuthLink href={marketingRoutes.holderDashboard} variant="primary">
            Dashboard
          </AuthLink>
        )}
        <UserButton appearance={getClerkAppearance(clerkMode)} />
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
