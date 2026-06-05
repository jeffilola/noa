import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  mixin,
  Type,
} from '@nestjs/common';
import type { Request } from 'express';
import { hasAnyPermission, hasRole, type NoaRoleKey, type PermissionName } from '@noa/domain';

export function RequirePermission(...required: PermissionName[]): Type<CanActivate> {
  @Injectable()
  class PermissionGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const req = context.switchToHttp().getRequest<Request>();
      const granted = req.auth?.permissions ?? [];

      if (req.auth?.isReadOnly && required.some((permission) => !permission.includes('view') && !permission.includes('readonly') && !permission.includes('export') && !permission.includes('lifecycle'))) {
        throw new ForbiddenException('Read-only role cannot perform this action');
      }

      if (!hasAnyPermission(granted, required)) {
        throw new ForbiddenException(`Missing permissions: ${required.join(', ')}`);
      }

      return true;
    }
  }

  return mixin(PermissionGuard);
}

export function RequireRole(...required: NoaRoleKey[]): Type<CanActivate> {
  @Injectable()
  class RoleGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const req = context.switchToHttp().getRequest<Request>();
      const roles = req.auth?.roles ?? [];

      if (!hasRole(roles, required)) {
        throw new ForbiddenException(`Missing role: ${required.join(' or ')}`);
      }

      return true;
    }
  }

  return mixin(RoleGuard);
}

export function RequireOrgScope(): Type<CanActivate> {
  @Injectable()
  class OrgScopeGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const req = context.switchToHttp().getRequest<Request>();
      const routeOrgId = req.params?.organizationId ?? req.params?.id ?? req.params?.orgId;
      const authOrgId = req.auth?.organizationId;

      if (routeOrgId && authOrgId && routeOrgId !== authOrgId) {
        if (!req.auth?.isPlatformAdmin) {
          throw new ForbiddenException('Organization scope mismatch');
        }
      }

      return true;
    }
  }

  return mixin(OrgScopeGuard);
}
