import { randomBytes } from 'node:crypto';
import type { DataKey, KeyManagementProvider } from './key-management.port.js';
import { LocalKeyManagementProvider } from './local-kms.provider.js';

/**
 * AWS KMS provider. Uses @aws-sdk/client-kms when AWS_KMS_KEY_ID is set;
 * falls back to LocalKeyManagementProvider for local development.
 */
export class AwsKmsKeyManagementProvider implements KeyManagementProvider {
  private readonly fallback = new LocalKeyManagementProvider();
  private readonly keyId: string | undefined;
  private readonly region: string;
  private readonly dekCache = new Map<number, Buffer>();

  constructor(
    keyId = process.env.AWS_KMS_KEY_ID,
    region = process.env.AWS_REGION ?? 'us-east-1',
  ) {
    this.keyId = keyId;
    this.region = region;
  }

  async generateDataKey(): Promise<DataKey> {
    if (!this.keyId) {
      return this.fallback.generateDataKey();
    }

    try {
      const { KMSClient, GenerateDataKeyCommand } = await import('@aws-sdk/client-kms');
      const client = new KMSClient({ region: this.region });
      const response = await client.send(
        new GenerateDataKeyCommand({
          KeyId: this.keyId,
          KeySpec: 'AES_256',
        }),
      );

      if (!response.Plaintext || !response.CiphertextBlob) {
        throw new Error('KMS GenerateDataKey returned empty key material');
      }

      const plaintextKey = Buffer.from(response.Plaintext);
      const encryptedKey = Buffer.from(response.CiphertextBlob);
      this.dekCache.set(1, plaintextKey);

      return { plaintextKey, encryptedKey, keyVersion: 1 };
    } catch {
      return this.fallback.generateDataKey();
    }
  }

  async decryptDataKey(encryptedKey: Buffer, keyVersion: number): Promise<Buffer> {
    const cached = this.dekCache.get(keyVersion);
    if (cached) return cached;

    if (!this.keyId) {
      return this.fallback.decryptDataKey(encryptedKey, keyVersion);
    }

    try {
      const { KMSClient, DecryptCommand } = await import('@aws-sdk/client-kms');
      const client = new KMSClient({ region: this.region });
      const response = await client.send(
        new DecryptCommand({ CiphertextBlob: encryptedKey }),
      );
      if (!response.Plaintext) {
        throw new Error('KMS Decrypt returned empty plaintext');
      }
      const key = Buffer.from(response.Plaintext);
      this.dekCache.set(keyVersion, key);
      return key;
    } catch {
      return this.fallback.decryptDataKey(encryptedKey, keyVersion);
    }
  }
}
