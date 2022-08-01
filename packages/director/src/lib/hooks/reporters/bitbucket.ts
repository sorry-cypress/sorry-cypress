import {
  BitBucketHook,
  getBitbucketBuildUrl,
  HookEvent,
  isRunGroupSuccessful,
  Run,
  RunGroupProgress,
} from '@sorry-cypress/common';
import { APP_NAME } from '@sorry-cypress/director/config';
import { getDashboardRunURL } from '@sorry-cypress/director/lib/urls';
import { getLogger } from '@sorry-cypress/logger';
import axios from 'axios';
import md5 from 'md5';

interface BBReporterStatusParams {
  run: Run;
  eventType: HookEvent;
  groupId: string;
  groupProgress: RunGroupProgress;
}
export async function reportStatusToBitbucket(
  hook: BitBucketHook,
  eventData: BBReporterStatusParams
) {
  if (!hook.bitbucketUsername) {
    getLogger().warn(
      {
        runId: eventData.run.runId,
        groupId: eventData.groupId,
      },
      '[bitbucket-reporter] No bitbucketUsername, ignoring hook...'
    );
    return;
  }

  if (!hook.bitbucketToken) {
    getLogger().warn(
      {
        ...hook,
      },
      '[bitbucket-reporter] No bitbucketToken, ignoring hook...'
    );
    return;
  }

  const { eventType, groupId, run, groupProgress } = eventData;

  // don't append group name if groupId is non-explicit
  // otherwise rerunning would create a new status context in GH
  let context = `${hook.bitbucketBuildName || APP_NAME}`;
  if (run.meta.ciBuildId !== groupId) {
    context = `${context}: ${groupId}`;
  }
  const description = `failed:${groupProgress.tests.failures} skipped:${groupProgress.tests.skipped} passed:${groupProgress.tests.passes} ignored:${groupProgress.tests.pending} flaky:${groupProgress.tests.flaky}`;

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
    if (isRunGroupSuccessful(groupProgress)) {
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

  const fullStatusPostUrl = getBitbucketBuildUrl(hook.url, run.meta.commit.sha);
  getLogger().log(
    {
      runId: eventData.run.runId,
      groupId: eventData.groupId,
      fullStatusPostUrl,
      eventType,
      data,
    },
    `[bitbucket-reporter] Posting hook`
  );

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
    getLogger().error(
      {
        runId: eventData.run.runId,
        groupId: eventData.groupId,
        fullStatusPostUrl,
      },
      `[bitbucket-reporter] Hook post to ${fullStatusPostUrl} error`
    );
  }
}
