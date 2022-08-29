import { Run } from '@sorry-cypress/common';
import { driver } from '@sorry-cypress/director/execution/mongo/driver';

const mockInsertOneRun = jest.fn(() => {
  return {
    ops: [
      {
        runId: '123',
        createdAt: '123',
      },
    ],
  };
});

jest.mock(
  '@sorry-cypress/mongo',
  () => {
    return {
      Collection: {
        project: jest.fn(() => {
          return {
            findOne: jest.fn(),
            insertOne: jest.fn(),
          };
        }),
        run: jest.fn(() => {
          return {
            insertOne: mockInsertOneRun,
          };
        }),
      },
      runTimeoutModel: {
        createRunTimeout: () => {},
      },
    };
  },
  { virtual: true }
);

describe('runs', () => {
  afterEach(() => {
    mockInsertOneRun.mockClear();
  });

  [
    {
      originType: 'GitLab CI',
      remoteOrigin:
        'https://gitlab-ci-token:token-to-remove@gitlab.com:group/project.git',
      expected: 'https://gitlab.com/group/project.git',
    },
    {
      originType: 'GitLab CI subdomain',
      remoteOrigin:
        'https://gitlab-ci-token:token-to-remove@gitlab.company.com:group/project.git',
      expected: 'https://gitlab.company.com/group/project.git',
    },
    {
      originType: 'GitLab',
      remoteOrigin: 'git@gitlab.com:group/project.git',
      expected: 'https://gitlab.com/group/project.git',
    },
    {
      originType: 'GitLab subdomain',
      remoteOrigin: 'git@gitlab.company.com:group/project.git',
      expected: 'https://gitlab.company.com/group/project.git',
    },
    {
      originType: 'GitHub',
      remoteOrigin: 'git@github.com:group/project.git',
      expected: 'https://github.com/group/project.git',
    },
    {
      originType: 'BitBucket',
      remoteOrigin: 'git@bitbucket.org:group/project.git',
      expected: 'https://bitbucket.org/group/project.git',
    },
  ].forEach(({ originType, remoteOrigin, expected }) => {
    it(`sets the correct remoteOrigin for ${originType}`, async () => {
      await driver.createRun({
        ciBuildId: 'buildId',
        commit: {
          sha: '1234',
          remoteOrigin,
        },
        projectId: 'myProject',
        specs: ['one.spec.ts'],
        ci: {
          params: { ciBuildId: 'buildId' },
          provider: 'provider',
        },
        platform: {
          osName: 'ubuntu',
          osVersion: '20.04',
        },
      });

      expect(
        (mockInsertOneRun.mock.calls[0][0] as Run).meta.commit.remoteOrigin
      ).toBe(expected);
    });
  });
});
