import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { NoaRole, hasRole } from '@noa/domain';
import type { Request } from 'express';

@Injectable()
export class OrgRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const auth = req.auth;

    if (
      !auth ||
      (!hasRole(auth.roles, NoaRole.ORG_ADMIN) &&
        !hasRole(auth.roles, NoaRole.PLATFORM_ADMIN))
    ) {
      throw new ForbiddenException('Organization administrator role required');
    }

    if (auth.isReadOnly) {
      throw new ForbiddenException('Read-only role cannot perform this action');
    }

    return true;
  }
}

export function RequireOrgAdmin(): OrgRoleGuard {
  return new OrgRoleGuard();
}
