import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@noa/database';
import { AccessEventService } from '../src/access-events/access-event.service';
import { OrganizationService } from '../src/organizations/organization.service';
import { AuditService } from '../src/audit/audit.service';
import { RbacService } from '../src/auth/rbac.service';

const prisma = new PrismaClient();
const audit = new AuditService(prisma as never);
const rbac = new RbacService(prisma as never);
const orgs = new OrganizationService(prisma as never, audit, rbac);
const accessEvents = new AccessEventService(prisma as never, orgs);

const TEST_ORG_ID = 'test-org-access-events';
const TEST_USER_ID = 'test-user-access-events';
const TEST_CRED_ID = 'test-cred-access-events';
const EXT_EVENT_ID = 'pacs-access-event-001';

describe('Access event ingest integration', () => {
  let dbAvailable = false;

  before(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbAvailable = true;
    } catch {
      console.warn('Skipping access event integration tests — database not available');
      return;
    }

    await prisma.organization.upsert({
      where: { id: TEST_ORG_ID },
      update: {},
      create: {
        id: TEST_ORG_ID,
        name: 'Access Test Org',
        slug: 'test-org-access-events',
        settings: {
          issuancePolicy: { defaultMode: 'pacs_led', allowNoaIssuanceForTypes: ['hotel_key'] },
        },
      },
    });

    await prisma.user.upsert({
      where: { id: TEST_USER_ID },
      update: {},
      create: { id: TEST_USER_ID, clerkUserId: 'clerk_test_access_events' },
    });

    await prisma.membership.upsert({
      where: {
        userId_organizationId: {
          userId: TEST_USER_ID,
          organizationId: TEST_ORG_ID,
        },
      },
      update: { status: 'active' },
      create: {
        userId: TEST_USER_ID,
        organizationId: TEST_ORG_ID,
        role: 'identity_holder',
        status: 'active',
        joinedAt: new Date(),
      },
    });

    await prisma.credentialProvider.upsert({
      where: { id: 'hid_origo' },
      update: {},
      create: {
        id: 'hid_origo',
        type: 'hid',
        name: 'HID Origo',
        adapterKey: 'hid_origo',
      },
    });

    await prisma.credential.upsert({
      where: { id: TEST_CRED_ID },
      update: {},
      create: {
        id: TEST_CRED_ID,
        organizationId: TEST_ORG_ID,
        providerId: 'hid_origo',
        type: 'corporate_access',
        issuanceSource: 'PACS',
        status: 'active',
        externalCredentialId: 'access-test-badge',
        cardNumber: 'ACCESS-9001',
        label: 'Test badge',
      },
    });

    await prisma.credentialAssignment.upsert({
      where: {
        credentialId_userId: {
          credentialId: TEST_CRED_ID,
          userId: TEST_USER_ID,
        },
      },
      update: { unassignedAt: null },
      create: {
        credentialId: TEST_CRED_ID,
        userId: TEST_USER_ID,
        organizationId: TEST_ORG_ID,
      },
    });

    await prisma.accessEvent.deleteMany({
      where: { organizationId: TEST_ORG_ID, externalEventId: EXT_EVENT_ID },
    });
  });

  after(async () => {
    if (!dbAvailable) {
      await prisma.$disconnect();
      return;
    }

    await prisma.accessEvent.deleteMany({
      where: { organizationId: TEST_ORG_ID, externalEventId: EXT_EVENT_ID },
    });
    await prisma.$disconnect();
  });

  it('ingests access event by card number', async (t) => {
    if (!dbAvailable) return t.skip('database not available');

    const result = await accessEvents.ingestPacsAccessEvents([
      {
        organizationId: TEST_ORG_ID,
        externalEventId: EXT_EVENT_ID,
        occurredAt: new Date().toISOString(),
        locationLabel: 'Main entrance',
        readerLabel: 'Reader 101',
        direction: 'entry',
        cardNumber: 'ACCESS-9001',
      },
    ]);

    assert.equal(result.processed, 1);
    assert.equal(result.events[0]?.action, 'created');

    const stored = await prisma.accessEvent.findUnique({
      where: {
        organizationId_externalEventId: {
          organizationId: TEST_ORG_ID,
          externalEventId: EXT_EVENT_ID,
        },
      },
    });

    assert.ok(stored);
    assert.equal(stored.userId, TEST_USER_ID);
    assert.equal(stored.credentialId, TEST_CRED_ID);
    assert.equal(stored.locationLabel, 'Main entrance');
  });

  it('dedupes access events by externalEventId', async (t) => {
    if (!dbAvailable) return t.skip('database not available');

    const payload = {
      organizationId: TEST_ORG_ID,
      externalEventId: EXT_EVENT_ID,
      occurredAt: new Date().toISOString(),
      locationLabel: 'Side door',
      direction: 'exit' as const,
      userId: TEST_USER_ID,
    };

    const result = await accessEvents.ingestPacsAccessEvents([payload]);
    assert.equal(result.processed, 1);
    assert.equal(result.events[0]?.action, 'updated');

    const count = await prisma.accessEvent.count({
      where: { organizationId: TEST_ORG_ID, externalEventId: EXT_EVENT_ID },
    });
    assert.equal(count, 1);

    const stored = await prisma.accessEvent.findFirst({
      where: { organizationId: TEST_ORG_ID, externalEventId: EXT_EVENT_ID },
    });
    assert.equal(stored?.locationLabel, 'Side door');
  });

  it('rejects ingest without identity fields', async (t) => {
    if (!dbAvailable) return t.skip('database not available');

    await assert.rejects(
      () =>
        accessEvents.ingestPacsAccessEvents([
          {
            organizationId: TEST_ORG_ID,
            externalEventId: 'missing-identity',
            occurredAt: new Date().toISOString(),
            locationLabel: 'Lobby',
          },
        ]),
      BadRequestException,
    );
  });

  it('returns 404 for unknown organization', async (t) => {
    if (!dbAvailable) return t.skip('database not available');

    await assert.rejects(
      () =>
        accessEvents.ingestPacsAccessEvents([
          {
            organizationId: 'missing-org-id',
            externalEventId: 'evt-missing-org',
            occurredAt: new Date().toISOString(),
            locationLabel: 'Lobby',
            userId: TEST_USER_ID,
          },
        ]),
      NotFoundException,
    );
  });

  it('lists holder access events and summary', async (t) => {
    if (!dbAvailable) return t.skip('database not available');

    const holderEvents = await accessEvents.listForHolder(TEST_USER_ID, 10);
    assert.ok(holderEvents.some((event) => event.externalEventId === EXT_EVENT_ID));

    const summary = await accessEvents.getUserAccessSummary(
      TEST_ORG_ID,
      TEST_USER_ID,
      TEST_USER_ID,
      false,
    );
    assert.ok(summary.lastAccess);
    assert.equal(summary.lastAccess?.locationLabel, 'Side door');
    assert.ok(summary.recentCount >= 1);
  });
});
