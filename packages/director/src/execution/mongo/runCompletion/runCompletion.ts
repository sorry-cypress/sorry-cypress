import { emitRunTimedout } from '@sorry-cypress/director/lib/hooks/events';
import { getLogger } from '@sorry-cypress/logger';
import { runTimeoutModel } from '@sorry-cypress/mongo';
import {
  getNonCompletedGroups,
  maybeSetRunCompleted,
} from '../runs/run.controller';
import {
  getRunById,
  setRunCompletedWithTimeout,
} from '../runs/run.model';

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

  runTimeouts.forEach(async (timeoutTask) => {
    try {
      getLogger().debug(
        timeoutTask,
        `[run-timeout] Checking run timeout for runId...`
      );
      await checkRunCompletionOnTimeout(
        timeoutTask.runId,
        timeoutTask.timeoutSeconds
      );
      await runTimeoutModel.setRunTimeoutChecked(timeoutTask._id);
    } catch (error) {
      getLogger().error(
        { ...timeoutTask, error },
        `[run-timeout] Error checking run timeout`
      );
    }
  });
};
