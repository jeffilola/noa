import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { AuditAction } from '@noa/database';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(params: {
    action: AuditAction;
    organizationId?: string;
    resourceType: string;
    resourceId?: string;
    actorUserId?: string;
    metadata?: Prisma.InputJsonValue;
  }) {
    return this.prisma.auditLog.create({
      data: {
        action: params.action,
        organizationId: params.organizationId,
        resourceType: params.resourceType,
        resourceId: params.resourceId,
        actorUserId: params.actorUserId,
        metadata: params.metadata,
      },
    });
  }
}
