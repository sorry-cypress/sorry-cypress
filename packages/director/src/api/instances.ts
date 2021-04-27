import { getExecutionDriver, getScreenshotsDriver } from '@src/drivers';
import { RUN_NOT_EXIST } from '@src/lib/errors';
import { emitInstanceFinish, emitInstanceStart } from '@src/lib/hooks/events';
import {
  AssetUploadInstruction,
  InstanceResult,
  ScreenshotUploadInstruction,
  SetInstanceTestsPayload,
  UpdateInstanceResponse,
  UpdateInstanceResultsPayload,
} from '@src/types';
import { RequestHandler } from 'express';

export const createInstance: RequestHandler = async (req, res) => {
  const { groupId, machineId } = req.body;
  const { runId } = req.params;
  const cypressVersion = req.headers['x-cypress-version'].toString();

  const executionDriver = await getExecutionDriver();

  console.log(`>> Machine is requesting a new task`, {
    runId,
    machineId,
    groupId,
  });

  try {
    const {
      instance,
      claimedInstances,
      totalInstances,
    } = await executionDriver.getNextTask({
      runId,
      machineId,
      groupId,
      cypressVersion,
    });

    if (instance === null) {
      console.log(`<< All tasks claimed`, { runId, machineId, groupId });
      return res.json({
        spec: null,
        instanceId: null,
        claimedInstances,
        totalInstances,
      });
    }

    emitInstanceStart({
      runId,
    });

    //Instance Start
    console.log(`<< Sending new task to machine`, instance);
    return res.json({
      spec: instance.spec,
      instanceId: instance.instanceId,
      claimedInstances,
      totalInstances,
    });
  } catch (error) {
    if (error.code && error.code === RUN_NOT_EXIST) {
      return res.sendStatus(404);
    }
    throw error;
  }
};

/**
 * cypress prior to 6.7.0 sends instance results in a single API call
 */
export const updateInstance: RequestHandler = async (req, res) => {
  const { instanceId } = req.params;
  const result: InstanceResult = req.body;

  console.log(`>> Received instance result`, { instanceId });
  const executionDriver = await getExecutionDriver();
  await executionDriver.setInstanceResults(instanceId, result);
  completeInstance(instanceId);
  return res.json(await getInstanceScreenshots(instanceId, result));
};

// - /instances/:instanceId/tests before running a spec
export const setInstanceTests: RequestHandler<
  any,
  any,
  SetInstanceTestsPayload
> = async (req, res) => {
  const instanceTests = req.body;
  const { instanceId } = req.params;
  const executionDriver = await getExecutionDriver();
  console.log(`>> Received instance tests`, { instanceId });
  await executionDriver.setInstanceTests(instanceId, instanceTests);
  res.json({});
};

// 6.7.0+ /instances/:instanceId/results after completing a spec
export const updateInstanceResults: RequestHandler<
  any,
  any,
  UpdateInstanceResultsPayload
> = async (req, res) => {
  const { instanceId } = req.params;
  const results = req.body;

  console.log(`>> Received instance results`, { instanceId });
  const executionDriver = await getExecutionDriver();
  const instanceResult = await executionDriver.updateInstanceResults(
    instanceId,
    results
  );

  completeInstance(instanceId);
  try {
    const uploadInstructions = await getInstanceScreenshots(
      instanceId,
      instanceResult
    );
    return res.json(uploadInstructions);
  } catch (error) {
    console.error('Unable to get upload instructions', instanceId);
    res.json({});
  }

  return;
};

async function completeInstance(instanceId: string) {
  const executionDriver = await getExecutionDriver();
  const instance = await executionDriver.getInstanceById(instanceId);
  emitInstanceFinish({
    runId: instance.runId,
  });
}
async function getInstanceScreenshots(
  instanceId: string,
  result: InstanceResult
) {
  const executionDriver = await getExecutionDriver();
  const screenshotsDriver = await getScreenshotsDriver();

  const screenshotUploadUrls: ScreenshotUploadInstruction[] = await screenshotsDriver.getScreenshotsUploadUrls(
    instanceId,
    result
  );

  const videoUploadInstructions: AssetUploadInstruction | null = await screenshotsDriver.getVideoUploadUrl(
    instanceId,
    result
  );

  if (screenshotUploadUrls.length > 0) {
    screenshotUploadUrls.forEach((screenshot: ScreenshotUploadInstruction) => {
      executionDriver.setScreenshotUrl(
        instanceId,
        screenshot.screenshotId,
        screenshot.readUrl
      );
    });
  }

  if (videoUploadInstructions) {
    executionDriver.setVideoUrl({
      instanceId,
      videoUrl: videoUploadInstructions.readUrl,
    });
  }

  console.log(`<< Sending assets upload URLs`, {
    instanceId,
    screenshotUploadUrls,
    videoUploadInstructions,
  });

  const responsePayload: UpdateInstanceResponse = {
    screenshotUploadUrls,
  };
  if (videoUploadInstructions) {
    responsePayload.videoUploadUrl = videoUploadInstructions.uploadUrl;
  }
  return responsePayload;
}
