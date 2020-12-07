import ibm from 'ibm-cos-sdk';
import {
  COS_ENDPOINT,
  COS_APIKEY,
  COS_SERVICEINSTANCE,
  COS_REGION,
  S3_READ_URL_PREFIX,
  S3_IMAGE_KEY_PREFIX,
  S3_VIDEO_KEY_PREFIX,
  COS_BUCKET,
} from './config';
import { S3SignedUploadResult } from './types';
import { AssetUploadInstruction } from '@src/types';
import { sanitizeS3KeyPrefix } from './utils';

const BUCKET_URL = COS_ENDPOINT;
const ImageContentType = 'image/png';
const VideoContentType = 'video/mp4';


const s3 = new ibm.S3({
  endpoint: BUCKET_URL,
  apiKeyId: COS_APIKEY,
  serviceInstanceId: COS_SERVICEINSTANCE,
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
      return resolve({
        readUrl: `${S3_READ_URL_PREFIX || BUCKET_URL}/${key}`,
        uploadUrl,
      });

    // s3.getSignedUrl(
    //   'putObject',
    //   s3Params,
    //   (error: Error, uploadUrl: string) => {
    //     if (error) {
    //       return reject(error);
    //     }
    //     return resolve({
    //       readUrl: `${S3_READ_URL_PREFIX || BUCKET_URL}/${key}`,
    //       uploadUrl,
    //     });
    //   }
    // );
  });
};

export const getImageUploadUrl = async (
  key: string
): Promise<AssetUploadInstruction> =>
  getUploadUrl({
    key: `${sanitizeS3KeyPrefix(S3_IMAGE_KEY_PREFIX)}${key}.png`,
  });

export const getVideoUploadUrl = async (
  key: string
): Promise<AssetUploadInstruction> =>
  getUploadUrl({
    key: `${sanitizeS3KeyPrefix(S3_VIDEO_KEY_PREFIX)}${key}.mp4`,
    ContentType: VideoContentType,
    Expires: 90,
  });
