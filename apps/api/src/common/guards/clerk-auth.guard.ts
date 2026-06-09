import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { ensureCombinedDemoForClerkUser } from '@noa/database';
import { AccessService } from '../../auth/access.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UserService } from '../../users/user.service';
import { getRequestContext, requestContextStorage } from '../request-context';
import type { AuthContext } from '../auth-context';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UserService,
    private readonly access: AccessService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const auth = await this.resolveAuth(req);
    req.auth = auth;

    const store = getRequestContext();
    if (store) {
      requestContextStorage.run(
        {
          ...store,
          actorUserId: auth.userId,
          clerkUserId: auth.clerkUserId,
          orgId: auth.organizationId,
        },
        () => undefined,
      );
    }

    return true;
  }

  private async resolveAuth(req: Request): Promise<AuthContext> {
    const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, '');

    if (process.env.CLERK_SECRET_KEY && bearer) {
      try {
        const { verifyToken } = await import('@clerk/backend');
        const payload = await verifyToken(bearer, {
          secretKey: process.env.CLERK_SECRET_KEY,
        });
        const clerkUserId = payload.sub;
        const clerkOrgId =
          (payload.o as { id?: string } | undefined)?.id ??
          (req.headers['x-org-id'] as string | undefined);

        let user = await this.prisma.user.findUnique({ where: { clerkUserId } });
        if (!user) {
          user = await this.syncUserFromClerk(clerkUserId);
        }

        if (process.env.NODE_ENV !== 'production') {
          await ensureCombinedDemoForClerkUser(this.prisma, clerkUserId).catch((error) => {
            console.warn('[ClerkAuthGuard] Dev combined demo bootstrap failed:', error);
          });
        }

        const resolved = await this.access.resolveForUser(user.id, {
          clerkOrgId,
          organizationId: req.headers['x-organization-id'] as string | undefined,
        });

        return this.toAuthContext(clerkUserId, resolved);
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('[ClerkAuthGuard] Token verification failed:', error);
        }
        throw new UnauthorizedException('Invalid Clerk token');
      }
    }

    const devUserId = req.headers['x-dev-user-id'] as string | undefined;
    if (devUserId) {
      const user = await this.prisma.user.findUnique({ where: { id: devUserId } });
      if (!user) throw new UnauthorizedException('Dev user not found');

      const resolved = await this.access.resolveForUser(user.id, {
        organizationId: req.headers['x-organization-id'] as string | undefined,
      });

      return this.toAuthContext(user.clerkUserId, resolved);
    }

    if (process.env.NODE_ENV !== 'production') {
      const devClerkUserId =
        (req.headers['x-dev-clerk-user-id'] as string | undefined)?.trim() ||
        process.env.DEV_DEFAULT_CLERK_USER_ID?.trim();

      if (devClerkUserId) {
        const user = await this.prisma.user.findUnique({ where: { clerkUserId: devClerkUserId } });
        if (user) {
          const resolved = await this.access.resolveForUser(user.id, {});
          return this.toAuthContext(user.clerkUserId, resolved);
        }
      }

      if (!process.env.CLERK_SECRET_KEY) {
        const user = await this.prisma.user.findUnique({ where: { clerkUserId: 'user_demo_holder' } });
        if (user) {
          const resolved = await this.access.resolveForUser(user.id, {});
          return this.toAuthContext(user.clerkUserId, resolved);
        }
      }
    }

    if (process.env.CLERK_SECRET_KEY) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization bearer token. Ensure apps/web/.env.local includes CLERK_SECRET_KEY from the same Clerk app as the API.',
      );
    }

    throw new UnauthorizedException('Authentication required');
  }

  private toAuthContext(
    clerkUserId: string,
    resolved: Awaited<ReturnType<AccessService['resolveForUser']>>,
  ): AuthContext {
    return {
      clerkUserId,
      userId: resolved.userId,
      organizationId: resolved.organizationId,
      orgId: resolved.organizationId,
      clerkOrgId: resolved.clerkOrgId,
      roles: resolved.roles,
      permissions: resolved.permissions,
      isReadOnly: resolved.isReadOnly,
      isPlatformAdmin: resolved.isPlatformAdmin,
    };
  }

  private async syncUserFromClerk(clerkUserId: string) {
    const { createClerkClient } = await import('@clerk/backend');
    const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
    const clerkUser = await clerk.users.getUser(clerkUserId);
    const email = clerkUser.emailAddresses.find(
      (entry) => entry.id === clerkUser.primaryEmailAddressId,
    )?.emailAddress;

    return this.users.upsertFromClerk({
      clerkUserId,
      firstName: clerkUser.firstName ?? undefined,
      lastName: clerkUser.lastName ?? undefined,
      email,
      phoneNumber: this.primaryPhone(clerkUser),
      dateOfBirth: this.dateOfBirthFromClerk(clerkUser),
    });
  }

  private primaryPhone(clerkUser: {
    phoneNumbers?: Array<{ id: string; phoneNumber: string }>;
    primaryPhoneNumberId?: string | null;
  }) {
    if (!clerkUser.phoneNumbers?.length) return undefined;
    const primary =
      clerkUser.phoneNumbers.find((entry) => entry.id === clerkUser.primaryPhoneNumberId) ??
      clerkUser.phoneNumbers[0];
    return primary?.phoneNumber;
  }

  private dateOfBirthFromClerk(clerkUser: { unsafeMetadata?: Record<string, unknown> }) {
    const metadata = clerkUser.unsafeMetadata ?? {};
    const value = metadata.dateOfBirth ?? metadata.birthday ?? metadata.date_of_birth;
    return typeof value === 'string' && value.trim() ? value.trim() : undefined;
  }
}
