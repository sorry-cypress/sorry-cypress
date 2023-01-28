import {
  CreateRunParameters,
  CreateRunResponse,
  CreateRunWarning,
  getCreateProjectValue,
  Instance,
  InstanceResult,
  Project,
  Run,
  RunMetaData,
  SetInstanceTestsPayload,
  Task,
  UpdateInstanceResultsPayload,
  Hook,
  isTestFlaky,
  isRunCompleted,
} from '@sorry-cypress/common';
import { INACTIVITY_TIMEOUT_SECONDS } from '@sorry-cypress/director/config';
import { getRunCiBuildId } from '@sorry-cypress/director/lib/ciBuildId';
import {
  AppError,
  INSTANCE_NOT_EXIST,
  RUN_NOT_EXIST,
} from '@sorry-cypress/director/lib/errors';
import {
  generateGroupId,
  generateRunIdHash,
  generateUUID,
} from '@sorry-cypress/director/lib/hash';
import { mergeInstanceResults } from '@sorry-cypress/director/lib/instance';
import { getDashboardRunURL } from '@sorry-cypress/director/lib/urls';
import { ExecutionDriver } from '@sorry-cypress/director/types';
import { getLogger } from '@sorry-cypress/logger';
import { getNewGroupTemplate } from './mongo/runs/run.model';
import {
  enhanceSpec,
  getClaimedSpecs,
  getFirstUnclaimedSpec,
  getNewSpecsInGroup,
  getRemoteOrigin,
  getSpecsForGroup,
} from './utils';

