import ibm from 'ibm-cos-sdk';
import {
  COS_ACCESSKEY,
  COS_SECRETKEY,
  COS_REGION,
  COS_BUCKET,
  COS_IMAGE_KEY_PREFIX,
  COS_VIDEO_KEY_PREFIX,
} from './config';
import { S3SignedUploadResult } from './types';
import { AssetUploadInstruction } from '@src/types';
import { sanitizeS3KeyPrefix } from '../utils';

const BUCKET_URL = `https://s3.${COS_REGION}.cloud-object-storage.appdomain.cloud`;
const COS_READ_ENDPOINT = `https://${COS_BUCKET}.s3.${COS_REGION}.cloud-object-storage.appdomain.cloud`;
const ImageContentType = 'image/png';
const VideoContentType = 'video/mp4';

const s3 = new ibm.S3({
  endpoint: BUCKET_URL,
  credentials: new ibm.Credentials(COS_ACCESSKEY, COS_SECRETKEY, null),
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
          console.log('errors from signed request: ' + error);
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
