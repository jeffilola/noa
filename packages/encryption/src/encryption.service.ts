import { createCipheriv, createDecipheriv, createHmac, randomBytes } from 'node:crypto';
import { AwsKmsKeyManagementProvider } from './aws-kms.provider.js';
import type { KeyManagementProvider } from './key-management.port.js';
import type {
  DecryptContext,
  EncryptedField,
  PiiAuditLogger,
  PiiFieldName,
} from './types.js';

const ALGORITHM = 'aes-256-gcm';
const DEK_CACHE_TTL_MS = 5 * 60 * 1000;

interface CachedDek {
  key: Buffer;
  expiresAt: number;
}

export class EncryptionService {
  private readonly dekCache = new Map<number, CachedDek>();
  private auditLogger?: PiiAuditLogger;

  constructor(private readonly kms: KeyManagementProvider = new AwsKmsKeyManagementProvider()) {}

  setAuditLogger(logger: PiiAuditLogger): void {
    this.auditLogger = logger;
  }

  async encrypt(plaintext: string, field: PiiFieldName): Promise<EncryptedField> {
    const normalized = this.normalize(plaintext, field);
    const dataKey = await this.kms.generateDataKey();
    this.cacheDek(dataKey.keyVersion, dataKey.plaintextKey);

    const iv = randomBytes(12);
    const cipher = createCipheriv(ALGORITHM, dataKey.plaintextKey, iv);
    const encrypted = Buffer.concat([cipher.update(normalized, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    const ciphertext = Buffer.concat([encrypted, authTag]).toString('base64');

    return {
      ciphertext,
      iv: iv.toString('base64'),
      keyVersion: dataKey.keyVersion,
    };
  }

  async decrypt(
    encrypted: EncryptedField,
    field: PiiFieldName,
    context: DecryptContext,
  ): Promise<string> {
    const dek = await this.resolveDek(encrypted.keyVersion);
    const iv = Buffer.from(encrypted.iv, 'base64');
    const payload = Buffer.from(encrypted.ciphertext, 'base64');
    const authTag = payload.subarray(payload.length - 16);
    const ciphertext = payload.subarray(0, payload.length - 16);

    const decipher = createDecipheriv(ALGORITHM, dek, iv);
    decipher.setAuthTag(authTag);
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString(
      'utf8',
    );

    if (this.auditLogger) {
      await this.auditLogger({
        field,
        purpose: context.purpose,
        resourceType: context.resourceType,
        resourceId: context.resourceId,
        actorUserId: context.actorUserId,
        organizationId: context.organizationId,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
      });
    }

    return plaintext;
  }

  async hashEmail(normalizedEmail: string): Promise<string> {
    const secret = process.env.EMAIL_HASH_SECRET ?? 'noa-email-hash-secret';
    return createHmac('sha256', secret).update(normalizedEmail.toLowerCase().trim()).digest('hex');
  }

  normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  private normalize(value: string, field: PiiFieldName): string {
    const trimmed = value.trim();
    if (field === 'email') {
      return this.normalizeEmail(trimmed);
    }
    return trimmed;
  }

  private cacheDek(keyVersion: number, key: Buffer): void {
    this.dekCache.set(keyVersion, { key, expiresAt: Date.now() + DEK_CACHE_TTL_MS });
  }

  private async resolveDek(keyVersion: number): Promise<Buffer> {
    const cached = this.dekCache.get(keyVersion);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.key;
    }
    const dataKey = await this.kms.generateDataKey();
    this.cacheDek(dataKey.keyVersion, dataKey.plaintextKey);
    return dataKey.plaintextKey;
  }
}

export const encryptionService = new EncryptionService();
