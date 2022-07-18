import {
  Hook,
  HookEvent,
  isBitbucketHook,
  isGChatHook,
  isGenericHook,
  isGithubHook,
  isSlackHook,
  isTeamsHook,
  Project,
  Run,
  RunGroupProgress,
} from '@sorry-cypress/common';
import { getLogger } from '@sorry-cypress/logger';
import { reportStatusToBitbucket } from './bitbucket';
import { reportToGChat } from './gchat';
import { reportToGenericWebHook } from './generic';
import { reportStatusToGithub } from './github';
import { reportToSlack } from './slack';
import { reportToTeams } from './teams';

interface ReportHooksParams {
  eventType: HookEvent;
  run: Run;
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

    const groupProgress = reportParams.run.progress?.groups.find(
      (g) => g.groupId === reportParams.groupId
    );

    if (!groupProgress) {
      getLogger().error(
        { groupId: reportParams.groupId },
        'No progress for group'
      );
      return;
    }

    reportParams.project.hooks.forEach((hook) => {
      // swallow errors, don't trust reporters to catch errors
      runSingleReporter({ ...reportParams, groupProgress, hook }).catch(
        (error) => {
          getLogger().error(
            {
              runId: reportParams.run.runId,
              hookId: hook.hookId,
              hookType: hook.hookType,
              error,
            },
            '[hooks] Error while reporting hook'
          );
        }
      );
    });
  } catch (error) {
    getLogger().error(
      {
        runId: reportParams.run.runId,
        error,
      },
      `[hooks] Failed to run hooks`
    );
  }
  return;
}

interface RunSingleReporterParams extends ReportHooksParams {
  groupProgress: RunGroupProgress;
  hook: Hook;
}
const runSingleReporter = async ({
  hook,
  run,
  groupProgress,
  groupId,
  eventType,
  spec,
}: RunSingleReporterParams) => {
  if (isGithubHook(hook)) {
    return reportStatusToGithub(hook, {
      run,
      groupProgress,
      groupId,
      eventType,
    });
  }
  if (isSlackHook(hook)) {
    return reportToSlack(hook, {
      eventType,
      run,
      groupId,
      groupProgress,
      spec: spec ?? '',
    });
  }
  if (isTeamsHook(hook)) {
    return reportToTeams(hook, {
      eventType,
      run,
      groupId,
      groupProgress,
      spec: spec ?? '',
    });
  }
  if (isBitbucketHook(hook)) {
    return reportStatusToBitbucket(hook, {
      run,
      groupProgress,
      groupId,
      eventType,
    });
  }
  if (isGenericHook(hook)) {
    return reportToGenericWebHook(hook, {
      run,
      groupId,
      groupProgress,
      eventType,
      spec,
    });
  }

  if (isGChatHook(hook)) {
    return reportToGChat(hook, {
      eventType,
      run,
      groupId,
      groupProgress,
      spec: spec ?? '',
    });
  }
  // throw new AppError(UNKNOWN_HOOK_TYPE);
};
