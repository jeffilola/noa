import { DashboardAppShell } from '@/components/dashboard/dashboard-app-shell';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { dashboardSwitcherLinks, fetchUserAccess } from '@/lib/access-data';
import { filterNavItems, type DashboardNavConfig, type PermissionName } from '@/lib/rbac/navigation';

export async function DashboardLayout({
  config,
  children,
}: {
  config: DashboardNavConfig;
  children: React.ReactNode;
}) {
  const access = await fetchUserAccess();
  const permissions = (access?.permissions ?? []) as PermissionName[];
  const filteredConfig: DashboardNavConfig = {
    ...config,
    items: filterNavItems(config, permissions),
  };
  const switcherLinks = dashboardSwitcherLinks(access);

  return (
    <DashboardAppShell sidebar={<DashboardSidebar config={filteredConfig} />} switcherLinks={switcherLinks}>
      {children}
    </DashboardAppShell>
  );
}
