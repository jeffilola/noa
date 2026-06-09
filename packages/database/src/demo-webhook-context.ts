import type { PrismaClient } from '@prisma/client';
import { resolveDemoClerkUserId } from './holder-demo-seed';

export type DemoWebhookContext = {
  orgId: string;
  userId: string;
  orgName: string;
  clerkUserId: string;
  source: string;
};

function isClerkUserId(value: string | undefined): value is string {
  return Boolean(value?.startsWith('user_'));
}

async function lookupUserByClerkId(prisma: PrismaClient, clerkUserId: string) {
  let user = await prisma.user.findUnique({ where: { clerkUserId } });
  if (!user && clerkUserId !== 'user_demo_holder') {
    user = await prisma.user.findUnique({ where: { clerkUserId: 'user_demo_holder' } });
  }
  return user;
}

/** Holder for local mock webhook posts — prefers the signed-in demo org member. */
export async function resolveDemoWebhookContext(
  prisma: PrismaClient,
  options?: { clerkUserId?: string },
): Promise<DemoWebhookContext> {
  const org = await prisma.organization.findUnique({ where: { slug: 'demo-org' } });
  if (!org) {
    throw new Error('Demo organization (slug demo-org) not found. Run pnpm db:seed.');
  }

  const explicitClerkUserId = options?.clerkUserId?.trim();
  if (isClerkUserId(explicitClerkUserId)) {
    const user = await lookupUserByClerkId(prisma, explicitClerkUserId);
    if (!user) {
      throw new Error(
        `User not found for ${explicitClerkUserId}. Sign in once in the web app or run pnpm db:seed.`,
      );
    }

    return {
      orgId: org.id,
      userId: user.id,
      orgName: org.name,
      clerkUserId: user.clerkUserId,
      source: 'explicit clerk user id',
    };
  }

  const recentHolder = await prisma.user.findFirst({
    where: {
      clerkUserId: { not: { startsWith: 'user_demo' } },
      memberships: { some: { organizationId: org.id, status: 'active' } },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (recentHolder) {
    return {
      orgId: org.id,
      userId: recentHolder.id,
      orgName: org.name,
      clerkUserId: recentHolder.clerkUserId,
      source: 'most recent demo-org member (matches typical browser session)',
    };
  }

  const { clerkUserId, source } = await resolveDemoClerkUserId(prisma);
  const user = await lookupUserByClerkId(prisma, clerkUserId);
  if (!user) {
    throw new Error(`Demo holder user not found for ${clerkUserId}. Run pnpm db:seed.`);
  }

  return {
    orgId: org.id,
    userId: user.id,
    orgName: org.name,
    clerkUserId: user.clerkUserId,
    source,
  };
}
