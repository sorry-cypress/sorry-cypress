import { AsyncLocalStorage } from 'async_hooks';
import { IncomingMessage, OutgoingMessage } from 'http';
import { Logger } from 'pino';
import { v4 as uuid } from 'uuid';
import { createLogger } from './logger';

const asyncLocalStorage = new AsyncLocalStorage<Map<string, unknown>>();

export const getLogger = (): Logger => {
  const asyncStore = asyncLocalStorage.getStore();
  if (asyncStore?.has('logger')) {
    return asyncStore.get('logger') as Logger;
  }
  return createLogger();
};

export const setLoggerMiddleware = (
  req: IncomingMessage,
  _res: OutgoingMessage,
  next: () => void
) => {
  const store = new Map();
  store.set(
    'logger',
    createLogger((req?.headers['X-Amzn-Trace-Id'] as string) ?? uuid())
  );
  return asyncLocalStorage.run(store, next);
};

export const setLogger = (id: string, next: () => void) => {
  const store = new Map();
  store.set('logger', createLogger(id));
  return asyncLocalStorage.run(store, next);
};
