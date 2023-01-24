import 'dotenv/config';

export const HOST = process.env.HOST || '0.0.0.0';
export const PORT = Number(process.env.PORT || 4000);
export const PAGE_ITEMS_LIMIT = Number(process.env.PAGE_ITEMS_LIMIT ?? 20);
export const CI_BUILD_BATCH_SIZE = Number(
  process.env.CI_BUILD_BATCH_SIZE ?? 1000
);
export const APOLLO_PLAYGROUND = process.env.APOLLO_PLAYGROUND || 'false';
export const BASE_PATH = process.env.BASE_PATH || '/';
