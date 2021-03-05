import { GithubHook, hookEvents, RunSummary } from '@sorry-cypress/common';
import axios from 'axios';
import { reportStatusToGithub } from '../reporters/github';
import githubHook from './fixtures/githubHooks.json';
import reportStatusRequest from './fixtures/reportStatusRequest.json';
import runSummary from './fixtures/runSummary.json';

jest.mock('axios');

const hook = ({
  ...githubHook,
  url: 'https://github.com/test-company/test-project/',
} as unknown) as GithubHook;
describe('test reportStatusToGithub', () => {
  beforeEach(() => {
    ((axios as unknown) as jest.Mock).mockResolvedValueOnce({ status: 200 });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should send correct request to the github.com repo when run is started', async () => {
    await reportStatusToGithub({
      hook,
      sha: 'testCommitSha',
      runId: 'testRunId',
      runSummary: (runSummary as unknown) as RunSummary,
      hookEvent: hookEvents.RUN_START,
    });

    expect(axios).toBeCalledWith({
      ...reportStatusRequest,
      url:
        'https://api.github.com/repos/test-company/test-project/statuses/testCommitSha',
    });
  });

  it('should send correct request to the github enterprise repo when run is started', async () => {
    await reportStatusToGithub({
      hook: {
        ...hook,
        url: 'https://gh.testcompany.com/test-company/test-project/',
      },
      sha: 'testCommitSha',
      runId: 'testRunId',
      runSummary: (runSummary as unknown) as RunSummary,
      hookEvent: hookEvents.RUN_START,
    });

    expect(axios).toBeCalledWith({
      ...reportStatusRequest,
      url:
        'https://gh.testcompany.com/api/v3/repos/test-company/test-project/statuses/testCommitSha',
    });
  });
});
