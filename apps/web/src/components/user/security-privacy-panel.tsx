'use client';

import { useClerk } from '@clerk/nextjs';
import { useState } from 'react';
import { FormSuccessBanner } from '@/components/user/dashboard-primitives';
import { useClientApi } from '@/lib/api-client';
import { formatCredentialDate } from '@/lib/user-dashboard';

const DELETE_CONFIRMATION = 'DELETE';

type GdprExportPayload = {
  profile: Record<string, unknown>;
  memberships: unknown[];
  assignments: unknown[];
  devices: unknown[];
  walletPasses: unknown[];
  exportedAt: string;
};

type ExportSummary = {
  filename: string;
  membershipCount: number;
  assignmentCount: number;
  deviceCount: number;
  walletPassCount: number;
  exportedAt: string;
};

function summarizeExport(data: GdprExportPayload): ExportSummary {
  const exportedAt = data.exportedAt ?? new Date().toISOString();
  return {
    filename: `noa-export-${formatCredentialDate(exportedAt)}.json`,
    membershipCount: data.memberships?.length ?? 0,
    assignmentCount: data.assignments?.length ?? 0,
    deviceCount: data.devices?.length ?? 0,
    walletPassCount: data.walletPasses?.length ?? 0,
    exportedAt,
  };
}

function downloadExport(data: GdprExportPayload, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function SecurityPrivacyPanel() {
  const { signOut } = useClerk();
  const { fetch } = useClientApi();
  const [pending, setPending] = useState<'export' | 'delete' | null>(null);
  const [exportSummary, setExportSummary] = useState<ExportSummary | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    setPending('export');
    setError(null);
    setExportSummary(null);

    try {
      const data = await fetch<GdprExportPayload>('/gdpr/export');
      const summary = summarizeExport(data);
      downloadExport(data, summary.filename);
      setExportSummary(summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed. Try again when the API is online.');
    } finally {
      setPending(null);
    }
  }

  async function handleDelete() {
    if (deleteConfirmText.trim() !== DELETE_CONFIRMATION) {
      setError(`Type ${DELETE_CONFIRMATION} to confirm account deletion.`);
      return;
    }

    setPending('delete');
    setError(null);

    try {
      await fetch('/gdpr/me', { method: 'DELETE' });
      setDeleteConfirmOpen(false);
      setDeleteConfirmText('');
      await signOut({ redirectUrl: '/' });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Deletion failed. Ensure the API is running and you are signed in.',
      );
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
          onClick={() => void handleExport()}
        >
          {pending === 'export' ? 'Preparing export…' : 'Download my data'}
        </button>
        {exportSummary ? (
          <div className="privacy-export-success">
            <FormSuccessBanner
              message={`Download started: ${exportSummary.filename} (${exportSummary.assignmentCount} credentials, ${exportSummary.deviceCount} devices, ${exportSummary.membershipCount} memberships, ${exportSummary.walletPassCount} wallet passes).`}
            />
          </div>
        ) : null}
      </div>

      <div className="card dashboard-danger">
        <h2 className="dashboard-section-title">Delete account</h2>
        <p className="dashboard-muted">
          Permanently erase your holder data from Noa. This action is audited and cannot be undone
          from the dashboard.
        </p>
        <ul className="dashboard-muted privacy-consequences">
          <li>Active credentials assigned to you will be revoked.</li>
          <li>Encrypted profile fields (name, email, phone) will be anonymized.</li>
          <li>Your holder record will be disabled until you sign in again.</li>
          <li>Signing in again with the same Clerk account creates a fresh holder profile.</li>
        </ul>

        {!deleteConfirmOpen ? (
          <button
            type="button"
            className="btn btn-ghost"
            disabled={pending !== null}
            onClick={() => {
              setDeleteConfirmOpen(true);
              setError(null);
            }}
          >
            Request deletion
          </button>
        ) : (
          <div className="privacy-delete-confirm device-form">
            <label className="device-form__field" htmlFor="delete-confirm">
              <span>
                Type <strong>{DELETE_CONFIRMATION}</strong> to confirm
              </span>
              <input
                id="delete-confirm"
                value={deleteConfirmText}
                autoComplete="off"
                disabled={pending === 'delete'}
                onChange={(event) => setDeleteConfirmText(event.target.value)}
              />
            </label>
            <div className="privacy-delete-confirm__actions">
              <button
                type="button"
                className="btn btn-ghost"
                disabled={pending === 'delete'}
                onClick={() => void handleDelete()}
              >
                {pending === 'delete' ? 'Deleting…' : 'Confirm deletion'}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={pending === 'delete'}
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setDeleteConfirmText('');
                  setError(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {error ? (
        <div className="callout callout-warning" role="alert">
          <p>{error}</p>
        </div>
      ) : null}
    </div>
  );
}

/** @deprecated Use SecurityPrivacyPanel */
export const PrivacyActions = SecurityPrivacyPanel;
