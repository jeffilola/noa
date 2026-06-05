import { createHash, randomBytes } from 'node:crypto';
import type { DataKey, KeyManagementProvider } from './key-management.port.js';

/** Dev/local KMS — stable 256-bit key from LOCAL_ENCRYPTION_SECRET for persistence across restarts. */
export class LocalKeyManagementProvider implements KeyManagementProvider {
  private readonly masterKey: Buffer;

  constructor(secret = process.env.LOCAL_ENCRYPTION_SECRET ?? 'noa-dev-local-secret-change-me') {
    this.masterKey = createHash('sha256').update(secret).digest();
  }

  async generateDataKey(): Promise<DataKey> {
    const encryptedKey = Buffer.from(`local:${this.masterKey.toString('base64')}`, 'utf8');
    return { plaintextKey: this.masterKey, encryptedKey, keyVersion: 1 };
  }

  async decryptDataKey(_encryptedKey: Buffer, _keyVersion: number): Promise<Buffer> {
    return this.masterKey;
  }
}

export function generateRandomIv(): Buffer {
  return randomBytes(12);
}
