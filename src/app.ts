import express from 'express';
import bodyParser from 'body-parser';
import { InstanceResult } from '@src/types';
import { RUN_NOT_EXIST } from '@src/lib/errors';

export const app = express();

app.use(bodyParser.json());

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

app.put('/instances/:instanceId', async (req, res) => {
  const { instanceId } = req.params;
  const result: InstanceResult = req.body;
  console.log(`>> Received instance result`, { instanceId });
  await app.get('executionDriver').createInstance(instanceId, result);

  console.log(`<< Sending screenshots upload URLs`, { instanceId });
  return res.json({
    screenshotUploadUrls: await app
      .get('screenshotsDriver')
      .getScreenshotsUploadURLs(instanceId, result)
  });
});

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
