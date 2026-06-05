import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContext {
  correlationId: string;
  ipAddress?: string;
  userAgent?: string;
  actorUserId?: string;
  clerkUserId?: string;
  orgId?: string;
  orgRole?: string;
}

export const requestContextStorage = new AsyncLocalStorage<RequestContext>();

export function getRequestContext(): RequestContext | undefined {
  return requestContextStorage.getStore();
}
