import axios from 'axios';
import { getDashboardRunURL } from '@src/lib/urls';
import { HookEvent, GenericHook, RunSummary } from '@sorry-cypress/common';
import { shouldHookHandleEvent } from '../utils';

export async function reportToGenericWebHook({
  hook,
  runId,
  branch,
  runSummary,
  hookEvent,
}: {
  hook: GenericHook;
  runId: string;
  branch: string;
  runSummary: RunSummary;
  hookEvent: HookEvent;
}) {
  if (!shouldHookHandleEvent(hookEvent, hook, runSummary, branch)) {
    return;
  }

  return axios({
    method: 'post',
    headers: hook.headers ? JSON.parse(hook.headers) : {},
    url: hook.url,
    data: {
      event: hookEvent,
      runUrl: getDashboardRunURL(runId),
      ...runSummary,
    },
  }).catch((err) => {
    console.error(`Error: Hook Post to ${hook.url} responded with `, err);
  });
}
