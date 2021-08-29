import 'dotenv/config';

export const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017';
export const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'sorry-cypress';
export const MONGODB_USER = process.env.MONGODB_USER || undefined;
export const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || undefined;
export const MONGODB_TLS = process.env.MONGODB_TLS || undefined;
export const MONGODB_AUTH_MECHANISM =
  process.env.MONGODB_AUTH_MECHANISM || undefined;
