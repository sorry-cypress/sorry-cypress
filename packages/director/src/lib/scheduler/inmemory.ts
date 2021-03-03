import {
  checkRunCompletionOnInactivity,
  getRunInactivityTimeoutMs,
} from './runCompletion';

const jobs: Record<string, NodeJS.Timeout> = {};

export const inMemoryScheduler = async (runId: string) => {
  const timeoutMs = await getRunInactivityTimeoutMs(runId);

  const jobName = `${runId}_inactivity_timeout`;
  if (jobs[jobName]) {
    clearTimeout(jobs[jobName]);
  }

  jobs[jobName] = setTimeout(async () => {
    clearTimeout(jobs[jobName]);
    checkRunCompletionOnInactivity(runId, timeoutMs).catch(console.error);
  }, timeoutMs);
};
