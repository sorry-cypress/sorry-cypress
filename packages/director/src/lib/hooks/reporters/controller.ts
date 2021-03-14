import {
  getRunSummary,
  HookEvent,
  isBitbucketHook,
  isGenericHook,
  isGithubHook,
  isSlackHook,
  Project,
  RunWithSpecs,
} from '@sorry-cypress/common';
import { compact } from 'lodash';
import { reportStatusToBitbucket } from './bitbucket';
import { reportToGenericWebHook } from './generic';
import { reportStatusToGithub } from './github';
import { reportToSlack } from './slack';

export function reportToHook({
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
      compact(run.specsFull.map((s) => s.results?.stats))
    );
    project.hooks?.forEach((hook) => {
      if (isSlackHook(hook)) {
        reportToSlack({
          hook,
          runSummary,
          runId: run.runId,
          ciBuildId: run.meta.ciBuildId,
          hookEvent,
        });
      }
      if (isGithubHook(hook)) {
        reportStatusToGithub({
          hook,
          sha: run.meta.commit.sha,
          runId: run.runId,
          runSummary,
          hookEvent,
        });
      }

      if (isGenericHook(hook)) {
        reportToGenericWebHook({
          hook,
          runId: run.runId,
          runSummary,
          hookEvent,
        });
      }

      if (isBitbucketHook(hook)) {
        return reportStatusToBitbucket({
          hook,
          sha: run.meta.commit.sha,
          runId: run.runId,
          runSummary,
          hookEvent,
        });
      }
    });
  } catch (error) {
    console.error(`Failed to run hook for ${project.projectId}`, error);
  }
  return Promise.resolve();
}
