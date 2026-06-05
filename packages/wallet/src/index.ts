export interface PassBarcodePayload {
  token: string;
  format: 'PKBarcodeFormatQR';
  messageEncoding: 'iso-8859-1';
}

export interface ApplePassBuildInput {
  serialNumber: string;
  organizationName: string;
  description: string;
  barcode: PassBarcodePayload;
}

export interface GooglePassBuildInput {
  objectId: string;
  classId: string;
  barcodeValue: string;
  header: string;
}

export class ApplePassBuilder {
  build(input: ApplePassBuildInput): Record<string, unknown> {
    return {
      formatVersion: 1,
      passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID ?? 'pass.com.noa.access',
      serialNumber: input.serialNumber,
      teamIdentifier: process.env.APPLE_TEAM_ID ?? 'TEAMID',
      organizationName: input.organizationName,
      description: input.description,
      barcode: {
        format: input.barcode.format,
        message: input.barcode.token,
        messageEncoding: input.barcode.messageEncoding,
      },
    };
  }
}

export class GooglePassBuilder {
  build(input: GooglePassBuildInput): Record<string, unknown> {
    return {
      id: input.objectId,
      classId: input.classId,
      state: 'ACTIVE',
      barcode: { type: 'QR_CODE', value: input.barcodeValue },
      header: { defaultValue: { language: 'en', value: input.header } },
    };
  }
}

export const applePassBuilder = new ApplePassBuilder();
export const googlePassBuilder = new GooglePassBuilder();
