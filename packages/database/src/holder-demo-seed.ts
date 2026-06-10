import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import {
  AccessEventDirection,
  AccessEventSource,
  CredentialStatus,
  CredentialType,
  IssuanceSource,
  type PrismaClient,
  type User,
} from '@prisma/client';
import { NoaRole } from '@noa/domain';

export const DEFAULT_HOLDER_CLERK_USER_ID = 'user_demo_holder';

const DEMO_ENV_KEYS = ['DEMO_CLERK_USER_ID', 'DEMO_HOLDER_CLERK_USER_ID', 'DEMO_ORG_ADMIN_CLERK_USER_ID'] as const;
const DEMO_ENV_FILES = ['packages/database/.env', 'apps/api/.env'] as const;

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

const COMPLIANCE_RECORDS = [
  {
    recordType: 'training',
    title: 'Site safety orientation',
    status: 'complete',
    issuedAt: new Date('2026-01-15T00:00:00.000Z'),
    expiresAt: new Date('2027-01-15T00:00:00.000Z'),
  },
  {
    recordType: 'certification',
    title: 'Electrical safety certification',
    status: 'valid',
    issuedAt: new Date('2026-02-01T00:00:00.000Z'),
    expiresAt: new Date('2027-02-01T00:00:00.000Z'),
  },
] as const;

function seedEmailHash(clerkUserId: string) {
  return `seed-${clerkUserId.replace(/[^a-zA-Z0-9-]/g, '').slice(-32)}`;
}

function loadEnvFile(path: string): Record<string, string> {
  if (!existsSync(path)) return {};

  const vars: Record<string, string> = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    vars[key] = value;
  }

  return vars;
}

function resolveClerkSecretKey(): string | undefined {
  const fromProcess = process.env.CLERK_SECRET_KEY?.trim();
  if (fromProcess) return fromProcess;

  const repoRoot = resolve(__dirname, '../..');
  for (const relPath of ['apps/api/.env', 'apps/web/.env.local']) {
    const key = loadEnvFile(resolve(repoRoot, relPath)).CLERK_SECRET_KEY?.trim();
    if (key) return key;
  }

  return undefined;
}

function isValidClerkUserId(value: string | undefined): value is string {
  if (!value?.startsWith('user_')) return false;
  if (value.includes('<') || value.includes('>')) return false;
  if (/your-clerk|example|xxxx/i.test(value)) return false;
  return true;
}

function readConfiguredDemoClerkUserId(): string | undefined {
  for (const key of DEMO_ENV_KEYS) {
    const fromProcess = process.env[key]?.trim();
    if (isValidClerkUserId(fromProcess)) return fromProcess;
  }

  const repoRoot = resolve(__dirname, '../..');
  for (const relPath of DEMO_ENV_FILES) {
    const vars = loadEnvFile(resolve(repoRoot, relPath));
    for (const key of DEMO_ENV_KEYS) {
      const fromFile = vars[key]?.trim();
      if (isValidClerkUserId(fromFile)) return fromFile;
    }
  }

  return undefined;
}

async function fetchFirstClerkUserId(secretKey: string): Promise<string | undefined> {
  try {
    const res = await fetch('https://api.clerk.com/v1/users?limit=1&order_by=-created_at', {
      headers: { Authorization: `Bearer ${secretKey}` },
    });
    if (!res.ok) {
      console.warn(`[seed] Clerk users API returned ${res.status}`);
      return undefined;
    }

    const body = (await res.json()) as { data?: Array<{ id: string }> };
    if (!body.data?.[0]?.id) {
      console.warn('[seed] Clerk users API returned no users');
    }
    return body.data?.[0]?.id;
  } catch (error) {
    console.warn('[seed] Could not reach Clerk users API:', error);
    return undefined;
  }
}

