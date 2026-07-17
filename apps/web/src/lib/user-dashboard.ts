import {
  FiCreditCard,
  FiFileText,
  FiHome,
  FiMapPin,
  FiShield,
  FiSmartphone,
  FiUser,
  FiUsers,
} from 'react-icons/fi';
import type { UserProfile } from '@/lib/user-types';

export function formatCredentialType(type: string) {
  return type.replace(/_/g, ' ');
}

/** Stable YYYY-MM-DD formatting for SSR + browser (avoids locale hydration mismatches). */
export function formatCredentialDate(value: string) {
  const trimmed = value.trim();
  const isoPrefix = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
  if (isoPrefix) return isoPrefix[1];

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return trimmed;

  return parsed.toISOString().slice(0, 10);
}

export function displayName(profile: UserProfile | null) {
  if (!profile) return 'Holder';
  const name = [profile.firstName, profile.lastName].filter(Boolean).join(' ');
  return name || profile.email || 'Holder';
}

export function sourceBadgeClass(source: string) {
  return source.toUpperCase() === 'PACS' ? 'badge badge-pacs' : 'badge badge-noa';
}

export function statusBadgeClass(status: string) {
  const normalized = status.toLowerCase();
  if (normalized === 'active') return 'badge badge-active';
  if (normalized === 'revoked') return 'badge badge-muted';
  if (normalized === 'suspended') return 'badge badge-muted';
  return 'badge badge-muted';
}

export const identitySubNav = [
  { href: '/user/identity#profile', label: 'User profile', hash: 'profile', icon: FiUser },
  { href: '/user/identity#organizations', label: 'Organizations', hash: 'organizations', icon: FiUsers },
  { href: '/user/identity#credentials', label: 'Credentials', hash: 'credentials', icon: FiCreditCard },
  { href: '/user/identity#devices', label: 'Devices', hash: 'devices', icon: FiSmartphone },
] as const;

export const userNavLinks = [
  { href: '/user', label: 'Overview', icon: FiHome },
  { href: '/user/identity', label: 'My Identity', subNav: identitySubNav, icon: FiUser },
  { href: '/user/wallet', label: 'Wallet preview', icon: FiCreditCard },
  { href: '/user/access', label: 'Site access', icon: FiMapPin },
  { href: '/user/compliance', label: 'Training & certs', icon: FiFileText },
  { href: '/user/security', label: 'Security', icon: FiShield },
] as const;
