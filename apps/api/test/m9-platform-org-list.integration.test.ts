import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { PrismaClient } from '@noa/database';
import { AuditService } from '../src/audit/audit.service';
import { RbacService } from '../src/auth/rbac.service';
import { OrganizationService } from '../src/organizations/organization.service';

const prisma = new PrismaClient();
const audit = new AuditService(prisma as never);
const rbac = new RbacService(prisma as never);
const orgs = new OrganizationService(prisma as never, audit, rbac);

const TEST_ORG_ID = 'test-org-m9-platform-list';
const TEST_USER_ID = 'test-user-m9-platform-list';

describe('M9 platform organization list', () => {
  let dbAvailable = false;

  before(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbAvailable = true;
    } catch {
      console.warn('Skipping M9 platform org list tests - database not available');
      return;
    }

    await prisma.organization.upsert({
      where: { id: TEST_ORG_ID },
      update: {
        name: 'M9 Platform Search Org',
        slug: 'm9-platform-search-org',
        clerkOrgId: 'org_m9_platform_search',
      },
      create: {
        id: TEST_ORG_ID,
        name: 'M9 Platform Search Org',
        slug: 'm9-platform-search-org',
        clerkOrgId: 'org_m9_platform_search',
      },
    });

    await prisma.user.upsert({
      where: { id: TEST_USER_ID },
      update: {},
      create: { id: TEST_USER_ID, clerkUserId: 'clerk_test_m9_platform_list' },
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
      await prisma.membership.deleteMany({ where: { organizationId: TEST_ORG_ID } });
      await prisma.organization.deleteMany({ where: { id: TEST_ORG_ID } });
      await prisma.user.deleteMany({ where: { id: TEST_USER_ID } });
    }
    await prisma.$disconnect();
  });

  it('lists platform organizations with search and counts', async (t) => {
    if (!dbAvailable) return t.skip('database not available');

    const organizations = await orgs.listPlatformOrganizations('platform-search');
    const org = organizations.find((entry) => entry.id === TEST_ORG_ID);

    assert.ok(org);
    assert.equal(org.memberCount, 1);
    assert.equal(org.credentialCount, 0);
    assert.equal(org.providerConnectionCount, 0);
  });
});
