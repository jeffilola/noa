import type { ICredentialProvider, OrgProviderConfig } from '@noa/domain';
import { brivoAdapter } from './brivo/brivo.adapter.js';
import { hidOrigoAdapter } from './hid-origo/hid-origo.adapter.js';
import { lenelS2Adapter } from './lenel-s2/lenel-s2.adapter.js';

export class AdapterRegistry {
  private readonly adapters = new Map<string, ICredentialProvider>();

  constructor() {
    this.register(hidOrigoAdapter);
    this.register(brivoAdapter);
    this.register(lenelS2Adapter);
  }

  register(adapter: ICredentialProvider): void {
    this.adapters.set(adapter.adapterKey, adapter);
  }

  get(adapterKey: string): ICredentialProvider | undefined {
    return this.adapters.get(adapterKey);
  }

  require(adapterKey: string): ICredentialProvider {
    const adapter = this.get(adapterKey);
    if (!adapter) {
      throw new Error(`No adapter registered for key: ${adapterKey}`);
    }
    return adapter;
  }
}

export const adapterRegistry = new AdapterRegistry();

export interface ProviderConnectionRecord {
  connectionId: string;
  adapterKey: string;
  apiBaseUrl: string;
  credentialsEnc: string;
  credentialsIv: string;
}

export class ProviderIntegrationService {
  constructor(private readonly registry: AdapterRegistry = adapterRegistry) {}

  resolveAdapter(adapterKey: string): ICredentialProvider {
    return this.registry.require(adapterKey);
  }

  buildConfig(connection: ProviderConnectionRecord): OrgProviderConfig {
    return {
      connectionId: connection.connectionId,
      apiBaseUrl: connection.apiBaseUrl,
      credentials: {},
    };
  }
}

export const providerIntegrationService = new ProviderIntegrationService();
