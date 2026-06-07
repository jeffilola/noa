import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Get,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuditAction, type AuditLog } from '@noa/database';
import { Permission } from '@noa/domain';
import type { AuthContext } from '../common/auth-context';
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';
import { RequireOrgAdmin } from '../common/guards/org-role.guard';
import { RequirePermission } from '../common/guards/permission.guard';
import { AuditService } from './audit.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('audit')
@UseGuards(ClerkAuthGuard)
export class AuditController {
  constructor(
    private readonly audit: AuditService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('logs')
  @UseGuards(
    RequirePermission(
      Permission.AUDIT_VIEW_ORG,
      Permission.AUDIT_VIEW,
      Permission.PLATFORM_ORGANIZATIONS_MANAGE,
    ),
  )
  list(
    @Req() req: Request,
    @Query('organizationId') organizationId?: string,
    @Query('action') action?: AuditAction,
    @Query('limit') limit = '50',
    @Query('offset') offset = '0',
  ) {
    this.assertAuditOrgScope(req.auth!, organizationId);

    return this.prisma.auditLog.findMany({
      where: { organizationId, action },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: Number(offset),
    });
  }

  @Get('logs/export')
  @UseGuards(RequireOrgAdmin())
  async export(
    @Query('organizationId') organizationId: string | undefined,
    @Query('format') format: 'json' | 'csv' = 'json',
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.assertAuditOrgScope(req.auth!, organizationId);

    const logs = await this.prisma.auditLog.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });

    await this.audit.log({
      action: 'data_export',
      actorUserId: req.auth!.userId,
      organizationId,
      resourceType: 'audit_log',
      metadata: { format, count: logs.length },
    });

    if (format === 'csv') {
      const header = 'id,action,organizationId,resourceType,resourceId,createdAt\n';
      const rows = logs
        .map(
          (l: AuditLog) =>
            `${l.id},${l.action},${l.organizationId ?? ''},${l.resourceType},${l.resourceId ?? ''},${l.createdAt.toISOString()}`,
        )
        .join('\n');
      res.setHeader('Content-Type', 'text/csv');
      res.send(header + rows);
      return;
    }

    res.json(logs);
  }

  private assertAuditOrgScope(auth: AuthContext, organizationId?: string) {
    if (!organizationId) {
      if (auth.isPlatformAdmin) return;
      throw new BadRequestException('organizationId is required for organization audit logs');
    }

    if (auth.isPlatformAdmin) return;

    if (auth.organizationId && auth.organizationId !== organizationId) {
      throw new ForbiddenException('Organization scope mismatch');
    }
  }
}
