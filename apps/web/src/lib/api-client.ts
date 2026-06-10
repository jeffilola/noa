'use client';

import { useAuth } from '@clerk/nextjs';
import { useCallback } from 'react';
import type { ApiErrorBody } from '@noa/shared';
import {
  normalizeProfilePhone,
  validateProfileDateOfBirth,
  validateProfilePhone,
  type ProfileFieldErrors,
} from '@noa/shared';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

export class ApiClientError extends Error {
  fieldErrors?: ProfileFieldErrors;

  constructor(message: string, fieldErrors?: ProfileFieldErrors) {
    super(message);
    this.name = 'ApiClientError';
    this.fieldErrors = fieldErrors;
  }
}

function parseApiError(text: string, status: number, path: string): ApiClientError {
  const fallback = text || `API ${path} failed: ${status}`;

  try {
    const body = JSON.parse(text) as Record<string, unknown>;
    let message = fallback;
    let fieldErrors: ProfileFieldErrors | undefined;

    const rawMessage = body.message;
    if (typeof rawMessage === 'string') {
      message = rawMessage;
    } else if (Array.isArray(rawMessage)) {
      message = rawMessage.map(String).join(', ');
    } else if (rawMessage && typeof rawMessage === 'object') {
      const nested = rawMessage as ApiErrorBody;
      if (typeof nested.message === 'string') {
        message = nested.message;
      }
      fieldErrors = nested.errors;
    }

    if (body.errors && typeof body.errors === 'object') {
      fieldErrors = body.errors as ProfileFieldErrors;
    }

    return new ApiClientError(message, fieldErrors);
  } catch {
    return new ApiClientError(fallback);
  }
}

export async function clientApiFetch<T>(
  path: string,
  getToken: () => Promise<string | null>,
  init?: RequestInit,
): Promise<T> {
  const token = await getToken();
  const headers = new Headers(init?.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  let res: Response;

  try {
    res = await fetch(`${API}${path}`, { ...init, headers });
  } catch {
    throw new ApiClientError(
      'Could not reach the Noa API. Start Postgres and run pnpm --filter @noa/api dev, then try again.',
    );
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw parseApiError(text, res.status, path);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export function useClientApi() {
  const { getToken } = useAuth();

  const fetch = useCallback(
    <T,>(path: string, init?: RequestInit) => clientApiFetch<T>(path, getToken, init),
    [getToken],
  );

  return { fetch };
}
