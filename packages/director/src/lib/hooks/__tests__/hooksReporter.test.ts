import axios from 'axios';
import { reportStatusToGithub } from '../githubReporter';
import { reportStatusToBitbucket } from '../bitbucketReporter';
import { hookEvents } from '../hooksEnums';

import githubHook from './fixtures/githubHooks.json';
import bitbucketHook from './fixtures/bitbucketHook.json';
import reportData from './fixtures/reportData.json';
import reportStatusRequest from './fixtures/reportStatusRequest.json';
import bitbucketReportStatusRequest from './fixtures/bitbucketReportStatusRequest.json';

jest.mock('axios');

describe('test reportStatusToGithub', () => {
  beforeEach(() => {
    ((axios as unknown) as jest.Mock).mockResolvedValueOnce({ status: 200 });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should send correct request to the github.com repo when run is started', async () => {
    await reportStatusToGithub({
      hook: {
        ...githubHook,
        url: 'https://github.com/test-company/test-project/',
      },
      reportData: reportData,
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
        ...githubHook,
        url: 'https://gh.testcompany.com/test-company/test-project/',
      },
      reportData: reportData,
      hookEvent: hookEvents.RUN_START,
    });

    expect(axios).toBeCalledWith({
      ...reportStatusRequest,
      url:
        'https://gh.testcompany.com/api/v3/repos/test-company/test-project/statuses/testCommitSha',
    });
  });
});

describe('test reportStatusToBitbucket', () => {
  beforeEach(() => {
    ((axios as unknown) as jest.Mock).mockResolvedValueOnce({ status: 200 });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should send correct request to the bitbucket.org repo when run is started', async () => {
    await reportStatusToBitbucket({
      hook: {
        ...bitbucketHook,
        url: 'https://bitbucket.org/testcompany/testrepo.git',
      },
      reportData: reportData,
      hookEvent: hookEvents.RUN_START,
    });

    expect(axios).toBeCalledWith({
      ...bitbucketReportStatusRequest,
      url:
        'https://api.bitbucket.org/2.0/testcompany/testrepo/commit/testCommitSha/statuses/build',
    });
  });
});
