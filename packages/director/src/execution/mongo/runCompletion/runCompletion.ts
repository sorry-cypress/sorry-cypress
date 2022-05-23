import { emitRunTimedout } from '@sorry-cypress/director/lib/hooks/events';
import { getLogger } from '@sorry-cypress/logger';
import { runTimeoutModel } from '@sorry-cypress/mongo';
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
    getLogger().log({ runId }, `[run-completion] Run completed`);
    setRunCompleted(runId).catch(getLogger().error);
    return true;
  }
  return false;
};

export const checkRunCompletionOnTimeout = async (
  runId: string,
  timeoutSeconds: number
) => {
  const run = await getRunById(runId);
  if (!run) {
    getLogger().warn(
      {
        runId,
      },
      '[run-completion] No run found for checking completion'
    );
    return;
  }

  if (await maybeSetRunCompleted(runId)) {
    return;
  }

  getLogger().log(
    {
      runId,
      timeoutSeconds,
      createdAt: run.createdAt,
    },
    `[run-completion] Run timed out after ${timeoutSeconds} seconds`
  );

  setRunCompletedWithTimeout({
    runId,
    timeoutMs: timeoutSeconds * 1000,
  }).catch(getLogger().error);

  // report timeout for non-completed groups
  getNonCompletedGroups(run).forEach((groupId) =>
    emitRunTimedout({
      runId,
      groupId,
    })
  );
};

export const checkRunTimeouts = async () => {
  getLogger().debug('[run-timeout] Checking run timeouts...');
  const runTimeouts = await runTimeoutModel.getUncheckedRunTimeouts();

  runTimeouts.forEach((timeoutTask) => {
    try {
      getLogger().debug(
        timeoutTask,
        `[run-timeout] Checking run timeout for runId...`
      );
      checkRunCompletionOnTimeout(
        timeoutTask.runId,
        timeoutTask.timeoutSeconds
      );
      runTimeoutModel.setRunTimeoutChecked(timeoutTask._id);
    } catch (error) {
      getLogger().error(
        { ...timeoutTask, error },
        `[run-timeout] Error checking run timeout`
      );
    }
  });
};
