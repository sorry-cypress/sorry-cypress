import { AssetUploadInstruction } from '@sorry-cypress/common';
import * as Minio from 'minio';
import {
  MINIO_ACCESS_KEY,
  MINIO_BUCKET,
  MINIO_ENDPOINT,
  MINIO_PORT,
  MINIO_READ_URL_PREFIX,
  MINIO_SECRET_KEY,
  MINIO_UPLOAD_URL_PREFIX,
  MINIO_URL,
  MINIO_USESSL,
  UPLOAD_EXPIRY_SECONDS,
} from './config';
import { S3SignedUploadResult } from './types';

const BUCKET_URL = `${MINIO_URL}:${MINIO_PORT}/${MINIO_BUCKET}`;
const VideoContentType = 'video/mp4';

const minioClient = new Minio.Client({
  endPoint: MINIO_ENDPOINT,
  port: +MINIO_PORT,
  useSSL: MINIO_USESSL == 'true',
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
});

interface GetUploadURLParams {
  key: string;
  ContentType?: string;
  expiry?: number;
}
export const getUploadUrl = async ({
  key,
  expiry = UPLOAD_EXPIRY_SECONDS,
}: GetUploadURLParams): Promise<S3SignedUploadResult> => {
  return new Promise((resolve, reject) => {
    minioClient.presignedPutObject(
      MINIO_BUCKET,
      key,
      expiry,
      (error: Error, uploadUrl: string) => {
        if (error) {
          return reject(error);
        }

        if (MINIO_UPLOAD_URL_PREFIX) {
          uploadUrl = replacePrefix(
            uploadUrl,
            MINIO_UPLOAD_URL_PREFIX,
            MINIO_BUCKET,
            key
          );
        }

        return resolve({
          readUrl: `${MINIO_READ_URL_PREFIX || BUCKET_URL}/${key}`,
          uploadUrl,
        });
      }
    );
  });
};

const replacePrefix = (uploadUrl, prefix, bucket, key) => {
  // Minio is proxied and the internal minio api endpoint is not accessible externally
  // replace the http://minio:9000/{bucket}/{key}?{parameters}
  // with {MINIO_UPLOAD_URL_PREFIX}/{key}?{parameters}

  const afterProtocol = uploadUrl.split('//').slice(1).join('//');
  const afterKey = afterProtocol
    .split(`/${bucket}/${key}`)
    .slice(1)
    .join(`/${bucket}/${key}`);
  return `${prefix}/${key}${afterKey}`;
};

export const getImageUploadUrl = async (
  key: string
): Promise<AssetUploadInstruction> => getUploadUrl({ key: `${key}.png` });

export const getVideoUploadUrl = async (
  key: string
): Promise<AssetUploadInstruction> =>
  getUploadUrl({
    key: `${key}.mp4`,
    ContentType: VideoContentType,
  });
