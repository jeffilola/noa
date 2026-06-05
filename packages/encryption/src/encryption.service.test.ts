import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { EncryptionService } from './encryption.service.js';
import { LocalKeyManagementProvider } from './local-kms.provider.js';

describe('EncryptionService', () => {
  const service = new EncryptionService(new LocalKeyManagementProvider());
  const auditEvents: string[] = [];
  service.setAuditLogger(async (event) => {
    auditEvents.push(event.field);
  });

  it('encrypts and decrypts round-trip', async () => {
    const encrypted = await service.encrypt('Jane Doe', 'first_name');
    assert.ok(encrypted.ciphertext);
    assert.ok(encrypted.iv);
    assert.notEqual(encrypted.ciphertext, 'Jane Doe');

    auditEvents.length = 0;
    const plain = await service.decrypt(encrypted, 'first_name', {
      actorUserId: 'actor-1',
      resourceType: 'user',
      resourceId: 'user-1',
      purpose: 'user_profile_view',
    });
    assert.equal(plain, 'Jane Doe');
    assert.deepEqual(auditEvents, ['first_name']);
  });

  it('hashEmail is deterministic', async () => {
    const a = await service.hashEmail('Test@Example.com');
    const b = await service.hashEmail('test@example.com');
    assert.equal(a, b);
  });
});
