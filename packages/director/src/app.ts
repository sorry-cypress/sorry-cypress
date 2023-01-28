import { getExecutionDriver } from '@sorry-cypress/director/drivers';
import { getLogger, setLoggerMiddleware } from '@sorry-cypress/logger';
import express from 'express';
import expressPino from 'express-pino-logger';
import {
  createInstance,
  setInstanceTests,
  updateInstanceResults,
} from './api/instances';
import { blockKeys, handleCreateRun } from './api/runs';
import { BASE_PATH, PROBE_LOGGER } from './config';
import { catchRequestHandlerErrors } from './lib/express';

export const app = express();
export const router = express();

router
  .use(
    PROBE_LOGGER === 'true'
      ? expressPino({
        logger: getLogger(),
      })
      : expressPino({
        logger: getLogger(),
        autoLogging: {
          ignorePaths: ['/health-check-db', '/ping'],
        },
      })
  )
  .use(
    express.json({
      limit: '50mb',
    })
  )
  .use(setLoggerMiddleware);

router.get('/', (_, res) =>
  res.redirect('https://github.com/agoldis/sorry-cypress')
);

router.post('/runs', blockKeys, catchRequestHandlerErrors(handleCreateRun));

// https://github.com/cypress-io/cypress/blob/b880e8c89051403b94133dc2f98fc6403f9ffe71/packages/server/lib/modes/record.js#L542
router.post(
  '/runs/:runId/instances',
  catchRequestHandlerErrors(createInstance)
);

/**
 * cypress prior to 6.7.0 sends instance results in a single API call
 * deprecated since 2.0.0
 */
router.put('/instances/:instanceId', (_, res, __) => res.status(404).send());

/**
 * cypress 6.7.0+ sends two separate API calls
 * - /instances/:instanceId/tests before running a spec
 * https://github.com/cypress-io/cypress/blob/b880e8c89051403b94133dc2f98fc6403f9ffe71/packages/server/lib/modes/record.js#L687

 * - /instances/:instanceId/results after completing a spec
 * https://github.com/cypress-io/cypress/blob/b880e8c89051403b94133dc2f98fc6403f9ffe71/packages/server/lib/modes/record.js#L567
 */
router.post(
  '/instances/:instanceId/tests',
  catchRequestHandlerErrors(setInstanceTests)
);
router.post(
  '/instances/:instanceId/results',
  catchRequestHandlerErrors(updateInstanceResults)
);

/*
4. PUT https://api.cypress.io/instances/<instanceId>/stdout
>> response 'OK'
*/
router.put('/instances/:instanceId/stdout', (req, res) => {
  const { instanceId } = req.params;
  getLogger().log(
    { instanceId },
    `[not implemented] Received stdout for instance`
  );
  return res.sendStatus(200);
});

router.get('/ping', (_, res) => {
  res.send(`${Date.now()}: sorry-cypress-director is live`);
});

router.get(
  '/health-check-db',
  catchRequestHandlerErrors(async (_, res) => {
    const executionDriver = await getExecutionDriver();
    (await executionDriver.isDBHealthy())
      ? res.sendStatus(200)
      : res.sendStatus(503);
  })
);

router.post(
  '/hooks',
  catchRequestHandlerErrors(async (req, res) => {
    const executionDriver = await getExecutionDriver();
    if (executionDriver.id !== 'in-memory')
      return res.status(405).send('This is only available for in-memory db. Please use the dashboard to set your hooks.');

    const { projectId, hooks } = req.body;
    executionDriver.setHooks && executionDriver.setHooks(projectId, hooks);
    getLogger().log(`[hooks] Hooks set for project ${req.body.projectId}`);
    return res.status(200).send(`Hooks set for project "${req.body.projectId}".`);
  })
);

router.use((error, req, res, _next) => {
  res
    .status(500)
    .send(
      'Unexpected error from sorry-cypress director service. Check the service logs for details.'
    );
});

app.use(BASE_PATH, router);
