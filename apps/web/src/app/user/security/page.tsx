import Link from 'next/link';
import { DashboardPlaceholder } from '@/components/dashboard/dashboard-placeholder';

export default function UserSecurityPage() {
  return (
    <section className="dashboard-stack">
      <DashboardPlaceholder
        title="Security & Privacy"
        description="Manage privacy settings, data export, and account security preferences."
      />
      <div className="dashboard-panel">
        <p>
          Data export and deletion controls live in{' '}
          <Link href="/user/privacy" className="text-link">
            Privacy settings
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
