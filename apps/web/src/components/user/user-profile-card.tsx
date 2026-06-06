'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import type { ProfileFieldErrors } from '@noa/shared';
import { validateProfileDateOfBirth, validateProfilePhone } from '@noa/shared';
import { FormSuccessBanner } from '@/components/user/dashboard-primitives';
import { ApiClientError, useClientApi } from '@/lib/api-client';
import { formatDateOfBirth, formatPhoneByRegion } from '@/lib/profile-format';
import type { UserProfile } from '@/lib/user-types';

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

function toDateInputValue(isoDate?: string | null) {
  if (!isoDate?.trim()) return '';
  const match = isoDate.trim().match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : '';
}

export function UserProfileCard({ noaProfile }: { noaProfile: UserProfile | null }) {
  const { user, isLoaded } = useUser();
  const { fetch } = useClientApi();
  const [profile, setProfile] = useState<UserProfile | null>(noaProfile);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ProfileFieldErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user) return;
    setProfile(noaProfile);
    setPhoneNumber(noaProfile?.phoneNumber ?? user.primaryPhoneNumber?.phoneNumber ?? '');
    setDateOfBirth(toDateInputValue(noaProfile?.dateOfBirth));
  }, [isLoaded, noaProfile, user]);

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

  const formattedPhone = formatPhoneByRegion(profile?.phoneNumber ?? phoneNumber);
  const formattedDob = formatDateOfBirth(profile?.dateOfBirth);

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

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setApiError(null);
    setSuccessMessage(null);

    const nextFieldErrors: ProfileFieldErrors = {};
    const phoneError = validateProfilePhone(phoneNumber);
    const dobError = validateProfileDateOfBirth(dateOfBirth);
    if (phoneError) nextFieldErrors.phoneNumber = phoneError;
    if (dobError) nextFieldErrors.dateOfBirth = dobError;

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setPending(false);
      return;
    }

    setFieldErrors({});

    try {
      const updated = await fetch<UserProfile>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ phoneNumber, dateOfBirth }),
      });
      setProfile(updated);
      setPhoneNumber(updated.phoneNumber ?? phoneNumber);
      setDateOfBirth(toDateInputValue(updated.dateOfBirth));
      setSuccessMessage('Profile saved. Phone and date of birth are encrypted in Noa.');
    } catch (err) {
      if (err instanceof ApiClientError && err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      }
      setApiError(err instanceof Error ? err.message : 'Could not save profile.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="card identity-section">
      <h2 className="dashboard-section-title" id="profile">
        User profile
      </h2>
      <p className="dashboard-muted identity-section__lede">
        Name and email come from Clerk. Save phone and date of birth here — they are stored encrypted
        in Noa for audit and GDPR.
      </p>

      {successMessage ? <FormSuccessBanner message={successMessage} /> : null}

      <ProfileRows rows={rows} />

      <form className="profile-form device-form" onSubmit={handleSave}>
        <h3 className="profile-form__title">Update encrypted fields</h3>
        <label className="device-form__field">
          <span>Phone number</span>
          <input
            value={phoneNumber}
            onChange={(event) => setPhoneNumber(event.target.value)}
            placeholder="+14155551234"
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={fieldErrors.phoneNumber ? true : undefined}
            aria-describedby={fieldErrors.phoneNumber ? 'profile-phone-error' : undefined}
          />
          {fieldErrors.phoneNumber ? (
            <span id="profile-phone-error" className="form-field-error">
              {fieldErrors.phoneNumber}
            </span>
          ) : (
            <span className="profile-field-hint">International E.164 format, e.g. +2348012345678</span>
          )}
        </label>

        <label className="device-form__field">
          <span>Date of birth</span>
          <input
            type="date"
            value={dateOfBirth}
            onChange={(event) => setDateOfBirth(event.target.value)}
            aria-invalid={fieldErrors.dateOfBirth ? true : undefined}
            aria-describedby={fieldErrors.dateOfBirth ? 'profile-dob-error' : undefined}
          />
          {fieldErrors.dateOfBirth ? (
            <span id="profile-dob-error" className="form-field-error">
              {fieldErrors.dateOfBirth}
            </span>
          ) : (
            <span className="profile-field-hint">Stored as YYYY-MM-DD and encrypted at rest</span>
          )}
        </label>

        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? 'Saving…' : 'Save profile'}
        </button>

        {apiError ? <p className="form-error">{apiError}</p> : null}
      </form>
    </div>
  );
}
