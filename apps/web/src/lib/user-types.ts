export interface UserProfile {
  id: string;
  clerkUserId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
}

export interface UserMembership {
  id: string;
  role: string;
  status: string;
  joinedAt: string | null;
  organization: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface UserCredential {
  id: string;
  type: string;
  status: string;
  issuanceSource: string;
  label?: string | null;
  cardNumber?: string | null;
  externalCredentialId?: string | null;
  validFrom?: string | null;
  validUntil?: string | null;
  organizationId: string;
  provider?: { name: string };
  assignments?: { userId: string }[];
}

export interface UserDevice {
  id: string;
  name: string;
  platform: string;
  deviceFingerprint?: string | null;
  lastSeenAt?: string | null;
  isActive: boolean;
  createdAt: string;
}
