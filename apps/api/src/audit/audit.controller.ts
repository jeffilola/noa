import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuditAction, type AuditLog } from '@noa/database';
import { ClerkAuthGuard } from '../common/guards/clerk-auth.guard';
import { RequireOrgAdmin } from '../common/guards/org-role.guard';
import { AuditService } from './audit.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('audit')
@UseGuards(ClerkAuthGuard, RequireOrgAdmin())
export class AuditController {
  constructor(
    private readonly audit: AuditService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('logs')
  list(
    @Query('organizationId') organizationId?: string,
    @Query('action') action?: AuditAction,
    @Query('limit') limit = '50',
    @Query('offset') offset = '0',
  ) {
    return this.prisma.auditLog.findMany({
      where: { organizationId, action },
      orderBy: { createdAt: 'desc' },
      take: Number(limit),
      skip: Number(offset),
    });
  }

  @Get('logs/export')
  async export(
    @Query('organizationId') organizationId: string | undefined,
    @Query('format') format: 'json' | 'csv' = 'json',
    @Req() req: Request,
    @Res() res: Response,
  ) {
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
}
