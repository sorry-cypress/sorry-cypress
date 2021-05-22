import {
  CommitData,
  GenericHook,
  HookEvent,
  RunSummary,
} from '@sorry-cypress/common';
import { getDashboardRunURL } from '@src/lib/urls';
import axios from 'axios';

export async function reportToGenericWebHook({
  hook,
  runId,
  runSummary,
  commit,
  hookEvent,
}: {
  hook: GenericHook;
  runId: string;
  commit: CommitData;
  runSummary: RunSummary;
  hookEvent: HookEvent;
}) {
  if (!shouldHandleGenericHook(hook, hookEvent)) {
    return;
  }

  axios({
    method: 'post',
    headers: hook.headers ? JSON.parse(hook.headers) : {},
    url: hook.url,
    data: {
      event: hookEvent,
      runUrl: getDashboardRunURL(runId),
      commit,
      ...runSummary,
    },
  }).catch((err) => {
    console.error(`Error: Hook Post to ${hook.url} responded with `, err);
  });
}

function shouldHandleGenericHook(hook: GenericHook, hookEvent: HookEvent) {
  return hook.hookEvents.includes(hookEvent);
}
