import {
  AppError,
  INSTANCE_NOT_EXIST,
  INSTANCE_NO_CREATE_TEST_DTO,
  SCREENSHOT_URL_UPDATE_FAILED,
} from '@src/lib/errors';
import { mergeInstanceResults } from '@src/lib/instance';
import { ExecutionDriver } from '@src/types';
import { updateRunSpecCompleted } from '../runs/run.controller';
import {
  getInstanceById,
  insertInstance,
  setInstanceResults as modelSetInstanceResults,
  setInstanceTests as modelSetInstanceTests,
  setScreenshotUrl as modelsetScreenshotUrl,
  setvideoUrl as modelsetvideoUrl,
} from './instance.model';

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
  videoUrl,
}) => modelsetvideoUrl(instanceId, videoUrl);

// save test creation to a temp field
export const setInstanceTests = modelSetInstanceTests;
// merge and save the results
export const updateInstanceResults: ExecutionDriver['updateInstanceResults'] = async (
  instanceId,
  update
) => {
  const instance = await getInstanceById(instanceId);
  if (!instance) {
    throw new AppError(INSTANCE_NOT_EXIST);
  }
  if (!instance._createTestsPayload) {
    throw new AppError(INSTANCE_NO_CREATE_TEST_DTO);
  }
  const instanceResult = mergeInstanceResults(
    instance._createTestsPayload,
    update
  );

  await Promise.all([
    modelSetInstanceResults(instanceId, instanceResult),
    updateRunSpecCompleted(instance.runId, instanceId),
  ]);

  return { ...instance, results: instanceResult };
};
