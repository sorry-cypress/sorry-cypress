import md5 = require('md5');
import {
  ScreenshotsDriver,
  InstanceResult,
  ScreenshotUploadInstruction,
  Screenshot
} from 'types';
import { getUploadURL } from './s3';

const getScreenshotUploadInstruction = (namespace: string) => async (
  screenshot: Screenshot
): Promise<ScreenshotUploadInstruction> => {
  const key = md5(`${namespace}:${screenshot.screenshotId}`);
  return {
    ...(await getUploadURL(key)),
    screenshotId: screenshot.screenshotId
  };
};

export const getScreenshotsUploadURLs = async (
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

export const S3ScreenshotsDriver: ScreenshotsDriver = {
  getScreenshotsUploadURLs
};
