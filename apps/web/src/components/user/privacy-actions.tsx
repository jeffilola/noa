'use client';

import { useState } from 'react';
import { useClientApi } from '@/lib/api-client';

export function PrivacyActions() {
  const { fetch } = useClientApi();
  const [pending, setPending] = useState<'export' | 'delete' | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    setPending('export');
    setMessage(null);
    setError(null);

    try {
      const data = await fetch<Record<string, unknown>>('/gdpr/export');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `noa-export-${new Date().toISOString().slice(0, 10)}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      setMessage('Your data export download started.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setPending(null);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      'Delete your account data? Credentials will be revoked and PII anonymized. This cannot be undone.',
    );
    if (!confirmed) return;

    setPending('delete');
    setMessage(null);
    setError(null);

    try {
      await fetch('/gdpr/me', { method: 'DELETE' });
      setMessage('Deletion requested. You may be signed out shortly.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deletion failed');
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="content-stack">
      <div className="card">
        <h2 className="dashboard-section-title">Export your data</h2>
        <p className="dashboard-muted">
          Download a JSON copy of your profile, memberships, credentials, devices, and wallet passes.
          Every export is logged in the audit trail.
        </p>
        <button
          type="button"
          className="btn btn-primary"
          disabled={pending !== null}
          onClick={handleExport}
        >
          {pending === 'export' ? 'Preparing export…' : 'Download my data'}
        </button>
      </div>

      <div className="card dashboard-danger">
        <h2 className="dashboard-section-title">Delete account</h2>
        <p className="dashboard-muted">
          Revoke active credentials, anonymize encrypted PII, and remove your holder record. Required
          for GDPR right-to-erasure requests.
        </p>
        <button
          type="button"
          className="btn btn-ghost"
          disabled={pending !== null}
          onClick={handleDelete}
        >
          {pending === 'delete' ? 'Processing…' : 'Request deletion'}
        </button>
      </div>

      {message ? <div className="callout"><p>{message}</p></div> : null}
      {error ? (
        <div className="callout callout-warning" role="alert">
          <p>{error}</p>
        </div>
      ) : null}
    </div>
  );
}
