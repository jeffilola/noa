import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { DASHBOARD_NAVIGATION } from '@/lib/rbac/navigation';

export default function PlatformAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout config={DASHBOARD_NAVIGATION.platform_admin}>{children}</DashboardLayout>
  );
}
