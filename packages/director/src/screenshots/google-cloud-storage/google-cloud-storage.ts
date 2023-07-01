import { Storage } from '@google-cloud/storage';
import { AssetUploadInstruction } from '@sorry-cypress/common';
import { sanitizeS3KeyPrefix } from '../utils/';
import {
  GCS_BUCKET,
  GCS_IMAGE_KEY_PREFIX,
  GCS_IS_BUCKET_PUBLIC_READ,
  GCS_PROJECT_ID,
  GCS_UPLOAD_URL_EXPIRY_IN_HOURS,
  GCS_VIDEO_KEY_PREFIX,
} from './config';

const SEVEN_DAYS_IN_SECONDS = 7 * 24 * 60 * 60;
const CLOUD_STORAGE_URL = `https://storage.googleapis.com/${GCS_BUCKET}`;
const GCS_SIGNED_VERSION = 'v4';

const ImageContentType = 'image/png';
const VideoContentType = 'video/mp4';

const storageClient = new Storage({
  projectId: GCS_PROJECT_ID,
});

interface GetUploadURLParams {
  key: string;
  contentType?: string;
}

export const getUploadUrl = async ({
  key,
  contentType = ImageContentType,
}: GetUploadURLParams): Promise<AssetUploadInstruction> => {
  const signedUploadUrlExpiresOn =
    Date.now() + 3600 * 1000 * GCS_UPLOAD_URL_EXPIRY_IN_HOURS;
  const signedReadUrlExpiresOn = Date.now() + 1000 * SEVEN_DAYS_IN_SECONDS; // 7 Days, Maximun supported on GCS v4 signed urls

  const [uploadUrl] = await storageClient
    .bucket(GCS_BUCKET)
    .file(key)
    .getSignedUrl({
      action: 'write',
      expires: signedUploadUrlExpiresOn,
      contentType,
      version: GCS_SIGNED_VERSION,
    });

  let readUrl = `${CLOUD_STORAGE_URL}/${key}`;

  if (GCS_IS_BUCKET_PUBLIC_READ !== 'true') {
    [readUrl] = await storageClient.bucket(GCS_BUCKET).file(key).getSignedUrl({
      action: 'read',
      expires: signedReadUrlExpiresOn,
      version: GCS_SIGNED_VERSION,
    });
  }

  return {
    readUrl,
    uploadUrl,
  };
};

export const getImageUploadUrl = async (
  key: string
): Promise<AssetUploadInstruction> =>
  getUploadUrl({
    key: `${sanitizeS3KeyPrefix(GCS_IMAGE_KEY_PREFIX)}${key}.png`,
    contentType: ImageContentType,
  });

export const getVideoUploadUrl = async (
  key: string
): Promise<AssetUploadInstruction> =>
  getUploadUrl({
    key: `${sanitizeS3KeyPrefix(GCS_VIDEO_KEY_PREFIX)}${key}.mp4`,
    contentType: VideoContentType,
  });
