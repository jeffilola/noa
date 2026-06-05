import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { DASHBOARD_NAVIGATION } from '@/lib/rbac/navigation';

export default function SecurityAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout config={DASHBOARD_NAVIGATION.security_admin}>{children}</DashboardLayout>
  );
}
