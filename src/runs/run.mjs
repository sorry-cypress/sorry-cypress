import md5 from 'md5';
import uuid from 'uuid/v4';
import { getRunById, createRun, updateRun } from '../storage/';

export const getById = getRunById;

export const createOrGetRun = async ({
  ciBuildId,
  commit,
  projectId,
  specs,
  platform
}) => {
  // generate machine id
  const machineId = uuid();

  // generate run id - multiple machines that run the same task should have the same runId
  const runId = md5(ciBuildId + commit.sha + projectId + specs.join(' '));

  // not sure how specific that should be
  const groupId = `${platform.osName}-${platform.osVersion}-${ciBuildId}`;

  if (!(await getRunById(runId))) {
    await createRun(runId, specs);
  }

  return {
    groupId,
    machineId,
    runId,
    runUrl: 'https://sorry.cypress.io/',
    warnings: []
  };
};

export const getClaimedInstances = run => run.filter(s => s.claimed);
export const getFirstUnclaimedInstance = run => run.find(s => !s.claimed);
export const getAllInstances = run => run;
export const isRunComplete = run => !getFirstUnclaimedInstance(run);

export const setInstanceClaimed = async (runId, instanceId) => {
  const run = await getById(runId);
  if (!run) {
    throw new Error('Setting instance for non-existing run');
  }
  const foundIndex = run.findIndex(i => i.instanceId === instanceId);

  if (foundIndex === -1) {
    throw new Error('Setting non-existing instance as claimed');
  }

  run[foundIndex].claimed = true;
  return await updateRun(runId, run);
};
