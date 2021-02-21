import axios from 'axios';
import { getDashboardRunURL } from '@src/lib/urls';
import {
  HookEvent,
  SlackHook,
  hookEvents,
  RunSummary,
} from '@sorry-cypress/common';

import { shouldHookHandleEvent } from '../utils';

export async function reportToSlack({
  hook,
  runId,
  ciBuildId,
  runSummary,
  hookEvent,
}: {
  hook: SlackHook;
  runId: string;
  ciBuildId: string;
  runSummary: RunSummary;
  hookEvent: HookEvent;
}) {
  if (!shouldHookHandleEvent(hookEvent, hook)) {
    return;
  }
  let title = 'Test suite started';
  let description = '';
  if (runSummary.passes) {
    description += ` ✅ passed ${runSummary.passes}`;
  }
  if (runSummary.failures) {
    description += ` ❌ failed ${runSummary.failures}`;
  }
  if (runSummary.skipped) {
    description += ` 👟 skipped ${runSummary.skipped}`;
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
              text: `*${title} (${ciBuildId})*\n${description}`,
            },
            accessory: {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Run',
                emoji: true,
              },
              value: `view_run_${runId}`,
              url: getDashboardRunURL(runId),
              action_id: `view_run_${runId}`,
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
