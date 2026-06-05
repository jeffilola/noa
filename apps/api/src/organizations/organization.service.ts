import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import type { Organization } from '@noa/database';
import { assertNoaRoleKey, NoaRole, parseOrganizationSettings, type NoaRoleKey } from '@noa/domain';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { RbacService } from '../auth/rbac.service';

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

  async listMembers(organizationId: string) {
    return this.prisma.membership.findMany({
      where: { organizationId, status: { not: 'removed' } },
      include: { user: { select: { id: true, clerkUserId: true, isDisabled: true } } },
    });
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
}
