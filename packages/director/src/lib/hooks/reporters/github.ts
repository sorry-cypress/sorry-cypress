import {
  getGithubStatusUrl,
  GithubHook,
  HookEvent,
  isRunGroupSuccessful,
  Run,
  RunGroupProgress,
} from '@sorry-cypress/common';
import { APP_NAME } from '@sorry-cypress/director/config';
import { getDashboardRunURL } from '@sorry-cypress/director/lib/urls';
import { getLogger } from '@sorry-cypress/logger';
import axios from 'axios';

interface GitHubReporterStatusParams {
  run: Run;
  eventType: HookEvent;
  groupId: string;
  groupProgress: RunGroupProgress;
}
export async function reportStatusToGithub(
  hook: GithubHook,
  eventData: GitHubReporterStatusParams
) {
  if (!hook.githubToken) {
    getLogger().warn(
      { ...hook, runId: eventData.run.runId, groupID: eventData.groupId },
      '[github-reporter] No github token defined, ignoring hook...'
    );
    return;
  }

  const { eventType, groupId, groupProgress, run } = eventData;

  const description = `failed:${
    groupProgress.tests.failures + groupProgress.tests.skipped
  } passed:${groupProgress.tests.passes} skipped:${
    groupProgress.tests.pending
  }`;

  // don't append group name if groupId is non-explicit
  // otherwise rerunning would create a new status context in GH
  let context = `${hook.githubContext || APP_NAME}`;

  if (run.meta.ciBuildId !== groupId) {
    context = `${context}: ${groupId}`;
  }

  const data = {
    state: '',
    context,
    description,
    target_url: getDashboardRunURL(run.runId),
  };

  if (eventType === HookEvent.RUN_START) {
    data.state = 'pending';
  }

  if (eventType === HookEvent.INSTANCE_FINISH) {
    data.state = 'pending';
  }

  if (eventType === HookEvent.RUN_FINISH) {
    data.state = 'failure';
    if (isRunGroupSuccessful(groupProgress)) {
      data.state = 'success';
    }
  }
  if (eventType === HookEvent.RUN_TIMEOUT) {
    data.state = 'failure';
    data.description = `timedout - ${data.description}`;
  }

  if (!data.state) {
    return;
  }

  const fullStatusPostUrl = getGithubStatusUrl(hook.url, run.meta.commit.sha);

  getLogger().log(
    { fullStatusPostUrl, eventType, ...data },
    '[github-reporter] Sending HTTP request to GitHub'
  );
  try {
    await axios({
      method: 'post',
      url: fullStatusPostUrl,
      auth: {
        username: APP_NAME,
        password: hook.githubToken,
      },
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
      data,
    });
  } catch (error) {
    getLogger().error(
      {
        fullStatusPostUrl,
        runId: run.runId,
        error: error.toJSON ? error.toJSON() : error,
        resonse: error.response?.data ? error.response.data : null,
      },
      `[github-reporter] Hook post to ${fullStatusPostUrl} responded with error`
    );
  }
}
