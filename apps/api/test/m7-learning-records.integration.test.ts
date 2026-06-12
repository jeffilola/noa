import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PrismaClient } from '@noa/database';
import { ensureComplianceRecordsForUser } from '@noa/database';
import { AuditService } from '../src/audit/audit.service';
import { RbacService } from '../src/auth/rbac.service';
import { OrganizationService } from '../src/organizations/organization.service';

const prisma = new PrismaClient();
const audit = new AuditService(prisma as never);
const rbac = new RbacService(prisma as never);
const orgs = new OrganizationService(prisma as never, audit, rbac);

const TEST_ORG_ID = 'test-org-m7-learning-records';
const TEST_USER_ID = 'test-user-m7-learning-records';

describe('M7 learning records', () => {
  let dbAvailable = false;

  before(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbAvailable = true;
    } catch {
      console.warn('Skipping M7 learning records tests - database not available');
      return;
    }

    await prisma.organization.upsert({
      where: { id: TEST_ORG_ID },
      update: { name: 'M7 Learning Records Org', slug: 'm7-learning-records-org' },
      create: {
        id: TEST_ORG_ID,
        name: 'M7 Learning Records Org',
        slug: 'm7-learning-records-org',
      },
    });

    await prisma.user.upsert({
      where: { id: TEST_USER_ID },
      update: {},
      create: { id: TEST_USER_ID, clerkUserId: 'clerk_test_m7_learning_records' },
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
      await prisma.complianceRecord.deleteMany({ where: { organizationId: TEST_ORG_ID } });
      await prisma.membership.deleteMany({ where: { organizationId: TEST_ORG_ID } });
      await prisma.organization.deleteMany({ where: { id: TEST_ORG_ID } });
      await prisma.user.deleteMany({ where: { id: TEST_USER_ID } });
    }
    await prisma.$disconnect();
  });

  it('seeds and lists training and certification records for org access decisions', async (t) => {
    if (!dbAvailable) return t.skip('database not available');

    await ensureComplianceRecordsForUser(prisma, TEST_ORG_ID, TEST_USER_ID);
    await ensureComplianceRecordsForUser(prisma, TEST_ORG_ID, TEST_USER_ID);

    const records = await orgs.listComplianceRecords(TEST_ORG_ID, TEST_USER_ID, TEST_USER_ID, true);

    assert.equal(records.length, 2);
    assert.ok(records.some((record) => record.recordType === 'training'));
    assert.ok(records.some((record) => record.recordType === 'certification'));
  });
});
