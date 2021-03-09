import { GithubHook, HookEvent, RunSummary } from '@sorry-cypress/common';
import { getDashboardRunURL } from '@src/lib/urls';
import axios from 'axios';

const getGithubHookUrl = (url: string, sha: string) => {
  const GITHUB_COM_DOMAIN = 'github.com';
  const GITHUB_COM_ENDPOINT = 'api.github.com';

  const [githubProtocol, restOfGithubUrl] = url.split('://');
  const [githubDomain, githubProject, githubRepo] = restOfGithubUrl.split('/');
  const githubEndpoint =
    githubDomain === GITHUB_COM_DOMAIN
      ? GITHUB_COM_ENDPOINT
      : `${githubDomain}/api/v3`;
  return `${githubProtocol}://${githubEndpoint}/repos/${githubProject}/${githubRepo}/statuses/${sha}`;
};

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
  const fullStatusPostUrl = getGithubHookUrl(hook.url, sha);

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
