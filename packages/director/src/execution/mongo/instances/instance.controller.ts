import {
  insertInstance,
  setScreenshotURL as modelSetScreenshotURL,
  setInstanceResults as modelSetInstanceResults
} from './instance.model';
import { ExecutionDriver } from '@src/types';

import { AppError, SCREENSHOT_URL_UPDATE_FAILED } from '@src/lib/errors';

export const createInstance = insertInstance;

export const setInstanceResults = modelSetInstanceResults;

export const setScreenshotURL: ExecutionDriver['setScreenshotURL'] = async (
  instanceId,
  screenshotId,
  screenshotURL
) => {
  try {
    await modelSetScreenshotURL(instanceId, screenshotId, screenshotURL);
  } catch {
    throw new AppError(SCREENSHOT_URL_UPDATE_FAILED);
  }
};
