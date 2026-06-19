import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, type Organization } from '@noa/database';
import { assertNoaRoleKey, NoaRole, parseOrganizationSettings, type NoaRoleKey } from '@noa/domain';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { RbacService } from '../auth/rbac.service';

export type PlatformOrganizationSearchField = 'all' | 'name' | 'clerkOrgId';
export type PlatformOrganizationFilter = 'all' | 'hasMembers' | 'hasCredentials' | 'hasProviders' | 'missingClerkOrg';
export type PlatformOrganizationSort = 'name' | 'updated';

export interface ListPlatformOrganizationsQuery {
  search?: string;
  field?: PlatformOrganizationSearchField;
  filter?: PlatformOrganizationFilter;
  sort?: PlatformOrganizationSort;
}

const ASSIGNABLE_ORG_ROLES: NoaRoleKey[] = [
  NoaRole.ORG_ADMIN,
  NoaRole.SECURITY_ADMIN,
  NoaRole.COMPLIANCE_AUDITOR,
  NoaRole.INTEGRATION_ADMIN,
];

@Injectable()
export class OrganizationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly rbac: RbacService,
  ) {}

  async create(name: string, slug: string) {
    return this.prisma.organization.create({
      data: {
        name,
        slug,
        settings: {
          issuancePolicy: {
            defaultMode: 'pacs_led',
            allowNoaIssuanceForTypes: ['hotel_key', 'gym_membership', 'event_pass', 'visitor_pass'],
          },
        },
      },
    });
  }

  async getOverview(organizationId: string, actorUserId: string, isPlatformAdmin: boolean) {
    await this.assertOrgAccess(actorUserId, organizationId, isPlatformAdmin);

    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: { id: true, name: true, slug: true },
    });
    if (!org) throw new NotFoundException('Organization not found');

    const [memberCount, activeMemberCount, credentialCount, activeCredentialCount] =
      await Promise.all([
        this.prisma.membership.count({
          where: { organizationId, status: { not: 'removed' } },
        }),
        this.prisma.membership.count({
          where: { organizationId, status: 'active' },
        }),
        this.prisma.credential.count({ where: { organizationId } }),
        this.prisma.credential.count({
          where: { organizationId, status: 'active' },
        }),
      ]);

    return {
      ...org,
      memberCount,
      activeMemberCount,
      credentialCount,
      activeCredentialCount,
    };
  }

  async listMembers(organizationId: string, actorUserId: string, isPlatformAdmin: boolean) {
    await this.assertOrgAccess(actorUserId, organizationId, isPlatformAdmin);

    return this.prisma.membership.findMany({
      where: { organizationId, status: { not: 'removed' } },
      include: { user: { select: { id: true, clerkUserId: true, isDisabled: true } } },
    });
  }

  async listComplianceRecords(organizationId: string, userId: string, actorUserId: string, isPlatformAdmin: boolean) {
    await this.assertOrgAccess(actorUserId, organizationId, isPlatformAdmin);

    const membership = await this.prisma.membership.findFirst({
      where: { organizationId, userId, status: { not: 'removed' } },
      select: { id: true },
    });
    if (!membership) throw new NotFoundException('Member not found in this organization');

    const records = await this.prisma.complianceRecord.findMany({
      where: { organizationId, userId },
      orderBy: [{ recordType: 'asc' }, { expiresAt: 'asc' }, { title: 'asc' }],
      select: {
        id: true,
        userId: true,
        organizationId: true,
        recordType: true,
        title: true,
        status: true,
        issuedAt: true,
        expiresAt: true,
        evidenceUrl: true,
        source: true,
      },
    });

    return records.map((record) => ({
      ...record,
      issuedAt: record.issuedAt?.toISOString() ?? null,
      expiresAt: record.expiresAt?.toISOString() ?? null,
    }));
  }

  async listPlatformOrganizations(options?: ListPlatformOrganizationsQuery | string) {
    const params: ListPlatformOrganizationsQuery =
      typeof options === 'string' ? { search: options } : options ?? {};
    const query = params.search?.trim();
    const field = params.field ?? 'all';
    const filter = params.filter ?? 'all';
    const sort = params.sort ?? 'name';

    const where: Prisma.OrganizationWhereInput = {};

    if (query) {
      if (field === 'name') {
        where.name = { contains: query, mode: 'insensitive' };
      } else if (field === 'clerkOrgId') {
        where.clerkOrgId = { contains: query, mode: 'insensitive' };
      } else {
        where.OR = [
          { name: { contains: query, mode: 'insensitive' } },
          { clerkOrgId: { contains: query, mode: 'insensitive' } },
        ];
      }
    }

    if (filter === 'hasMembers') {
      where.memberships = { some: { status: { not: 'removed' } } };
    } else if (filter === 'hasCredentials') {
      where.credentials = { some: {} };
    } else if (filter === 'hasProviders') {
      where.providerConnections = { some: {} };
    } else if (filter === 'missingClerkOrg') {
      where.clerkOrgId = null;
    }

    const organizations = await this.prisma.organization.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      orderBy: sort === 'updated' ? { updatedAt: 'desc' } : { name: 'asc' },
      take: 50,
      select: {
        id: true,
        name: true,
        slug: true,
        clerkOrgId: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            memberships: { where: { status: { not: 'removed' } } },
            credentials: true,
            providerConnections: true,
          },
        },
      },
    });

    return organizations.map((org) => ({
      id: org.id,
      name: org.name,
      slug: org.slug,
      clerkOrgId: org.clerkOrgId,
      createdAt: org.createdAt.toISOString(),
      updatedAt: org.updatedAt.toISOString(),
      memberCount: org._count.memberships,
      credentialCount: org._count.credentials,
      providerConnectionCount: org._count.providerConnections,
    }));
  }

  async inviteMember(organizationId: string, userId: string, role: string, actorUserId: string) {
    const validRole = this.parseAssignableRole(role);
    const membership = await this.prisma.membership.upsert({
      where: { userId_organizationId: { userId, organizationId } },
      update: { role: validRole, status: 'invited', invitedAt: new Date() },
      create: { userId, organizationId, role: validRole, status: 'invited', invitedAt: new Date() },
    });

    await this.rbac.assignRole({
      userId,
      roleKey: validRole,
      organizationId,
      grantedByUserId: actorUserId,
    });

    await this.audit.log({
      action: 'org_member_invited',
      actorUserId,
      organizationId,
      resourceType: 'membership',
      resourceId: membership.id,
      metadata: { role: validRole },
    });
    return membership;
  }

  async removeMember(organizationId: string, userId: string, actorUserId: string) {
    const membership = await this.prisma.membership.findUnique({
      where: { userId_organizationId: { userId, organizationId } },
    });
    if (!membership) throw new NotFoundException('Membership not found');

    const updated = await this.prisma.membership.update({
      where: { id: membership.id },
      data: { status: 'removed', removedAt: new Date() },
    });

    for (const roleKey of ASSIGNABLE_ORG_ROLES) {
      await this.rbac.revokeRole(userId, roleKey, organizationId);
    }

    await this.audit.log({
      action: 'org_member_removed',
      actorUserId,
      organizationId,
      resourceType: 'membership',
      resourceId: membership.id,
    });
    return updated;
  }

  async assignRole(organizationId: string, userId: string, role: string, actorUserId: string) {
    const validRole = this.parseAssignableRole(role);
    const membership = await this.prisma.membership.update({
      where: { userId_organizationId: { userId, organizationId } },
      data: { role: validRole },
    });

    for (const roleKey of ASSIGNABLE_ORG_ROLES) {
      if (roleKey !== validRole) {
        await this.rbac.revokeRole(userId, roleKey, organizationId);
      }
    }

    await this.rbac.assignRole({
      userId,
      roleKey: validRole,
      organizationId,
      grantedByUserId: actorUserId,
    });

    await this.audit.log({
      action: 'org_role_assigned',
      actorUserId,
      organizationId,
      resourceType: 'membership',
      resourceId: membership.id,
      metadata: { role: validRole },
    });
    return membership;
  }

  private parseAssignableRole(role: string): NoaRoleKey {
    try {
      const validRole = assertNoaRoleKey(role);
      if (!ASSIGNABLE_ORG_ROLES.includes(validRole)) {
        throw new Error('not assignable');
      }
      return validRole;
    } catch {
      throw new BadRequestException(
        `Invalid organization role: ${role}. Expected one of: ${ASSIGNABLE_ORG_ROLES.join(', ')}`,
      );
    }
  }

  getIssuancePolicy(organizationId: string) {
    return this.prisma.organization.findUnique({ where: { id: organizationId } }).then((org: Organization | null) => {
      if (!org) throw new NotFoundException('Organization not found');
      return parseOrganizationSettings(org.settings);
    });
  }

  async assertOrgAccess(
    userId: string,
    organizationId: string,
    isPlatformAdmin: boolean,
  ) {
    if (isPlatformAdmin) return;

    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: { id: true },
    });
    if (!org) throw new NotFoundException('Organization not found');

    const membership = await this.prisma.membership.findFirst({
      where: {
        userId,
        organizationId,
        status: { in: ['active', 'invited'] },
      },
    });
    if (membership) return;

    const orgRole = await this.prisma.userRole.findFirst({
      where: {
        userId,
        organizationId,
        revokedAt: null,
        role: { scope: 'organization' },
      },
    });
    if (orgRole) return;

    throw new ForbiddenException('You do not have access to this organization');
  }
}
