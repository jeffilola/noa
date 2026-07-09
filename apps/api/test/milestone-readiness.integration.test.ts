import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@noa/database';
import { ensureComplianceRecordsForUser } from '@noa/database';
import { AuditService } from '../src/audit/audit.service';
import { RbacService } from '../src/auth/rbac.service';
import { IntegrationsService } from '../src/integrations/integrations.service';
import { OrganizationService } from '../src/organizations/organization.service';
import { UserService } from '../src/users/user.service';

const prisma = new PrismaClient();
const audit = new AuditService(prisma as never);
const rbac = new RbacService(prisma as never);
const orgs = new OrganizationService(prisma as never, audit, rbac);
const integrations = new IntegrationsService(prisma as never, audit, {} as never);
const users = new UserService({} as never, prisma as never);

const TEST_ORG_ID = 'test-org-milestone-readiness';
const TEST_USER_ID = 'test-user-milestone-readiness';

describe('Milestone readiness services', () => {
  let dbAvailable = false;

  before(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbAvailable = true;
    } catch {
      console.warn('Skipping milestone readiness integration tests — database not available');
      return;
    }

    await prisma.organization.upsert({
      where: { id: TEST_ORG_ID },
      update: { name: 'Milestone Readiness Org', slug: 'milestone-readiness-org' },
      create: {
        id: TEST_ORG_ID,
        name: 'Milestone Readiness Org',
        slug: 'milestone-readiness-org',
        settings: {
          issuancePolicy: { defaultMode: 'pacs_led', allowNoaIssuanceForTypes: ['hotel_key'] },
        },
      },
    });

    await prisma.user.upsert({
      where: { id: TEST_USER_ID },
      update: {},
      create: { id: TEST_USER_ID, clerkUserId: 'clerk_test_milestone_readiness' },
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
  });

  after(async () => {
    if (dbAvailable) {
      await prisma.complianceRecord.deleteMany({
        where: { organizationId: TEST_ORG_ID },
      });
      await prisma.membership.deleteMany({ where: { organizationId: TEST_ORG_ID } });
      await prisma.organization.deleteMany({ where: { id: TEST_ORG_ID } });
      await prisma.user.deleteMany({ where: { id: TEST_USER_ID } });
    }
    await prisma.$disconnect();
  });

  it('seeds and lists compliance records for org access decisions', async (t) => {
    if (!dbAvailable) return t.skip('database not available');

    await ensureComplianceRecordsForUser(prisma, TEST_ORG_ID, TEST_USER_ID);

    const records = await orgs.listComplianceRecords(TEST_ORG_ID, TEST_USER_ID, TEST_USER_ID, true);

    assert.equal(records.length, 2);
    assert.ok(records.some((record) => record.recordType === 'training'));
    assert.ok(records.some((record) => record.recordType === 'certification'));
  });

  it('lists holder compliance records for the signed-in user', async (t) => {
    if (!dbAvailable) return t.skip('database not available');

    await ensureComplianceRecordsForUser(prisma, TEST_ORG_ID, TEST_USER_ID);

    const records = await users.listComplianceRecords(TEST_USER_ID);

    assert.equal(records.length, 2);
    assert.ok(records.every((record) => record.userId === TEST_USER_ID));
    assert.ok(records.every((record) => record.organization?.name === 'Milestone Readiness Org'));
  });

  it('lists platform organizations with search counts', async (t) => {
    if (!dbAvailable) return t.skip('database not available');

    const organizations = await orgs.listPlatformOrganizations('readiness');

    const org = organizations.find((entry) => entry.id === TEST_ORG_ID);
    assert.ok(org);
    assert.equal(org.memberCount, 1);
  });

  it('validates integration settings without storing credentials', () => {
    const result = integrations.validateTestModeConnection({
      providerId: 'hid_origo',
      apiBaseUrl: 'https://api.origo.test',
      mode: 'test',
    });

    assert.equal(result.ok, true);
    assert.match(result.message, /No provider keys were stored/);
  });

  it('rejects non-https integration test URLs', () => {
    assert.throws(
      () =>
        integrations.validateTestModeConnection({
          providerId: 'hid_origo',
          apiBaseUrl: 'http://localhost:3000',
        }),
      BadRequestException,
    );
  });
});
