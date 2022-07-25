import { SetInstanceTestsPayload } from '@sorry-cypress/common';
import {
  AppError,
  INSTANCE_NOT_EXIST,
  SCREENSHOT_URL_UPDATE_FAILED,
} from '@sorry-cypress/director/lib/errors';
import { mergeInstanceResults } from '@sorry-cypress/director/lib/instance';
import { ExecutionDriver } from '@sorry-cypress/director/types';
import { getLogger } from '@sorry-cypress/logger';
import { updateRunSpecCompleted } from '../runs/run.controller';
import { incProgressOverallTests } from '../runs/run.model';
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
// increment progress
export const setInstanceTests = async (
  instanceId: string,
  payload: SetInstanceTestsPayload
) => {
  const instance = await getInstanceById(instanceId);
  if (!instance) {
    getLogger().error(
      { instanceId },
      'No instance found for setting instance tests'
    );
    throw new Error('No instance found');
  }
  getLogger().log(
    { instanceId, runId: instance.runId, groupId: instance.groupId },
    'Setting instance tests'
  );
  await modelSetInstanceTests(instanceId, payload);
  getLogger().log(
    { instanceId, runId: instance.runId, groupId: instance.groupId },
    'Updating group progress'
  );

  await incProgressOverallTests(
    instance.runId,
    instance.groupId,
    instance.instanceId,
    payload.tests.length
  );
};

// merge and save the results
export const updateInstanceResults: ExecutionDriver['updateInstanceResults'] = async (
  instanceId,
  update
) => {
  const instance = await getInstanceById(instanceId);
  if (!instance) {
    getLogger().error(
      { instanceId },
      'No instance found for setting instance results'
    );
    throw new AppError(INSTANCE_NOT_EXIST);
  }

  // Correct for Mocha madness, where tests which are deliberately skipped are marked as 'pending'.
  // Since the test is finished when we get this result, it should be safe to say that no test should actually be pending at this point.
  // update.stats.failures += update.stats.skipped; // things that cypress reports as skipped are things skipped after a failure
  // update.stats.skipped = update.stats.pending; // things that cypress reports as pending are skipped by mocha
  // update.stats.pending = 0; // things can never be pending after execution is complete

  // update.tests.forEach((test) => {
  //   if (test.state === TestState.Skipped) {
  //     test.state = TestState.Failed;
  //   }
  //   if (test.state === TestState.Pending) {
  //     test.state = TestState.Skipped;
  //   }
  // });

  const instanceResult = mergeInstanceResults(
    instance._createTestsPayload,
    update
  );

  getLogger().log(
    { instanceId, runId: instance.runId, groupId: instance.groupId },
    'Setting instance results'
  );
  await Promise.all([
    modelSetInstanceResults(instanceId, instanceResult),
    updateRunSpecCompleted(
      instance.runId,
      instance.groupId,
      instanceId,
      instanceResult
    ),
  ]);

  return { ...instance, results: instanceResult };
};
