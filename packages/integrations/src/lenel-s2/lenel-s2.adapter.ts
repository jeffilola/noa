import type { ICredentialProvider, OrgProviderConfig, ProviderHealth } from '@noa/domain';

export interface CardholderReadResult {
  cardholderId: string;
  cardNumber?: string;
  metadata?: Record<string, unknown>;
}

export class LenelS2Adapter implements ICredentialProvider {
  readonly adapterKey = 'lenel_s2';

  /**
   * v1.1: Lenel Elements read API — sync cardholder/badge metadata.
   * TODO: Implement GET cardholder by ID against org-configured OpenAccess endpoint.
   */
  async readCardholder(_cardholderId: string, _config: OrgProviderConfig): Promise<CardholderReadResult | null> {
    return null;
  }

  async issue(): Promise<never> {
    throw new Error('LenelS2 write/issue not implemented in v1');
  }

  async revoke(): Promise<void> {
    // v2 write-back
  }

  async suspend(): Promise<void> {
    // v2 write-back
  }

  async activate(): Promise<void> {
    // v2 write-back
  }

  async testConnection(_config: OrgProviderConfig): Promise<ProviderHealth> {
    return { ok: true, message: 'LenelS2 read adapter stub (v1.1)' };
  }
}

export const lenelS2Adapter = new LenelS2Adapter();
