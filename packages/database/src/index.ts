export { PrismaClient, Prisma } from '@prisma/client';
export {
  AccessEventDirection,
  AccessEventSource,
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
  AccessEvent,
  ComplianceRecord,
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
  ensureComplianceRecordsForClerkUser,
  ensureComplianceRecordsForUser,
  ensureCombinedDemoForClerkUser,
  ensureHolderAccessEventsForClerkUser,
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
