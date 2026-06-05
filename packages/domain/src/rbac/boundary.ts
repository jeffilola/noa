/**
 * Noa responsibility boundary.
 *
 * Noa orchestrates identity, organization context, credential visibility,
 * lifecycle state, compliance, audit, and integrations — but never replaces
 * credential providers or PACS for physical access control configuration.
 */
export const NOA_MANAGES = [
  'Identity management',
  'Organization management',
  'Credential visibility',
  'Credential lifecycle orchestration',
  'Compliance',
  'Audit logging',
  'Integration management',
] as const;

/** Capabilities that remain with credential providers and PACS systems. */
export const PACS_PROVIDER_ONLY = [
  'doors',
  'readers',
  'access_levels',
  'access_schedules',
  'credential_issuance',
] as const;

/**
 * Permission prefixes and keys that must never appear in Noa RBAC.
 * Issuance is requested via credentials:provision:request, not performed in Noa.
 */
export const FORBIDDEN_PERMISSION_PATTERNS = [
  'doors:',
  'readers:',
  'access_levels:',
  'access_schedules:',
  'credentials:issue',
  'credentials:issue:',
] as const;

export function isForbiddenPermission(key: string): boolean {
  const normalized = key.toLowerCase();
  return FORBIDDEN_PERMISSION_PATTERNS.some(
    (pattern) => normalized === pattern || normalized.startsWith(pattern),
  );
}

export function assertNoaPermissionKey(key: string): void {
  if (isForbiddenPermission(key)) {
    throw new Error(
      `Permission "${key}" is outside Noa scope. Physical access and issuance remain with PACS/providers.`,
    );
  }
}
