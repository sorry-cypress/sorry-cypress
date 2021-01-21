import {
  Project,
  Run,
  Task,
  RunMetaData,
  Instance,
  InstanceResult,
  ExecutionDriver,
  CreateRunResponse,
  CreateRunParameters,
  CreateRunWarning,
} from '@src/types';
import { getDashboardRunURL } from '@src/lib/urls';
import { AppError, RUN_NOT_EXIST, INSTANCE_NOT_EXIST } from '@src/lib/errors';
import {
  generateRunIdHash,
  generateGroupId,
  generateUUID,
} from '@src/lib/hash';
import {
  getClaimedSpecs,
  getFirstUnclaimedSpec,
  getNewSpecsInGroup,
  getSpecsForGroup,
  enhanceSpec,
} from './utils';

const projects: { [key: string]: Project } = {};
const runs: { [key: string]: Run } = {};
const instances: {
  [key: string]: Instance;
} = {};

const createProject = (project: Project) => {
  projects[project.projectId] = project;
  return project;
};

const createRun: ExecutionDriver['createRun'] = async (
  params: CreateRunParameters
): Promise<CreateRunResponse> => {
  const runId = generateRunIdHash(params);
  const machineId = generateUUID();

  const groupId =
    params.group ?? generateGroupId(params.platform, params.ciBuildId);
  const enhaceSpecForThisRun = enhanceSpec(groupId);

  const response: CreateRunResponse = {
    groupId,
    machineId,
    runId,
    runUrl: getDashboardRunURL(runId),
    isNewRun: true,
    warnings: [] as CreateRunWarning[],
  };

  if (runs[runId]) {
    response.isNewRun = false;
    // update new specs for a new group
    const newSpecs = getNewSpecsInGroup({
      run: runs[runId],
      groupId,
      candidateSpecs: params.specs,
    });
    if (!newSpecs.length) {
      return response;
    }

    const existingGroupSpecs = getSpecsForGroup(runs[runId], groupId);
    if (newSpecs.length && existingGroupSpecs.length) {
      response.warnings.push({
        message: `Group ${groupId} has different specs for the same run. Make sure each group in run has the same specs.`,
        originalSpecs: existingGroupSpecs.map((spec) => spec.spec).join(', '),
        newSpecs: newSpecs.join(','),
      });
      return response;
    }

    runs[runId].specs = [
      ...runs[runId].specs,
      ...newSpecs.map(enhaceSpecForThisRun),
    ];
    return response;
  }

  if (!projects[params.projectId]) {
    createProject({
      projectId: params.projectId,
      createdAt: new Date().toUTCString(),
    });
  }

  runs[runId] = {
    runId,
    createdAt: new Date().toUTCString(),
    meta: {
      groupId,
      ciBuildId: params.ciBuildId,
      commit: params.commit,
      projectId: params.projectId,
      platform: params.platform,
    } as RunMetaData,
    specs: params.specs.map(enhaceSpecForThisRun),
  };

  return response;
};

const getNextTask: ExecutionDriver['getNextTask'] = async ({
  runId,
  groupId,
}): Promise<Task> => {
  if (!runs[runId]) {
    throw new AppError(RUN_NOT_EXIST);
  }

  const unclaimedSpec = getFirstUnclaimedSpec(runs[runId], groupId);

  if (!unclaimedSpec) {
    return {
      instance: null,
      claimedInstances: runs[runId].specs.length,
      totalInstances: runs[runId].specs.length,
    };
  }

  const unclaimedSpecIndex = runs[runId].specs.findIndex(
    (s) => s === unclaimedSpec
  );
  runs[runId].specs[unclaimedSpecIndex].claimed = true;
  instances[unclaimedSpec.instanceId] = {
    runId,
    instanceId: unclaimedSpec.instanceId,
  };

  return {
    instance: unclaimedSpec,
    claimedInstances: getClaimedSpecs(runs[runId], groupId).length + 1,
    totalInstances: getSpecsForGroup(runs[runId], groupId).length,
  };
};

const getRunWithSpecs: ExecutionDriver['getRunWithSpecs'] = async (runId) => {
  return {
    ...runs[runId],
    specsFull: runs[runId].specs.map((spec) => instances[spec.instanceId]),
  };
};

const setInstanceResults = async (
  instanceId: string,
  results: InstanceResult
) => {
  if (!instances[instanceId]) {
    throw new AppError(INSTANCE_NOT_EXIST);
  }
  instances[instanceId] = { ...instances[instanceId], results };
};
export const driver: ExecutionDriver = {
  id: 'in-memory',
  init: () => Promise.resolve(),
  getProjectById: (projectId: string) => Promise.resolve(projects[projectId]),
  getRunById: (runId: string) => Promise.resolve(runs[runId]),
  getRunWithSpecs,
  getInstanceById: (instanceId: string) =>
    Promise.resolve(instances[instanceId]),
  createRun,
  getNextTask,
  setInstanceResults,
  setScreenshotUrl: () => Promise.resolve(),
  setVideoUrl: () => Promise.resolve(),
};
