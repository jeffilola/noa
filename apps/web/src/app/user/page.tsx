import { PageHeader } from '@/components/page-header';
import {
  ApiErrorBanner,
  ApiOfflineBanner,
  DashboardStatGrid,
  OverviewEmptyStates,
  type OverviewEmptyItem,
} from '@/components/user/dashboard-primitives';
import { CredentialsGrid } from '@/components/user/credentials-grid';
import { UserQuickLink } from '@/components/user/user-quick-link';
import { displayName } from '@/lib/user-dashboard';
import { fetchUserDashboardData } from '@/lib/user-data';

export const dynamic = 'force-dynamic';

const unavailableStat = { value: '—' as const, hint: 'Unavailable while API is offline', unavailable: true };

function formatCount(count: number, emptyHint: string) {
  return {
    value: count,
    hint: count === 0 ? emptyHint : undefined,
  };
}

function buildEmptyItems(
  credentialsEmpty: boolean,
  membershipsEmpty: boolean,
  devicesEmpty: boolean,
): OverviewEmptyItem[] {
  const items: OverviewEmptyItem[] = [];

  if (credentialsEmpty) {
    items.push({
      title: 'No credentials yet',
      body: 'Wallet passes and PACS badges appear here after your organization connects a provider or issues credentials through Noa.',
      href: '/user/identity#credentials',
      linkLabel: 'View credentials',
    });
  }

  if (membershipsEmpty) {
    items.push({
      title: 'No organizations yet',
      body: 'When an administrator adds you to an organization, your memberships and roles will show on the overview and in My Identity.',
      href: '/user/identity#organizations',
      linkLabel: 'View organizations',
    });
  }

  if (devicesEmpty) {
    items.push({
      title: 'No devices registered',
      body: 'Register a phone or watch from My Identity when you are ready to use wallet passes or NFC presentation.',
      href: '/user/identity#devices',
      linkLabel: 'Manage devices',
    });
  }

  return items;
}

export default async function UserOverviewPage() {
  const { profile, memberships, credentials, devices, apiReachable, credentialsError } =
    await fetchUserDashboardData();

  const apiOffline = !apiReachable;
  const activeCredentials = credentials.filter((c) => c.status === 'active').length;
  const activeDevices = devices.filter((d) => d.isActive).length;
  const statUnavailable = apiOffline ? unavailableStat : null;

  const stats = [
    {
      label: 'Active credentials',
      ...(statUnavailable ??
        formatCount(activeCredentials, 'None active yet — check My Identity for details')),
      hint:
        statUnavailable?.hint ??
        (credentials.length === 0
          ? 'None active yet — check My Identity for details'
          : `${credentials.length} total`),
    },
    {
      label: 'Organizations',
      ...(statUnavailable ?? formatCount(memberships.length, 'No memberships yet')),
    },
    {
      label: 'Active devices',
      ...(statUnavailable ??
        formatCount(activeDevices, 'None registered yet — add one in My Identity')),
      hint:
        statUnavailable?.hint ??
        (devices.length === 0
          ? 'None registered yet — add one in My Identity'
          : `${devices.length} registered`),
    },
  ];

  const emptyItems = apiOffline
    ? []
    : buildEmptyItems(
        credentials.length === 0,
        memberships.length === 0,
        devices.length === 0,
      );

  const tileStat = (count: number) => (apiOffline ? '—' : String(count));

  return (
    <div className="content-stack">
      <PageHeader
        title={`Welcome, ${displayName(profile)}`}
        description="Your holder dashboard — credentials, devices, and privacy controls in one place."
      />

      {apiOffline ? <ApiOfflineBanner /> : null}
      {credentialsError ? <ApiErrorBanner message={credentialsError} /> : null}

      <DashboardStatGrid stats={stats} />

      <div className="dashboard-tiles">
        <UserQuickLink
          href="/user/identity#credentials"
          title="Credentials"
          stat={tileStat(credentials.length)}
          statUnavailable={apiOffline}
          description="Wallet passes, PACS badges, and presentation methods."
        />
        <UserQuickLink
          href="/user/identity#organizations"
          title="Organizations"
          stat={tileStat(memberships.length)}
          statUnavailable={apiOffline}
          description="Organizations you belong to and your roles."
        />
        <UserQuickLink
          href="/user/identity#devices"
          title="Devices"
          stat={tileStat(devices.length)}
          statUnavailable={apiOffline}
          description="Phones and watches paired for NFC and Wallet."
        />
        <UserQuickLink
          href="/user/security"
          title="Security"
          description="Privacy settings, data export, and account security."
        />
      </div>

      <OverviewEmptyStates items={emptyItems} />

      {!apiOffline && credentials.length > 0 ? (
        <section className="content-stack">
          <h2 className="dashboard-section-title">Recent credentials</h2>
          <CredentialsGrid credentials={credentials.slice(0, 3)} />
        </section>
      ) : null}
    </div>
  );
}
