'use client';

import { useAuth } from '@clerk/nextjs';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

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

  const res = await fetch(`${API}${path}`, { ...init, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `API ${path} failed: ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export function useClientApi() {
  const { getToken } = useAuth();

  return {
    fetch: <T>(path: string, init?: RequestInit) => clientApiFetch<T>(path, getToken, init),
  };
}
