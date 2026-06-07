import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { canAccessOrgDashboard, fetchUserAccess } from '@/lib/access-data';
import { DASHBOARD_NAVIGATION } from '@/lib/rbac/navigation';

export default async function OrgAdminLayout({ children }: { children: React.ReactNode }) {
  const access = await fetchUserAccess();
  if (!canAccessOrgDashboard(access)) {
    redirect('/user');
  }

  return <DashboardLayout config={DASHBOARD_NAVIGATION.org_admin}>{children}</DashboardLayout>;
}
