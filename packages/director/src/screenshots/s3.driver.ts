import md5 from 'md5';
import {
  ScreenshotsDriver,
  InstanceResult,
  ScreenshotUploadInstruction,
  Screenshot,
  AssetUploadInstruction
} from '@src/types';

import { isInstanceFailed } from '@src/lib/results';
import {
  getImageUploadUrl,
  getVideoUploadUrl as s3getVideoUploadUrl
} from './s3';

const getScreenshotUploadInstruction = (namespace: string) => async (
  screenshot: Screenshot
): Promise<ScreenshotUploadInstruction> => {
  const key = md5(`${namespace}:${screenshot.screenshotId}`);
  return {
    ...(await getImageUploadUrl(key)),
    screenshotId: screenshot.screenshotId
  };
};

export const getVideoUploadUrl = async (
  instanceId: string,
  result: InstanceResult
): Promise<AssetUploadInstruction | null> => {
  if (!result.cypressConfig.video) {
    return null;
  }
  if (!isInstanceFailed(result) && !result.cypressConfig.videoUploadOnPasses) {
    return null;
  }
  return await s3getVideoUploadUrl(instanceId);
};

export const getScreenshotsUploadUrls = async (
  instanceId: string,
  result: InstanceResult
): Promise<ScreenshotUploadInstruction[]> => {
  if (result.screenshots.length === 0) {
    return [];
  }

  return Promise.all(
    result.screenshots.map(getScreenshotUploadInstruction(instanceId))
  );
};

export const driver: ScreenshotsDriver = {
  id: 's3',
  init: () => Promise.resolve(),
  getScreenshotsUploadUrls,
  getVideoUploadUrl
};