export async function resolveDemoClerkUserId(
  prisma: PrismaClient,
): Promise<{ clerkUserId: string; source: string }> {
  const configured = readConfiguredDemoClerkUserId();
  if (configured) {
    return { clerkUserId: configured, source: 'DEMO_CLERK_USER_ID (or holder/org alias)' };
  }

  const signedInUser = await prisma.user.findFirst({
    where: {
      clerkUserId: {
        not: { startsWith: 'user_demo' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  if (signedInUser) {
    return {
      clerkUserId: signedInUser.clerkUserId,
      source: 'most recent signed-in user in database',
    };
  }

  const secretKey = resolveClerkSecretKey();
  if (secretKey) {
    const clerkUserId = await fetchFirstClerkUserId(secretKey);
    if (clerkUserId) {
      return { clerkUserId, source: 'Clerk API (most recent user)' };
    }
  }

  return { clerkUserId: DEFAULT_HOLDER_CLERK_USER_ID, source: 'default demo holder' };
}

/** @deprecated Use resolveDemoClerkUserId */
export const resolveHolderClerkUserId = resolveDemoClerkUserId;

async function seedHolderDemoAssets(
  prisma: PrismaClient,
  organizationId: string,
  holder: User,
) {
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

  await seedHolderAccessEvents(prisma, organizationId, holder.id);
  await seedComplianceRecords(prisma, organizationId, holder.id);
}

function startOfDayOffset(daysAgo: number, hour = 9, minute = 15) {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  date.setDate(date.getDate() - daysAgo);
  return date;
}

async function seedHolderAccessEvents(
  prisma: PrismaClient,
  organizationId: string,
  holderUserId: string,
) {
  const credential = await prisma.credential.findUnique({
    where: {
      organizationId_externalCredentialId: {
        organizationId,
        externalCredentialId: 'demo-seed-pacs-badge',
      },
    },
  });

  const demoEvents = [
    {
      externalEventId: 'demo-seed-access-main-yesterday',
      occurredAt: startOfDayOffset(1, 8, 42),
      locationLabel: 'Main entrance',
      readerLabel: 'Reader 101',
      direction: AccessEventDirection.entry,
    },
    {
      externalEventId: 'demo-seed-access-parking',
      occurredAt: startOfDayOffset(3, 17, 5),
      locationLabel: 'Parking gate',
      readerLabel: 'Reader P2',
      direction: AccessEventDirection.entry,
    },
    {
      externalEventId: 'demo-seed-access-main-week',
      occurredAt: startOfDayOffset(7, 7, 30),
      locationLabel: 'Main entrance',
      readerLabel: 'Reader 101',
      direction: AccessEventDirection.exit,
    },
  ] as const;

  for (const event of demoEvents) {
    await prisma.accessEvent.upsert({
      where: {
        organizationId_externalEventId: {
          organizationId,
          externalEventId: event.externalEventId,
        },
      },
      update: {
        occurredAt: event.occurredAt,
        locationLabel: event.locationLabel,
        readerLabel: event.readerLabel,
        direction: event.direction,
        userId: holderUserId,
        credentialId: credential?.id ?? null,
      },
      create: {
        organizationId,
        userId: holderUserId,
        credentialId: credential?.id ?? null,
        externalEventId: event.externalEventId,
        occurredAt: event.occurredAt,
        locationLabel: event.locationLabel,
        readerLabel: event.readerLabel,
        direction: event.direction,
        source: AccessEventSource.PACS,
      },
    });
  }
}

export async function seedHolderDemoData(
  prisma: PrismaClient,
  organizationId: string,
  holderClerkUserId: string,
) {
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

  await seedHolderDemoAssets(prisma, organizationId, holder);

  return {
    userId: holder.id,
    clerkUserId: holderClerkUserId,
    memberships: 1,
    credentials: HOLDER_CREDENTIALS.length,
    devices: HOLDER_DEVICES.length,
  };
}

async function ensureHolderAccessEvents(
  prisma: PrismaClient,
  organizationId: string,
  holderUserId: string,
) {
  const demoEventCount = await prisma.accessEvent.count({
    where: {
      userId: holderUserId,
      organizationId,
      externalEventId: { startsWith: 'demo-seed-access-' },
    },
  });
  if (demoEventCount >= 3) return;
  await seedHolderAccessEvents(prisma, organizationId, holderUserId);
}

async function seedComplianceRecords(
  prisma: PrismaClient,
  organizationId: string,
  holderUserId: string,
) {
  for (const record of COMPLIANCE_RECORDS) {
    await prisma.complianceRecord.upsert({
      where: {
        userId_organizationId_recordType_title: {
          userId: holderUserId,
          organizationId,
          recordType: record.recordType,
          title: record.title,
        },
      },
      update: {
        status: record.status,
        issuedAt: record.issuedAt,
        expiresAt: record.expiresAt,
        source: 'demo',
      },
      create: {
        userId: holderUserId,
        organizationId,
        recordType: record.recordType,
        title: record.title,
        status: record.status,
        issuedAt: record.issuedAt,
        expiresAt: record.expiresAt,
        source: 'demo',
      },
    });
  }
}

export async function ensureComplianceRecordsForUser(
  prisma: PrismaClient,
  organizationId: string,
  holderUserId: string,
) {
  if (process.env.NODE_ENV === 'production') return;
  await seedComplianceRecords(prisma, organizationId, holderUserId);
}

export async function ensureHolderDemoForClerkUser(
  prisma: PrismaClient,
  clerkUserId: string,
) {
  if (process.env.NODE_ENV === 'production') return;
  if (clerkUserId.startsWith('user_demo_')) return;

  const org = await prisma.organization.findUnique({ where: { slug: 'demo-org' } });
  if (!org) return;

  const holder = await prisma.user.findUnique({ where: { clerkUserId } });
  if (!holder) return;

  const activeAssignments = await prisma.credentialAssignment.count({
    where: { userId: holder.id, unassignedAt: null },
  });
  if (activeAssignments < HOLDER_CREDENTIALS.length) {
    await seedHolderDemoAssets(prisma, org.id, holder);
  } else {
    await ensureHolderAccessEvents(prisma, org.id, holder.id);
    await ensureComplianceRecordsForUser(prisma, org.id, holder.id);
  }

  const membership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: holder.id,
        organizationId: org.id,
      },
    },
  });

  if (!membership) {
    await prisma.membership.create({
      data: {
        userId: holder.id,
        organizationId: org.id,
        role: NoaRole.IDENTITY_HOLDER,
        status: 'active',
        joinedAt: new Date(),
      },
    });
  }
}

async function assignOrgScopedRole(
  prisma: PrismaClient,
  userId: string,
  organizationId: string,
  roleKey: string,
) {
  const role = await prisma.role.findUniqueOrThrow({ where: { key: roleKey } });

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
    update: { role: roleKey, status: 'active', joinedAt: new Date() },
    create: {
      userId,
      organizationId,
      role: roleKey,
      status: 'active',
      joinedAt: new Date(),
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId_scopeKey: {
        userId,
        roleId: role.id,
        scopeKey: organizationId,
      },
    },
    update: { revokedAt: null, grantedAt: new Date() },
    create: {
      userId,
      roleId: role.id,
      organizationId,
      scopeKey: organizationId,
    },
  });
}

