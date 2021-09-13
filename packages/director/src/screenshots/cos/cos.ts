import { AssetUploadInstruction } from '@sorry-cypress/common';
import { getLogger } from '@sorry-cypress/logger';
import ibm from 'ibm-cos-sdk';
import { sanitizeS3KeyPrefix } from '../utils';
import {
  COS_ACCESSKEY,
  COS_BUCKET,
  COS_IMAGE_KEY_PREFIX,
  COS_REGION,
  COS_SECRETKEY,
  COS_VIDEO_KEY_PREFIX
} from './config';
import { S3SignedUploadResult } from './types';

const BUCKET_URL = `https://s3.${COS_REGION}.cloud-object-storage.appdomain.cloud`;
const COS_READ_ENDPOINT = `https://${COS_BUCKET}.s3.${COS_REGION}.cloud-object-storage.appdomain.cloud`;
const ImageContentType = 'image/png';
const VideoContentType = 'video/mp4';

if (!COS_ACCESSKEY) {
  throw new Error('No COS_ACCESSKEY defined');
}
if (!COS_SECRETKEY) {
  throw new Error('No COS_SECRETKEY defined');
}
const s3 = new ibm.S3({
  endpoint: BUCKET_URL,
  credentials: new ibm.Credentials(COS_ACCESSKEY, COS_SECRETKEY, undefined),
  signatureVersion: 'v4',
});

interface GetUploadURLParams {
  key: string;
  ContentType?: string;
  Expires?: number;
}

export const getUploadUrl = async ({
  key,
  ContentType = ImageContentType,
  Expires = 60,
}: GetUploadURLParams): Promise<S3SignedUploadResult> => {
  const s3Params = {
    Bucket: COS_BUCKET,
    Key: key,
    Expires,
    ContentType,
  };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl(
      'putObject',
      s3Params,
      (error: Error, uploadUrl: string) => {
        if (error) {
          getLogger().error(
            { error },
            'Errors while getting signed upload URL'
          );
          return reject(error);
        }
        return resolve({
          readUrl: `${COS_READ_ENDPOINT || BUCKET_URL}/${key}`,
          uploadUrl,
        });
      }
    );
  });
};

export const getImageUploadUrl = async (
  key: string
): Promise<AssetUploadInstruction> =>
  getUploadUrl({
    key: `${sanitizeS3KeyPrefix(COS_IMAGE_KEY_PREFIX)}${key}.png`,
  });

export const getVideoUploadUrl = async (
  key: string
): Promise<AssetUploadInstruction> =>
  getUploadUrl({
    key: `${sanitizeS3KeyPrefix(COS_VIDEO_KEY_PREFIX)}${key}.mp4`,
    ContentType: VideoContentType,
    Expires: 90,
  });
