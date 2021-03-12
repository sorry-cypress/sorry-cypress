import {
  checkRunCompletionOnInactivity,
  getRunInactivityTimeoutMs,
} from './runCompletion';

const jobs: Record<string, NodeJS.Timeout> = {};

export const inMemoryScheduler = async (runId: string) => {
  const timeoutMs = await getRunInactivityTimeoutMs(runId);

  if (jobs[runId]) {
    clearTimeout(jobs[runId]);
  }

  jobs[runId] = setTimeout(async () => {
    clearTimeout(jobs[runId]);
    checkRunCompletionOnInactivity(runId, timeoutMs).catch(console.error);
  }, timeoutMs);
};
