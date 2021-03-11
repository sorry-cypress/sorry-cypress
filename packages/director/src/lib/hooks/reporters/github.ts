import {
  getGithubStatusUrl,
  GithubHook,
  HookEvent,
  RunSummary,
} from '@sorry-cypress/common';
import { getDashboardRunURL } from '@src/lib/urls';
import axios from 'axios';

export async function reportStatusToGithub({
  hook,
  runId,
  runSummary,
  sha,
  hookEvent,
}: {
  hook: GithubHook;
  runId: string;
  sha: string;
  runSummary: RunSummary;
  hookEvent: string;
}) {
  const fullStatusPostUrl = getGithubStatusUrl(hook.url, sha);

  const data = {
    state: '',
    description: `fa:${runSummary.failures} pa:${runSummary.passes} pe:${runSummary.pending} sk:${runSummary.skipped}`,
    target_url: getDashboardRunURL(runId),
    context: hook.githubContext || 'Sorry-Cypress-Tests',
  };

  if (hookEvent === HookEvent.RUN_START) {
    data.state = 'pending';
  }

  if (hookEvent === HookEvent.INSTANCE_FINISH) {
    data.state = 'pending';
  }

  if (hookEvent === HookEvent.RUN_FINISH) {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, 5000);
    });

    data.state = 'success';
    if (runSummary.failures > 0) {
      data.state = 'failure';
    }
  }

  return (
    (data.state &&
      axios({
        method: 'post',
        url: fullStatusPostUrl,
        auth: {
          username: 'sorry-cypress',
          password: hook.githubToken,
        },
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
        data,
      }).catch((err) => {
        console.error(
          `Error: Hook post to ${fullStatusPostUrl} responded with `,
          err
        );
      })) ||
    Promise.resolve()
  );
}
