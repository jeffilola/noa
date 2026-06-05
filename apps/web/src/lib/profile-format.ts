const REGION_BY_CALLING_CODE: Record<string, string> = {
  '1': 'US',
  '234': 'NG',
  '44': 'GB',
  '33': 'FR',
  '49': 'DE',
  '91': 'IN',
  '61': 'AU',
  '27': 'ZA',
};

function regionLabel(regionCode: string): string {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(regionCode) ?? regionCode;
  } catch {
    return regionCode;
  }
}

function inferRegionFromE164(e164: string): string {
  const digits = e164.replace(/\D/g, '');

  for (const length of [3, 2, 1]) {
    const prefix = digits.slice(0, length);
    if (REGION_BY_CALLING_CODE[prefix]) {
      return REGION_BY_CALLING_CODE[prefix];
    }
  }

  return 'INTL';
}

export function formatPhoneByRegion(e164?: string | null) {
  if (!e164?.trim()) return null;

  const normalized = e164.trim().startsWith('+') ? e164.trim() : `+${e164.trim()}`;
  const regionCode = inferRegionFromE164(normalized);
  const region = regionLabel(regionCode);

  return {
    region,
    regionCode,
    e164: normalized,
    display: `${region} · ${normalized}`,
  };
}

export function formatDateOfBirth(isoDate?: string | null) {
  if (!isoDate?.trim()) return null;

  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;

  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parsed);
}
