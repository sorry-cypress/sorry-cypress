import { hookEvents, hookTypes } from '@src/lib/hooksEnums';
import axios from 'axios';
import { getDashboardRunURL } from '@src/lib/urls';
import { Instance } from '@src/types/instance.types';
import { Run, RunSpec } from '@src/types/run.types';
import { Project, Hook } from '@src/types/project.types';
import { hookReportSchema } from '@src/lib/schemas';
import Ajv from 'ajv';
import { cloneDeep } from 'lodash';

const ajv = new Ajv({ removeAdditional: 'all' });
const cleanHookReportData = ajv.compile(hookReportSchema);
const getCleanHookReportData = (data: unknown) =>
  cleanHookReportData(cloneDeep(data));
type ReportData = {
  run?: Run;
  instance?: Instance | RunSpec;
  reportUrl?: string;
  hookEvent?: string;
  currentResults?: any;
};

// this is duplicated from dashboard since there is no easy way to share code.
function getRunTestsOverall(run: any) {
  const isStillRunning = run.specs.reduce(
    (wasRunning: boolean, currentSpec: { claimed: any; results: any }) => {
      return !currentSpec.claimed || !currentSpec.results || wasRunning;
    },
    false
  );
  const duration = run.specs.reduce(
    (dates: any, currentSpec: any, index: number) => {
      if (currentSpec.results) {
        if (
          index === 0 ||
          new Date(currentSpec?.results?.stats?.wallClockStartedAt) <=
            new Date(dates.firstStart)
        ) {
          dates.firstStart = currentSpec.results.stats.wallClockStartedAt;
        }
        if (
          index === 0 ||
          new Date(currentSpec?.results?.stats?.wallClockEndedAt) >
            new Date(dates.lastEnd)
        ) {
          dates.lastEnd = currentSpec.results.stats.wallClockEndedAt;
        }
      }
      if (index + 1 === run.specs.length) {
        return dates.lastEnd
          ? Number(new Date(dates.lastEnd)) - Number(new Date(dates.firstStart))
          : 0;
      }
      return dates;
    },
    {}
  );
  return run.specs.reduce(
    (agg: any, spec: any) => {
      if (!spec.results) {
        return agg;
      }

      return {
        tests: agg.tests + spec.results.stats.tests,
        failures: agg.failures + spec.results.stats.failures,
        passes: agg.passes + spec.results.stats.passes,
        pending: agg.pending + spec.results.stats.pending,
        skipped: agg.skipped + spec.results.stats.skipped,
        wallClockStartedAt: new Date(run.createdAt),
        wallClockDuration: isStillRunning ? 0 : duration || 0,
      };
    },
    {
      failures: 0,
      passes: 0,
      skipped: 0,
      tests: 0,
      pending: 0,
      wallClockStartedAt: new Date(run.createdAt),
      wallClockDuration: 0,
    }
  );
}

async function reportStatusToGithub({
  hook,
  reportData,
  hookEvent,
}: {
  hook: Hook;
  reportData: any;
  hookEvent: string;
}) {
  const [githubProtocol, restOfGithubUrl] = hook.url.split('://');
  const [githubDomain, githubProject, githubRepo] = restOfGithubUrl.split('/');
  const fullStatusPostUrl = `${githubProtocol}://${githubDomain}/api/v3/repos/${githubProject}/${githubRepo}/statuses/${reportData.run.meta.commit.sha}`;

  const data = {
    state: '',
    description: '',
    target_url: getDashboardRunURL(
      reportData?.run?.runId || reportData.instance.runId
    ),
    context: 'Sorry-Cypress-Tests',
  };

  if (hookEvent === hookEvents.RUN_START) {
    data.state = 'pending';
    data.description = `fa:${reportData.currentResults.failures} pa:${reportData.currentResults.passes} pe:${reportData.currentResults.pending} sk:${reportData.currentResults.skipped}`;
  }

  if (hookEvent === hookEvents.INSTANCE_FINISH) {
    data.state = 'pending';
    data.description = `fa:${reportData.currentResults.failures} pa:${reportData.currentResults.passes} pe:${reportData.currentResults.pending} sk:${reportData.currentResults.skipped}`;
  }

  if (hookEvent === hookEvents.RUN_FINISH) {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, 5000);
    });

    data.state = 'success';
    if (reportData.currentResults.failures > 0) {
      data.state = 'failure';
    }
    data.description = `fa:${reportData.currentResults.failures} pa:${reportData.currentResults.passes} pe:${reportData.currentResults.pending} sk:${reportData.currentResults.skipped}`;
  }

  return (
    (data.state &&
      axios({
        method: 'post',
        url: fullStatusPostUrl,
        auth: {
          username: 'sorry-cypress',
          password: hook.githubToken,
        },
        data,
      }).catch((err) => {
        console.error(
          `Error: Hook post to ${fullStatusPostUrl} responded with `,
          err
        );
      })) ||
    Promise.resolve()
  );
}

async function reportToGenericWebHook({
  hook,
  reportData,
  hookEvent,
}: {
  hook: Hook;
  reportData: any;
  hookEvent: string;
}) {
  if (
    // if no hooks are specified we should trigger the hook call on all events
    !hook.hookEvents || //no hooks
    hook.hookEvents.length < 1 || // no hooks
    hook.hookEvents.indexOf(hookEvent) !== -1 // matches specific event that fired
  ) {
    reportData.hookEvent = hookEvent;
    reportData.reportUrl = getDashboardRunURL(
      (reportData.run && reportData.run.runId) || reportData.instance.runId
    );
    return axios({
      method: 'post',
      headers: JSON.parse(hook.headers) || {},
      url: hook.url,
      data: reportData,
    }).catch((err) => {
      console.error(`Error: Hook Post to ${hook.url} responded with `, err);
    });
  }
}

export function reportToHook({
  hookEvent,
  reportData,
  project,
}: {
  hookEvent: string;
  reportData: ReportData;
  project: Project;
}): Promise<any> {
  try {
    reportData.currentResults = getRunTestsOverall(reportData.run);
    const cleanReportData = getCleanHookReportData(reportData);

    project?.hooks?.forEach((hook) => {
      if (hook.hookType === hookTypes.GITHUB_STATUS_HOOK) {
        return reportStatusToGithub({
          hook,
          reportData: cleanReportData,
          hookEvent,
        });
      } else {
        return reportToGenericWebHook({
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
