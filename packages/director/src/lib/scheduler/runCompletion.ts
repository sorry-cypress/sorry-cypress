import { isAllRunSpecsCompleted } from '@sorry-cypress/common';
import { INACTIVITY_TIMEOUT_SECONDS } from '@src/config';
import { getExecutionDriver } from '@src/drivers';
import { emitRunFinish } from '../hooks/events';

export const checkRunCompletionOnInactivity = async (
  runId: string,
  timeoutMs: number
) => {
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

export const getRunInactivityTimeoutMs = async (runId: string) => {
  const executionDriver = await getExecutionDriver();
  const run = await executionDriver.getRunWithSpecs(runId);
  const project = await executionDriver.getProjectById(run.meta.projectId);

  return (
    (project.inactivityTimeoutSeconds ?? INACTIVITY_TIMEOUT_SECONDS) * 1000
  );
};
