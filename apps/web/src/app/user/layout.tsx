import { DashboardAppShell } from '@/components/dashboard/dashboard-app-shell';
import { UserSidebar } from '@/components/user/user-sidebar';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return <DashboardAppShell sidebar={<UserSidebar />}>{children}</DashboardAppShell>;
}
