import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { DASHBOARD_NAVIGATION } from '@/lib/rbac/navigation';

export default function OrgAdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout config={DASHBOARD_NAVIGATION.org_admin}>{children}</DashboardLayout>;
}
