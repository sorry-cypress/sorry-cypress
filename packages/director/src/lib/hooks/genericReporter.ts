import axios from 'axios';
import { getDashboardRunURL } from '@src/lib/urls';

import { HookEvent, GenericHook } from '@src/types/project.types';

export async function reportToGenericWebHook({
  hook,
  reportData,
  hookEvent,
}: {
  hook: GenericHook;
  reportData: any;
  hookEvent: HookEvent;
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
      headers: hook.headers ? JSON.parse(hook.headers) : {},
      url: hook.url,
      data: {
        username: 'sorry-cypress',
        icon_url: 'https://avatars1.githubusercontent.com/u/64430146?s=200&v=4',
      },
    }).catch((err) => {
      console.error(`Error: Hook Post to ${hook.url} responded with `, err);
    });
  }
}
