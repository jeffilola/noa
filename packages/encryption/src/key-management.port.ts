export interface DataKey {
  plaintextKey: Buffer;
  encryptedKey: Buffer;
  keyVersion: number;
}

export interface KeyManagementProvider {
  generateDataKey(): Promise<DataKey>;
  decryptDataKey(encryptedKey: Buffer, keyVersion: number): Promise<Buffer>;
}
