const E164_REGEX = /^\+[1-9]\d{6,14}$/;
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export type ProfileFieldErrors = Partial<Record<'phoneNumber' | 'dateOfBirth', string>>;

export function normalizeProfilePhone(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('+')) {
    return `+${trimmed.slice(1).replace(/\D/g, '')}`;
  }
  return `+${trimmed.replace(/\D/g, '')}`;
}

export function validateProfilePhone(input: string): string | undefined {
  const normalized = normalizeProfilePhone(input);
  if (!normalized) {
    return 'Phone number is required.';
  }
  if (!E164_REGEX.test(normalized)) {
    return 'Use international E.164 format, e.g. +14155551234 or +2348012345678.';
  }
  return undefined;
}

export function validateProfileDateOfBirth(input: string): string | undefined {
  const trimmed = input.trim();
  if (!trimmed) {
    return 'Date of birth is required.';
  }
  if (!ISO_DATE_REGEX.test(trimmed)) {
    return 'Use YYYY-MM-DD format.';
  }

  const [year, month, day] = trimmed.split('-').map(Number);
  const parsed = new Date(Date.UTC(year, month - 1, day));
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return 'Enter a valid calendar date.';
  }

  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  if (parsed.getTime() > todayUtc) {
    return 'Date of birth cannot be in the future.';
  }

  const minYear = today.getUTCFullYear() - 120;
  if (year < minYear) {
    return `Year must be ${minYear} or later.`;
  }

  return undefined;
}

export function validateProfileUpdate(body: {
  phoneNumber?: string;
  dateOfBirth?: string;
}): ProfileFieldErrors {
  const errors: ProfileFieldErrors = {};

  if (body.phoneNumber !== undefined) {
    const phoneError = validateProfilePhone(body.phoneNumber);
    if (phoneError) errors.phoneNumber = phoneError;
  }

  if (body.dateOfBirth !== undefined) {
    const dobError = validateProfileDateOfBirth(body.dateOfBirth);
    if (dobError) errors.dateOfBirth = dobError;
  }

  return errors;
}

export function normalizeProfileUpdate(body: {
  phoneNumber?: string;
  dateOfBirth?: string;
}): { phoneNumber?: string; dateOfBirth?: string } {
  const normalized: { phoneNumber?: string; dateOfBirth?: string } = {};

  if (body.phoneNumber !== undefined) {
    normalized.phoneNumber = normalizeProfilePhone(body.phoneNumber);
  }

  if (body.dateOfBirth !== undefined) {
    normalized.dateOfBirth = body.dateOfBirth.trim();
  }

  return normalized;
}
