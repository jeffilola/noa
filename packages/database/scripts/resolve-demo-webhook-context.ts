import { PrismaClient } from '@prisma/client';
import { resolveDemoWebhookContext } from '../src/demo-webhook-context';

async function main() {
  const prisma = new PrismaClient();
  try {
    const explicitClerkUserId =
      process.argv.find((arg) => arg.startsWith('--as='))?.slice('--as='.length) ??
      process.env.NOA_WEBHOOK_HOLDER_CLERK_USER_ID?.trim();

    const context = await resolveDemoWebhookContext(prisma, {
      clerkUserId: explicitClerkUserId,
    });

    console.log(JSON.stringify(context));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
