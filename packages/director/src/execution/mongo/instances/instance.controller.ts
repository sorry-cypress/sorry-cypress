import { InstanceResult, TestV670 } from '@sorry-cypress/common';
import {
  AppError,
  INSTANCE_NOT_EXIST,
  INSTANCE_NO_CREATE_TEST_DTO,
  SCREENSHOT_URL_UPDATE_FAILED,
} from '@src/lib/errors';
import { ExecutionDriver } from '@src/types';
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
  // fetch tokens from stored _createTestsPayload and merge
  const { cypressConfig, tests } = instance._createTestsPayload;
  const mergedTests = update.tests.map((t) => {
    const existingTest = (tests as TestV670[]).find(
      (i) => i.clientId === t.clientId
    );
    return { ...existingTest, ...t, testId: t.clientId };
  });
  const instanceResult: InstanceResult = {
    ...update,
    cypressConfig,
    tests: mergedTests,
  };
  await modelSetInstanceResults(instanceId, instanceResult);

  return instanceResult;
};
