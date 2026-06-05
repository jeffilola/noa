export type IssuanceMode = 'pacs_led' | 'noa_led';

export type CredentialTypeName =
  | 'corporate_access'
  | 'hotel_key'
  | 'gym_membership'
  | 'event_pass'
  | 'visitor_pass';

export interface IssuancePolicy {
  defaultMode: IssuanceMode;
  allowNoaIssuanceForTypes?: CredentialTypeName[];
}

export interface OrganizationSettings {
  issuancePolicy?: IssuancePolicy;
}

export const DEFAULT_ISSUANCE_POLICY: IssuancePolicy = {
  defaultMode: 'pacs_led',
  allowNoaIssuanceForTypes: ['hotel_key', 'gym_membership', 'event_pass', 'visitor_pass'],
};

export function parseOrganizationSettings(settings: unknown): OrganizationSettings {
  if (!settings || typeof settings !== 'object') {
    return { issuancePolicy: DEFAULT_ISSUANCE_POLICY };
  }
  const raw = settings as OrganizationSettings;
  return {
    issuancePolicy: {
      ...DEFAULT_ISSUANCE_POLICY,
      ...raw.issuancePolicy,
    },
  };
}

export function isPacsLedCorporateBlocked(
  type: CredentialTypeName,
  settings: OrganizationSettings,
): boolean {
  const policy = settings.issuancePolicy ?? DEFAULT_ISSUANCE_POLICY;
  return policy.defaultMode === 'pacs_led' && type === 'corporate_access';
}
