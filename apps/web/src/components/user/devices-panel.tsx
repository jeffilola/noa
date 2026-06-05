'use client';

import { useState } from 'react';
import type { UserDevice } from '@/lib/user-types';
import { useClientApi } from '@/lib/api-client';

export function DevicesPanel({ initialDevices }: { initialDevices: UserDevice[] }) {
  const { fetch } = useClientApi();
  const [devices, setDevices] = useState(initialDevices);
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('ios');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const device = await fetch<UserDevice>('/devices', {
        method: 'POST',
        body: JSON.stringify({ name, platform }),
      });
      setDevices((current) => [device, ...current]);
      setName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not register device');
    } finally {
      setPending(false);
    }
  }

  async function handleDeactivate(deviceId: string) {
    setPending(true);
    setError(null);

    try {
      await fetch(`/devices/${deviceId}`, { method: 'DELETE' });
      setDevices((current) =>
        current.map((device) =>
          device.id === deviceId ? { ...device, isActive: false } : device,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not deactivate device');
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="content-stack">
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
            {pending ? 'Saving…' : 'Register device'}
          </button>
        </form>
        {error ? <p className="form-error">{error}</p> : null}
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
                  {device.platform}
                  {device.lastSeenAt
                    ? ` · Last seen ${new Date(device.lastSeenAt).toLocaleDateString()}`
                    : ''}
                </span>
              </div>
              <div className="device-row__actions">
                <span className={`badge ${device.isActive ? 'badge-active' : 'badge-muted'}`}>
                  {device.isActive ? 'Active' : 'Inactive'}
                </span>
                {device.isActive ? (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    disabled={pending}
                    onClick={() => handleDeactivate(device.id)}
                  >
                    Deactivate
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
