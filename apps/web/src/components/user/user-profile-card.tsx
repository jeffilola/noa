'use client';

import { useUser } from '@clerk/nextjs';
import type { UserProfile } from '@/lib/user-types';
import { formatDateOfBirth, formatPhoneByRegion } from '@/lib/profile-format';

interface ProfileRow {
  label: string;
  value?: string | null;
  hint?: string;
}

function ProfileRows({ rows }: { rows: ProfileRow[] }) {
  return (
    <dl className="dl-list">
      {rows.map((row) => (
        <div key={row.label} className="dl-row">
          <dt>{row.label}</dt>
          <dd>
            {row.value ? (
              <>
                <span>{row.value}</span>
                {row.hint ? <span className="profile-field-hint">{row.hint}</span> : null}
              </>
            ) : (
              <span className="dashboard-muted">Not provided</span>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function UserProfileCard({ noaProfile }: { noaProfile: UserProfile | null }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="card identity-section">
        <h2 className="dashboard-section-title" id="profile">
          User profile
        </h2>
        <p className="dashboard-muted">Loading your profile…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="card identity-section">
        <h2 className="dashboard-section-title" id="profile">
          User profile
        </h2>
        <p className="dashboard-muted">Sign in to view your profile.</p>
      </div>
    );
  }

  const clerkPhone = user.primaryPhoneNumber?.phoneNumber;
  const storedPhone = noaProfile?.phoneNumber ?? clerkPhone;
  const formattedPhone = formatPhoneByRegion(storedPhone);
  const formattedDob = formatDateOfBirth(noaProfile?.dateOfBirth);

  const rows: ProfileRow[] = [
    { label: 'First name', value: user.firstName },
    { label: 'Last name', value: user.lastName },
    { label: 'Email', value: user.primaryEmailAddress?.emailAddress },
    {
      label: 'Date of birth',
      value: formattedDob,
      hint: formattedDob ? 'Encrypted at rest in Noa' : undefined,
    },
    {
      label: 'Phone number',
      value: formattedPhone?.display,
      hint: formattedPhone ? `Region: ${formattedPhone.region}` : undefined,
    },
    { label: 'Clerk user ID', value: user.id },
  ];

  return (
    <div className="card identity-section">
      <h2 className="dashboard-section-title" id="profile">
        User profile
      </h2>
      <p className="dashboard-muted identity-section__lede">
        Signed-in identity from Clerk. Date of birth and phone are stored encrypted in Noa for audit and
        GDPR.
      </p>
      <ProfileRows rows={rows} />
    </div>
  );
}
