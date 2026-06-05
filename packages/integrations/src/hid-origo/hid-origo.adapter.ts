import {
  PacsLedIssuanceNotAllowedError,
  type ICredentialProvider,
  type IssueCredentialRequest,
  type IssueCredentialResult,
  type OrgProviderConfig,
  type ProviderHealth,
} from '@noa/domain';

export class HidOrigoAdapter implements ICredentialProvider {
  readonly adapterKey = 'hid_origo';

  async issue(request: IssueCredentialRequest, _config: OrgProviderConfig): Promise<IssueCredentialResult> {
    if (request.type === 'corporate_access') {
      throw new PacsLedIssuanceNotAllowedError(
        'HID Origo outbound issue is disabled for corporate_access in v1 (PACS-led). Issue in Lenel Elements.',
      );
    }

    // v2: real HID Origo MA issue API call
    return {
      externalCredentialId: `hid-stub-${Date.now()}`,
      metadata: { stub: true, type: request.type },
    };
  }

  async revoke(_externalId: string, _config: OrgProviderConfig): Promise<void> {
    // v2: DELETE /credentials/{id}
  }

  async suspend(_externalId: string, _config: OrgProviderConfig): Promise<void> {
    // v2: suspend endpoint
  }

  async activate(_externalId: string, _config: OrgProviderConfig): Promise<void> {
    // v2: activate endpoint
  }

  async testConnection(_config: OrgProviderConfig): Promise<ProviderHealth> {
    return { ok: true, message: 'HID Origo connection test stub (v1 ingest-only)' };
  }
}

export const hidOrigoAdapter = new HidOrigoAdapter();
