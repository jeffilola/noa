import {
  PacsLedIssuanceNotAllowedError,
  type ICredentialProvider,
  type IssueCredentialRequest,
  type IssueCredentialResult,
  type OrgProviderConfig,
  type ProviderHealth,
} from '@noa/domain';

export class BrivoAdapter implements ICredentialProvider {
  readonly adapterKey = 'brivo';

  async issue(request: IssueCredentialRequest, _config: OrgProviderConfig): Promise<IssueCredentialResult> {
    if (request.type === 'corporate_access') {
      throw new PacsLedIssuanceNotAllowedError(
        'Brivo outbound issue is disabled for corporate_access in v1 (PACS-led).',
      );
    }
    // v2: POST /users/credentials/brivo-wallet-pass or digital invitations
    return {
      externalCredentialId: `brivo-stub-${Date.now()}`,
      metadata: { stub: true, track: request.type === 'hotel_key' ? 'wallet-pass' : 'mobile-pass' },
    };
  }

  async revoke(_externalId: string, _config: OrgProviderConfig): Promise<void> {}

  async suspend(_externalId: string, _config: OrgProviderConfig): Promise<void> {}

  async activate(_externalId: string, _config: OrgProviderConfig): Promise<void> {}

  async testConnection(_config: OrgProviderConfig): Promise<ProviderHealth> {
    return { ok: true, message: 'Brivo connection test stub (v1)' };
  }
}

export const brivoAdapter = new BrivoAdapter();
