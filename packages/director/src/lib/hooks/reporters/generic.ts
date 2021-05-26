import {
  GenericHook,
  HookEvent,
  RunSummary,
  RunWithSpecs,
} from '@sorry-cypress/common';
import { getDashboardRunURL } from '@src/lib/urls';
import axios from 'axios';

interface GenericHookReporterStatusParams {
  run: RunWithSpecs;
  eventType: HookEvent;
  runSummary: RunSummary;
  groupId: string;
  spec?: string;
}
export async function reportToGenericWebHook(
  hook: GenericHook,
  eventData: GenericHookReporterStatusParams
) {
  const { runSummary, eventType, run, groupId, spec } = eventData;

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
      ...runSummary,
    };

    if (run.meta.ciBuildId !== groupId) {
      data.groupId = groupId;
    }
    if (spec) {
      data.spec = spec;
    }
    console.log('[webhook-reporter] Posting webhook', {
      eventType,
      data,
    });
    await axios({
      method: 'post',
      headers: hook.headers ? JSON.parse(hook.headers) : {},
      url: hook.url,
      data,
    });
  } catch (err) {
    console.error('[webhook-reporter] Post hook responded with error');
    console.error(err);
  }
}

function shouldHandleGenericHook(hook: GenericHook, eventType: HookEvent) {
  return hook.hookEvents.includes(eventType);
}
