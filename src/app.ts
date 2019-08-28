import express from 'express';
import bodyParser from 'body-parser';
import { createRun, getNextTask, getAllInstances } from './runs/run.controller';
import { RUN_NOT_EXIST } from './lib/errors';
import {
  createInstance,
  getScreenshotsUploadURLs
} from './instances/instance.controller';
import md5 = require('md5');
import { InstanceResult } from './instances/instance.types';
export const app = express();

app.use(bodyParser.json());

/* 1. /run
>> {
  specs: [],
  commit: {}
  group: '...',
  platform: '...',
  ciBuildId: 'local-003',
  projectId: '79k9pu',
  recordKey: "xxx",
  specPattern: '...'
} 

<< 
runId: uuid,
groupId: 'darwin-Electron-61-433fc0d734',
machineId: 'c43f621a-31bb-4c77-a85c-6416f2ec6df0',
runUrl: '...'
*/

app.post('/runs', async (req, res) => {
  const { ciBuildId, commit, platform, projectId, specs } = req.body;
  console.log(`>> Machine is joining a run`, { ciBuildId });

  const response = await createRun({
    ciBuildId,
    commit,
    platform,
    projectId,
    specs
  });

  console.log(`<< Responding to machine`, response);
  return res.json(response);
});

/*
2. POST https://api.cypress.io/runs/<runId>/instances
>>
spec: null,
groupId: 'darwin-Electron-61-433fc0d734',
machineId: 'c43f621a-31bb-4c77-a85c-6416f2ec6df0',
platform: {}
<<
{
  spec: 'cypress/integration/i18n/i18n.publicInvoice.spec.js',
  instanceId: '4c72d97b-438b-432d-aef2-66d4c8311799',
  claimedInstances: 10,
  totalInstances: 94,
  estimatedWallClockDuration: null
}
*/
app.post('/runs/:runId/instances', async (req, res) => {
  const { groupId, machineId } = req.body;
  const { runId } = req.params;

  console.log(`>> Machine is requesting a new task`, {
    runId,
    machineId,
    groupId
  });

  try {
    const { instance, claimedInstances, totalInstances } = await getNextTask(
      runId
    );
    if (instance === null) {
      console.log(`<< All tasks claimed`, { runId, machineId });
      return res.json({
        spec: null,
        instanceId: null,
        claimedInstances,
        totalInstances
      });
    }

    console.log(`<< Sending a new task to machine`, instance);
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

/*
3. PUT https://api.cypress.io/instances/<instanceId>
>> { screenshotUploadUrls: [] }

from: https://github.com/cypress-io/cypress/blob/a7dfda986531f9176468de4156e3f1215869c342/packages/server/lib/modes/record.coffee#L134
  if screenshotUploadUrls
    screenshotUploadUrls.forEach (obj) ->
      screenshot = _.find(screenshots, { screenshotId: obj.screenshotId })

      send(screenshot.path, obj.uploadUrl) 
      ...
      send = (pathToFile, url) ->
      ...
      https://github.com/cypress-io/cypress/blob/a7dfda986531f9176468de4156e3f1215869c342/packages/server/lib/upload.coffee
      rp({
        url: url
        method: "PUT"
        body: buf
      })
      
object shape {
  screenshotId,
  uploadUrl
}
*/
app.put('/instances/:instanceId', async (req, res) => {
  const { instanceId } = req.params;

  const result: InstanceResult = req.body;
  await createInstance(instanceId, result);
  const upload = await getScreenshotsUploadURLs(instanceId, result);
  return res.json({
    screenshotUploadUrls: upload
  });
});

/*
4. PUT https://api.cypress.io/instances/<instanceId>/stdout
>> response 'OK'
*/
app.put('/instances/:instanceId/stdout', (req, res) => {
  const { instanceId } = req.params;
  console.log(`Received stdout for instance`, { instanceId });
  return res.sendStatus(200);
});
