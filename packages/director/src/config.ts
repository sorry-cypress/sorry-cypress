import 'dotenv/config';

export const PORT = process.env.PORT || 1234;

export const DASHBOARD_URL =
  process.env.DASHBOARD_URL || `http://localhost:8080`;

export const EXECUTION_DRIVER =
  process.env.EXECUTION_DRIVER || '../execution/mongo/driver';

export const SCREENSHOTS_DRIVER =
  process.env.SCREENSHOTS_DRIVER || '../screenshots/dummy.driver';

export const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017';
export const MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'sorry-cypress';

export const ALLOWED_KEYS: string[] = process.env.ALLOWED_KEYS
  ? process.env.ALLOWED_KEYS.split(',')
  : null;

export const INACTIVITY_TIMEOUT_SECONDS = Number(
  process.env.INACTIVITY_TIMEOUT_SECONDS ?? 180
);

export const REDIS_URI = process.env.REDIS_URI;
