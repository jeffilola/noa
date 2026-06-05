-- CreateEnum
CREATE TYPE "CredentialStatus" AS ENUM ('active', 'suspended', 'revoked', 'expired');
CREATE TYPE "CredentialType" AS ENUM ('corporate_access', 'hotel_key', 'gym_membership', 'event_pass', 'visitor_pass');
CREATE TYPE "MembershipStatus" AS ENUM ('active', 'invited', 'suspended', 'removed');
CREATE TYPE "AuditAction" AS ENUM ('credential_issued', 'credential_revoked', 'credential_suspended', 'credential_activated', 'login', 'logout', 'org_member_invited', 'org_member_removed', 'org_role_assigned', 'user_created', 'user_updated', 'user_disabled', 'data_export', 'data_delete_requested', 'data_anonymized', 'pii_decrypted', 'wallet_pass_issued', 'wallet_pass_updated', 'presentation_token_minted', 'presentation_qr_scanned', 'presentation_nfc_tapped', 'presentation_token_consumed', 'presentation_token_rejected', 'provider_connection_created', 'provider_connection_updated', 'provider_connection_tested', 'provider_connection_disabled', 'provider_api_call');
CREATE TYPE "ConnectionStatus" AS ENUM ('draft', 'active', 'error', 'disabled');
CREATE TYPE "WalletPlatform" AS ENUM ('apple', 'google');
CREATE TYPE "WalletPassStatus" AS ENUM ('active', 'suspended', 'revoked');
CREATE TYPE "ProviderType" AS ENUM ('hid', 'brivo', 'lenel_s2', 'hotel', 'event', 'internal');
CREATE TYPE "IssuanceSource" AS ENUM ('PACS', 'NOA');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "firstNameEnc" TEXT,
    "firstNameIv" TEXT,
    "lastNameEnc" TEXT,
    "lastNameIv" TEXT,
    "emailEnc" TEXT,
    "emailIv" TEXT,
    "emailHash" TEXT,
    "phoneNumberEnc" TEXT,
    "phoneNumberIv" TEXT,
    "encryptionKeyVersion" INTEGER NOT NULL DEFAULT 1,
    "isDisabled" BOOLEAN NOT NULL DEFAULT false,
    "isPlatformAdmin" BOOLEAN NOT NULL DEFAULT false,
    "anonymizedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "clerkOrgId" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'invited',
    "employeeIdEnc" TEXT,
    "employeeIdIv" TEXT,
    "invitedAt" TIMESTAMP(3),
    "joinedAt" TIMESTAMP(3),
    "removedAt" TIMESTAMP(3),
    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CredentialProvider" (
    "id" TEXT NOT NULL,
    "type" "ProviderType" NOT NULL,
    "name" TEXT NOT NULL,
    "adapterKey" TEXT NOT NULL,
    "apiSpecUrl" TEXT,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "configSchema" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CredentialProvider_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "OrganizationProviderConnection" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "status" "ConnectionStatus" NOT NULL DEFAULT 'draft',
    "apiBaseUrl" TEXT NOT NULL,
    "credentialsEnc" TEXT NOT NULL,
    "credentialsIv" TEXT NOT NULL,
    "encryptionKeyVersion" INTEGER NOT NULL DEFAULT 1,
    "lastTestedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "OrganizationProviderConnection_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Credential" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "type" "CredentialType" NOT NULL,
    "issuanceSource" "IssuanceSource" NOT NULL DEFAULT 'PACS',
    "status" "CredentialStatus" NOT NULL DEFAULT 'active',
    "externalCredentialId" TEXT,
    "pacsCardholderId" TEXT,
    "cardNumber" TEXT,
    "label" TEXT,
    "validFrom" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "suspendedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "payloadEnc" TEXT,
    "payloadIv" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Credential_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CredentialAssignment" (
    "id" TEXT NOT NULL,
    "credentialId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unassignedAt" TIMESTAMP(3),
    CONSTRAINT "CredentialAssignment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "deviceFingerprint" TEXT,
    "lastSeenAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "actorUserId" TEXT,
    "actorUserIdAnon" TEXT,
    "organizationId" TEXT,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WalletPass" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "credentialId" TEXT NOT NULL,
    "platform" "WalletPlatform" NOT NULL,
    "externalPassId" TEXT NOT NULL,
    "passTypeIdentifier" TEXT,
    "status" "WalletPassStatus" NOT NULL DEFAULT 'active',
    "lastBarcodeUpdatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "WalletPass_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PresentationToken" (
    "id" TEXT NOT NULL,
    "credentialId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "consumedBy" TEXT,
    "channel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PresentationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");
CREATE UNIQUE INDEX "User_emailHash_key" ON "User"("emailHash");
CREATE UNIQUE INDEX "Organization_clerkOrgId_key" ON "Organization"("clerkOrgId");
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");
CREATE UNIQUE INDEX "Membership_userId_organizationId_key" ON "Membership"("userId", "organizationId");
CREATE UNIQUE INDEX "OrganizationProviderConnection_organizationId_providerId_key" ON "OrganizationProviderConnection"("organizationId", "providerId");
CREATE UNIQUE INDEX "Credential_organizationId_externalCredentialId_key" ON "Credential"("organizationId", "externalCredentialId");
CREATE INDEX "Credential_organizationId_cardNumber_idx" ON "Credential"("organizationId", "cardNumber");
CREATE UNIQUE INDEX "CredentialAssignment_credentialId_userId_key" ON "CredentialAssignment"("credentialId", "userId");
CREATE INDEX "AuditLog_organizationId_createdAt_idx" ON "AuditLog"("organizationId", "createdAt");
CREATE INDEX "AuditLog_action_createdAt_idx" ON "AuditLog"("action", "createdAt");
CREATE UNIQUE INDEX "WalletPass_credentialId_platform_userId_key" ON "WalletPass"("credentialId", "platform", "userId");
CREATE UNIQUE INDEX "PresentationToken_tokenHash_key" ON "PresentationToken"("tokenHash");
CREATE INDEX "PresentationToken_credentialId_windowStart_idx" ON "PresentationToken"("credentialId", "windowStart");
CREATE INDEX "PresentationToken_expiresAt_idx" ON "PresentationToken"("expiresAt");

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OrganizationProviderConnection" ADD CONSTRAINT "OrganizationProviderConnection_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OrganizationProviderConnection" ADD CONSTRAINT "OrganizationProviderConnection_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "CredentialProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Credential" ADD CONSTRAINT "Credential_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "CredentialProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CredentialAssignment" ADD CONSTRAINT "CredentialAssignment_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "Credential"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CredentialAssignment" ADD CONSTRAINT "CredentialAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CredentialAssignment" ADD CONSTRAINT "CredentialAssignment_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Device" ADD CONSTRAINT "Device_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "WalletPass" ADD CONSTRAINT "WalletPass_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "WalletPass" ADD CONSTRAINT "WalletPass_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "Credential"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PresentationToken" ADD CONSTRAINT "PresentationToken_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "Credential"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
