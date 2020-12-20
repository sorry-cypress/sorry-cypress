import axios from 'axios';
import { getDashboardRunURL } from '@src/lib/urls';

import { HookEvent, SlackHook } from '@src/types/project.types';
import { hookEvents } from './hooksEnums';

export async function reportToSlack({
  hook,
  reportData,
  hookEvent,
}: {
  hook: SlackHook;
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

    let title = 'Test suite started';
    let description = '';
    if (reportData.currentResults.passes) {
      description += ` ✅ passed ${reportData.currentResults.passes}`;
    }
    if (reportData.currentResults.failures) {
      description += ` ❌ failed ${reportData.currentResults.failures}`;
    }
    if (reportData.currentResults.skipped) {
      description += ` 👟 skipped ${reportData.currentResults.skipped}`;
    }

    if (hookEvent === hookEvents.RUN_START) {
      title = '🚀 Started Run';
    }

    if (hookEvent === hookEvents.INSTANCE_FINISH) {
      title = 'Test suite finished';
    }

    if (hookEvent === hookEvents.RUN_FINISH) {
      title = '🏁 Finished Run';
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(null);
        }, 5000);
      });
    }

    return axios
      .post(
        hook.url,
        JSON.stringify({
          username: 'sorry-cypress',
          text: title,
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*${title} (${reportData.run.meta.ciBuildId})*\n${description}`,
              },
              accessory: {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'View Run',
                  emoji: true,
                },
                value: `view_run_${reportData.run.runId}`,
                url: reportData.reportUrl,
                action_id: `view_run_${reportData.run.runId}`,
              },
            },
          ],
          icon_url: 'https://sorry-cypress.s3.amazonaws.com/images/icon-bg.png',
        })
      )
      .catch((err) => {
        console.error(`Error: Hook Post to ${hook.url} responded with `, err);
      });
  }
}
