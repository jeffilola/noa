'use client';

import { FormEvent, useState } from 'react';
import { useAuth } from '@clerk/nextjs';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

type ValidationState =
  | { kind: 'idle'; message: string }
  | { kind: 'success'; message: string }
  | { kind: 'error'; message: string };

export function ProviderTestModeForm({ organizationId }: { organizationId: string }) {
  const { getToken } = useAuth();
  const [state, setState] = useState<ValidationState>({
    kind: 'idle',
    message: 'Enter test-mode provider settings to validate URL and provider selection.',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const token = await getToken();

    try {
      const response = await fetch(
        `${API}/organizations/${organizationId}/integrations/validate-test-mode`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            'x-organization-id': organizationId,
          },
          body: JSON.stringify({
            providerId: form.get('providerId'),
            apiBaseUrl: form.get('apiBaseUrl'),
            mode: 'test',
          }),
        },
      );

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(body?.message ?? `Validation failed: ${response.status}`);
      }

      const body = (await response.json()) as { message: string };
      setState({ kind: 'success', message: body.message });
    } catch (error) {
      setState({
        kind: 'error',
        message: error instanceof Error ? error.message : 'Validation failed.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="provider-test-form card" onSubmit={onSubmit}>
      <div>
        <label htmlFor="providerId">Provider</label>
        <select id="providerId" name="providerId" defaultValue="hid_origo">
          <option value="hid_origo">HID Origo</option>
          <option value="brivo">Brivo Access API</option>
          <option value="lenel_s2">LenelS2</option>
        </select>
      </div>

      <div>
        <label htmlFor="apiBaseUrl">Test API base URL</label>
        <input
          id="apiBaseUrl"
          name="apiBaseUrl"
          type="url"
          required
          defaultValue="https://api.origo.test"
          placeholder="https://api.provider.test"
        />
      </div>

      <div className="callout callout-warning">
        <p>
          Test mode validates shape only. Do not enter live API keys, client secrets, or production
          provider URLs.
        </p>
      </div>

      <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Validating...' : 'Validate test settings'}
      </button>

      <p
        className={`provider-test-form__status provider-test-form__status--${state.kind}`}
        role={state.kind === 'error' ? 'alert' : 'status'}
      >
        {state.message}
      </p>
    </form>
  );
}
