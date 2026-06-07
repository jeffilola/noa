'use client';

import type { ReactNode } from 'react';
import { AppNav } from '@/components/app-nav';
import type { DashboardSwitcherLink } from '@/components/dashboard/dashboard-switcher';
import { SidebarProvider, useSidebar } from '@/components/dashboard/sidebar-context';

function DrawerBody({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  const { open } = useSidebar();

  return (
    <div className={`drawer-layout${open ? '' : ' drawer-layout--collapsed'}`}>
      <div className="drawer-sidebar" aria-hidden={!open}>
        <div className="drawer-sidebar__inner">{sidebar}</div>
      </div>
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
