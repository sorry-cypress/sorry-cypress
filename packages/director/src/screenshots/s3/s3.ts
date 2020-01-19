import aws from 'aws-sdk';
import { S3_BUCKET, S3_REGION } from './config';
import { S3SignedUploadResult } from './types';
import { AssetUploadInstruction } from '@src/types';

const BUCKET_URL = `https://${S3_BUCKET}.s3.amazonaws.com`;
const ImageContentType = 'image/png';
const VideoContentType = 'video/mp4';

const s3 = new aws.S3({
  region: S3_REGION,
  signatureVersion: 'v4'
});

interface GetUploadURLParams {
  key: string;
  ContentType?: string;
  Expires?: number;
}
export const getUploadUrl = async ({
  key,
  ContentType = ImageContentType,
  Expires = 60
}: GetUploadURLParams): Promise<S3SignedUploadResult> => {
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: key,
    Expires,
    ContentType,
    ACL: 'public-read'
  };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl(
      'putObject',
      s3Params,
      (error: Error, uploadUrl: string) => {
        if (error) {
          return reject(error);
        }
        return resolve({
          readUrl: `${BUCKET_URL}/${key}`,
          uploadUrl
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
    Expires: 90
  });
