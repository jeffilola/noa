import { auth } from '@clerk/nextjs/server';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const { getToken, userId } = await auth();

  if (!userId) {
    throw new Error(`API ${path} failed: not signed in`);
  }

  const token = await getToken();

  const headers = new Headers(init?.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let res: Response;

  try {
    res = await fetch(`${API}${path}`, {
      cache: 'no-store',
      ...init,
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
