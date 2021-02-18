import axios from 'axios';
import { getDashboardRunURL } from '@src/lib/urls';
import { HookEvent, GenericHook } from '@src/types/project.types';
import { RunSummaryForHooks } from './types';
import { shouldHookHandleEvent } from './hookHasEvent';

export async function reportToGenericWebHook({
  hook,
  runSummary,
  hookEvent,
  runId,
}: {
  runId: string;
  hook: GenericHook;
  runSummary: RunSummaryForHooks;
  hookEvent: HookEvent;
}) {
  if (!shouldHookHandleEvent(hookEvent, hook)) {
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
