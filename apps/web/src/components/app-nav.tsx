'use client';

import Link from 'next/link';
import { FiMenu } from 'react-icons/fi';
import { AuthNavControls } from '@/components/auth-nav-controls';
import type { DashboardSwitcherLink } from '@/components/dashboard/dashboard-switcher';
import { useSidebarOptional } from '@/components/dashboard/sidebar-context';
import { ThemeToggle } from '@/components/theme-toggle';

export function AppNav({
  variant = 'default',
  switcherLinks,
}: {
  variant?: 'default' | 'drawer';
  switcherLinks?: DashboardSwitcherLink[];
}) {
  const sidebar = useSidebarOptional();
  const isDrawer = variant === 'drawer' && sidebar;

  return (
    <header className={`site-header${isDrawer ? ' site-header--drawer' : ''}`}>
      <div className={`site-header-inner${isDrawer ? ' site-header-inner--drawer' : ' site-header-inner--minimal'}`}>
        <div className="site-header-start">
          {isDrawer ? (
            <button
              type="button"
              className="drawer-menu-button"
              onClick={() => sidebar?.toggle()}
              aria-expanded={sidebar.open}
              aria-label={sidebar.open ? 'Close navigation menu' : 'Open navigation menu'}
            >
              <FiMenu aria-hidden />
            </button>
          ) : null}
          <Link href="/" className="brand">
            <span className="brand-mark" aria-hidden>
              N
            </span>
            <span className="brand-text">Noa</span>
          </Link>
        </div>

        <div className="site-header-end">
          {!isDrawer ? <ThemeToggle compact /> : null}
          <AuthNavControls switcherLinks={switcherLinks} />
        </div>
      </div>
    </header>
  );
}
