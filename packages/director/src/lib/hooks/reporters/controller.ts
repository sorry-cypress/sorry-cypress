import {
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
import { compact } from 'lodash';
import { reportStatusToBitbucket } from './bitbucket';
import { reportToGenericWebHook } from './generic';
import { reportStatusToGithub } from './github';
import { reportToSlack } from './slack';

interface ReportHooksParams {
  eventType: HookEvent;
  run: RunWithSpecs;
  groupId: string;
  project: Project;
  spec?: string;
}
export async function reportToHooks(
  reportParams: ReportHooksParams
): Promise<void> {
  try {
    if (!reportParams.project.hooks?.length) {
      return;
    }
    const runSummary = getRunSummary(
      compact(
        reportParams.run.specsFull
          .filter((s) => s.groupId === reportParams.groupId)
          .map((s) => s.results)
      )
    );

    reportParams.project.hooks.forEach((hook) => {
      // swallow errors, don't trust reporters to catch errors
      runSingleReporter({ ...reportParams, runSummary, hook }).catch(
        (error) => {
          console.error(
            '[hooks] Error while reporting hook',
            reportParams.run.runId,
            hook.hookId,
            hook.hookType
          );
          console.error(error);
        }
      );
    });
  } catch (error) {
    console.error(
      `[hooks] Failed to run hooks`,
      reportParams.run.runId,
      reportParams.project.projectId
    );
    console.error(error);
  }
  return;
}

interface RunSingleReporterParams extends ReportHooksParams {
  runSummary: RunSummary;
  hook: Hook;
}
const runSingleReporter = async ({
  hook,
  run,
  runSummary,
  groupId,
  eventType,
  spec,
}: RunSingleReporterParams) => {
  if (isGithubHook(hook)) {
    return reportStatusToGithub(hook, {
      run,
      runSummary,
      groupId,
      eventType,
    });
  }
  if (isSlackHook(hook)) {
    return reportToSlack(hook, {
      eventType,
      run,
      groupId,
      runSummary,
      spec,
    });
  }
  if (isBitbucketHook(hook)) {
    return reportStatusToBitbucket(hook, {
      run,
      runSummary,
      groupId,
      eventType,
    });
  }
  if (isGenericHook(hook)) {
    return reportToGenericWebHook(hook, {
      run,
      groupId,
      runSummary,
      eventType,
      spec,
    });
  }

  // throw new AppError(UNKNOWN_HOOK_TYPE);
};
