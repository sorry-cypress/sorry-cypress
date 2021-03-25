import {
  BitBucketHook,
  GithubHook,
  HookEvent,
  RunSummary,
} from '@sorry-cypress/common';
import axios from 'axios';
import { reportStatusToBitbucket } from '../reporters/bitbucket';
import { reportStatusToGithub } from '../reporters/github';
import bitbucketHook from './fixtures/bitbucketHook.json';
import bitbucketReportStatusRequest from './fixtures/bitbucketReportStatusRequest.json';
import githubHook from './fixtures/githubHooks.json';
import githubReportStatusRequest from './fixtures/githubReportStatusRequest.json';
import runSummary from './fixtures/runSummary.json';

jest.mock('axios');

const ghHook = ({
  ...githubHook,
  url: 'https://github.com/test-company/test-project/',
} as unknown) as GithubHook;

const bbHook = ({
  ...bitbucketHook,
  url: 'https://bitbucket.org/testcompany/testrepo.git',
} as unknown) as BitBucketHook;

describe('Report Status to Github / Bitbucket', () => {
  beforeEach(() => {
    ((axios as unknown) as jest.Mock).mockResolvedValueOnce({ status: 200 });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

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
