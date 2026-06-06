'use client';

import { useRef, useState } from 'react';
import { ApiErrorBanner, FormSuccessBanner } from '@/components/user/dashboard-primitives';
import { ApiClientError, useClientApi } from '@/lib/api-client';
import type { UserDevice } from '@/lib/user-types';

const PLATFORM_LABELS: Record<string, string> = {
  ios: 'iOS',
  android: 'Android',
  watchos: 'watchOS',
  wearos: 'Wear OS',
};

function platformLabel(platform: string) {
  return PLATFORM_LABELS[platform] ?? platform;
}

export function DevicesPanel({ initialDevices }: { initialDevices: UserDevice[] }) {
  const { fetch } = useClientApi();
  const feedbackRef = useRef<HTMLDivElement>(null);
  const [devices, setDevices] = useState(initialDevices);
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('ios');
  const [pending, setPending] = useState(false);
  const [confirmDeactivateId, setConfirmDeactivateId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function showFeedback(message: string | null, isError = false) {
    if (message && !isError) {
      setSuccessMessage(message);
      setError(null);
      requestAnimationFrame(() => {
        feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
      return;
    }

    setSuccessMessage(null);
    setError(message);
    if (message) {
      requestAnimationFrame(() => {
        feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }
  }

  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    showFeedback(null);

    try {
      const device = await fetch<UserDevice>('/devices', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), platform }),
      });
      setDevices((current) => [device, ...current]);
      setName('');
      showFeedback(`${device.name} registered for ${platformLabel(device.platform)} wallet and NFC presentation.`);
    } catch (err) {
      const message =
        err instanceof ApiClientError || err instanceof Error
          ? err.message
          : 'Could not register device.';
      showFeedback(message, true);
    } finally {
      setPending(false);
    }
  }

  async function handleDeactivate(deviceId: string) {
    const device = devices.find((entry) => entry.id === deviceId);
    if (!device) return;

    setPending(true);
    showFeedback(null);

    try {
      await fetch(`/devices/${deviceId}`, { method: 'DELETE' });
      setDevices((current) => current.filter((entry) => entry.id !== deviceId));
      setConfirmDeactivateId(null);
      showFeedback(`${device.name} deactivated. It will no longer present wallet passes or NFC credentials.`);
    } catch (err) {
      const message =
        err instanceof ApiClientError || err instanceof Error
          ? err.message
          : 'Could not deactivate device.';
      showFeedback(message, true);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="content-stack">
      <div ref={feedbackRef}>
        {successMessage ? <FormSuccessBanner message={successMessage} /> : null}
        {error ? <ApiErrorBanner message={error} /> : null}
      </div>

      <div className="card">
        <h2 className="dashboard-section-title">Register device</h2>
        <p className="dashboard-muted">
          Pair a phone or watch for wallet passes and NFC presentation.
        </p>
        <form className="device-form" onSubmit={handleRegister}>
          <label className="device-form__field">
            <span>Device name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="iPhone 16 Pro"
              required
            />
          </label>
          <label className="device-form__field">
            <span>Platform</span>
            <select value={platform} onChange={(event) => setPlatform(event.target.value)}>
              <option value="ios">iOS</option>
              <option value="android">Android</option>
              <option value="watchos">watchOS</option>
              <option value="wearos">Wear OS</option>
            </select>
          </label>
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending && !confirmDeactivateId ? 'Registering…' : 'Register device'}
          </button>
        </form>
      </div>

      {devices.length === 0 ? (
        <div className="card empty-state">
          <p>No devices registered yet. Add one above or pair from the Noa mobile app.</p>
        </div>
      ) : (
        <ul className="credential-list">
          {devices.map((device) => (
            <li key={device.id} className="credential-list-item">
              <div>
                <strong>{device.name}</strong>
                <span className="meta">
                  {platformLabel(device.platform)}
                  {device.lastSeenAt
                    ? ` · Last seen ${new Date(device.lastSeenAt).toLocaleDateString()}`
                    : ''}
                </span>
              </div>
              <div className="device-row__actions">
                <span className="badge badge-active">Active</span>
                {confirmDeactivateId === device.id ? (
                  <div className="device-confirm">
                    <span className="device-confirm__text">Deactivate {device.name}?</span>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      disabled={pending}
                      onClick={() => handleDeactivate(device.id)}
                    >
                      {pending ? 'Deactivating…' : 'Confirm'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      disabled={pending}
                      onClick={() => setConfirmDeactivateId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    disabled={pending}
                    onClick={() => {
                      setConfirmDeactivateId(device.id);
                      showFeedback(null);
                    }}
                  >
                    Deactivate
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
