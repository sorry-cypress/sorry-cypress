import { driver } from '@sorry-cypress/director/execution/in-memory';

const ALL_SPECS = ['one.spec.ts', 'two.spec.ts', 'three.spec.ts'];

it('should report the correct number of claimed specs as they are picked up', async () => {
  const { groupId, machineId, runId } = await driver.createRun({
    ciBuildId: 'buildId',
    commit: { sha: '1234' },
    projectId: 'myProject',
    specs: ALL_SPECS,
    ci: {
      params: { ciBuildId: 'buildId' },
      provider: 'provider',
    },
    platform: {
      osName: 'ubuntu',
      osVersion: '20.04',
    },
  });
  const nextTaskRequest = {
    groupId,
    machineId,
    runId,
    cypressVersion: '10.3.0',
  };
  const firstResponse = await driver.getNextTask(nextTaskRequest);
  expect(firstResponse.claimedInstances).toBe(1);
  expect(firstResponse.totalInstances).toBe(3);

  const secondResponse = await driver.getNextTask(nextTaskRequest);
  expect(secondResponse.claimedInstances).toBe(2);

  const thirdResponse = await driver.getNextTask(nextTaskRequest);
  expect(thirdResponse.claimedInstances).toBe(3);
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
    const { runId } = await driver.createRun({
      ciBuildId: originType,
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

    const run = await driver.getRunById(runId);

    expect(run?.meta.commit.remoteOrigin).toEqual(expected);
  });
});
