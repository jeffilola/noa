import type { CredentialTypeName } from '../organization/issuance-policy.js';

export interface OrgProviderConfig {
  connectionId: string;
  apiBaseUrl: string;
  credentials: Record<string, string>;
}

export interface IssueCredentialRequest {
  organizationId: string;
  userId: string;
  type: CredentialTypeName;
  label?: string;
  validFrom?: Date;
  validUntil?: Date;
  metadata?: Record<string, unknown>;
}

export interface IssueCredentialResult {
  externalCredentialId: string;
  cardNumber?: string;
  metadata?: Record<string, unknown>;
}

export interface ProviderHealth {
  ok: boolean;
  message?: string;
  latencyMs?: number;
}

export interface ICredentialProvider {
  readonly adapterKey: string;
  issue(request: IssueCredentialRequest, config: OrgProviderConfig): Promise<IssueCredentialResult>;
  revoke(externalId: string, config: OrgProviderConfig): Promise<void>;
  suspend(externalId: string, config: OrgProviderConfig): Promise<void>;
  activate(externalId: string, config: OrgProviderConfig): Promise<void>;
  testConnection(config: OrgProviderConfig): Promise<ProviderHealth>;
}
