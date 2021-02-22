import { getExecutionDriver, getScreenshotsDriver } from '@src/drivers';
import { RUN_NOT_EXIST } from '@src/lib/errors';
import { emitInstanceFinish, emitInstanceStart } from '@src/lib/hooks/events';
import {
  AssetUploadInstruction,
  InstanceResult,
  ScreenshotUploadInstruction,
  UpdateInstanceResponse,
} from '@src/types';
import { RequestHandler } from 'express';

export const handleCreateInstance: RequestHandler = async (req, res) => {
  const { groupId, machineId } = req.body;
  const { runId } = req.params;
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
    } = await executionDriver.getNextTask({ runId, machineId, groupId });

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

export const handleUpdateInstance: RequestHandler = async (req, res) => {
  const { instanceId } = req.params;
  const result: InstanceResult = req.body;
  const executionDriver = await getExecutionDriver();
  const screenshotsDriver = await getScreenshotsDriver();

  console.log(`>> Received instance result`, { instanceId });
  await executionDriver.setInstanceResults(instanceId, result);
  const instance = await executionDriver.getInstanceById(instanceId);
  const run = await executionDriver.getRunWithSpecs(instance.runId);

  emitInstanceFinish({
    runId: run.runId,
  });

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
  return res.json(responsePayload);
};
