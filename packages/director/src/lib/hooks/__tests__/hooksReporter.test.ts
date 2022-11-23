import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';
import {
  BitBucketHook,
  GChatHook,
  GithubHook,
  HookEvent,
  RunWithSpecs,
  SlackHook,
  TeamsHook,
} from '@sorry-cypress/common';
import { reportToGChat } from '@sorry-cypress/director/lib/hooks/reporters/gchat';
import axios from 'axios';
import { reportStatusToBitbucket } from '../reporters/bitbucket';
import { reportStatusToGithub } from '../reporters/github';
import { reportToSlack } from '../reporters/slack';
import { reportToTeams } from '../reporters/teams';
import bitbucketHook from './fixtures/bitbucketHook.json';
import bitbucketReportStatusRequest from './fixtures/bitbucketReportStatusRequest.json';
import gchatHook from './fixtures/gchatHook.json';
import gchatReportStatusRequest from './fixtures/gchatReportStatusRequest.json';
import gchatReportStatusRequestWithoutCommitDescription from './fixtures/gchatReportStatusRequestWithoutCommitDescription.json';
import githubHook from './fixtures/githubHooks.json';
import githubReportStatusRequest from './fixtures/githubReportStatusRequest.json';
import groupProgress from './fixtures/groupProgress.json';
import slackHook from './fixtures/slackHook.json';
import slackReportStatusRequest from './fixtures/slackReportStatusRequest.json';
import slackReportStatusRequestWithoutCommitData from './fixtures/slackReportStatusRequestWithoutCommitData.json';
import teamsHook from './fixtures/teamsHook.json';
import teamsReportStatusRequest from './fixtures/teamsReportStatusRequest.json';

jest.mock('axios');
jest.mock('@octokit/rest');

const createCommitStatus = jest.fn();
const octokitMock = (Octokit as unknown) as jest.Mock;

octokitMock.mockImplementation(function () {
  this.repos = { createCommitStatus };
});

beforeEach(() => {
  ((axios as unknown) as jest.Mock).mockReset();
  ((axios as unknown) as jest.Mock).mockResolvedValueOnce({ status: 200 });
});

afterEach(() => {
  jest.restoreAllMocks();
});

const run = {
  runId: 'testRunId',
  meta: {
    ciBuildId: 'testCiBuildId',
    commit: {
      sha: 'testCommitSha',
      branch: 'testBranch',
      message: 'testMessage',
    },
  },
} as RunWithSpecs;

const runWithoutCommitDescription = {
  runId: 'testRunId',
  meta: {
    ciBuildId: 'testCiBuildId',
    commit: {
      sha: '',
      branch: '',
      message: '',
    },
  },
} as RunWithSpecs;

describe('Report status to GitHub', () => {
  const ghHook = ({
    ...githubHook,
    url: 'https://github.com/test-company/test-project/',
  } as unknown) as GithubHook;

  it('should send correct request to the github.com repo when run is started', async () => {
    await reportStatusToGithub(ghHook, {
      run,
      groupId: 'ciBuildId',
      groupProgress,
      eventType: HookEvent.RUN_START,
    });

    expect(octokitMock).toBeCalledWith({
      auth: 'testGithubToken',
    });

    expect(createCommitStatus).toBeCalledWith({
      ...githubReportStatusRequest,
      owner: 'test-company',
      repo: 'test-project',
      sha: 'testCommitSha',
    });
  });

  it('should send request with app authentication when run is started', async () => {
    await reportStatusToGithub(
      {
        ...ghHook,
        githubAuthType: 'app',
        githubAppPrivateKey: 'private-key',
        githubAppId: '123',
        githubAppInstallationId: '456',
      },
      {
        run,
        groupId: 'ciBuildId',
        groupProgress,
        eventType: HookEvent.RUN_START,
      }
    );

    expect(octokitMock).toBeCalledWith({
      authStrategy: createAppAuth,
      auth: {
        appId: '123',
        privateKey: 'private-key',
        installationId: '456',
      },
    });

    expect(createCommitStatus).toBeCalledWith({
      ...githubReportStatusRequest,
      owner: 'test-company',
      repo: 'test-project',
      sha: 'testCommitSha',
    });
  });

  it('should send correct request to the github enterprise repo when run is started', async () => {
    await reportStatusToGithub(
      {
        ...ghHook,
        url: 'https://gh.testcompany.com/test-company/test-project/',
      },
      {
        run,
        groupId: 'ciBuildId',
        groupProgress,
        eventType: HookEvent.RUN_START,
      }
    );

    expect(octokitMock).toBeCalledWith({
      auth: 'testGithubToken',
      baseUrl: 'https://gh.testcompany.com/api/v3',
    });

    expect(createCommitStatus).toBeCalledWith({
      ...githubReportStatusRequest,
      owner: 'test-company',
      repo: 'test-project',
      sha: 'testCommitSha',
    });
  });
});

