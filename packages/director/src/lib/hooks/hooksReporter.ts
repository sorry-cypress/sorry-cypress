import {
  isGenericHook,
  isGithubHook,
  isSlackHook,
} from '@src/lib/hooks/hooksEnums';

import { Project, HookEvent } from '@src/types/project.types';

import { getRunTestsOverall } from './getRunTestOverall';
import { getCleanHookReportData } from './cleanHooksData';
import { reportStatusToGithub } from './githubReporter';
import { reportToGenericWebHook } from './genericReporter';
import { reportToSlack } from './slackReporter';
import { RunWithSpecs } from '@src/types';

export function reportToHook({
  hookEvent,
  run,
  project,
}: {
  hookEvent: HookEvent;
  run: RunWithSpecs;
  project: Project;
}): Promise<any> {
  try {
    const runSummary = getCleanHookReportData(getRunTestsOverall(run));

    project?.hooks?.forEach((hook) => {
      if (isSlackHook(hook)) {
        return reportToSlack({
          hook,
          runSummary,
          runId: run.runId,
          ciBuildId: run.meta.ciBuildId,
          hookEvent,
        });
      }
      if (isGithubHook(hook)) {
        return reportStatusToGithub({
          hook,
          sha: run.meta.commit.sha,
          runId: run.runId,
          runSummary,
          hookEvent,
        });
      }

      if (isGenericHook(hook)) {
        return reportToGenericWebHook({
          hook,
          runId: run.runId,
          runSummary,
          hookEvent,
        });
      }
    });
  } catch (error) {
    console.error(`Failed to run hook at for ${project.projectId}`, error);
  }
  return Promise.resolve();
}
