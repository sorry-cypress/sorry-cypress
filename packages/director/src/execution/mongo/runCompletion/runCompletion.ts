import { runTimeoutModel } from '@sorry-cypress/mongo';
import { emitGroupTimedout } from '@src/lib/hooks/events';
import {
  allRunSpecsCompleted,
  getNonCompletedGroups,
} from '../runs/run.controller';
import {
  getRunById,
  setRunCompleted,
  setRunCompletedWithTimeout,
} from '../runs/run.model';

export const maybeSetRunCompleted = async (runId: string) => {
  if (await allRunSpecsCompleted(runId)) {
    console.log(`[run-completion] Run completed`, { runId });
    setRunCompleted(runId).catch(console.error);
    return true;
  }
  return false;
};

export const checkRunCompletionOnTimeout = async (
  runId: string,
  timeoutSeconds: number
) => {
  if (await maybeSetRunCompleted(runId)) {
    return;
  }

  const run = await getRunById(runId);

  console.log(
    `[run-completion] Run ${runId} timed out after ${timeoutSeconds} seconds. Created: ${
      run.createdAt
    }, now: ${new Date().toISOString()}`
  );

  setRunCompletedWithTimeout({
    runId,
    timeoutMs: timeoutSeconds * 1000,
  }).catch(console.error);

  // report timeout for non-completed groups
  getNonCompletedGroups(run).forEach((groupId) =>
    emitGroupTimedout({
      runId,
      groupId,
    })
  );
};

export const checkRunTimeouts = async () => {
  console.log('[run-timeout] Checking run timeouts...');
  const runTimeouts = await runTimeoutModel.getUncheckedRunTimeouts();

  runTimeouts.forEach(async (timeoutTask) => {
    try {
      console.log(
        `[run-timeout] Checking run timeout for runId: ${timeoutTask.runId}, task id: ${timeoutTask._id}`
      );
      await checkRunCompletionOnTimeout(
        timeoutTask.runId,
        timeoutTask.timeoutSeconds
      );
      await runTimeoutModel.setRunTimeoutChecked(timeoutTask._id);
    } catch (error) {
      console.error(
        `[run-timeout] Error checking run timeout for runId: ${timeoutTask.runId}, task id: ${timeoutTask._id}`
      );
      console.error(error);
    }
  });
};
