import * as Minio from 'minio';
import { MINIO_BUCKET, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_READ_URL_PREFIX, MINIO_ENDPOINT, MINIO_PORT, MINIO_URL, MINIO_USESSL } from './config';
import { S3SignedUploadResult } from './types';
import { AssetUploadInstruction } from '@src/types';

const BUCKET_URL = `${MINIO_URL}:${MINIO_PORT}/${MINIO_BUCKET}`;
const ImageContentType = 'image/png';
const VideoContentType = 'video/mp4';

const minioClient = new Minio.Client({
  endPoint: MINIO_ENDPOINT,
  port: +MINIO_PORT,
  useSSL: (MINIO_USESSL == 'true'),
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY
});

interface GetUploadURLParams {
  key: string;
  ContentType?: string;
}
export const getUploadUrl = async ({
  key,
  ContentType = ImageContentType,
}: GetUploadURLParams): Promise<S3SignedUploadResult> => {
  const s3Params = {
    Bucket: MINIO_BUCKET,
    Key: key,
    ContentType,
  };

  return new Promise((resolve, reject) => {
    minioClient.presignedPutObject(
      MINIO_BUCKET,
      key,
      (error: Error, uploadUrl: string) => {
        if (error) {
          return reject(error);
        }
        return resolve({
          readUrl: `${MINIO_READ_URL_PREFIX || BUCKET_URL}/${key}`,
          uploadUrl,
        });
      }
    );
  });
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
