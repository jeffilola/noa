-- CreateEnum
CREATE TYPE "AccessEventDirection" AS ENUM ('entry', 'exit', 'unknown');
CREATE TYPE "AccessEventSource" AS ENUM ('PACS', 'NOA');

-- CreateTable
CREATE TABLE "AccessEvent" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "credentialId" TEXT,
    "externalEventId" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "locationLabel" TEXT NOT NULL,
    "readerLabel" TEXT,
    "direction" "AccessEventDirection" NOT NULL DEFAULT 'unknown',
    "source" "AccessEventSource" NOT NULL DEFAULT 'PACS',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccessEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AccessEvent_organizationId_occurredAt_idx" ON "AccessEvent"("organizationId", "occurredAt");
CREATE INDEX "AccessEvent_userId_organizationId_occurredAt_idx" ON "AccessEvent"("userId", "organizationId", "occurredAt");
CREATE UNIQUE INDEX "AccessEvent_organizationId_externalEventId_key" ON "AccessEvent"("organizationId", "externalEventId");

-- AddForeignKey
ALTER TABLE "AccessEvent" ADD CONSTRAINT "AccessEvent_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AccessEvent" ADD CONSTRAINT "AccessEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AccessEvent" ADD CONSTRAINT "AccessEvent_credentialId_fkey" FOREIGN KEY ("credentialId") REFERENCES "Credential"("id") ON DELETE SET NULL ON UPDATE CASCADE;
