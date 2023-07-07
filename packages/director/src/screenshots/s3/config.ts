export const S3_BUCKET = process.env.S3_BUCKET || 'sorry-cypress';
export const S3_REGION = process.env.S3_REGION || 'us-east-1';
export const S3_ACL = process.env.S3_ACL || 'public-read';
export const S3_FORCE_PATH_STYLE = process.env.S3_FORCE_PATH_STYLE || false;
export const S3_READ_URL_PREFIX = process.env.S3_READ_URL_PREFIX || undefined;
export const S3_IMAGE_KEY_PREFIX = process.env.S3_IMAGE_KEY_PREFIX || undefined;
export const S3_VIDEO_KEY_PREFIX = process.env.S3_VIDEO_KEY_PREFIX || undefined;
export const S3_PRESIGN_DOWNLOAD_URLS = process.env.S3_PRESIGN_DOWNLOAD_URLS || false;
export const UPLOAD_EXPIRY_SECONDS = parseInt(
  process.env.UPLOAD_EXPIRY_SECONDS || '90',
  90
);
export const S3_DOWNLOAD_EXPIRY_SECONDS = parseInt(
  process.env.S3_DOWNLOAD_EXPIRY_SECONDS || '90',
  90
);
