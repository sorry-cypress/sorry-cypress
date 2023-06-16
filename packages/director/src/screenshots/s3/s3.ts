import { AssetUploadInstruction,AssetDownloadInstruction } from '@sorry-cypress/common';
import aws from 'aws-sdk';
import { sanitizeS3KeyPrefix } from '../utils/';
import {
  S3_ACL,
  S3_BUCKET,
  S3_FORCE_PATH_STYLE,
  S3_IMAGE_KEY_PREFIX,
  S3_READ_URL_PREFIX,
  S3_REGION,
  S3_VIDEO_KEY_PREFIX,
  S3_UPLOAD_EXPIRY_SECONDS,
  S3_DOWNLOAD_EXPIRY_SECONDS,
  S3_PRESIGN_DOWNLOAD_URLS
} from './config';
import { S3SignedUploadResult, S3SignedDownloadResult } from './types';

const BUCKET_URL = S3_FORCE_PATH_STYLE
  ? `https://s3.amazonaws.com/${S3_BUCKET}`
  : `https://${S3_BUCKET}.s3.amazonaws.com`;

const ImageContentType = 'image/png';
const VideoContentType = 'video/mp4';

const s3 = new aws.S3({
  region: S3_REGION,
  signatureVersion: 'v4',
});

interface GetUploadURLParams {
  key: string;
  ContentType?: string;
  Expires?: number;
}

interface GetDownloadURLParams {
  key: string;
  Expires?: number;
}

// Signed uploads
export const getUploadUrl = async ({
  key,
  ContentType = ImageContentType,
  Expires = S3_UPLOAD_EXPIRY_SECONDS,
}: GetUploadURLParams): Promise<S3SignedUploadResult> => {
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: key,
    Expires,
    ContentType,
    ACL: S3_ACL,
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
          readUrl: `${S3_READ_URL_PREFIX || BUCKET_URL}/${key}`,
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
  });

export const getVideoUploadUrl = async (
  key: string
): Promise<AssetUploadInstruction> =>
  getUploadUrl({
    key: `${sanitizeS3KeyPrefix(S3_VIDEO_KEY_PREFIX)}${key}.mp4`,
    ContentType: VideoContentType,
    Expires: S3_UPLOAD_EXPIRY_SECONDS,
  });

// Signed downloads
export const getDownloadUrl = async ({
  key,
  Expires = S3_DOWNLOAD_EXPIRY_SECONDS,
}: GetDownloadURLParams): Promise<S3SignedDownloadResult> => {
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: key,
    Expires
  };

  return new Promise((resolve, reject) => {
    s3.getSignedUrl(
      'getObject',
      s3Params,
      (error: Error, downloadUrl: string) => {
        if (error) {
          return reject(error);
        }
        return resolve({
          downloadUrl: `${S3_READ_URL_PREFIX || BUCKET_URL}/${key}`
        });
      }
    );
  });
};

export const getImageDownloadUrl = async (
  key: string
): Promise<AssetDownloadInstruction> =>
  getDownloadUrl({
    key: `${sanitizeS3KeyPrefix(S3_IMAGE_KEY_PREFIX)}${key}.png`,
  });

export const getVideoDownloadUrl = async (
  key: string
): Promise<AssetDownloadInstruction> =>
  getDownloadUrl({
    key: `${sanitizeS3KeyPrefix(S3_VIDEO_KEY_PREFIX)}${key}.mp4`,
    Expires: S3_DOWNLOAD_EXPIRY_SECONDS,
  });
