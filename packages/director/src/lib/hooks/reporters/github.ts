import {
  getGithubStatusUrl,
  GithubHook,
  HookEvent,
  isResultSuccessful,
  RunSummary,
  RunWithSpecs,
} from '@sorry-cypress/common';
import { APP_NAME } from '@src/config';
import { getDashboardRunURL } from '@src/lib/urls';
import axios from 'axios';

interface GitHubReporterStatusParams {
  run: RunWithSpecs;
  eventType: HookEvent;
  runSummary: RunSummary;
  groupId: string;
}
export async function reportStatusToGithub(
  hook: GithubHook,
  eventData: GitHubReporterStatusParams
) {
  const { eventType, runSummary, groupId, run } = eventData;

  const fullStatusPostUrl = getGithubStatusUrl(hook.url, run.meta.commit.sha);
  const description = `failed:${
    runSummary.failures + runSummary.skipped
  } passed:${runSummary.passes} skipped:${runSummary.pending}`;

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
    if (isResultSuccessful(runSummary)) {
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

  console.log('[github-reporter] ', { eventType, data });

  try {
    axios({
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
    console.error(
      `[github-reporter] Hook post to ${fullStatusPostUrl} responded with error`
    );
    console.error(error);
  }
}
