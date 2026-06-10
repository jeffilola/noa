'use client';

import { ThemeToggle } from '@/components/theme-toggle';

export function SidebarThemeSettings() {
  return (
    <div className="sidebar-theme-settings">
      <p className="drawer-sidebar__section-label">Theme</p>
      <ThemeToggle />
    </div>
  );
}
