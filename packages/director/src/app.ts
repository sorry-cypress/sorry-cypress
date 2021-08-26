import bodyParser from 'body-parser';
import express from 'express';
import {
  createInstance,
  setInstanceTests,
  updateInstanceResults,
} from './api/instances';
import { blockKeys, handleCreateRun } from './api/runs';

export const app = express();

app.use(
  bodyParser.json({
    limit: '50mb',
  })
);

app.get('/', (_, res) =>
  res.redirect('https://github.com/agoldis/sorry-cypress')
);

app.post('/runs', blockKeys, handleCreateRun);

// https://github.com/cypress-io/cypress/blob/b880e8c89051403b94133dc2f98fc6403f9ffe71/packages/server/lib/modes/record.js#L542
app.post('/runs/:runId/instances', createInstance);

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
app.post('/instances/:instanceId/tests', setInstanceTests);
app.post('/instances/:instanceId/results', updateInstanceResults);

/*
4. PUT https://api.cypress.io/instances/<instanceId>/stdout
>> response 'OK'
*/
app.put('/instances/:instanceId/stdout', (req, res) => {
  const { instanceId } = req.params;
  console.log(`>> [not implemented] Received stdout for instance`, {
    instanceId,
  });
  return res.sendStatus(200);
});

app.get('/ping', (_, res) => {
  res.send(`${Date.now()}: sorry-cypress-director is live`);
});
