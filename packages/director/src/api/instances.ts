import { getExecutionDriver, getScreenshotsDriver } from '@src/drivers';
import { RUN_NOT_EXIST } from '@src/lib/errors';
import { hookEvents } from '@src/lib/hooksEnums';
import { reportToHook } from '@src/lib/hooksReporter';
import { RequestHandler } from 'express';
import {
  InstanceResult,
  ScreenshotUploadInstruction,
  AssetUploadInstruction,
  UpdateInstanceResponse,
} from '@src/types';

export const handleCreateNextTask: RequestHandler = async (req, res) => {
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
    } = await executionDriver.getNextTask(runId);

    if (instance === null) {
      console.log(`<< All tasks claimed`, { runId, machineId });
      return res.json({
        spec: null,
        instanceId: null,
        claimedInstances,
        totalInstances,
      });
    }

    const run = await executionDriver.getRunWithSpecs(runId);
    reportToHook({
      hookEvent: hookEvents.INSTANCE_START,
      reportData: {
        run,
        instance,
      },
      project: await executionDriver.getProjectById(run.meta.projectId),
    });

    console.log(`<< INSTANCE_START hook called`, instance.instanceId);

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
  const project = await executionDriver.getProjectById(run.meta.projectId);
  const isRunStillRunning = run.specs.reduce(
    (
      wasRunning: boolean,
      currentSpec: {
        claimed: boolean;
        results: any;
      },
      index: number
    ) => {
      return (
        !currentSpec.claimed || !run.specsFull[index].results || wasRunning
      );
    },
    false
  );

  reportToHook({
    hookEvent: hookEvents.INSTANCE_FINISH,
    reportData: {
      run,
      instance,
    },
    project,
  }).then(() => {
    console.log(`<< INSTANCE_FINISH hook called`, instance.instanceId);
    // We should probably add a flag to the actual run here aswell
    // We should also probably do a check to see if all specs passed and set a flag of success or fail
    if (!isRunStillRunning) {
      reportToHook({
        hookEvent: hookEvents.RUN_FINISH,
        reportData: {
          run,
          instance,
        },
        project,
      });
      console.log(`<< RUN_FINISH hook called`, run.runId);
    }
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
