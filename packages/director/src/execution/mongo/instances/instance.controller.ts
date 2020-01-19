import {
  insertInstance,
  setScreenshotUrl as modelsetScreenshotUrl,
  setInstanceResults as modelSetInstanceResults,
  setvideoUrl as modelsetvideoUrl
} from './instance.model';
import { ExecutionDriver } from '@src/types';

import { AppError, SCREENSHOT_URL_UPDATE_FAILED } from '@src/lib/errors';

export const createInstance = insertInstance;

export const setInstanceResults = modelSetInstanceResults;

export const setScreenshotUrl: ExecutionDriver['setScreenshotUrl'] = async (
  instanceId,
  screenshotId,
  screenshotURL
) => {
  try {
    await modelsetScreenshotUrl(instanceId, screenshotId, screenshotURL);
  } catch {
    throw new AppError(SCREENSHOT_URL_UPDATE_FAILED);
  }
};

export const setVideoUrl: ExecutionDriver['setVideoUrl'] = async ({
  instanceId,
  videoUrl
}) => modelsetvideoUrl(instanceId, videoUrl);
