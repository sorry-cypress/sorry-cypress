import express from 'express';
import bodyParser from 'body-parser';
import {
  InstanceResult,
  ScreenshotUploadInstruction,
  AssetUploadInstruction,
  ExecutionDriver,
  ScreenshotsDriver
} from '@src/types';
import { ALLOWED_KEYS } from '@src/config';
import { RUN_NOT_EXIST } from '@src/lib/errors';
import { UpdateInstanseResponse } from './types/response.types';
import { hookEvents } from '@src/lib/hooksEnums';
import { reportToHook } from '@src/lib/hooksReporter';

export const app = express();

const isKeyAllowed = (recordKey: string) => ALLOWED_KEYS ? ALLOWED_KEYS.includes(recordKey) : true;

app.use(
  bodyParser.json({
    limit: '50mb'
  })
);

app.get('/', (_, res) =>
  res.redirect('https://github.com/agoldis/sorry-cypress')
);

app.post('/runs', async (req, res) => {
  const { recordKey, ciBuildId } = req.body;
  const executionDriver = app.get('executionDriver');

  console.log(`>> Machine is asking to join a run`, { recordKey, ciBuildId });

  if(!isKeyAllowed(recordKey)) {
    console.log(`<< Record key is not allowed`, { recordKey })

    return res.status(403).send(`Provided record key '${recordKey}' is not allowed`);
  }

  console.log(`>> Machine is joining a run`, { ciBuildId });

  const response = await executionDriver.createRun(req.body);
  const runWithSpecs = await executionDriver.getRunWithSpecs(response.runId);
  reportToHook({
    hookEvent: hookEvents.RUN_START,
    reportData:{run:runWithSpecs},
    project: await executionDriver.getProjectById(runWithSpecs.meta.projectId)
  });

  console.log(`<< RUN_START hook called`, response);

  console.log(`<< Responding to machine`, response);
  return res.json(response);
});

app.post('/runs/:runId/instances', async (req, res) => {
  const { groupId, machineId } = req.body;
  const { runId } = req.params;
  const executionDriver = app.get('executionDriver');

  console.log(`>> Machine is requesting a new task`, {
    runId,
    machineId,
    groupId
  });

  try {
    const { instance, claimedInstances, totalInstances } = await executionDriver.getNextTask(runId);
    if (instance === null) {
      console.log(`<< All tasks claimed`, { runId, machineId });
      return res.json({
        spec: null,
        instanceId: null,
        claimedInstances,
        totalInstances
      });
    }

    const run = await executionDriver.getRunWithSpecs(runId);
    reportToHook({
      hookEvent: hookEvents.INSTANCE_START,
      reportData:{
        run,
        instance
      },
      project: await executionDriver.getProjectById(run.meta.projectId)
    });

    console.log(`<< INSTANCE_START hook called`, instance.instanceId);
    //Instance Start
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

    const instance = await executionDriver.getInstanceById(instanceId);
    const run = await executionDriver.getRunWithSpecs(instance.runId);
    const project = await executionDriver.getProjectById(run.meta.projectId);
    const isRunStillRunning = run.specs.reduce((
      wasRunning:boolean,
      currentSpec:{
        claimed: boolean,
        results: any
      },
      index: number
    ) => {
      return !currentSpec.claimed || !run.specsFull[index].results || wasRunning;
    }, false);

    reportToHook({
      hookEvent: hookEvents.INSTANCE_FINISH,
      reportData:{
        run,
        instance
      },
      project
    }).then(()=>{
      console.log(`<< INSTANCE_FINISH hook called`, instance.instanceId);
      // We should probably add a flag to the actual run here aswell
      // We should also probably do a check to see if all specs passed and set a flag of success or fail
      if (!isRunStillRunning) {
        reportToHook({
          hookEvent: hookEvents.RUN_FINISH,
          reportData:{
            run,
            instance
          },
          project
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
