import {
  GenericHook,
  HookEvent,
  Run,
  RunGroupProgress,
} from '@sorry-cypress/common';
import { getDashboardRunURL } from '@sorry-cypress/director/lib/urls';
import { getLogger } from '@sorry-cypress/logger';
import axios from 'axios';

interface GenericHookReporterStatusParams {
  run: Run;
  eventType: HookEvent;
  groupProgress: RunGroupProgress;
  groupId: string;
  spec?: string;
}
export async function reportToGenericWebHook(
  hook: GenericHook,
  eventData: GenericHookReporterStatusParams
) {
  const { groupProgress, eventType, run, groupId, spec } = eventData;

  if (!shouldHandleGenericHook(hook, eventType)) {
    return;
  }

  try {
    // don't send group name if groupId is non-explicit
    const data: any = {
      event: eventType,
      runUrl: getDashboardRunURL(run.runId),
      buildId: run.meta.ciBuildId,
      commit: run.meta.commit,
      ...groupProgress.tests,
    };

    if (run.meta.ciBuildId !== groupId) {
      data.groupId = groupId;
    }
    if (spec) {
      data.spec = spec;
    }
    getLogger().log(
      {
        eventType,
        ...data,
      },
      '[webhook-reporter] Posting webhook'
    );
    await axios({
      method: 'post',
      headers: hook.headers ? JSON.parse(hook.headers) : {},
      url: hook.url,
      data,
    });
  } catch (error) {
    getLogger().error(
      { error },
      '[webhook-reporter] Post hook responded with error'
    );
  }
}

function shouldHandleGenericHook(hook: GenericHook, eventType: HookEvent) {
  return hook.hookEvents.includes(eventType);
}
