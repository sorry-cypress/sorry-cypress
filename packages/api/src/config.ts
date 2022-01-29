import 'dotenv/config';

export const HOST = process.env.HOST || '0.0.0.0';
export const PORT = process.env.PORT || 4000;
export const PAGE_ITEMS_LIMIT = Number(process.env.PAGE_ITEMS_LIMIT ?? 20);
