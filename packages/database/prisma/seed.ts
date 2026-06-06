import {
  CredentialStatus,
  CredentialType,
  IssuanceSource,
  PrismaClient,
  ProviderType,
} from '@prisma/client';
import { NoaRole } from '@noa/domain';

const prisma = new PrismaClient();

const DEFAULT_ISSUANCE_POLICY = {
  issuancePolicy: {
    defaultMode: 'pacs_led' as const,
    allowNoaIssuanceForTypes: ['hotel_key', 'gym_membership', 'event_pass', 'visitor_pass'],
  },
};

const DEFAULT_HOLDER_CLERK_USER_ID = 'user_demo_holder';

const HOLDER_CREDENTIALS = [
  {
    externalCredentialId: 'demo-seed-pacs-badge',
    type: CredentialType.corporate_access,
    issuanceSource: IssuanceSource.PACS,
    providerAdapterKey: 'hid_origo',
    label: 'HQ Building Access',
    cardNumber: 'DEMO-1001',
  },
  {
    externalCredentialId: 'demo-seed-gym-pass',
    type: CredentialType.gym_membership,
    issuanceSource: IssuanceSource.NOA,
    providerAdapterKey: 'internal',
    label: 'Demo Gym Membership',
    cardNumber: 'DEMO-GYM-01',
  },
] as const;

const HOLDER_DEVICES = [
  { name: 'Demo iPhone', platform: 'ios' },
  { name: 'Demo Apple Watch', platform: 'watchos' },
] as const;

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

function seedEmailHash(clerkUserId: string) {
  return `seed-${clerkUserId.replace(/[^a-zA-Z0-9-]/g, '').slice(-32)}`;
}

async function seedHolderDemoData(organizationId: string, holderClerkUserId: string) {
  const holder = await prisma.user.upsert({
    where: { clerkUserId: holderClerkUserId },
    update: {},
    create: {
      clerkUserId: holderClerkUserId,
      emailHash: seedEmailHash(holderClerkUserId),
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: holder.id,
        organizationId,
      },
    },
    update: {
      status: 'active',
      role: NoaRole.IDENTITY_HOLDER,
      joinedAt: new Date(),
    },
    create: {
      userId: holder.id,
      organizationId,
      role: NoaRole.IDENTITY_HOLDER,
      status: 'active',
      joinedAt: new Date(),
    },
  });

  for (const spec of HOLDER_CREDENTIALS) {
    const provider = await prisma.credentialProvider.findFirstOrThrow({
      where: { adapterKey: spec.providerAdapterKey },
    });

    const credential = await prisma.credential.upsert({
      where: {
        organizationId_externalCredentialId: {
          organizationId,
          externalCredentialId: spec.externalCredentialId,
        },
      },
      update: {
        label: spec.label,
        cardNumber: spec.cardNumber,
        status: CredentialStatus.active,
        type: spec.type,
        issuanceSource: spec.issuanceSource,
        providerId: provider.id,
      },
      create: {
        organizationId,
        providerId: provider.id,
        type: spec.type,
        issuanceSource: spec.issuanceSource,
        status: CredentialStatus.active,
        externalCredentialId: spec.externalCredentialId,
        label: spec.label,
        cardNumber: spec.cardNumber,
        validFrom: new Date('2026-01-01T00:00:00.000Z'),
        validUntil: new Date('2027-12-31T00:00:00.000Z'),
      },
    });

    await prisma.credentialAssignment.upsert({
      where: {
        credentialId_userId: {
          credentialId: credential.id,
          userId: holder.id,
        },
      },
      update: { unassignedAt: null },
      create: {
        credentialId: credential.id,
        userId: holder.id,
        organizationId,
      },
    });
  }

  for (const device of HOLDER_DEVICES) {
    const existing = await prisma.device.findFirst({
      where: { userId: holder.id, name: device.name },
    });

    if (!existing) {
      await prisma.device.create({
        data: {
          userId: holder.id,
          name: device.name,
          platform: device.platform,
          lastSeenAt: new Date(),
        },
      });
      continue;
    }

    if (!existing.isActive) {
      await prisma.device.update({
        where: { id: existing.id },
        data: { isActive: true, lastSeenAt: new Date() },
      });
    }
  }

  return {
    userId: holder.id,
    clerkUserId: holderClerkUserId,
    memberships: 1,
    credentials: HOLDER_CREDENTIALS.length,
    devices: HOLDER_DEVICES.length,
  };
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

  const holderClerkUserId =
    process.env.DEMO_HOLDER_CLERK_USER_ID?.trim() || DEFAULT_HOLDER_CLERK_USER_ID;
  const holderDemo = await seedHolderDemoData(org.id, holderClerkUserId);

  console.log('Seed complete:', {
    orgId: org.id,
    demoOrgSlug: org.slug,
    demoUsers: demoUsers.map((entry) => entry.clerkUserId),
    primaryUserId: primaryUser.id,
    holderDemo,
    holderSeedNote:
      holderClerkUserId === DEFAULT_HOLDER_CLERK_USER_ID
        ? 'Set DEMO_HOLDER_CLERK_USER_ID in packages/database/.env to your Clerk user ID, then re-run pnpm db:seed'
        : `Holder demo data linked to Clerk user ${holderClerkUserId}`,
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
