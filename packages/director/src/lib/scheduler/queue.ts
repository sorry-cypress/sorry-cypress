import { REDIS_URI } from '@src/config';
import { Queue, QueueScheduler, Worker } from 'bullmq';
import { getRedisConnection } from '../redisURI';
import {
  checkRunCompletionOnInactivity,
  getRunInactivityTimeoutMs,
} from './runCompletion';
const INACTIVITY_TIMEOUT_QUEUE_NAME = 'sc_inactivityTimeoutQueue';
const INACTIVITY_TIMEOUT_JOB_NAME = 'sc_inactivityTimeoutJob';

// https://docs.bullmq.io/guide/queuescheduler
export const scheduler = new QueueScheduler(INACTIVITY_TIMEOUT_QUEUE_NAME);

const inactiviyTimeoutQueue = new Queue(INACTIVITY_TIMEOUT_QUEUE_NAME, {
  connection: getRedisConnection(REDIS_URI),
});

export const setInactivityTimeoutJob = async (runId: string) => {
  const timeoutMs = await getRunInactivityTimeoutMs(runId);
  const previousJob = await inactiviyTimeoutQueue.getJob(runId);
  console.log(
    `[queue] Queueing ${INACTIVITY_TIMEOUT_JOB_NAME} to ${INACTIVITY_TIMEOUT_QUEUE_NAME} for ${runId} with ${timeoutMs}`
  );
  if (previousJob) {
    try {
      await previousJob.remove();
    } catch (e) {
      console.error(e);
    }
  }

  inactiviyTimeoutQueue.add(
    INACTIVITY_TIMEOUT_JOB_NAME,
    {
      runId,
      timeoutMs,
    },
    {
      delay: timeoutMs,
      removeOnComplete: true,
      removeOnFail: true,
      jobId: runId,
    }
  );
};

type InactivityTimeoutJob = {
  runId: string;
  timeoutMs: number;
};
new Worker<InactivityTimeoutJob>(INACTIVITY_TIMEOUT_QUEUE_NAME, async (job) => {
  await checkRunCompletionOnInactivity(job.data.runId, job.data.timeoutMs);
});
