import { auth } from '@clerk/nextjs/server';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

export type ApiFetchInit = RequestInit & {
  organizationId?: string;
};

export async function apiFetch<T>(path: string, init?: ApiFetchInit): Promise<T> {
  const { organizationId, ...requestInit } = init ?? {};
  const { getToken, userId } = await auth();

  if (!userId) {
    throw new Error(`API ${path} failed: not signed in`);
  }

  const token = await getToken();

  const headers = new Headers(requestInit.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  } else if (process.env.CLERK_SECRET_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    throw new Error(
      `API ${path} failed: no Clerk session token. Add CLERK_SECRET_KEY to apps/web/.env.local (same Clerk app as apps/api/.env), then restart the web dev server.`,
    );
  }
  if (organizationId) {
    headers.set('x-organization-id', organizationId);
  }

  let res: Response;

  try {
    res = await fetch(`${API}${path}`, {
      cache: 'no-store',
      ...requestInit,
      headers,
    });
  } catch {
    throw new Error(`API ${path} failed: could not reach ${API}`);
  }

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error(`API ${path} failed: authentication rejected (401). Check that the API is running and Clerk keys match.`);
    }
    throw new Error(`API ${path} failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}
