import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  assertNoaRoleKey,
  legacyMembershipRoleToNoaRole,
  NoaRole,
} from './roles.js';
import {
  hasPermission,
  hasRole,
  Permission,
  permissionsForRoles,
  ROLE_PERMISSION_MAP,
} from './permissions.js';
import { isForbiddenPermission } from './boundary.js';
import { dashboardsForRoles, DASHBOARD_NAVIGATION } from './navigation.js';

describe('Noa RBAC roles', () => {
  it('maps legacy membership roles', () => {
    assert.equal(legacyMembershipRoleToNoaRole('admin'), NoaRole.ORG_ADMIN);
    assert.equal(legacyMembershipRoleToNoaRole('owner'), NoaRole.ORG_ADMIN);
    assert.equal(legacyMembershipRoleToNoaRole('security'), NoaRole.SECURITY_ADMIN);
  });

  it('rejects unknown roles', () => {
    assert.throws(() => assertNoaRoleKey('superuser'));
  });
});

describe('permissionsForRoles', () => {
  it('always includes identity holder permissions', () => {
    const permissions = permissionsForRoles([NoaRole.IDENTITY_HOLDER]);
    assert.ok(permissions.includes(Permission.PROFILE_VIEW));
    assert.ok(permissions.includes(Permission.CREDENTIALS_VIEW_OWN));
  });

  it('grants org admin inventory visibility without issuance', () => {
    const permissions = permissionsForRoles([NoaRole.ORG_ADMIN]);
    assert.ok(permissions.includes(Permission.CREDENTIALS_INVENTORY_VIEW));
    assert.ok(permissions.includes(Permission.CREDENTIALS_PROVISION_REQUEST));
    assert.equal(permissions.includes('credentials:issue' as Permission), false);
  });

  it('grants security admin suspend and revoke', () => {
    const permissions = permissionsForRoles([NoaRole.SECURITY_ADMIN]);
    assert.ok(hasPermission(permissions, Permission.CREDENTIALS_SUSPEND));
    assert.ok(hasPermission(permissions, Permission.CREDENTIALS_REVOKE));
  });
});

describe('Noa boundary', () => {
  it('forbids PACS-only permission keys', () => {
    assert.equal(isForbiddenPermission('doors:manage'), true);
    assert.equal(isForbiddenPermission('credentials:issue'), true);
    assert.equal(isForbiddenPermission('credentials:view:own'), false);
  });
});

describe('dashboard navigation', () => {
  it('defines six role dashboards', () => {
    assert.equal(Object.keys(DASHBOARD_NAVIGATION).length, 6);
  });

  it('returns operational dashboards excluding identity holder', () => {
    const dashboards = dashboardsForRoles([
      NoaRole.IDENTITY_HOLDER,
      NoaRole.ORG_ADMIN,
      NoaRole.SECURITY_ADMIN,
    ]);
    assert.equal(dashboards.length, 2);
    assert.ok(dashboards.some((dashboard) => dashboard.basePath === '/org'));
  });
});

describe('role permission catalog', () => {
  it('defines permissions for every role', () => {
    for (const role of Object.values(NoaRole)) {
      assert.ok(ROLE_PERMISSION_MAP[role].length > 0);
    }
  });

  it('checks role membership', () => {
    assert.equal(hasRole([NoaRole.ORG_ADMIN], NoaRole.ORG_ADMIN), true);
    assert.equal(hasRole([NoaRole.ORG_ADMIN], NoaRole.SECURITY_ADMIN), false);
  });
});
