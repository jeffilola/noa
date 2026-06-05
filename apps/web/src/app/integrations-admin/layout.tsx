import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { DASHBOARD_NAVIGATION } from '@/lib/rbac/navigation';

export default function IntegrationAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout config={DASHBOARD_NAVIGATION.integration_admin}>{children}</DashboardLayout>
  );
}
