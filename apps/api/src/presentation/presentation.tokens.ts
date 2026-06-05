import { createHash, randomBytes } from 'node:crypto';

const TOKEN_WINDOW_SECONDS = 30;

export interface MintedToken {
  opaqueToken: string;
  tokenHash: string;
  windowStart: Date;
  expiresAt: Date;
}

export class TokenStore {
  private readonly consumed = new Set<string>();
  private readonly redisUrl = process.env.REDIS_URL;

  async markConsumed(tokenHash: string): Promise<boolean> {
    if (this.consumed.has(tokenHash)) return false;
    if (this.redisUrl) {
      try {
        const Redis = (await import('ioredis')).default;
        const client = new Redis(this.redisUrl);
        const result = await client.set(`noa:token:${tokenHash}`, '1', 'EX', 35, 'NX');
        await client.quit();
        return result === 'OK';
      } catch {
        // fall through to memory
      }
    }
    this.consumed.add(tokenHash);
    return true;
  }

  isConsumed(tokenHash: string): boolean {
    return this.consumed.has(tokenHash);
  }
}

export class PresentationTokenMint {
  mint(userId: string, credentialId: string): MintedToken {
    const now = Math.floor(Date.now() / 1000);
    const windowStartSec = Math.floor(now / TOKEN_WINDOW_SECONDS) * TOKEN_WINDOW_SECONDS;
    const windowStart = new Date(windowStartSec * 1000);
    const expiresAt = new Date((windowStartSec + TOKEN_WINDOW_SECONDS) * 1000);
    const nonce = randomBytes(8).toString('hex');
    const opaqueToken = `${credentialId}.${windowStartSec}.${nonce}`;
    const tokenHash = createHash('sha256').update(opaqueToken).digest('hex');
    return { opaqueToken, tokenHash, windowStart, expiresAt };
  }

  hash(opaqueToken: string): string {
    return createHash('sha256').update(opaqueToken).digest('hex');
  }
}

export const tokenStore = new TokenStore();
export const presentationTokenMint = new PresentationTokenMint();
