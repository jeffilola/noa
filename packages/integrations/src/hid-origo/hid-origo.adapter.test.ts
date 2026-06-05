import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { HidOrigoAdapter } from './hid-origo.adapter.js';
import { mapHidCloudEventToIngest } from './hid-origo-ingest.mapper.js';
import { PacsLedIssuanceNotAllowedError } from '@noa/domain';

describe('HidOrigoAdapter', () => {
  const adapter = new HidOrigoAdapter();
  const config = { connectionId: 'c1', apiBaseUrl: 'https://api.example.com', credentials: {} };

  it('throws PacsLedIssuanceNotAllowedError for corporate_access', async () => {
    await assert.rejects(
      () =>
        adapter.issue(
          { organizationId: 'org1', userId: 'u1', type: 'corporate_access' },
          config,
        ),
      PacsLedIssuanceNotAllowedError,
    );
  });
});

describe('mapHidCloudEventToIngest', () => {
  it('maps ISSUED event', () => {
    const result = mapHidCloudEventToIngest({
      specversion: '1.0',
      type: 'com.hidglobal.origo.credentials.issued',
      source: 'origo',
      id: 'evt-1',
      data: {
        organizationId: 'org-1',
        origoCredentialId: 'cred-123',
        cardNumber: '10001',
        userId: 'user-1',
      },
    });
    assert.equal(result?.action, 'issued');
    assert.equal(result?.externalCredentialId, 'cred-123');
  });
});
