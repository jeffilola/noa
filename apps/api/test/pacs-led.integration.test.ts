import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { ConflictException } from '@nestjs/common';
import { PrismaClient } from '@noa/database';
import { PacsIngestService } from '../src/pacs-ingest/pacs-ingest.service';
import { CredentialService } from '../src/credential/credential.service';
import { AuditService } from '../src/audit/audit.service';

const prisma = new PrismaClient();
const audit = new AuditService(prisma as never);
const pacsIngest = new PacsIngestService(prisma as never, audit);
const credentialService = new CredentialService(prisma as never, audit);

const TEST_ORG_ID = 'test-org-pacs';
const TEST_USER_ID = 'test-user-pacs';
const TEST_PROVIDER_ID = 'hid_origo';
const EXT_CRED_ID = 'origo-test-cred-001';

describe('PACS ingest integration', () => {
  let dbAvailable = false;

  before(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbAvailable = true;
    } catch {
      console.warn('Skipping PACS integration tests — database not available');
      return;
    }

    await prisma.credentialProvider.upsert({
      where: { id: TEST_PROVIDER_ID },
      update: {},
      create: {
        id: TEST_PROVIDER_ID,
        type: 'hid',
        name: 'HID Origo',
        adapterKey: 'hid_origo',
      },
    });

    await prisma.organization.upsert({
      where: { id: TEST_ORG_ID },
      update: {},
      create: {
        id: TEST_ORG_ID,
        name: 'Test Org',
        slug: 'test-org-pacs',
        settings: {
          issuancePolicy: { defaultMode: 'pacs_led', allowNoaIssuanceForTypes: ['hotel_key'] },
        },
      },
    });

    await prisma.user.upsert({
      where: { id: TEST_USER_ID },
      update: {},
      create: { id: TEST_USER_ID, clerkUserId: 'clerk_test_pacs' },
    });

    await prisma.organizationProviderConnection.upsert({
      where: {
        organizationId_providerId: {
          organizationId: TEST_ORG_ID,
          providerId: TEST_PROVIDER_ID,
        },
      },
      update: {},
      create: {
        organizationId: TEST_ORG_ID,
        providerId: TEST_PROVIDER_ID,
        status: 'active',
        apiBaseUrl: 'https://api.origo.test',
        credentialsEnc: 'enc',
        credentialsIv: 'iv',
      },
    });

    await prisma.accessEvent.deleteMany({
      where: { credential: { organizationId: TEST_ORG_ID, externalCredentialId: EXT_CRED_ID } },
    });
    await prisma.credentialAssignment.deleteMany({
      where: { credential: { organizationId: TEST_ORG_ID, externalCredentialId: EXT_CRED_ID } },
    });
    await prisma.credential.deleteMany({
      where: { organizationId: TEST_ORG_ID, externalCredentialId: EXT_CRED_ID },
    });
  });

  after(async () => {
    if (!dbAvailable) {
      await prisma.$disconnect();
      return;
    }
    await prisma.accessEvent.deleteMany({
      where: { credential: { organizationId: TEST_ORG_ID, externalCredentialId: EXT_CRED_ID } },
    });
    await prisma.credentialAssignment.deleteMany({
      where: { credential: { organizationId: TEST_ORG_ID, externalCredentialId: EXT_CRED_ID } },
    });
    await prisma.credential.deleteMany({
      where: { organizationId: TEST_ORG_ID, externalCredentialId: EXT_CRED_ID },
    });
    await prisma.$disconnect();
  });

  it('webhook ISSUED creates credential with issuanceSource PACS', async (t) => {
    if (!dbAvailable) return t.skip('database not available');
    const result = await pacsIngest.ingestHidOrigoEvents([
      {
        specversion: '1.0',
        type: 'com.hidglobal.origo.credentials.issued',
        source: 'origo',
        id: 'evt-issued-1',
        data: {
          organizationId: TEST_ORG_ID,
          origoCredentialId: EXT_CRED_ID,
          cardNumber: '90001',
          userId: TEST_USER_ID,
          credentialType: 'corporate_access',
        },
      },
    ]);

    assert.equal(result.processed, 1);
    const cred = await prisma.credential.findUnique({
      where: {
        organizationId_externalCredentialId: {
          organizationId: TEST_ORG_ID,
          externalCredentialId: EXT_CRED_ID,
        },
      },
    });
    assert.ok(cred);
    assert.equal(cred.issuanceSource, 'PACS');
    assert.equal(cred.cardNumber, '90001');
  });

  it('duplicate webhook is idempotent', async (t) => {
    if (!dbAvailable) return t.skip('database not available');
    const before = await prisma.credential.count({
      where: { organizationId: TEST_ORG_ID, externalCredentialId: EXT_CRED_ID },
    });

    await pacsIngest.ingestHidOrigoEvents([
      {
        specversion: '1.0',
        type: 'com.hidglobal.origo.credentials.issued',
        source: 'origo',
        id: 'evt-issued-2',
        data: {
          organizationId: TEST_ORG_ID,
          origoCredentialId: EXT_CRED_ID,
          cardNumber: '90001',
          userId: TEST_USER_ID,
        },
      },
    ]);

    const after = await prisma.credential.count({
      where: { organizationId: TEST_ORG_ID, externalCredentialId: EXT_CRED_ID },
    });
    assert.equal(before, after);
    assert.equal(after, 1);
  });

  it('POST /credentials/issue corporate_access returns 409 under pacs_led', async (t) => {
    if (!dbAvailable) return t.skip('database not available');
    await assert.rejects(
      () =>
        credentialService.issue({
          organizationId: TEST_ORG_ID,
          userId: TEST_USER_ID,
          providerId: TEST_PROVIDER_ID,
          type: 'corporate_access',
        }),
      (err: unknown) => {
        assert.ok(err instanceof ConflictException);
        const response = err.getResponse() as { message: string; issueInPacs: boolean };
        assert.equal(response.issueInPacs, true);
        return true;
      },
    );
  });
});
