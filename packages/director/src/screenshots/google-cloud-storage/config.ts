export const GCS_BUCKET = process.env.GCS_BUCKET ?? 'sorry-cypress';
export const GCS_IS_BUCKET_PUBLIC_READ =
  process.env.GCS_IS_BUCKET_PUBLIC_READ ?? 'false';
export const GCS_PROJECT_ID = process.env.GCS_PROJECT_ID;
export const GCS_IMAGE_KEY_PREFIX = process.env.GCS_IMAGE_KEY_PREFIX ?? '';
export const GCS_VIDEO_KEY_PREFIX = process.env.GCS_VIDEO_KEY_PREFIX ?? '';

export const UPLOAD_EXPIRY_SECONDS = Number(
  process.env.UPLOAD_EXPIRY_SECONhDS || '300'
);
