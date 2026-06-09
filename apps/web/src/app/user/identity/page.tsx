import { PageHeader } from '@/components/page-header';
import { ApiErrorBanner, EmptyPanel } from '@/components/user/dashboard-primitives';
import { CredentialsPanel } from '@/components/user/credentials-panel';
import { UserProfileCard } from '@/components/user/user-profile-card';
import { DevicesPanel } from '@/components/user/devices-panel';
import { loadIdentityPageData, OrganizationsCard } from '@/components/user/identity-sections';

export default async function IdentityPage() {
  const { profile, memberships, credentials, devices, error, credentialsError } =
    await loadIdentityPageData();

  return (
    <div className="content-stack">
      <PageHeader
        title="My identity"
        description="Your signed-in profile, organizations, credentials, and devices in one place."
      />

      {error ? <ApiErrorBanner message={error} /> : null}
      {credentialsError ? <ApiErrorBanner message={credentialsError} /> : null}

      <div className="identity-sections">
        <UserProfileCard noaProfile={profile} />

        <OrganizationsCard memberships={memberships} />

        <section className="card identity-section" id="credentials">
          <h2 className="dashboard-section-title">Credentials</h2>
          <CredentialsPanel initialCredentials={credentials} clerkUserId={profile?.clerkUserId} />
        </section>

        <section className="card identity-section" id="devices">
          <h2 className="dashboard-section-title">Devices</h2>
          <p className="dashboard-muted identity-section__lede">
            Phones and watches registered for wallet passes and NFC presentation.
          </p>
          <DevicesPanel initialDevices={devices} />
        </section>
      </div>
    </div>
  );
}
