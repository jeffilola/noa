import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isPacsLedCorporateBlocked, DEFAULT_ISSUANCE_POLICY } from './issuance-policy.js';

describe('issuance policy', () => {
  it('blocks corporate_access when pacs_led', () => {
    assert.equal(
      isPacsLedCorporateBlocked('corporate_access', { issuancePolicy: DEFAULT_ISSUANCE_POLICY }),
      true,
    );
  });

  it('allows hotel_key when pacs_led', () => {
    assert.equal(
      isPacsLedCorporateBlocked('hotel_key', { issuancePolicy: DEFAULT_ISSUANCE_POLICY }),
      false,
    );
  });
});