describe('Report status to BitBucket', () => {
  const bbHook = ({
    ...bitbucketHook,
    url: 'https://bitbucket.org/testcompany/testrepo.git',
  } as unknown) as BitBucketHook;

  it('should send correct request to the bitbucket.org repo when run is started', async () => {
    await reportStatusToBitbucket(bbHook, {
      run,
      groupId: 'ciBuildId',
      groupProgress,
      eventType: HookEvent.RUN_START,
    });

    expect(axios).toBeCalledWith({
      ...bitbucketReportStatusRequest,
      url:
        'https://api.bitbucket.org/2.0/repositories/testcompany/testrepo/commit/testCommitSha/statuses/build',
    });
  });
});

describe('Report status to Slack', () => {
  const slkHook = ({
    ...slackHook,
    url: 'https://hooks.slack.com/services/123/XXX/zzz',
    hookEvents: ['RUN_FINISH'],
    slackResultFilter: 'ONLY_SUCCESSFUL',
    slackBranchFilter: ['testBranch'],
  } as unknown) as SlackHook;

  it('should send correct request to the Slack when run is finished', async () => {
    await reportToSlack(slkHook, {
      run,
      groupProgress,
      eventType: HookEvent.RUN_FINISH,
      spec: 'spec',
      groupId: 'groupId',
    });

    expect(axios).toBeCalledWith({
      ...slackReportStatusRequest,
      url: 'https://hooks.slack.com/services/123/XXX/zzz',
    });
  });

  it('should report correctly to Slack with no commit data', async () => {
    await reportToSlack(
      ({
        ...slackHook,
        url: 'https://hooks.slack.com/services/123/XXX/zzz',
      } as unknown) as SlackHook,
      {
        run: {
          ...run,
          meta: {
            ...run.meta,
            commit: null,
          },
        },
        groupProgress,
        eventType: HookEvent.RUN_FINISH,
        groupId: 'groupId',
        spec: 'spec',
      }
    );

    expect(axios).toBeCalledWith({
      ...slackReportStatusRequestWithoutCommitData,
      url: 'https://hooks.slack.com/services/123/XXX/zzz',
    });
  });
});

describe('Report status to Teams', () => {
  const tmsHook = ({
    ...teamsHook,
    url:
      'https://xyz123.webhok.office.com/webhook/abc987/IncomingWebhook/123/456',
    hookEvents: ['RUN_FINISH'],
  } as unknown) as TeamsHook;

  it('should send correct request to Teams when run is finished', async () => {
    await reportToTeams(tmsHook, {
      run,
      groupProgress,
      eventType: HookEvent.RUN_FINISH,
      spec: 'spec',
      groupId: 'groupId',
    });

    expect(axios).toBeCalledWith({
      ...teamsReportStatusRequest,
      url:
        'https://xyz123.webhok.office.com/webhook/abc987/IncomingWebhook/123/456',
    });
  });
});

describe('Report status to GChat', () => {
  const gcHook = ({
    ...gchatHook,
    url:
      'https://xyz123.webhok.office.com/webhook/abc987/IncomingWebhook/123/456',
    hookEvents: ['RUN_FINISH'],
  } as unknown) as GChatHook;

  it('should send correct request to GChat when run is finished', async () => {
    await reportToGChat(gcHook, {
      run,
      groupProgress,
      eventType: HookEvent.RUN_FINISH,
      spec: 'spec',
      groupId: 'groupId',
    });

    expect(axios).toBeCalledWith({
      ...gchatReportStatusRequest,
      url:
        'https://xyz123.webhok.office.com/webhook/abc987/IncomingWebhook/123/456',
    });
  });

  it('should send correct request (without commit description) to GChat when run is finished', async () => {
    await reportToGChat(gcHook, {
      run: runWithoutCommitDescription,
      groupProgress,
      eventType: HookEvent.RUN_FINISH,
      spec: 'spec',
      groupId: 'groupId',
    });

    expect(axios).toBeCalledWith({
      ...gchatReportStatusRequestWithoutCommitDescription,
      url:
        'https://xyz123.webhok.office.com/webhook/abc987/IncomingWebhook/123/456',
    });
  });
});
