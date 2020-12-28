import aws from 'aws-sdk';
import {
  S3_BUCKET,
  S3_REGION,
  S3_IMAGE_KEY_PREFIX,
  S3_VIDEO_KEY_PREFIX,
  FILES_EXPIRATION,
  S3_ENDPOINT,
  S3_FORCE_PATH_STYLE,
} from './config';
import { S3SignedUploadResult } from './types';
import { AssetUploadInstruction } from '@src/types';
import { sanitizeS3KeyPrefix } from './utils';

const BUCKET_URL = `https://${S3_BUCKET}.s3.amazonaws.com`;
const ImageContentType = 'image/png';
const VideoContentType = 'video/mp4';

const s3 = new aws.S3({
  region: S3_REGION,
  signatureVersion: 'v4',
  endpoint: S3_ENDPOINT,
  s3ForcePathStyle: S3_FORCE_PATH_STYLE,
});

interface GetUploadURLParams {
  key: string;
  ContentType?: string;
  Expires?: number;
}

export const getUploadUrl = async ({
  key,
  ContentType = ImageContentType,
  Expires = FILES_EXPIRATION,
}: GetUploadURLParams): Promise<S3SignedUploadResult> => {
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: key,
    Expires,
    ContentType,
  };

  const s3ParamsRead = {
      Bucket: S3_BUCKET,
      Expires,
      Key: key,
    };
  
    const s3ParamsUpload = {
      Expires,
      ContentType,
      ...s3ParamsRead,
    };

  return new Promise((resolve, reject) => {
    const signedReadURL = s3.getSignedUrl('getObject', s3ParamsRead);
    s3.getSignedUrl(
      'putObject',
      s3ParamsUpload,
      (error: Error, uploadUrl: string) => {
        if (error) {
          return reject(error);
        }
        return resolve({
          readUrl: signedReadURL,
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
    key: `${sanitizeS3KeyPrefix(S3_IMAGE_KEY_PREFIX)}${key}.png`,
    Expires: FILES_EXPIRATION,
  });

export const getVideoUploadUrl = async (
  key: string
): Promise<AssetUploadInstruction> =>
  getUploadUrl({
    key: `${sanitizeS3KeyPrefix(S3_VIDEO_KEY_PREFIX)}${key}.mp4`,
    ContentType: VideoContentType,
    Expires: FILES_EXPIRATION,
  });
