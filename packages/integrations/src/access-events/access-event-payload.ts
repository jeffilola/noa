export type AccessEventDirectionName = 'entry' | 'exit' | 'unknown';
export type AccessEventSourceName = 'PACS' | 'NOA';

/** Normalized PACS door/check-in event for webhook ingest. */
export interface PacsAccessEventPayload {
  organizationId: string;
  externalEventId: string;
  occurredAt: string;
  locationLabel: string;
  readerLabel?: string;
  direction?: AccessEventDirectionName;
  source?: AccessEventSourceName;
  /** Prefer this in local scripts — resolves to the Noa user row automatically. */
  clerkUserId?: string;
  userId?: string;
  credentialId?: string;
  cardNumber?: string;
  externalCredentialId?: string;
}

export interface PacsAccessEventIngestResult {
  processed: number;
  skipped: number;
  events: Array<{ id: string; externalEventId: string; action: 'created' | 'updated' }>;
}
