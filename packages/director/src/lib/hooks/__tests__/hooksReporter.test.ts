import {
  BitBucketHook,
  CommitData,
  GithubHook,
  HookEvent,
  RunSummary,
  SlackHook,
} from '@sorry-cypress/common';
import axios from 'axios';
import { reportStatusToBitbucket } from '../reporters/bitbucket';
import { reportStatusToGithub } from '../reporters/github';
import { reportToSlack } from '../reporters/slack';
import bitbucketHook from './fixtures/bitbucketHook.json';
import bitbucketReportStatusRequest from './fixtures/bitbucketReportStatusRequest.json';
import githubHook from './fixtures/githubHooks.json';
import githubReportStatusRequest from './fixtures/githubReportStatusRequest.json';
import runSummary from './fixtures/runSummary.json';
import slackHook from './fixtures/slackHook.json';
import slackReportStatusRequest from './fixtures/slackReportStatusRequest.json';
import slackReportStatusRequestWithoutCommitData from './fixtures/slackReportStatusRequestWithoutCommitData.json';

jest.mock('axios');

beforeEach(() => {
  ((axios as unknown) as jest.Mock).mockResolvedValueOnce({ status: 200 });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Report status to GitHub', () => {
  const ghHook = ({
    ...githubHook,
    url: 'https://github.com/test-company/test-project/',
  } as unknown) as GithubHook;

  it('should send correct request to the github.com repo when run is started', async () => {
    await reportStatusToGithub({
      hook: ghHook,
      sha: 'testCommitSha',
      runId: 'testRunId',
      runSummary: (runSummary as unknown) as RunSummary,
      hookEvent: HookEvent.RUN_START,
    });

    expect(axios).toBeCalledWith({
      ...githubReportStatusRequest,
      url:
        'https://api.github.com/repos/test-company/test-project/statuses/testCommitSha',
    });
  });

  it('should send correct request to the github enterprise repo when run is started', async () => {
    await reportStatusToGithub({
      hook: {
        ...ghHook,
        url: 'https://gh.testcompany.com/test-company/test-project/',
      },
      sha: 'testCommitSha',
      runId: 'testRunId',
      runSummary: (runSummary as unknown) as RunSummary,
      hookEvent: HookEvent.RUN_START,
    });

    expect(axios).toBeCalledWith({
      ...githubReportStatusRequest,
      url:
        'https://gh.testcompany.com/api/v3/repos/test-company/test-project/statuses/testCommitSha',
    });
  });
});

describe('Report status to BitBucket', () => {
  const bbHook = ({
    ...bitbucketHook,
    url: 'https://bitbucket.org/testcompany/testrepo.git',
  } as unknown) as BitBucketHook;

  it('should send correct request to the bitbucket.org repo when run is started', async () => {
    await reportStatusToBitbucket({
      hook: bbHook,
      sha: 'testCommitSha',
      runId: 'testRunId',
      runSummary: (runSummary as unknown) as RunSummary,
      hookEvent: HookEvent.RUN_START,
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
    await reportToSlack({
      hook: slkHook,
      runId: 'testRunId',
      ciBuildId: 'testCiBuildId',
      runSummary: (runSummary as unknown) as RunSummary,
      hookEvent: HookEvent.RUN_FINISH,
      commit: {
        sha: 'testSha123',
        branch: 'testBranch',
        message: 'testMessage',
      },
    });

    expect(axios).toBeCalledWith({
      ...slackReportStatusRequest,
      url: 'https://hooks.slack.com/services/123/XXX/zzz',
    });
  });

  it('should report correctly to Slack with no commit data', async () => {
    await reportToSlack({
      hook: ({
        ...slackHook,
        url: 'https://hooks.slack.com/services/123/XXX/zzz',
      } as unknown) as SlackHook,
      runId: 'testRunId',
      ciBuildId: 'testCiBuildId',
      runSummary: (runSummary as unknown) as RunSummary,
      hookEvent: HookEvent.RUN_FINISH,
      commit: {} as CommitData,
    });

    expect(axios).toBeCalledWith({
      ...slackReportStatusRequestWithoutCommitData,
      url: 'https://hooks.slack.com/services/123/XXX/zzz',
    });
  });
});
