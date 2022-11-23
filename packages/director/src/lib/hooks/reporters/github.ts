import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';
import {
  getGithubConfiguration,
  GithubHook,
  HookEvent,
  isRunGroupSuccessful,
  Run,
  RunGroupProgress,
} from '@sorry-cypress/common';
import { APP_NAME } from '@sorry-cypress/director/config';
import { getDashboardRunURL } from '@sorry-cypress/director/lib/urls';
import { getLogger } from '@sorry-cypress/logger';

type OctokitOptions = ConstructorParameters<typeof Octokit>[0];

type GithubStatusData = {
  state: 'error' | 'failure' | 'pending' | 'success' | undefined;
  context: string;
  description: string;
  target_url: string;
};

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
  if (
    (hook.githubAuthType === 'token' || !hook.githubAuthType) &&
    !hook.githubToken
  ) {
    getLogger().warn(
      { ...hook, runId: eventData.run.runId, groupID: eventData.groupId },
      '[github-reporter] No github token defined, ignoring hook...'
    );
    return;
  }

  if (
    hook.githubAuthType === 'app' &&
    (!hook.githubAppPrivateKey ||
      !hook.githubAppId ||
      !hook.githubAppInstallationId)
  ) {
    getLogger().warn(
      { ...hook, runId: eventData.run.runId, groupID: eventData.groupId },
      '[github-reporter] Not all required values for github app auth are set, ignoring hook...'
    );
    return;
  }

  const { eventType, groupId, groupProgress, run } = eventData;

  const description = `failed:${groupProgress.tests.failures} skipped:${groupProgress.tests.skipped} passed:${groupProgress.tests.passes} pending:${groupProgress.tests.pending} flaky:${groupProgress.tests.flaky}`;

  // don't append group name if groupId is non-explicit
  // otherwise rerunning would create a new status context in GH
  let context = `${hook.githubContext || APP_NAME}`;

  if (run.meta.ciBuildId !== groupId) {
    context = `${context}: ${groupId}`;
  }

  const data: GithubStatusData = {
    state: undefined,
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
    data.description = `timed out - ${data.description}`;
  }

  if (!data.state) {
    return;
  }

  const {
    githubDomain,
    githubRepo,
    githubProject,
    isEnterpriseUrl,
    enterpriseUrl,
  } = getGithubConfiguration(hook.url);

  const octokitOptions: OctokitOptions = {
    auth: hook.githubToken,
  };

  if (hook.githubAuthType === 'app') {
    octokitOptions.authStrategy = createAppAuth;
    octokitOptions.auth = {
      appId: hook.githubAppId,
      privateKey: hook.githubAppPrivateKey,
      installationId: hook.githubAppInstallationId,
    };
  }

  if (isEnterpriseUrl) {
    octokitOptions.baseUrl = enterpriseUrl;
  }

  const octokit = new Octokit(octokitOptions);

  getLogger().log(
    {
      githubDomain,
      githubRepo,
      githubProject,
      sha: run.meta.commit.sha,
      eventType,
      ...data,
    },
    '[github-reporter] Sending HTTP request to GitHub'
  );
  try {
    await octokit.repos.createCommitStatus({
      sha: run.meta.commit.sha,
      owner: githubProject,
      repo: githubRepo,
      state: data.state,
      context: data.context,
      description: data.description,
      target_url: getDashboardRunURL(run.runId),
    });
  } catch (error) {
    getLogger().error(
      {
        githubDomain,
        githubRepo,
        githubProject,
        runId: run.runId,
        error: error.toJSON ? error.toJSON() : error,
        resonse: error.response?.data ? error.response.data : null,
      },
      `[github-reporter] Hook post to ${githubDomain} responded with error`
    );
  }
}
