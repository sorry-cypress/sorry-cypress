import md5 from "md5";
import uuid from "uuid/v4";
import express from "express";
import bodyParser from "body-parser";
export const app = express();

const runs = {};
app.use(bodyParser.json());

app.use("*", (req, _, next) => {
  console.log(req.baseUrl);
  console.log(req.body);
  next();
});
/*
1. POST https://api.cypress.io/runs
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


.... running test suite ....
....  test suite finished ....

3. PUT https://api.cypress.io/instances/<instanceId>
>> { screenshotUploadUrls: [] }
4. PUT https://api.cypress.io/instances/<instanceId>/stdout
>> response 'OK'
*/

app.post("/runs", (req, res, next) => {
  /*
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
  const { ciBuildId, commit, platform, projectId, recordKey, specs } = req.body;

  // generate machine id
  const machineId = uuid();

  // generate run id - multiple machines that run the same task should have the same runId
  const runId = md5(
    ciBuildId + commit.sha + recordKey + projectId + specs.join(" ")
  );

  // not sure how specific that should be

  const groupId = `${platform.osName}-${platform.osVersion}-${ciBuildId}`;

  if (!runs[runId]) {
    runs[runId] = [];
    specs.forEach(spec =>
      runs[runId].push({
        spec,
        instanceId: uuid(),
        claimed: false
      })
    );
  }

  res.json({
    groupId,
    machineId,
    runId,
    runUrl: "https://fake.cypress.io/",
    warnings: []
  });
});

app.post("/runs/:runId/instances", (req, res) => {
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

  // const { groupId, machineId } = req.body;
  const { runId } = req.params;

  if (!runs[runId]) {
    return res.sendStatus(404);
  }

  // find first unclaimed spec
  const specIndex = runs[runId].findIndex(s => !s.claimed);

  // all claimed
  if (specIndex === -1) {
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

  return res.json({
    spec: specToSend.spec,
    instanceId: specToSend.instanceId,
    claimedInstances: runs[runId].filter(s => s.claimed).length,
    totalInstances: runs[runId].length,
    estimatedWallClockDuration: null
  });
});

app.put("/instances/:instanceId", (_, res) => {
  return res.json({ screenshotUploadUrls: [] });
  /*
  3. PUT https://api.cypress.io/instances/<instanceId>
    >> { screenshotUploadUrls: [] }
  */
});

/*
4. PUT https://api.cypress.io/instances/<instanceId>/stdout
>> response 'OK'
*/
app.put("/instances/:instanceId/stdout", (_, res) => res.sendStatus(200));
