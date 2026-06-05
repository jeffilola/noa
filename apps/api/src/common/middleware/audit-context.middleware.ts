import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { getRequestContext, requestContextStorage } from '../request-context';

@Injectable()
export class AuditContextMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const correlationId = (req.headers['x-correlation-id'] as string) ?? randomUUID();
    const ctx = {
      correlationId,
      ipAddress: req.ip ?? req.socket.remoteAddress,
      userAgent: req.headers['user-agent'],
    };
    requestContextStorage.run(ctx, () => next());
  }
}

export function auditContextFromRequest() {
  return getRequestContext();
}
