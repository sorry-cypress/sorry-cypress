export const S3_URL = process.env.S3_URL || 'https://s3.amazonaws.com/';
export const S3_BUCKET = process.env.S3_BUCKET || 'sorry-cypress';
export const S3_REGION = process.env.S3_REGION || 'us-east-1';
export const S3_IMAGE_KEY_PREFIX = process.env.S3_IMAGE_KEY_PREFIX || undefined;
export const S3_VIDEO_KEY_PREFIX = process.env.S3_VIDEO_KEY_PREFIX || undefined;
export const UPLOAD_EXPIRY_SECONDS = parseInt(
  process.env.UPLOAD_EXPIRY_SECONDS || '90',
  10
);