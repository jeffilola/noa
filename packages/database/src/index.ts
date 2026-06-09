export { PrismaClient, Prisma } from '@prisma/client';
export {
  AuditAction,
  ConnectionStatus,
  CredentialStatus,
  CredentialType,
  IssuanceSource,
  MembershipStatus,
  PermissionCategory,
  ProviderType,
  RoleScope,
  WalletPassStatus,
  WalletPlatform,
} from '@prisma/client';
export type {
  User,
  Organization,
  Credential,
  CredentialAssignment,
  CredentialProvider,
  AuditLog,
  OrganizationProviderConnection,
  WalletPass,
  PresentationToken,
  Device,
  Membership,
  Role,
  Permission,
  RolePermission,
  UserRole,
} from '@prisma/client';
export {
  ensureCombinedDemoForClerkUser,
  ensureHolderDemoForClerkUser,
  ensureOrgAdminForClerkUser,
  resolveDemoClerkUserId,
  resolveHolderClerkUserId,
  seedCombinedDemoUser,
  seedHolderDemoData,
  seedOrgAdminForClerkUser,
} from './holder-demo-seed';

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
