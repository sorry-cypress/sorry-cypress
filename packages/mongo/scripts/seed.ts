/**
 * Usage: ts-node -r tsconfig-paths/register packages/mongo/scripts/seed.ts
 *
 * IntelliJ debugging:
 *   Create new Node.js configuration:
 *     Node parameters: --require ts-node/register --require tsconfig-paths/register
 *     JavasScript file: packages/mongo/scripts/seed.ts
 *     Environment variables: TS_NODE_PROJECT=tsconfig.json
 */

import { Project, Run } from '@sorry-cypress/common';
import { generateUUID } from '@sorry-cypress/director/lib/hash';
import { MONGODB_DATABASE, MONGODB_URI } from '@sorry-cypress/mongo/config';
import { shuffle } from 'lodash';
import { Db, MongoClient } from 'mongodb';

const PROJECTS_COUNT = 10;
const PROJECT_ID_PREFIX = 'PROJECT-';
const RUNS_COUNT = 100000;
const RUNS_SHUFFLE = true;
const RUNS_BATCH_SIZE = 250;
const CI_BUILD_ID_PREFIX = 'CI-BUILD-';

(async () => {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(MONGODB_DATABASE);

  try {
    await createProjects(db);
    await createRuns(db);
  } finally {
    await client.close();
  }
})();

function getProject(projectId: string): Project {
  return {
    projectId,
    hooks: [],
    createdAt: new Date().toISOString(),
    inactivityTimeoutSeconds: 600,
    projectColor: '',
  };
}

function getRun(ciBuildId: string, projectId: string): Run {
  return ({
    runId: generateUUID(),
    cypressVersion: '10.4.0',
    createdAt: new Date(),
    completion: { completed: true },
    meta: {
      ciBuildId,
      commit: {
        sha: '332595df6c0ade51c8cf4213a8852c3112fea352',
        branch: 'main',
        authorName: 'Math Paquette',
        authorEmail: 'me@mathpaquette.com',
        message: 'feat: add applications\n',
        remoteOrigin: null,
        defaultBranch: null,
      },
      projectId,
      platform: {
        osName: 'darwin',
        osMemory: { free: 284966912, total: 17179869184 },
        osVersion: '21.5.0',
        browserName: 'Electron',
        browserVersion: '102.0.5005.148',
      },
      ci: { params: null, provider: null },
    },
    progress: {
      updatedAt: new Date(),
      groups: [
        {
          groupId: ciBuildId,
          instances: {
            overall: 1,
            claimed: 1,
            complete: 1,
            passes: 1,
            failures: 0,
          },
          tests: {
            overall: 1,
            passes: 1,
            failures: 0,
            skipped: 0,
            pending: 0,
            flaky: 0,
          },
        },
      ],
    },
    specs: [
      {
        spec: 'src/e2e/app.cy.ts',
        instanceId: '364bbdbc-e819-4ef1-970f-d4bd92361fff',
        claimedAt: new Date(),
        completedAt: new Date(),
        groupId: 'CI-1000',
        machineId: 'c2c62ac3-0296-4f9f-ad7e-6e2d946106ec',
        tests: 1,
        results: {
          stats: {
            suites: 1,
            tests: 1,
            passes: 1,
            pending: 0,
            skipped: 0,
            failures: 0,
            wallClockStartedAt: new Date(),
            wallClockEndedAt: new Date(),
            wallClockDuration: 264,
          },
          flaky: 0,
        },
      },
    ],
  } as unknown) as Run;
}

async function createProjects(db: Db): Promise<void> {
  const projects = db.collection<Project>('projects');
  const documents: Project[] = [];
  for (let i = 1; i <= PROJECTS_COUNT; i++) {
    documents.push(getProject(`${PROJECT_ID_PREFIX}${i}`));
  }
  console.info(
    `inserting ${documents.length} of ${PROJECTS_COUNT} projects...`
  );
  await projects.insertMany(documents);
}

async function createRuns(db: Db): Promise<void> {
  const runs = db.collection<Run>('runs');
  let documents: Run[] = [];
  let ciBuildId = 1;
  let runId = 1;

  while (runId <= RUNS_COUNT) {
    for (let i = 1; i <= PROJECTS_COUNT; i++) {
      if (documents.length > 0 && documents.length % RUNS_BATCH_SIZE === 0) {
        if (RUNS_SHUFFLE) documents = shuffle(documents);
        console.info(`inserting ${runId - 1} of ${RUNS_COUNT} runs...`);
        await runs.insertMany(documents);
        documents = [];
      }

      documents.push(
        getRun(`${CI_BUILD_ID_PREFIX}${ciBuildId}`, `${PROJECT_ID_PREFIX}${i}`)
      );
      runId++;
    }
    ciBuildId++;
  }
}
