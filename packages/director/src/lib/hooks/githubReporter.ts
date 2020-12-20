import { hookEvents } from '@src/lib/hooks/hooksEnums';
import axios from 'axios';
import { getDashboardRunURL } from '@src/lib/urls';
import { GithubHook } from '@src/types/project.types';

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
  reportData,
  hookEvent,
}: {
  hook: GithubHook;
  reportData: any;
  hookEvent: string;
}) {
  const fullStatusPostUrl = getGithubHookUrl(
    hook.url,
    reportData.run.meta.commit.sha
  );

  const data = {
    state: '',
    description: `fa:${reportData.currentResults.failures} pa:${reportData.currentResults.passes} pe:${reportData.currentResults.pending} sk:${reportData.currentResults.skipped}`,
    target_url: getDashboardRunURL(
      reportData?.run?.runId || reportData.instance.runId
    ),
    context: hook.githubContext || 'Sorry-Cypress-Tests',
  };

  if (hookEvent === hookEvents.RUN_START) {
    data.state = 'pending';
  }

  if (hookEvent === hookEvents.INSTANCE_FINISH) {
    data.state = 'pending';
  }

  if (hookEvent === hookEvents.RUN_FINISH) {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, 5000);
    });

    data.state = 'success';
    if (reportData.currentResults.failures > 0) {
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
