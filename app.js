const md5 = require('md5');
const uuid = require('uuid/v4');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

exports.app = app;

const runs = {};
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

app.post('/runs', (req, res) => {
  const { ciBuildId, commit, platform, projectId, specs } = req.body;

  console.log(`New machine joins the party!`, {
    ciBuildId,
    projectId,
    specs
  });

  // generate machine id
  const machineId = uuid();

  // generate run id - multiple machines that run the same task should have the same runId
  const runId = md5(ciBuildId + commit.sha + projectId + specs.join(' '));

  // not sure how specific that should be
  const groupId = `${platform.osName}-${platform.osVersion}-${ciBuildId}`;

  if (!runs[runId]) {
    console.log(`It is a new runId and specs`, {
      runId,
      specsLength: specs.length
    });
    runs[runId] = [];
    specs.forEach(spec =>
      runs[runId].push({
        spec,
        instanceId: uuid(),
        claimed: false
      })
    );
  }

  const response = {
    groupId,
    machineId,
    runId,
    runUrl: 'https://sorry.cypress.io/',
    warnings: []
  };

  console.log(`Responding to machine`, response);
  res.json(response);
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

app.post('/runs/:runId/instances', (req, res) => {
  const { groupId, machineId } = req.body;
  const { runId } = req.params;

  console.log(`Machine's requesting a new task`, { runId, machineId, groupId });

  if (!runs[runId]) {
    console.log(`Machine's requesting unknown task`, {
      runId,
      machineId,
      groupId
    });
    return res.sendStatus(404);
  }

  // find first unclaimed spec
  const specIndex = runs[runId].findIndex(s => !s.claimed);

  // all claimed
  if (specIndex === -1) {
    console.log(`All tasks completed!!!`, { runId, machineId });
    return res.json({
      spec: null,
      instanceId: null,
      claimedInstances: runs[runId].length,
      totalInstances: runs[runId].length,
      estimatedWallClockDuration: null
    });
  }

  // mark as claimed
  const specToSend = runs[runId][specIndex];
  specToSend.claimed = true;

  const response = {
    spec: specToSend.spec,
    instanceId: specToSend.instanceId,
    claimedInstances: runs[runId].filter(s => s.claimed).length,
    totalInstances: runs[runId].length,
    estimatedWallClockDuration: null
  };

  console.log(`Sending a new task to machine`, response);
  return res.json(response);
});

/*
3. PUT https://api.cypress.io/instances/<instanceId>
>> { screenshotUploadUrls: [] }
*/
app.put('/instances/:instanceId', (req, res) => {
  const { instanceId } = req.params;
  console.log(`Received result of a task`, { instanceId });
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
