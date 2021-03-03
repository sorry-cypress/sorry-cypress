import { redisExpirationListener, setInactivityTimeout } from '../redis';
import {
  checkRunCompletionOnInactivity,
  getRunInactivityTimeoutMs,
} from './runCompletion';

redisExpirationListener.on('message', async function (channel, runId) {
  console.log('REDIS Inactivity timeout message received');
  checkRunCompletionOnInactivity(
    runId,
    await getRunInactivityTimeoutMs(runId)
  ).catch(console.error);
});

export const redisScheduler = async (runId: string) => {
  setInactivityTimeout(runId, await getRunInactivityTimeoutMs(runId));
};
