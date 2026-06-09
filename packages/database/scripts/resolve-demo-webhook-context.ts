import { PrismaClient } from '@prisma/client';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

function loadEnvFile(path: string): Record<string, string> {
  if (!existsSync(path)) return {};
  const vars: Record<string, string> = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    vars[trimmed.slice(0, eq).trim()] = value;
  }
  return vars;
}

function resolveDemoClerkUserId(): string {
  for (const key of ['DEMO_CLERK_USER_ID', 'DEMO_HOLDER_CLERK_USER_ID']) {
    const fromProcess = process.env[key]?.trim();
    if (fromProcess?.startsWith('user_')) return fromProcess;
  }

  const envPath = resolve(__dirname, '../.env');
  const vars = loadEnvFile(envPath);
  for (const key of ['DEMO_CLERK_USER_ID', 'DEMO_HOLDER_CLERK_USER_ID']) {
    const value = vars[key]?.trim();
    if (value?.startsWith('user_')) return value;
  }

  return 'user_demo_holder';
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const org = await prisma.organization.findUnique({ where: { slug: 'demo-org' } });
    if (!org) {
      throw new Error('Demo organization (slug demo-org) not found. Run pnpm db:seed.');
    }

    const clerkUserId = resolveDemoClerkUserId();
    let user = await prisma.user.findUnique({ where: { clerkUserId } });
    if (!user) {
      user = await prisma.user.findUnique({ where: { clerkUserId: 'user_demo_holder' } });
    }
    if (!user) {
      throw new Error(`Demo holder user not found for ${clerkUserId}. Run pnpm db:seed.`);
    }

    console.log(
      JSON.stringify({
        orgId: org.id,
        userId: user.id,
        orgName: org.name,
        clerkUserId: user.clerkUserId,
      }),
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
