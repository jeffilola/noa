import { apiFetch } from '@/lib/api';
import type { UserCredential, UserDevice, UserMembership, UserProfile } from '@/lib/user-types';

export async function fetchUserDashboardData() {
  const [profileResult, membershipsResult, credentialsResult, devicesResult] = await Promise.all([
    apiFetch<UserProfile>('/users/me').catch(() => null),
    apiFetch<UserMembership[]>('/users/me/memberships').catch(() => [] as UserMembership[]),
    apiFetch<UserCredential[]>('/credentials').catch(() => [] as UserCredential[]),
    apiFetch<UserDevice[]>('/devices').catch(() => [] as UserDevice[]),
  ]);

  const apiReachable = profileResult !== null;

  return {
    profile: profileResult,
    memberships: membershipsResult,
    credentials: credentialsResult,
    devices: devicesResult,
    apiReachable,
  };
}
