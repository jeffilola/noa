'use client';

import { useEffect, useRef, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import type { ProfileFieldErrors } from '@noa/shared';
import { validateProfileDateOfBirth, validateProfilePhone } from '@noa/shared';
import { FormSuccessBanner } from '@/components/user/dashboard-primitives';
import { ApiClientError, useClientApi } from '@/lib/api-client';
import { useAutoDismiss } from '@/lib/use-auto-dismiss';
import type { UserProfile } from '@/lib/user-types';

interface ProfileRow {
  label: string;
  value?: string | null;
}

function ProfileRows({ rows }: { rows: ProfileRow[] }) {
  return (
    <dl className="dl-list">
      {rows.map((row) => (
        <div key={row.label} className="dl-row">
          <dt>{row.label}</dt>
          <dd>{row.value ? <span>{row.value}</span> : <span className="dashboard-muted">Not provided</span>}</dd>
        </div>
      ))}
    </dl>
  );
}

function ProfilePhotoId({ imageUrl, name }: { imageUrl?: string | null; name: string }) {
  return (
    <div className="profile-photo-id">
      <div className="profile-photo-id__frame" aria-hidden={!imageUrl}>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="profile-photo-id__image" />
        ) : (
          <span className="profile-photo-id__placeholder">{name.charAt(0).toUpperCase() || '?'}</span>
        )}
      </div>
      <div className="profile-photo-id__copy">
        <p className="profile-photo-id__label">Photo ID</p>
        <p className="dashboard-muted profile-photo-id__hint">
          {imageUrl
            ? 'Using your Clerk profile photo for now. Official badge photos from PACS sync are planned.'
            : 'Add a profile photo in your Clerk account, or wait for official badge photo sync from PACS.'}
        </p>
      </div>
    </div>
  );
}

function toDateInputValue(isoDate?: string | null) {
  if (!isoDate?.trim()) return '';
  const match = isoDate.trim().match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : '';
}

function displayName(firstName?: string | null, lastName?: string | null, email?: string | null) {
  const name = [firstName, lastName].filter(Boolean).join(' ');
  return name || email || 'Holder';
}

export function UserProfileCard({ noaProfile }: { noaProfile: UserProfile | null }) {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { fetch } = useClientApi();
  const successRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<UserProfile | null>(noaProfile);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [fieldErrors, setFieldErrors] = useState<ProfileFieldErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useAutoDismiss(successMessage, () => setSuccessMessage(null));
  useAutoDismiss(apiError, () => setApiError(null));

  useEffect(() => {
    if (!isLoaded || !user) return;
    setProfile(noaProfile);
    setPhoneNumber(noaProfile?.phoneNumber ?? user.primaryPhoneNumber?.phoneNumber ?? '');
    setDateOfBirth(toDateInputValue(noaProfile?.dateOfBirth));
  }, [isLoaded, noaProfile, user?.id, user?.primaryPhoneNumber?.phoneNumber]);

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

  const holderName = displayName(user.firstName, user.lastName, user.primaryEmailAddress?.emailAddress);

  const rows: ProfileRow[] = [
    { label: 'Full name', value: holderName },
    { label: 'Email', value: user.primaryEmailAddress?.emailAddress },
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
      setSuccessMessage('Contact details saved. Phone and date of birth are encrypted in Noa.');
      router.refresh();
      requestAnimationFrame(() => {
        successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
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
        Your visual identity and signed-in details. Contact fields below are stored encrypted in Noa.
      </p>

      <ProfilePhotoId imageUrl={user.imageUrl} name={holderName} />
      <ProfileRows rows={rows} />

      <form className="profile-form device-form" onSubmit={handleSave}>
        <h3 className="profile-form__title">Contact &amp; verification</h3>
        <p className="dashboard-muted profile-form__lede">
          Used for account verification and compliance. Not shown on your Photo ID card.
        </p>
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
          {pending ? 'Saving…' : 'Save contact details'}
        </button>

        {successMessage ? (
          <div ref={successRef}>
            <FormSuccessBanner message={successMessage} />
          </div>
        ) : null}

        {apiError ? <p className="form-error">{apiError}</p> : null}
      </form>
    </div>
  );
}
