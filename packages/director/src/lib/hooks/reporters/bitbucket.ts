import {
  BitBucketHook,
  getBitbucketBuildUrl,
  HookEvent,
  isResultSuccessful,
  RunSummary,
  RunWithSpecs,
} from '@sorry-cypress/common';
import { APP_NAME } from '@src/config';
import { getDashboardRunURL } from '@src/lib/urls';
import axios from 'axios';
import md5 from 'md5';

interface BBReporterStatusParams {
  run: RunWithSpecs;
  eventType: HookEvent;
  runSummary: RunSummary;
  groupId: string;
}
export async function reportStatusToBitbucket(
  hook: BitBucketHook,
  eventData: BBReporterStatusParams
) {
  const { eventType, runSummary, groupId, run } = eventData;

  const fullStatusPostUrl = getBitbucketBuildUrl(hook.url, run.meta.commit.sha);

  // don't append group name if groupId is non-explicit
  // otherwise rerunning would create a new status context in GH
  let context = `${hook.bitbucketBuildName || APP_NAME}`;
  if (run.meta.ciBuildId !== groupId) {
    context = `${context}: ${groupId}`;
  }
  const description = `failed:${
    runSummary.failures + runSummary.skipped
  } passed:${runSummary.passes} skipped:${runSummary.pending}`;

  const data = {
    state: 'INPROGRESS',
    // see https://github.com/sorry-cypress/sorry-cypress/pull/325
    key: md5(`${hook.hookId}_${context}`),
    name: `${context}`,
    description,
    url: getDashboardRunURL(run.runId),
  };

  if (eventType === HookEvent.RUN_FINISH) {
    data.state = 'FAILED';
    if (isResultSuccessful(runSummary)) {
      data.state = 'SUCCESSFUL';
    }
  }

  if (eventType === HookEvent.RUN_TIMEOUT) {
    data.state = 'FAILED';
    data.description = `timedout - ${data.description}`;
  }

  if (!data.state) {
    return;
  }

  console.log(`[bitbucket-reporter] Posting hook`, {
    eventType,
    data,
  });

  try {
    await axios({
      method: 'post',
      url: fullStatusPostUrl,
      auth: {
        username: hook.bitbucketUsername,
        password: hook.bitbucketToken,
      },
      headers: {
        Accept: 'application/json',
      },
      data,
    });
  } catch (err) {
    console.error(
      `[bitbucket-reporter] Hook post to ${fullStatusPostUrl} error`
    );
    console.error(err);
  }
}
