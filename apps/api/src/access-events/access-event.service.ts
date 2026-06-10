import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AccessEventDirection,
  AccessEventSource,
  type AccessEvent,
} from '@noa/database';
import type {
  PacsAccessEventIngestResult,
  PacsAccessEventPayload,
} from '@noa/integrations';
import { PrismaService } from '../prisma/prisma.service';
import { OrganizationService } from '../organizations/organization.service';

const ACCESS_EVENT_SELECT = {
  id: true,
  organizationId: true,
  userId: true,
  credentialId: true,
  externalEventId: true,
  occurredAt: true,
  locationLabel: true,
  readerLabel: true,
  direction: true,
  source: true,
  createdAt: true,
} as const;

export interface AccessEventDto {
  id: string;
  organizationId: string;
  userId: string;
  credentialId: string | null;
  externalEventId: string | null;
  occurredAt: string;
  locationLabel: string;
  readerLabel: string | null;
  direction: string;
  source: string;
  createdAt: string;
  organization?: { id: string; name: string; slug: string };
}

export interface AccessSummaryDto {
  lastAccess: {
    occurredAt: string;
    locationLabel: string;
    readerLabel: string | null;
    direction: string;
  } | null;
  recentCount: number;
}

@Injectable()
export class AccessEventService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orgs: OrganizationService,
  ) {}

  async ingestPacsAccessEvents(
    payloads: PacsAccessEventPayload[],
  ): Promise<PacsAccessEventIngestResult> {
    const result: PacsAccessEventIngestResult = {
      processed: 0,
      skipped: 0,
      events: [],
    };

    for (const payload of payloads) {
      const { event, action } = await this.ingestPacsAccessEvent(payload);
      result.processed += 1;
      result.events.push({
        id: event.id,
        externalEventId: event.externalEventId ?? payload.externalEventId,
        action,
      });
    }

    return result;
  }

  async ingestPacsAccessEvent(
    payload: PacsAccessEventPayload,
  ): Promise<{ event: AccessEvent; action: 'created' | 'updated' }> {
    this.assertIngestPayload(payload);

    const org = await this.prisma.organization.findUnique({
      where: { id: payload.organizationId },
      select: { id: true },
    });
    if (!org) {
      throw new NotFoundException(`Organization not found: ${payload.organizationId}`);
    }

    const resolved = await this.resolveIngestContext(payload);
    const occurredAt = new Date(payload.occurredAt);
    if (Number.isNaN(occurredAt.getTime())) {
      throw new BadRequestException('occurredAt must be a valid ISO-8601 timestamp');
    }

    const direction = this.parseDirection(payload.direction);
    const source = payload.source === 'NOA' ? AccessEventSource.NOA : AccessEventSource.PACS;

    const existing = await this.prisma.accessEvent.findUnique({
      where: {
        organizationId_externalEventId: {
          organizationId: payload.organizationId,
          externalEventId: payload.externalEventId,
        },
      },
    });

    if (existing) {
      const event = await this.prisma.accessEvent.update({
        where: { id: existing.id },
        data: {
          userId: resolved.userId,
          credentialId: resolved.credentialId,
          occurredAt,
          locationLabel: payload.locationLabel.trim(),
          readerLabel: payload.readerLabel?.trim() || null,
          direction,
          source,
        },
      });
      return { event, action: 'updated' };
    }

    const event = await this.prisma.accessEvent.create({
      data: {
        organizationId: payload.organizationId,
        userId: resolved.userId,
        credentialId: resolved.credentialId,
        externalEventId: payload.externalEventId,
        occurredAt,
        locationLabel: payload.locationLabel.trim(),
        readerLabel: payload.readerLabel?.trim() || null,
        direction,
        source,
      },
    });
    return { event, action: 'created' };
  }

  async listForOrganization(
    organizationId: string,
    actorUserId: string,
    isPlatformAdmin: boolean,
    options: { userId?: string; limit?: number },
  ): Promise<AccessEventDto[]> {
    await this.orgs.assertOrgAccess(actorUserId, organizationId, isPlatformAdmin);

    const limit = Math.min(Math.max(options.limit ?? 50, 1), 100);

    const events = await this.prisma.accessEvent.findMany({
      where: {
        organizationId,
        ...(options.userId ? { userId: options.userId } : {}),
      },
      orderBy: { occurredAt: 'desc' },
      take: limit,
      select: ACCESS_EVENT_SELECT,
    });

    return events.map((event) => this.toDto(event));
  }

  async getUserAccessSummary(
    organizationId: string,
    userId: string,
    actorUserId: string,
    isPlatformAdmin: boolean,
  ): Promise<AccessSummaryDto> {
    await this.orgs.assertOrgAccess(actorUserId, organizationId, isPlatformAdmin);

    const membership = await this.prisma.membership.findFirst({
      where: { organizationId, userId, status: { not: 'removed' } },
    });
    if (!membership) {
      throw new NotFoundException('Member not found in this organization');
    }

    const [lastEvent, recentCount] = await Promise.all([
      this.prisma.accessEvent.findFirst({
        where: { organizationId, userId },
        orderBy: { occurredAt: 'desc' },
        select: {
          occurredAt: true,
          locationLabel: true,
          readerLabel: true,
          direction: true,
        },
      }),
      this.prisma.accessEvent.count({
        where: {
          organizationId,
          userId,
          occurredAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      }),
    ]);

    return {
      lastAccess: lastEvent
        ? {
            occurredAt: lastEvent.occurredAt.toISOString(),
            locationLabel: lastEvent.locationLabel,
            readerLabel: lastEvent.readerLabel,
            direction: lastEvent.direction,
          }
        : null,
      recentCount,
    };
  }

  async listForHolder(userId: string, limit = 50): Promise<AccessEventDto[]> {
    const cappedLimit = Math.min(Math.max(limit, 1), 100);

    const events = await this.prisma.accessEvent.findMany({
      where: { userId },
      orderBy: { occurredAt: 'desc' },
      take: cappedLimit,
      select: {
        ...ACCESS_EVENT_SELECT,
        organization: { select: { id: true, name: true, slug: true } },
      },
    });

    return events.map((event) => this.toDto(event));
  }

  private assertIngestPayload(payload: PacsAccessEventPayload) {
    if (!payload.organizationId?.trim()) {
      throw new BadRequestException('organizationId is required');
    }
    if (!payload.externalEventId?.trim()) {
      throw new BadRequestException('externalEventId is required');
    }
    if (!payload.occurredAt?.trim()) {
      throw new BadRequestException('occurredAt is required');
    }
    if (!payload.locationLabel?.trim()) {
      throw new BadRequestException('locationLabel is required');
    }

    const hasIdentity =
      Boolean(payload.clerkUserId?.trim()) ||
      Boolean(payload.userId?.trim()) ||
      Boolean(payload.credentialId?.trim()) ||
      Boolean(payload.cardNumber?.trim()) ||
      Boolean(payload.externalCredentialId?.trim());

    if (!hasIdentity) {
      throw new BadRequestException(
        'One of clerkUserId, userId, credentialId, cardNumber, or externalCredentialId is required',
      );
    }
  }

  private async resolveIngestContext(payload: PacsAccessEventPayload) {
    if (payload.clerkUserId?.trim()) {
      const user = await this.prisma.user.findUnique({
        where: { clerkUserId: payload.clerkUserId.trim() },
        select: { id: true },
      });
      if (!user) {
        throw new NotFoundException(`User not found for Clerk id: ${payload.clerkUserId}`);
      }

      const membership = await this.prisma.membership.findFirst({
        where: {
          userId: user.id,
          organizationId: payload.organizationId,
          status: { in: ['active', 'invited'] },
        },
      });
      if (!membership) {
        throw new NotFoundException('User is not a member of this organization');
      }

      let credentialId: string | null = null;
      if (payload.credentialId?.trim()) {
        credentialId = payload.credentialId.trim();
        await this.assertCredentialInOrg(credentialId, payload.organizationId, user.id);
      } else if (payload.cardNumber?.trim() || payload.externalCredentialId?.trim()) {
        const credential = await this.findCredentialForIngest(payload);
        if (credential) {
          await this.assertCredentialAssignment(credential.id, payload.organizationId, user.id);
          credentialId = credential.id;
        }
      }

      return { userId: user.id, credentialId };
    }

    if (payload.userId?.trim()) {
      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId.trim() },
        select: { id: true },
      });
      if (!user) {
        throw new NotFoundException(`User not found: ${payload.userId}`);
      }

      const membership = await this.prisma.membership.findFirst({
        where: {
          userId: user.id,
          organizationId: payload.organizationId,
          status: { in: ['active', 'invited'] },
        },
      });
      if (!membership) {
        throw new NotFoundException('User is not a member of this organization');
      }

      let credentialId: string | null = payload.credentialId?.trim() ?? null;
      if (credentialId) {
        await this.assertCredentialInOrg(credentialId, payload.organizationId, user.id);
      }

      return { userId: user.id, credentialId };
    }

    const credential = await this.findCredentialForIngest(payload);
    if (!credential) {
      throw new NotFoundException('Credential not found for access event');
    }

    const assignment = await this.prisma.credentialAssignment.findFirst({
      where: {
        credentialId: credential.id,
        organizationId: payload.organizationId,
        unassignedAt: null,
      },
      select: { userId: true },
    });
    if (!assignment) {
      throw new NotFoundException('No active credential assignment found for access event');
    }

    return { userId: assignment.userId, credentialId: credential.id };
  }

  private async findCredentialForIngest(payload: PacsAccessEventPayload) {
    if (payload.credentialId?.trim()) {
      const credential = await this.prisma.credential.findFirst({
        where: {
          id: payload.credentialId.trim(),
          organizationId: payload.organizationId,
        },
      });
      if (!credential) {
        throw new NotFoundException(`Credential not found: ${payload.credentialId}`);
      }
      return credential;
    }

    if (payload.externalCredentialId?.trim()) {
      return this.prisma.credential.findUnique({
        where: {
          organizationId_externalCredentialId: {
            organizationId: payload.organizationId,
            externalCredentialId: payload.externalCredentialId.trim(),
          },
        },
      });
    }

    if (payload.cardNumber?.trim()) {
      return this.prisma.credential.findFirst({
        where: {
          organizationId: payload.organizationId,
          cardNumber: payload.cardNumber.trim(),
        },
      });
    }

    return null;
  }

  private async assertCredentialInOrg(
    credentialId: string,
    organizationId: string,
    userId: string,
  ) {
    const credential = await this.prisma.credential.findFirst({
      where: { id: credentialId, organizationId },
      select: { id: true },
    });
    if (!credential) {
      throw new NotFoundException(`Credential not found: ${credentialId}`);
    }

    await this.assertCredentialAssignment(credentialId, organizationId, userId);
  }

  private async assertCredentialAssignment(
    credentialId: string,
    organizationId: string,
    userId: string,
  ) {
    const assignment = await this.prisma.credentialAssignment.findFirst({
      where: {
        credentialId,
        userId,
        organizationId,
        unassignedAt: null,
      },
    });
    if (!assignment) {
      throw new ForbiddenException('Credential is not assigned to this user');
    }
  }

  private parseDirection(direction?: string): AccessEventDirection {
    if (direction === 'entry') return AccessEventDirection.entry;
    if (direction === 'exit') return AccessEventDirection.exit;
    return AccessEventDirection.unknown;
  }

  private toDto(
    event: {
      id: string;
      organizationId: string;
      userId: string;
      credentialId: string | null;
      externalEventId: string | null;
      occurredAt: Date;
      locationLabel: string;
      readerLabel: string | null;
      direction: string;
      source: string;
      createdAt: Date;
      organization?: { id: string; name: string; slug: string };
    },
  ): AccessEventDto {
    return {
      id: event.id,
      organizationId: event.organizationId,
      userId: event.userId,
      credentialId: event.credentialId,
      externalEventId: event.externalEventId,
      occurredAt: event.occurredAt.toISOString(),
      locationLabel: event.locationLabel,
      readerLabel: event.readerLabel,
      direction: event.direction,
      source: event.source,
      createdAt: event.createdAt.toISOString(),
      organization: event.organization,
    };
  }
}
