import bodyParser from 'body-parser';
import express from 'express';
import { handleCreateInstance, handleUpdateInstance } from './api/instances';
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
app.post('/runs/:runId/instances', handleCreateInstance);
app.put('/instances/:instanceId', handleUpdateInstance);

app.post('/webhook', (req, res) => {
  console.log('💥 webhook!');
  console.log(req.body);
  res.send('ok');
});

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
