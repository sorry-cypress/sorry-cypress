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
