import {
  AssetUploadInstruction,
  InstanceResult,
  ScreenshotUploadInstruction,
  SetInstanceTestsPayload,
  UpdateInstanceResponse,
  UpdateInstanceResultsPayload,
} from '@sorry-cypress/common';
import {
  getExecutionDriver,
  getScreenshotsDriver,
} from '@sorry-cypress/director/drivers';
import { RUN_NOT_EXIST } from '@sorry-cypress/director/lib/errors';
import {
  emitInstanceFinish,
  emitInstanceStart,
  emitRunFinish,
  emitRunStart,
} from '@sorry-cypress/director/lib/hooks/events';
import { getLogger } from '@sorry-cypress/logger';
import { RequestHandler } from 'express';

export const createInstance: RequestHandler = async (req, res) => {
  const { groupId, machineId } = req.body;
  const { runId } = req.params;
  const cypressVersion = req.headers['x-cypress-version']?.toString() ?? '';

  const executionDriver = await getExecutionDriver();

  getLogger().log(
    { ...req.body, ...req.headers },
    `Machine is requesting a new task`
  );

  try {
    const task = await executionDriver.getNextTask({
      runId,
      machineId,
      groupId,
      cypressVersion,
    });

    if (task.instance === null) {
      getLogger().log(
        { runId, machineId, groupId, task },
        `All spec files claimed, nothing to run`
      );
      return res.json({
        spec: null,
        instanceId: null,
        claimedInstances: task.claimedInstances,
        totalInstances: task.totalInstances,
      });
    }

    emitInstanceStart({
      runId,
      groupId,
      spec: task.instance.spec,
    });

    if (task.claimedInstances === 1) {
      getLogger().log(
        {
          ...task,
        },
        'Detected first claimed instance for group'
      );
      emitRunStart({
        runId,
        groupId,
        projectId: task.projectId,
      });
    }

    //Instance Start
    getLogger().log(
      { ...task.instance, machineId, groupId, cypressVersion },
      `Sending a new instance to machine`
    );

    return res.json({
      spec: task.instance.spec,
      instanceId: task.instance.instanceId,
      claimedInstances: task.claimedInstances,
      totalInstances: task.totalInstances,
    });
  } catch (error) {
    getLogger().error({ error }, 'Error while creating instance...');
    if (error.code && error.code === RUN_NOT_EXIST) {
      return res.sendStatus(404);
    }
    throw error;
  }
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

  getLogger().log({ instanceId, ...req.body }, 'Received instance tests');
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

  getLogger().log({ instanceId, ...req.body }, `Received instance results`);
  const executionDriver = await getExecutionDriver();

  const instance = await executionDriver.updateInstanceResults(
    instanceId,
    results
  );

  if (!instance.results) {
    throw new Error('Missing results on instance after updating');
  }

  completeInstance(instanceId, instance.runId, instance.groupId);

  try {
    const result = await getInstanceScreenshots(instanceId, instance.results);
    res.json(result);
  } catch (error) {
    getLogger().error(
      { error, instanceId },
      'Unable to get upload instructions'
    );

    res.json({});
  }

  return;
};

async function completeInstance(
  instanceId: string,
  runId: string,
  groupId: string
) {
  const executionDriver = await getExecutionDriver();

  const instance = await executionDriver.getInstanceById(instanceId);
  if (!instance) {
    throw new Error('Cannot find instance to complete');
  }
  emitInstanceFinish({
    runId: instance.runId,
    groupId: instance.groupId,
    spec: instance.spec,
  });

  if (await executionDriver.allGroupSpecsCompleted(runId, groupId)) {
    // delay for a few seconds to prevent concurrent updates
    await new Promise((resolve) => setTimeout(resolve, 3000));
    emitRunFinish({
      runId,
      groupId,
    });
  }

  await executionDriver.maybeSetRunCompleted(runId);
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

  getLogger().log(
    { instanceId, screenshotUploadUrls, videoUploadInstructions },
    `Sending assets upload URLs`
  );

  const responsePayload: UpdateInstanceResponse = {
    screenshotUploadUrls,
  };
  if (videoUploadInstructions) {
    responsePayload.videoUploadUrl = videoUploadInstructions.uploadUrl;
  }
  return responsePayload;
}
