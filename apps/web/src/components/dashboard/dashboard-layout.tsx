import { DashboardAppShell } from '@/components/dashboard/dashboard-app-shell';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import type { DashboardNavConfig } from '@/lib/rbac/navigation';

export function DashboardLayout({
  config,
  children,
}: {
  config: DashboardNavConfig;
  children: React.ReactNode;
}) {
  return (
    <DashboardAppShell sidebar={<DashboardSidebar config={config} />}>{children}</DashboardAppShell>
  );
}
