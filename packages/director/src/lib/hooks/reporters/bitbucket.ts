import {
  BitBucketHook,
  getBitbucketBuildUrl,
  HookEvent,
  RunSummary,
} from '@sorry-cypress/common';
import { getDashboardRunURL } from '@src/lib/urls';
import axios from 'axios';

export async function reportStatusToBitbucket({
  hook,
  runId,
  runSummary,
  sha,
  hookEvent,
}: {
  hook: BitBucketHook;
  runId: string;
  sha: string;
  runSummary: RunSummary;
  hookEvent: string;
}) {
  const fullStatusPostUrl = getBitbucketBuildUrl(hook.url, sha);

  const data = {
    state: 'INPROGRESS',
    key: hook.hookId,
    name: hook.bitbucketBuildName || 'sorry-cypress',
    url: getDashboardRunURL(runId),
  };

  if (hookEvent === HookEvent.RUN_FINISH) {
    data.state = 'SUCCESSFUL';
    if (runSummary.failures > 0) {
      data.state = 'FAILED';
    }
  }

  if (!data.state) {
    return;
  }

  axios({
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
  }).catch((err) => {
    console.error(
      `Error: Hook post to ${fullStatusPostUrl} responded with `,
      err
    );
  });
}
