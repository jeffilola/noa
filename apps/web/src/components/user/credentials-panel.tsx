'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CredentialsGrid } from '@/components/user/credentials-grid';
import { EmptyPanel } from '@/components/user/dashboard-primitives';
import { useClientApi } from '@/lib/api-client';
import type { UserCredential } from '@/lib/user-types';

export function CredentialsPanel({
  initialCredentials,
  clerkUserId,
}: {
  initialCredentials: UserCredential[];
  clerkUserId?: string | null;
}) {
  const router = useRouter();
  const { fetch } = useClientApi();
  const [credentials, setCredentials] = useState(initialCredentials);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const next = await fetch<UserCredential[]>('/credentials');
      setCredentials(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load credentials.');
    } finally {
      setLoading(false);
    }
  }, [fetch, router]);

  useEffect(() => {
    setCredentials(initialCredentials);
  }, [initialCredentials]);

  const activeCount = credentials.filter((credential) => credential.status === 'active').length;
  const mockCredential = credentials.find(
    (credential) => credential.externalCredentialId === 'mock-origo-webhook-001',
  );

  return (
    <div className="content-stack">
      <div className="identity-section__toolbar">
        <p className="dashboard-muted">
          {credentials.length === 0
            ? 'Nothing loaded yet.'
            : `${activeCount} active · ${credentials.length} total`}
          {mockCredential ? ` · Mock badge is ${mockCredential.status}` : null}
        </p>
        <button type="button" className="btn btn-secondary btn-sm" disabled={loading} onClick={() => void reload()}>
          {loading ? 'Refreshing…' : 'Refresh list'}
        </button>
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      {credentials.length === 0 && !error ? (
        <EmptyPanel
          title="No credentials yet"
          body={
            clerkUserId
              ? `If you just ran the mock webhook script, click Refresh list above. The script assigns the mock badge to your most recent demo-org sign-in (${clerkUserId}). If you still see nothing, pass --as=${clerkUserId} when running the script.`
              : 'Corporate badges sync from your PACS via HID Origo webhooks once your organization connects a provider. After running the local mock webhook script, click Refresh list.'
          }
        />
      ) : null}

      {credentials.length > 0 ? <CredentialsGrid credentials={credentials} /> : null}
    </div>
  );
}
