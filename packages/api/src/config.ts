import 'dotenv/config';

export const PORT = process.env.PORT || 4000;
export const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017';
export const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'sorry-cypress';
export const MONGODB_USER = process.env.MONGODB_USER || undefined;
export const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || undefined;
export const MONGODB_AUTH_MECHANISM =
  process.env.MONGODB_AUTH_MECHANISM || undefined;

export const RUNS_TTL_OPTIONS = { expireAfterSeconds: Number(process.env.RUNS_TTL) } || {};
export const INSTANCES_TTL_OPTIONS = { expireAfterSeconds: Number(process.env.INSTANCES_TTL) } || {};
export const PROJECTS_TTL_OPTIONS = { expireAfterSeconds: Number(process.env.PROJECTS_TTL) } || {};
