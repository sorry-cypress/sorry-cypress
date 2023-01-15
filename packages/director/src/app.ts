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
import { PROBE_LOGGER } from './config';
import { catchRequestHandlerErrors } from './lib/express';

export const app = express();

app
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

app.get('/', (_, res) =>
  res.redirect('https://github.com/agoldis/sorry-cypress')
);

app.post('/runs', blockKeys, catchRequestHandlerErrors(handleCreateRun));

// https://github.com/cypress-io/cypress/blob/b880e8c89051403b94133dc2f98fc6403f9ffe71/packages/server/lib/modes/record.js#L542
app.post('/runs/:runId/instances', catchRequestHandlerErrors(createInstance));

/**
 * cypress prior to 6.7.0 sends instance results in a single API call
 * deprecated since 2.0.0
 */
app.put('/instances/:instanceId', (_, res, __) => res.status(404).send());

/**
 * cypress 6.7.0+ sends two separate API calls
 * - /instances/:instanceId/tests before running a spec
 * https://github.com/cypress-io/cypress/blob/b880e8c89051403b94133dc2f98fc6403f9ffe71/packages/server/lib/modes/record.js#L687

 * - /instances/:instanceId/results after completing a spec
 * https://github.com/cypress-io/cypress/blob/b880e8c89051403b94133dc2f98fc6403f9ffe71/packages/server/lib/modes/record.js#L567
 */
app.post(
  '/instances/:instanceId/tests',
  catchRequestHandlerErrors(setInstanceTests)
);
app.post(
  '/instances/:instanceId/results',
  catchRequestHandlerErrors(updateInstanceResults)
);

/*
4. PUT https://api.cypress.io/instances/<instanceId>/stdout
>> response 'OK'
*/
app.put('/instances/:instanceId/stdout', (req, res) => {
  const { instanceId } = req.params;
  getLogger().log(
    { instanceId },
    `[not implemented] Received stdout for instance`
  );
  return res.sendStatus(200);
});

app.get('/ping', (_, res) => {
  res.send(`${Date.now()}: sorry-cypress-director is live`);
});

app.get(
  '/health-check-db',
  catchRequestHandlerErrors(async (_, res) => {
    const executionDriver = await getExecutionDriver();
    (await executionDriver.isDBHealthy())
      ? res.sendStatus(200)
      : res.sendStatus(503);
  })
);


app.post(
  '/hooks',
  catchRequestHandlerErrors(async (req, res) => {
    const executionDriver = await getExecutionDriver();
    if (executionDriver.id !== 'in-memory')
      return res.status(405).send('This is only available for in-memory db. Please use the dashboard to set your hooks.');

    const { projectId, hooks } = req.body;
    //@ts-ignore
    const projects = executionDriver.setHooks(projectId, hooks);
    getLogger().log(`[hooks] Hooks set for project ${req.body.projectId}`);
    return res.json(projects);

  })
);

app.get(
  '/hooks',
  catchRequestHandlerErrors(async (req, res) => {
    const executionDriver = await getExecutionDriver();
    if (executionDriver.id !== 'in-memory')
      return res.status(405).send('This is only available for in-memory db. Please use the dashboard to set your hooks.');

    //@ts-ignore
    return res.json(executionDriver!.getProjects());
  })
);

app.use((error, req, res, _next) => {
  res
    .status(500)
    .send(
      'Unexpected error from sorry-cypress director service. Check the service logs for details.'
    );
});