export async function seedOrgAdminForClerkUser(
  prisma: PrismaClient,
  organizationId: string,
  clerkUserId: string,
) {
  if (!isValidClerkUserId(clerkUserId) || clerkUserId.startsWith('user_demo_')) {
    return null;
  }

  const user = await prisma.user.upsert({
    where: { clerkUserId },
    update: {},
    create: {
      clerkUserId,
      emailHash: seedEmailHash(clerkUserId),
    },
  });

  await assignOrgScopedRole(prisma, user.id, organizationId, NoaRole.ORG_ADMIN);

  return { userId: user.id, clerkUserId };
}

export async function seedCombinedDemoUser(
  prisma: PrismaClient,
  organizationId: string,
  clerkUserId: string,
) {
  if (!isValidClerkUserId(clerkUserId) || clerkUserId.startsWith('user_demo_')) {
    return null;
  }

  const holderDemo = await seedHolderDemoData(prisma, organizationId, clerkUserId);
  const orgAdminDemo = await seedOrgAdminForClerkUser(prisma, organizationId, clerkUserId);

  return { holderDemo, orgAdminDemo, clerkUserId };
}

export async function ensureOrgAdminForClerkUser(
  prisma: PrismaClient,
  clerkUserId: string,
) {
  if (process.env.NODE_ENV === 'production') return;
  if (clerkUserId.startsWith('user_demo_')) return;

  const org = await prisma.organization.findUnique({ where: { slug: 'demo-org' } });
  if (!org) return;

  await seedOrgAdminForClerkUser(prisma, org.id, clerkUserId);
}

export async function ensureCombinedDemoForClerkUser(
  prisma: PrismaClient,
  clerkUserId: string,
) {
  if (process.env.NODE_ENV === 'production') return;
  if (clerkUserId.startsWith('user_demo_')) return;

  await ensureHolderDemoForClerkUser(prisma, clerkUserId);
  await ensureOrgAdminForClerkUser(prisma, clerkUserId);
  await ensureHolderAccessEventsForClerkUser(prisma, clerkUserId);
  await ensureComplianceRecordsForClerkUser(prisma, clerkUserId);
}

export async function ensureHolderAccessEventsForClerkUser(
  prisma: PrismaClient,
  clerkUserId: string,
) {
  if (process.env.NODE_ENV === 'production') return;
  if (clerkUserId.startsWith('user_demo_')) return;

  const org = await prisma.organization.findUnique({ where: { slug: 'demo-org' } });
  if (!org) return;

  const holder = await prisma.user.findUnique({ where: { clerkUserId } });
  if (!holder) return;

  await ensureHolderAccessEvents(prisma, org.id, holder.id);
  await reconcileDevIngestEventsForUser(prisma, org.id, holder.id);
}

export async function ensureComplianceRecordsForClerkUser(
  prisma: PrismaClient,
  clerkUserId: string,
) {
  if (process.env.NODE_ENV === 'production') return;
  if (clerkUserId.startsWith('user_demo_')) return;

  const org = await prisma.organization.findUnique({ where: { slug: 'demo-org' } });
  if (!org) return;

  const holder = await prisma.user.findUnique({ where: { clerkUserId } });
  if (!holder) return;

  await ensureComplianceRecordsForUser(prisma, org.id, holder.id);
}

/** In dev, attach recent mock webhook events that used the demo badge but wrong user row. */
async function reconcileDevIngestEventsForUser(
  prisma: PrismaClient,
  organizationId: string,
  userId: string,
) {
  const assignment = await prisma.credentialAssignment.findFirst({
    where: {
      userId,
      organizationId,
      unassignedAt: null,
      credential: { cardNumber: 'DEMO-1001' },
    },
    select: { credentialId: true },
  });
  if (!assignment) return;

  await prisma.accessEvent.updateMany({
    where: {
      organizationId,
      userId: { not: userId },
      OR: [
        { externalEventId: { startsWith: 'demo-access-' } },
        { externalEventId: { startsWith: 'evt-' } },
      ],
    },
    data: {
      userId,
      credentialId: assignment.credentialId,
    },
  });
}
