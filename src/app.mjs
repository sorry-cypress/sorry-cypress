import express from 'express';
import bodyParser from 'body-parser';
import {
  getById,
  isRunComplete,
  createOrGetRun,
  getAllInstances,
  setInstanceClaimed,
  getClaimedInstances,
  getFirstUnclaimedInstance
} from './runs/run.mjs';
export const app = express();

app.use(bodyParser.json());

app.get('/', (_, res) => res.send(`Served ${Object.keys(runs).length} runs`));

app.use('*', (req, _, next) => {
  console.log(req.baseUrl);
  next();
});

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

  const response = await createOrGetRun({
    ciBuildId,
    commit,
    platform,
    projectId,
    specs
  });

  console.log(`Responding to machine`, response);
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

  console.log(`* Machine's requesting a new task`, {
    runId,
    machineId,
    groupId
  });

  let run = await getById(runId);

  if (!run) {
    console.log(`* Machine's requesting unknown task`, {
      runId,
      machineId,
      groupId
    });
    return res.sendStatus(404);
  }

  if (await isRunComplete(run)) {
    console.log(`* All tasks completed`, { runId, machineId });
    return res.json({
      spec: null,
      instanceId: null,
      claimedInstances: getClaimedInstances(run).length,
      totalInstances: getAllInstances(run).length,
      estimatedWallClockDuration: null
    });
  }

  const instance = getFirstUnclaimedInstance(run);
  run = await setInstanceClaimed(runId, instance.instanceId);

  const response = {
    spec: instance.spec,
    instanceId: instance.instanceId,
    claimedInstances: getClaimedInstances(run).length,
    totalInstances: getAllInstances(run).length,
    estimatedWallClockDuration: null
  };

  console.log(`* Sending a new task to machine`, response);
  return res.json(response);
});

/*
3. PUT https://api.cypress.io/instances/<instanceId>
>> { screenshotUploadUrls: [] }
*/
app.put('/instances/:instanceId', (req, res) => {
  const { instanceId } = req.params;
  console.log(`* Received result of a task`, { instanceId });
  return res.json({ screenshotUploadUrls: [] });
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
