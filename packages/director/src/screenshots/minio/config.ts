export const MINIO_BUCKET = process.env.MINIO_BUCKET || 'sorry-cypress';
export const MINIO_ACCESS_KEY =
  process.env.MINIO_ACCESS_KEY || 'defaultAccessKey';
export const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY || 'defaultSecret';
export const MINIO_ACL = process.env.MINIO_ACL || 'public-read';
export const MINIO_READ_URL_PREFIX = process.env.MINIO_READ_URL_PREFIX || null;
export const MINIO_ENDPOINT =
  process.env.MINIO_ENDPOINT || 'storage.yourdomain.com';
export const MINIO_PORT = process.env.MINIO_PORT || '9000';
export const MINIO_USESSL = process.env.MINIO_USESSL || 'false';
export const MINIO_URL =
  process.env.MINIO_URL || 'https://storage.yourdomain.com';

export const UPLOAD_EXPIRY_SECONDS = parseInt(
  process.env.UPLOAD_EXPIRY_SECONDS || '90',
  90
);
