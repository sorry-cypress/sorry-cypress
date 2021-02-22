/**
 * This is unfriendly implementation
 * - serverless runtime
 * - multi node setup
 * An proper alternative would be an external service
 * that invokes inactivity check after a timeout
 */
import { hookEvents, isAllRunSpecsCompleted } from '@sorry-cypress/common';
import { INACTIVITY_TIMEOUT_SECONDS } from '@src/config';
import { getExecutionDriver } from '@src/drivers';
import { emitRunFinish, PubSubHookEventPayload } from '../hooks/events';
import { pubsub } from '../pubsub';

const jobs: Record<string, NodeJS.Timeout> = {};

const getInactivityTimeoutHandler = (
  runId: string,
  timeoutMs: number
) => async () => {
  const executionDriver = await getExecutionDriver();
  const run = await executionDriver.getRunWithSpecs(runId);

  if (run.completion?.completed) {
    return;
  }

  if (isAllRunSpecsCompleted(run)) {
    console.log('Run', runId, 'completed');
    executionDriver.setRunCompleted(runId).catch(console.error);
  } else {
    console.log('Run', runId, 'timed out after', timeoutMs, 'ms');
    executionDriver
      .setRunCompletedWithTimeout({
        runId,
        timeoutMs,
      })
      .catch(console.error);
  }
  emitRunFinish({ runId });
};

const handleSchedulerEvent = async ({ runId }: PubSubHookEventPayload) => {
  const jobName = `${runId}_inactivity_timeout`;

  if (jobs[jobName]) {
    clearTimeout(jobs[jobName]);
  }

  const executionDriver = await getExecutionDriver();
  const run = await executionDriver.getRunWithSpecs(runId);
  const project = await executionDriver.getProjectById(run.meta.projectId);

  const timeoutMs =
    (project.inactivityTimeoutSeconds ?? INACTIVITY_TIMEOUT_SECONDS) * 1000;

  jobs[jobName] = setTimeout(async () => {
    clearTimeout(jobs[jobName]);
    getInactivityTimeoutHandler(runId, timeoutMs)().catch(console.error);
  }, timeoutMs);
};

console.log('🎧 Initializing listeners for scheduler...');
[hookEvents.RUN_START, hookEvents.INSTANCE_START].forEach((event) => {
  pubsub.on(event, handleSchedulerEvent);
});
