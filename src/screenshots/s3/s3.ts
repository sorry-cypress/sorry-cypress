import aws from 'aws-sdk';
import { S3_BUCKET } from './config';
import { S3SignedUploadResult } from './types';

const BUCKET_URL = `https://${S3_BUCKET}.s3.amazonaws.com`;
const ContentType = 'image/png';

const s3 = new aws.S3({
  signatureVersion: 'v4'
});

export const getUploadURL = async (
  key: string
): Promise<S3SignedUploadResult> => {
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: key,
    Expires: 60,
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
