'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { AuthNavControls } from '@/components/auth-nav-controls';
import { SidebarThemeSettings } from '@/components/sidebar-theme-settings';
import { useNoaColors } from '@/hooks/use-noa-colors';
import { BrandLogo } from './BrandLogo';
import { marketingNavLinks, marketingRoutes } from './routes';

function NavItem({ href, label, onNavigate }) {
  const c = useNoaColors();
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={clsx(
        'rounded-full px-4 py-2 text-sm font-medium transition-colors no-underline hover:no-underline',
        active ? 'font-semibold' : '',
      )}
      style={{
        color: active ? c.ink : c.sage,
        background: active ? c.accentSoft : 'transparent',
      }}
    >
      {label}
    </Link>
  );
}

export function Navbar3() {
  const c = useNoaColors();
  const menuRef = useRef(null);

  useEffect(() => {
    function closeOnEscape(event) {
      if (event.key !== 'Escape' || !menuRef.current?.open) {
        return;
      }

      menuRef.current.open = false;
    }

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  function closeMenu() {
    if (menuRef.current) {
      menuRef.current.open = false;
    }
  }

  return (
    <header
      className="marketing-site-header sticky top-0 border-b"
      style={{
        borderColor: `color-mix(in srgb, ${c.sage} 22%, transparent)`,
        background: c.glassNav,
      }}
    >
      <div className="marketing-shell flex h-[4.5rem] items-center justify-between gap-6">
        <BrandLogo href={marketingRoutes.home} />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {marketingNavLinks.map((link) => (
            <NavItem key={link.href} {...link} onNavigate={undefined} />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <AuthNavControls />
          </div>

          <details ref={menuRef} className="marketing-menu-details">
            <summary
              className="marketing-menu-button inline-flex size-11 min-h-11 min-w-11 cursor-pointer list-none items-center justify-center rounded-full border"
              style={{ borderColor: `color-mix(in srgb, ${c.sage} 35%, transparent)` }}
              aria-label="Open menu"
            >
              <span className="flex flex-col gap-1" aria-hidden>
                <span className="block h-0.5 w-5" style={{ background: c.sage }} />
                <span className="block h-0.5 w-5" style={{ background: c.sage }} />
                <span className="block h-0.5 w-5" style={{ background: c.sage }} />
              </span>
            </summary>

            <button
              type="button"
              className="marketing-menu-backdrop"
              aria-label="Close menu overlay"
              tabIndex={-1}
              onClick={closeMenu}
            />

            <div
              id="marketing-nav-panel"
              className="marketing-menu-panel"
              style={{
                borderColor: `color-mix(in srgb, ${c.sage} 22%, transparent)`,
                background: c.surface,
              }}
            >
              <nav className="marketing-shell flex flex-col gap-4 lg:hidden" aria-label="Mobile primary">
                {marketingNavLinks.map((link) => (
                  <NavItem key={link.href} {...link} onNavigate={closeMenu} />
                ))}
                <AuthNavControls compact />
              </nav>

              <div className="marketing-shell marketing-nav-panel__theme lg:px-4">
                <SidebarThemeSettings />
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
