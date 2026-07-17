'use client';

import { useCallback, useEffect, useState } from 'react';
import { ApiClientError, useClientApi } from '@/lib/api-client';
import type { ComplianceRecord } from '@/lib/org-data';
import { formatCredentialDate, statusBadgeClass } from '@/lib/user-dashboard';
import { ApiErrorBanner } from './dashboard-primitives';

function formatRecordType(recordType: string) {
  return recordType.replace(/_/g, ' ');
}

function formatDate(value: string | null) {
  return value ? formatCredentialDate(value) : '-';
}

export function HolderComplianceRecordsPanel({
  initialRecords,
  initialApiReachable,
}: {
  initialRecords: ComplianceRecord[];
  initialApiReachable: boolean;
}) {
  const { fetch } = useClientApi();
  const [records, setRecords] = useState(initialRecords);
  const [apiReachable, setApiReachable] = useState(initialApiReachable);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRecords(initialRecords);
    setApiReachable(initialApiReachable);
  }, [initialRecords, initialApiReachable]);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetch<ComplianceRecord[]>('/users/me/compliance-records', {
        cache: 'no-store',
      });
      setApiReachable(true);
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setApiReachable(false);
      setRecords([]);
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Could not load training and certification records.');
      }
    } finally {
      setLoading(false);
    }
  }, [fetch]);

  const emptyMessage = apiReachable
    ? 'No training or certification records are on file yet. Demo records are created by pnpm qa:prepare or when the holder demo bootstrap runs.'
    : 'Could not load training and certification records because the API is offline. Start the API and refresh this page.';

  return (
    <div className="content-stack">
      {error ? <ApiErrorBanner message={error} /> : null}

      <p>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          disabled={loading}
          onClick={() => void reload()}
        >
          {loading ? 'Refreshing...' : 'Refresh list'}
        </button>
      </p>

      {records.length === 0 ? (
        <div className="card empty-state">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="data-table-wrap card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Record</th>
                <th>Type</th>
                <th>Status</th>
                <th>Organization</th>
                <th>Issued</th>
                <th>Expires</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id}>
                  <td>{record.title}</td>
                  <td>{formatRecordType(record.recordType)}</td>
                  <td>
                    <span className={statusBadgeClass(record.status)}>{record.status}</span>
                  </td>
                  <td>{record.organization?.name ?? record.organizationId}</td>
                  <td>{formatDate(record.issuedAt)}</td>
                  <td>{formatDate(record.expiresAt)}</td>
                  <td>{record.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
