import {
  isGenericHook,
  isGithubHook,
  isSlackHook,
  isBitbucketHook,
} from '@src/lib/hooks/hooksEnums';

import { Instance } from '@src/types/instance.types';
import { Run, RunSpec } from '@src/types/run.types';
import { Project, HookEvent } from '@src/types/project.types';

import { getRunTestsOverall } from './getRunTestOverall';
import { getCleanHookReportData } from './cleanHooksData';
import { reportStatusToGithub } from './githubReporter';
import { reportToGenericWebHook } from './genericReporter';
import { reportStatusToBitbucket } from './bitbucketReporter';
import { reportToSlack } from './slackReporter';

type ReportData = {
  run: Run;
  instance?: Instance | RunSpec;
  reportUrl?: string;
  hookEvent?: string;
  currentResults?: any;
};

export function reportToHook({
  hookEvent,
  reportData,
  project,
}: {
  hookEvent: HookEvent;
  reportData: ReportData;
  project: Project;
}): Promise<any> {
  try {
    reportData.currentResults = getRunTestsOverall(reportData.run);
    const cleanReportData = getCleanHookReportData(reportData);

    project?.hooks?.forEach((hook) => {
      if (isSlackHook(hook)) {
        return reportToSlack({
          hook,
          reportData: cleanReportData,
          hookEvent,
        });
      }
      if (isGithubHook(hook)) {
        return reportStatusToGithub({
          hook,
          reportData: cleanReportData,
          hookEvent,
        });
      }

      if (isGenericHook(hook)) {
        return reportToGenericWebHook({
          hook,
          reportData: cleanReportData,
          hookEvent,
        });
      }

      if (isBitbucketHook(hook)) {
        return reportStatusToBitbucket({
          hook,
          reportData: cleanReportData,
          hookEvent,
        });
      }
    });
  } catch (error) {
    console.error(`Failed to run hook at for ${project.projectId}`, error);
  }
  return Promise.resolve();
}
