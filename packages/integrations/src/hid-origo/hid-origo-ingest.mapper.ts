export type HidOrigoEventType =
  | 'com.hidglobal.origo.credentials.issued'
  | 'com.hidglobal.origo.credentials.revoked'
  | 'com.hidglobal.origo.credentials.suspended';

export interface HidOrigoCloudEvent {
  specversion: string;
  type: HidOrigoEventType | string;
  source: string;
  id: string;
  time?: string;
  data: HidOrigoCredentialEventData;
}

export interface HidOrigoCredentialEventData {
  organizationId: string;
  origoCredentialId: string;
  cardNumber?: string;
  pacsCardholderId?: string;
  userId?: string;
  credentialType?: string;
  label?: string;
  validFrom?: string;
  validUntil?: string;
}

export type PacsIngestAction = 'issued' | 'revoked' | 'suspended';

export interface PacsIngestPayload {
  action: PacsIngestAction;
  organizationId: string;
  externalCredentialId: string;
  cardNumber?: string;
  pacsCardholderId?: string;
  userId?: string;
  credentialType: string;
  label?: string;
  validFrom?: Date;
  validUntil?: Date;
  eventId: string;
}

export function mapHidCloudEventToIngest(event: HidOrigoCloudEvent): PacsIngestPayload | null {
  const action = mapEventTypeToAction(event.type);
  if (!action) return null;

  const data = event.data;
  if (!data.organizationId || !data.origoCredentialId) return null;

  return {
    action,
    organizationId: data.organizationId,
    externalCredentialId: data.origoCredentialId,
    cardNumber: data.cardNumber,
    pacsCardholderId: data.pacsCardholderId,
    userId: data.userId,
    credentialType: data.credentialType ?? 'corporate_access',
    label: data.label,
    validFrom: data.validFrom ? new Date(data.validFrom) : undefined,
    validUntil: data.validUntil ? new Date(data.validUntil) : undefined,
    eventId: event.id,
  };
}

function mapEventTypeToAction(type: string): PacsIngestAction | null {
  const normalized = type.toLowerCase();
  if (normalized.includes('issued')) return 'issued';
  if (normalized.includes('revoked')) return 'revoked';
  if (normalized.includes('suspended')) return 'suspended';
  return null;
}
