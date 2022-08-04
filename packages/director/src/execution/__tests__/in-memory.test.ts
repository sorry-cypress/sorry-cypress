import {driver} from "@sorry-cypress/director/execution/in-memory";
import {CreateRunParameters} from "@sorry-cypress/common";

const ALL_SPECS = ['one.spec.ts', 'two.spec.ts', 'three.spec.ts']

it('should report the correct number of claimed specs as they are picked up', async () => {
    const createRunParams = makeCreateRunParameters(ALL_SPECS)
    const { groupId, machineId, runId } = await driver.createRun(createRunParams)
    const taskResponse = await driver.getNextTask({ groupId, machineId, runId, cypressVersion: '10.3.0' })
    expect(taskResponse.claimedInstances).toBe(1)
    expect(taskResponse.totalInstances).toBe(3)
})

const makeCreateRunParameters = (specs: string[]): CreateRunParameters => ({
    ciBuildId: 'buildId',
    commit: { sha: '1234' },
    projectId: 'myProject',
    specs,
    ci: {
        params: { ciBuildId: 'buildId' },
        provider: 'provider',
    },
    platform: {
        osName: 'ubuntu',
        osVersion: '20.04',
    },
})