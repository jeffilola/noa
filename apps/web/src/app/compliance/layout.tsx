import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { DASHBOARD_NAVIGATION } from '@/lib/rbac/navigation';

export default function ComplianceLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout config={DASHBOARD_NAVIGATION.compliance_auditor}>{children}</DashboardLayout>
  );
}
