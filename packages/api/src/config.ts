import 'dotenv/config';

export const HOST = process.env.HOST || 'localhost';
export const PORT = process.env.PORT || 4000;
export const PAGE_ITEMS_LIMIT = Number(process.env.PAGE_ITEMS_LIMIT ?? 20);
