'use client';

import type { ReactNode } from 'react';
import { AppNav } from '@/components/app-nav';
import type { DashboardSwitcherLink } from '@/lib/dashboard-switcher';
import { SidebarProvider, useSidebar } from '@/components/dashboard/sidebar-context';

const MOBILE_DRAWER_TOP = 'calc(3.5rem + env(safe-area-inset-top, 0px))';

function DrawerOverlay({ sidebar }: { sidebar: ReactNode }) {
  const { open, close } = useSidebar();

  if (!open) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        className="drawer-scrim"
        aria-label="Close navigation menu"
        onClick={close}
        style={{
          position: 'fixed',
          top: MOBILE_DRAWER_TOP,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9990,
        }}
      />
      <aside
        className="drawer-sidebar drawer-sidebar--mobile"
        aria-hidden={false}
        style={{
          position: 'fixed',
          top: MOBILE_DRAWER_TOP,
          left: 0,
          bottom: 0,
          zIndex: 9991,
          width: 'min(18rem, 88vw)',
          maxWidth: '88vw',
        }}
      >
        <div className="drawer-sidebar__inner">{sidebar}</div>
      </aside>
    </>
  );
}

function DrawerBody({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  const { open } = useSidebar();

  return (
    <div className={`drawer-layout${open ? ' drawer-layout--open' : ' drawer-layout--collapsed'}`}>
      <div className={`drawer-sidebar drawer-sidebar--desktop${open ? '' : ' drawer-sidebar--closed'}`} aria-hidden={!open}>
        <div className="drawer-sidebar__inner">{sidebar}</div>
      </div>
      <div className="drawer-mobile-layer">{open ? <DrawerOverlay sidebar={sidebar} /> : null}</div>
      <main className="drawer-content">{children}</main>
    </div>
  );
}

export function DashboardAppShell({
  sidebar,
  switcherLinks,
  children,
}: {
  sidebar: ReactNode;
  switcherLinks?: DashboardSwitcherLink[];
  children: ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="app-shell app-shell--drawer">
        <AppNav variant="drawer" switcherLinks={switcherLinks} />
        <DrawerBody sidebar={sidebar}>{children}</DrawerBody>
      </div>
    </SidebarProvider>
  );
}
