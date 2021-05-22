import {
  CommitData,
  getRunSummary,
  Hook,
  HookEvent,
  isBitbucketHook,
  isGenericHook,
  isGithubHook,
  isSlackHook,
  Project,
  RunSummary,
  RunWithSpecs,
} from '@sorry-cypress/common';
import { AppError, UNKNOWN_HOOK_TYPE } from '@src/lib/errors';
import { compact } from 'lodash';
import { reportStatusToBitbucket } from './bitbucket';
import { reportToGenericWebHook } from './generic';
import { reportStatusToGithub } from './github';
import { reportToSlack } from './slack';

export function reportToHooks({
  hookEvent,
  run,
  project,
}: {
  hookEvent: HookEvent;
  run: RunWithSpecs;
  project: Project;
}): Promise<void> {
  try {
    if (!project.hooks.length) {
      return;
    }
    const runSummary = getRunSummary(
      compact(run.specsFull.map((s) => s.results))
    );
    const reporterArgs = {
      runSummary,
      runId: run.runId,
      ciBuildId: run.meta.ciBuildId,
      commit: run.meta.commit,
      hookEvent,
    };
    project.hooks?.forEach((hook) => {
      // swallow errors, don't trust reporters to catch errors
      runSingleReporter({ ...reporterArgs, hook }).catch((error) => {
        console.error(error);
        console.error('Error while reporting hook', hook.hookId, hook.hookType);
      });
    });
  } catch (error) {
    console.error(`Failed to run hooks for ${project.projectId}`, error);
  }
  return Promise.resolve();
}

interface RunSingleReporterParams {
  runSummary: RunSummary;
  hook: Hook;
  runId: string;
  ciBuildId: string;
  commit: CommitData;
  hookEvent: HookEvent;
}
const runSingleReporter = (params: RunSingleReporterParams) => {
  if (isGithubHook(params.hook)) {
    return reportStatusToGithub({
      ...params,
      hook: params.hook,
      sha: params.commit.sha,
    });
  }
  if (isGenericHook(params.hook)) {
    return reportToGenericWebHook({ ...params, hook: params.hook });
  }
  if (isBitbucketHook(params.hook)) {
    return reportStatusToBitbucket({
      ...params,
      hook: params.hook,
      sha: params.commit.sha,
    });
  }
  if (isSlackHook(params.hook)) {
    return reportToSlack({ ...params, hook: params.hook });
  }

  throw new AppError(UNKNOWN_HOOK_TYPE);
};
