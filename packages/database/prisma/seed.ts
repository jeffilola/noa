import { PrismaClient, ProviderType } from '@prisma/client';
import { NoaRole } from '@noa/domain';

const prisma = new PrismaClient();

const DEFAULT_ISSUANCE_POLICY = {
  issuancePolicy: {
    defaultMode: 'pacs_led' as const,
    allowNoaIssuanceForTypes: ['hotel_key', 'gym_membership', 'event_pass', 'visitor_pass'],
  },
};

const providers = [
  {
    type: ProviderType.hid,
    name: 'HID Origo',
    adapterKey: 'hid_origo',
    apiSpecUrl: 'https://doc.origo.hidglobal.com/api/',
  },
  {
    type: ProviderType.brivo,
    name: 'Brivo Access API',
    adapterKey: 'brivo',
    apiSpecUrl: 'https://apidocs.brivo.com/access/',
  },
  {
    type: ProviderType.lenel_s2,
    name: 'LenelS2',
    adapterKey: 'lenel_s2',
    apiSpecUrl: 'https://www.lenels2.com/',
  },
  {
    type: ProviderType.internal,
    name: 'Noa Internal',
    adapterKey: 'internal',
    apiSpecUrl: null,
  },
];

async function syncRbacCatalog() {
  const { RBAC_PERMISSION_SEEDS, RBAC_ROLE_SEEDS } = await import('@noa/domain');

  for (const permission of RBAC_PERMISSION_SEEDS) {
    await prisma.permission.upsert({
      where: { key: permission.key },
      update: {
        name: permission.name,
        description: permission.description,
        category: permission.category,
      },
      create: {
        key: permission.key,
        name: permission.name,
        description: permission.description,
        category: permission.category,
      },
    });
  }

  for (const role of RBAC_ROLE_SEEDS) {
    const roleRecord = await prisma.role.upsert({
      where: { key: role.key },
      update: {
        name: role.name,
        description: role.description,
        scope: role.scope,
        isSystem: true,
      },
      create: {
        key: role.key,
        name: role.name,
        description: role.description,
        scope: role.scope,
        isSystem: true,
      },
    });

    for (const permissionKey of role.permissionKeys) {
      const permission = await prisma.permission.findUniqueOrThrow({
        where: { key: permissionKey },
      });

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: roleRecord.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: roleRecord.id,
          permissionId: permission.id,
        },
      });
    }
  }
}

async function assignRole(userId: string, roleKey: string, organizationId?: string) {
  const role = await prisma.role.findUniqueOrThrow({ where: { key: roleKey } });
  const scopeKey = organizationId ?? '__platform__';

  await prisma.userRole.upsert({
    where: {
      userId_roleId_scopeKey: {
        userId,
        roleId: role.id,
        scopeKey,
      },
    },
    update: { revokedAt: null },
    create: {
      userId,
      roleId: role.id,
      organizationId,
      scopeKey,
    },
  });
}

async function main() {
  await syncRbacCatalog();

  for (const provider of providers) {
    await prisma.credentialProvider.upsert({
      where: { id: provider.adapterKey },
      update: {
        name: provider.name,
        type: provider.type,
        apiSpecUrl: provider.apiSpecUrl,
        isEnabled: true,
      },
      create: {
        id: provider.adapterKey,
        type: provider.type,
        name: provider.name,
        adapterKey: provider.adapterKey,
        apiSpecUrl: provider.apiSpecUrl,
        isEnabled: true,
      },
    });
  }

  const org = await prisma.organization.upsert({
    where: { slug: 'demo-org' },
    update: {},
    create: {
      name: 'Demo Organization',
      slug: 'demo-org',
      settings: DEFAULT_ISSUANCE_POLICY,
    },
  });

  const hidProvider = await prisma.credentialProvider.findFirstOrThrow({
    where: { adapterKey: 'hid_origo' },
  });

  const demoUsers = [
    { clerkUserId: 'user_demo_holder', emailHash: 'demo-holder', role: null },
    { clerkUserId: 'user_demo_org_admin', emailHash: 'demo-org-admin', role: NoaRole.ORG_ADMIN },
    { clerkUserId: 'user_demo_security', emailHash: 'demo-security', role: NoaRole.SECURITY_ADMIN },
    { clerkUserId: 'user_demo_compliance', emailHash: 'demo-compliance', role: NoaRole.COMPLIANCE_AUDITOR },
    { clerkUserId: 'user_demo_integration', emailHash: 'demo-integration', role: NoaRole.INTEGRATION_ADMIN },
    { clerkUserId: 'user_demo_platform', emailHash: 'demo-platform', role: NoaRole.PLATFORM_ADMIN, platform: true },
  ] as const;

  for (const demo of demoUsers) {
    const user = await prisma.user.upsert({
      where: { clerkUserId: demo.clerkUserId },
      update: {
        isPlatformAdmin: 'platform' in demo ? demo.platform : false,
      },
      create: {
        clerkUserId: demo.clerkUserId,
        emailHash: demo.emailHash,
        isPlatformAdmin: 'platform' in demo ? demo.platform : false,
      },
    });

    if (demo.role && demo.role !== NoaRole.PLATFORM_ADMIN) {
      await prisma.membership.upsert({
        where: {
          userId_organizationId: {
            userId: user.id,
            organizationId: org.id,
          },
        },
        update: { status: 'active', role: demo.role, joinedAt: new Date() },
        create: {
          userId: user.id,
          organizationId: org.id,
          role: demo.role,
          status: 'active',
          joinedAt: new Date(),
        },
      });

      await assignRole(user.id, demo.role, org.id);
    }

    if (demo.role === NoaRole.PLATFORM_ADMIN) {
      await assignRole(user.id, NoaRole.PLATFORM_ADMIN);
    }
  }

  const primaryUser = await prisma.user.findUniqueOrThrow({
    where: { clerkUserId: 'user_demo_org_admin' },
  });

  await prisma.organizationProviderConnection.upsert({
    where: {
      organizationId_providerId: {
        organizationId: org.id,
        providerId: hidProvider.id,
      },
    },
    update: {},
    create: {
      organizationId: org.id,
      providerId: hidProvider.id,
      status: 'active',
      apiBaseUrl: 'https://api.origo.hidglobal.com',
      credentialsEnc: 'stub',
      credentialsIv: 'stub',
    },
  });

  console.log('Seed complete:', {
    orgId: org.id,
    demoUsers: demoUsers.map((entry) => entry.clerkUserId),
    primaryUserId: primaryUser.id,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
