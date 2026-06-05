export type PiiFieldName =
  | 'first_name'
  | 'last_name'
  | 'email'
  | 'phone_number'
  | 'date_of_birth'
  | 'employee_id';

export interface EncryptedField {
  ciphertext: string;
  iv: string;
  keyVersion: number;
}

export interface DecryptContext {
  actorUserId: string;
  resourceType: 'user' | 'membership';
  resourceId: string;
  purpose:
    | 'gdpr_export'
    | 'user_profile_view'
    | 'admin_user_view'
    | 'member_invite_display'
    | 'clerk_sync'
    | 'internal_job';
  organizationId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface PiiDecryptAuditEvent {
  field: PiiFieldName;
  purpose: DecryptContext['purpose'];
  resourceType: DecryptContext['resourceType'];
  resourceId: string;
  actorUserId: string;
  organizationId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export type PiiAuditLogger = (event: PiiDecryptAuditEvent) => Promise<void>;
