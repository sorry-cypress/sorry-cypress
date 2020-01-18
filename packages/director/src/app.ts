import express from 'express';
import bodyParser from 'body-parser';
import {
  InstanceResult,
  ScreenshotUploadInstruction,
  AssetUploadInstruction,
  ExecutionDriver,
  ScreenshotsDriver
} from '@src/types';
import { RUN_NOT_EXIST } from '@src/lib/errors';
import { UpdateInstanseResponse } from './types/response.types';

export const app = express();

app.use(
  bodyParser.json({
    limit: '50mb'
  })
);

app.get('/', (_, res) =>
  res.redirect('https://github.com/agoldis/sorry-cypress')
);

app.post('/runs', async (req, res) => {
  const { ciBuildId } = req.body;
  console.log(`>> Machine is joining a run`, { ciBuildId });

  const response = await app.get('executionDriver').createRun(req.body);

  console.log(`<< Responding to machine`, response);
  return res.json(response);
});

app.post('/runs/:runId/instances', async (req, res) => {
  const { groupId, machineId } = req.body;
  const { runId } = req.params;

  console.log(`>> Machine is requesting a new task`, {
    runId,
    machineId,
    groupId
  });

  try {
    const { instance, claimedInstances, totalInstances } = await app
      .get('executionDriver')
      .getNextTask(runId);
    if (instance === null) {
      console.log(`<< All tasks claimed`, { runId, machineId });
      return res.json({
        spec: null,
        instanceId: null,
        claimedInstances,
        totalInstances
      });
    }

    console.log(`<< Sending new task to machine`, instance);
    return res.json({
      spec: instance.spec,
      instanceId: instance.instanceId,
      claimedInstances,
      totalInstances
    });
  } catch (error) {
    if (error.code && error.code === RUN_NOT_EXIST) {
      return res.sendStatus(404);
    }
    throw error;
  }
});

app.put(
  '/instances/:instanceId',
  async (req: express.Request, res: express.Response) => {
    const { instanceId } = req.params;
    const result: InstanceResult = req.body;

    const executionDriver: ExecutionDriver = app.get('executionDriver');
    const screenshotsDriver: ScreenshotsDriver = app.get('screenshotsDriver');

    console.log(`>> Received instance result`, { instanceId });
    await executionDriver.setInstanceResults(instanceId, result);

    const screenshotUploadUrls: ScreenshotUploadInstruction[] = await screenshotsDriver.getScreenshotsUploadUrls(
      instanceId,
      result
    );

    const videoUploadInstructions: AssetUploadInstruction | null = await screenshotsDriver.getVideoUploadUrl(
      instanceId,
      result
    );

    if (screenshotUploadUrls.length > 0) {
      screenshotUploadUrls.forEach(
        (screenshot: ScreenshotUploadInstruction) => {
          executionDriver.setScreenshotUrl(
            instanceId,
            screenshot.screenshotId,
            screenshot.readUrl
          );
        }
      );
    }

    if (videoUploadInstructions) {
      executionDriver.setVideoUrl({
        instanceId,
        videoUrl: videoUploadInstructions.readUrl
      });
    }

    console.log(`<< Sending assets upload URLs`, {
      instanceId,
      screenshotUploadUrls,
      videoUploadInstructions
    });

    const responsePayload: UpdateInstanseResponse = {
      screenshotUploadUrls
    };
    if (videoUploadInstructions) {
      responsePayload.videoUploadUrl = videoUploadInstructions.uploadUrl;
    }
    return res.json(responsePayload);
  }
);

/*
4. PUT https://api.cypress.io/instances/<instanceId>/stdout
>> response 'OK'
*/
app.put('/instances/:instanceId/stdout', (req, res) => {
  const { instanceId } = req.params;
  console.log(`>> [not implemented] Received stdout for instance`, {
    instanceId
  });
  return res.sendStatus(200);
});

app.get('/ping', (_, res) => {
  res.send(`${Date.now()}: sorry-cypress-director is live`);
});
