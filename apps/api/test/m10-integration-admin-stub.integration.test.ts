import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@noa/database';
import { AuditService } from '../src/audit/audit.service';
import { IntegrationsService } from '../src/integrations/integrations.service';

const prisma = new PrismaClient();
const audit = new AuditService(prisma as never);
const integrations = new IntegrationsService(prisma as never, audit, {} as never);

describe('M10 integration admin test-mode validation', () => {
  it('validates HTTPS test settings without storing provider keys', () => {
    const result = integrations.validateTestModeConnection({
      providerId: 'hid_origo',
      apiBaseUrl: 'https://api.origo.test',
      mode: 'test',
    });

    assert.equal(result.ok, true);
    assert.equal(result.mode, 'test');
    assert.equal(result.providerId, 'hid_origo');
    assert.match(result.message, /No provider keys were stored/);
  });

  it('rejects non-HTTPS provider URLs', () => {
    assert.throws(
      () =>
        integrations.validateTestModeConnection({
          providerId: 'hid_origo',
          apiBaseUrl: 'http://localhost:3000',
        }),
      BadRequestException,
    );
  });
});
