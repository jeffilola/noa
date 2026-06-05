import { PageHeader } from '@/components/page-header';
import { ApiErrorBanner, DashboardStatGrid } from '@/components/user/dashboard-primitives';
import { CredentialsGrid } from '@/components/user/credentials-grid';
import { UserQuickLink } from '@/components/user/user-quick-link';
import { displayName } from '@/lib/user-dashboard';
import { fetchUserDashboardData } from '@/lib/user-data';

export default async function UserOverviewPage() {
  const { profile, memberships, credentials, devices, apiReachable } =
    await fetchUserDashboardData();

  const activeCredentials = credentials.filter((c) => c.status === 'active').length;
  const activeDevices = devices.filter((d) => d.isActive).length;

  return (
    <div className="content-stack">
      <PageHeader
        title={`Welcome, ${displayName(profile)}`}
        description="Your holder dashboard — credentials, devices, and privacy controls in one place."
      />

      {!apiReachable ? (
        <ApiErrorBanner message="Could not reach the Noa API. Start Postgres, run pnpm --filter @noa/api dev, then refresh. You are signed in as an Identity Holder — navigation still works while the API is offline." />
      ) : null}

      <DashboardStatGrid
        stats={[
          { label: 'Active credentials', value: activeCredentials, hint: `${credentials.length} total` },
          { label: 'Organizations', value: memberships.length },
          { label: 'Active devices', value: activeDevices, hint: `${devices.length} registered` },
        ]}
      />

      <div className="dashboard-tiles">
        <UserQuickLink
          href="/user/identity#credentials"
          title="Credentials"
          stat={String(credentials.length)}
          description="Wallet passes, PACS badges, and presentation methods."
        />
        <UserQuickLink
          href="/user/identity#organizations"
          title="Organizations"
          stat={String(memberships.length)}
          description="Organizations you belong to and your roles."
        />
        <UserQuickLink
          href="/user/identity#devices"
          title="Devices"
          stat={String(devices.length)}
          description="Phones and watches paired for NFC and Wallet."
        />
        <UserQuickLink
          href="/user/security"
          title="Security"
          description="Privacy settings, data export, and account security."
        />
      </div>

      {credentials.length > 0 ? (
        <section className="content-stack">
          <h2 className="dashboard-section-title">Recent credentials</h2>
          <CredentialsGrid credentials={credentials.slice(0, 3)} />
        </section>
      ) : null}
    </div>
  );
}