const projects: { [key: string]: Project; } = {};
const runs: { [key: string]: Run; } = {};
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
  const ciBuildId = getRunCiBuildId(params);

  const runId = generateRunIdHash(ciBuildId, params.projectId);

  const machineId = generateUUID();

  const groupId = params.group ?? generateGroupId(params.platform, ciBuildId);
  const enhanceSpecForThisRun = enhanceSpec(groupId);

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
      response.warnings?.push({
        message: `Group ${groupId} has different specs for the same run. Make sure each group in run has the same specs.`,
        originalSpecs: existingGroupSpecs.map((spec) => spec.spec).join(', '),
        newSpecs: newSpecs.join(','),
      });
      return response;
    }

    runs[runId].specs = [
      ...runs[runId].specs,
      ...newSpecs.map(enhanceSpecForThisRun),
    ];
    return response;
  }

  if (!projects[params.projectId]) {
    createProject(
      getCreateProjectValue(params.projectId, INACTIVITY_TIMEOUT_SECONDS)
    );
  }

  params.commit.remoteOrigin = getRemoteOrigin(params.commit.remoteOrigin);

  runs[runId] = {
    runId,
    createdAt: new Date().toUTCString(),
    completion: {
      completed: false,
    },
    meta: {
      groupId,
      ciBuildId,
      commit: params.commit,
      projectId: params.projectId,
      platform: params.platform,
      ci: params.ci,
    } as RunMetaData,
    specs: params.specs.map(enhanceSpecForThisRun),
    cypressVersion: params.cypressVersion,
    progress: {
      updatedAt: new Date(),
      groups: [getNewGroupTemplate(groupId, params.specs.length)],
    },
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
      projectId: runs[runId].meta.projectId,
      claimedInstances: runs[runId].specs.length,
      totalInstances: runs[runId].specs.length,
    };
  }

  const unclaimedSpecIndex = runs[runId].specs.findIndex(
    (s) => s === unclaimedSpec
  );
  runs[runId].specs[unclaimedSpecIndex].claimedAt = new Date().toISOString();
  instances[unclaimedSpec.instanceId] = {
    _createTestsPayload: undefined,
    projectId: 'some',
    spec: runs[runId].specs[unclaimedSpecIndex].spec,
    runId,
    groupId,
    instanceId: unclaimedSpec.instanceId,
    cypressVersion: '',
  };

  return {
    projectId: runs[runId].meta.projectId,
    instance: unclaimedSpec,
    claimedInstances: getClaimedSpecs(runs[runId], groupId).length,
    totalInstances: getSpecsForGroup(runs[runId], groupId).length,
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

const setInstanceTests = async (
  instanceId: string,
  payload: SetInstanceTestsPayload
) => {
  if (!instances[instanceId]) {
    throw new AppError(INSTANCE_NOT_EXIST);
  }
  instances[instanceId] = {
    ...instances[instanceId],
    _createTestsPayload: { ...payload },
  };

  const runTests = runs[instances[instanceId].runId].progress.groups.find(group => group.groupId === instances[instanceId].groupId)?.tests;
  if (runTests) {
    runTests.overall = runTests.overall + payload.tests.length;
  }
};

const updateInstanceResults = async (
  instanceId: string,
  update: UpdateInstanceResultsPayload
) => {
  const instance = instances[instanceId];

  if (!instance) {
    throw new AppError(INSTANCE_NOT_EXIST);
  }

  const instanceResult = mergeInstanceResults(
    instance._createTestsPayload,
    update
  );

  instances[instanceId].results = instanceResult;

  updateRunsProgress(instanceId, instanceResult);
  return instances[instanceId];
};

const updateRunsProgress = (instanceId, instanceResult) => {
  const hasFailures = instanceResult.stats.failures > 0 || instanceResult.stats.skipped > 0;
  const flakyTests = instanceResult.tests.filter(isTestFlaky);
  const progressGroup = runs[instances[instanceId].runId].progress.groups.find(group => group.groupId === instances[instanceId].groupId);
  if (progressGroup) {
    progressGroup.instances.complete = progressGroup?.instances.complete + 1;
    if (hasFailures) {
      progressGroup.instances.failures = progressGroup?.instances.failures + 1;
    } else {
      progressGroup.instances.passes = progressGroup?.instances.passes + 1;
    }
    progressGroup.tests.passes = progressGroup.tests.passes + instanceResult.stats.passes;
    progressGroup.tests.failures = progressGroup.tests.failures + instanceResult.stats.failures;
    progressGroup.tests.skipped = progressGroup.tests.skipped + instanceResult.stats.skipped;
    progressGroup.tests.pending = progressGroup.tests.pending + instanceResult.stats.pending;
    progressGroup.tests.flaky = progressGroup.tests.flaky + flakyTests.length;
  }
};

const allGroupSpecsCompleted = (runId, groupId) => {
  const instances = runs[runId].progress.groups.find(group => group.groupId === groupId)?.instances;
  return Promise.resolve(instances?.overall === instances?.complete);
};

const setHooks = (projectId: string, hooks: Hook[]) => {
  projects[projectId] = { projectId, createdAt: new Date().toISOString(), hooks };
  return projects;
};

const allRunSpecsCompleted = async (runId: string): Promise<boolean> => {
  const run = runs[runId];
  if (!run) {
    throw new AppError(RUN_NOT_EXIST);
  }
  if (!run.progress) {
    return false;
  }
  return isRunCompleted(run.progress);
};

const maybeSetRunCompleted = async (runId) => {
  if (await allRunSpecsCompleted(runId)) {
    getLogger().log({ runId }, `[run-completion] Run completed`);
    setRunCompleted(runId).catch(getLogger().error);
    return true;
  }
  // timeout should handle
  return false;
};

const setRunCompleted = async (runId) => {
  if (!runs[runId]) {
    throw new AppError(RUN_NOT_EXIST);
  }
  runs[runId].completion = { completed: true };
};

export const driver: ExecutionDriver = {
  id: 'in-memory',
  init: () => Promise.resolve(),
  isDBHealthy: () => Promise.resolve(true),
  getProjectById: (projectId: string) => Promise.resolve(projects[projectId]),
  getRunById: (runId: string) => Promise.resolve(runs[runId]),
  maybeSetRunCompleted,
  allGroupSpecsCompleted,
  getInstanceById: (instanceId: string) =>
    Promise.resolve(instances[instanceId]),
  createRun,
  getNextTask,
  setInstanceResults,
  setInstanceTests,
  updateInstanceResults,
  setHooks,
  setScreenshotUrl: () => Promise.resolve(),
  setVideoUrl: () => Promise.resolve(),
  setRunCompleted,
  setRunCompletedWithTimeout: async ({ runId, timeoutMs }) => {
    if (!runs[runId]) {
      throw new AppError(RUN_NOT_EXIST);
    }
    runs[runId].completion = {
      completed: true,
      inactivityTimeoutMs: timeoutMs,
    };
  },
};
