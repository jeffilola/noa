import { apiFetch } from '@/lib/api';
import type { UserCredential, UserDevice, UserMembership, UserProfile } from '@/lib/user-types';

const fieldLabels: Record<string, string> = {
  id: 'User ID',
  clerkUserId: 'Clerk ID',
  email: 'Email',
  firstName: 'First name',
  lastName: 'Last name',
  phoneNumber: 'Phone',
};

export function IdentityProfileCard({ profile }: { profile: UserProfile }) {
  const entries = Object.entries(profile).filter(([, value]) => value);

  return (
    <div className="card">
      <h2 className="dashboard-section-title">Profile</h2>
      <dl className="dl-list">
        {entries.map(([key, value]) => (
          <div key={key} className="dl-row">
            <dt>{fieldLabels[key] ?? key}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function OrganizationsCard({ memberships }: { memberships: UserMembership[] }) {
  return (
    <div className="card identity-section">
      <h2 className="dashboard-section-title" id="organizations">
        Organizations
      </h2>
      {memberships.length === 0 ? (
        <p className="dashboard-muted">No organization memberships yet.</p>
      ) : (
        <ul className="org-list">
          {memberships.map((membership) => (
            <li key={membership.id} className="org-list__item">
              <div>
                <strong>{membership.organization.name}</strong>
                <span className="meta">{membership.organization.slug}</span>
              </div>
              <div className="badges">
                <span className="badge badge-muted">{membership.role}</span>
                <span className={`badge ${membership.status === 'active' ? 'badge-active' : 'badge-muted'}`}>
                  {membership.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export async function loadIdentityPageData() {
  let profile: UserProfile | null = null;
  let memberships: UserMembership[] = [];
  let credentials: UserCredential[] = [];
  let devices: UserDevice[] = [];
  let error: string | null = null;
  let credentialsError: string | null = null;

  try {
    profile = await apiFetch<UserProfile>('/users/me');
  } catch {
    error = 'Could not load your Noa profile. Make sure the API is running and you are signed in.';
  }

  try {
    memberships = await apiFetch<UserMembership[]>('/users/me/memberships');
  } catch {
    memberships = [];
  }

  try {
    credentials = await apiFetch<UserCredential[]>('/credentials');
  } catch (err) {
    credentialsError = err instanceof Error ? err.message : 'Could not load credentials.';
    credentials = [];
  }

  try {
    devices = await apiFetch<UserDevice[]>('/devices');
  } catch {
    devices = [];
  }

  return { profile, memberships, credentials, devices, error, credentialsError };
}
