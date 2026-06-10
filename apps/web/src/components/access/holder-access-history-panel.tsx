'use client';

import { useCallback, useEffect, useState } from 'react';
import { AccessEventsTable } from '@/components/access/access-events-table';
import { ApiErrorBanner } from '@/components/user/dashboard-primitives';
import { ApiClientError, useClientApi } from '@/lib/api-client';
import type { AccessEventRecord } from '@/lib/org-data';

export function HolderAccessHistoryPanel({
  initialEvents,
  initialApiReachable,
}: {
  initialEvents: AccessEventRecord[];
  initialApiReachable: boolean;
}) {
  const { fetch } = useClientApi();
  const [events, setEvents] = useState(initialEvents);
  const [apiReachable, setApiReachable] = useState(initialApiReachable);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEvents(initialEvents);
    setApiReachable(initialApiReachable);
  }, [initialEvents, initialApiReachable]);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetch<AccessEventRecord[]>('/users/me/access-events?limit=50', {
        cache: 'no-store',
      });
      setApiReachable(true);
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setApiReachable(false);
      setEvents([]);
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Could not load site access history.');
      }
    } finally {
      setLoading(false);
    }
  }, [fetch]);

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
          {loading ? 'Refreshing…' : 'Refresh list'}
        </button>
      </p>

      <AccessEventsTable
        events={events}
        showOrganization
        emptyMessage={
          apiReachable
            ? 'No access events for your account yet. Demo events are created when you open this page — click Refresh list. You can also run: node scripts/post-access-event.mjs'
            : 'Could not load access history because the API is offline. Start the API and refresh this page.'
        }
      />
    </div>
  );
}
