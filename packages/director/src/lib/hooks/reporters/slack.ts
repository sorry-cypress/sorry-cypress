import { HookEvent, RunSummary, SlackHook } from '@sorry-cypress/common';
import { getDashboardRunURL } from '@src/lib/urls';
import axios from 'axios';
import { shouldHookHandleEvent } from '../utils';

export async function reportToSlack({
  hook,
  runId,
  ciBuildId,
  runSummary,
  hookEvent,
  branch
}: {
  hook: SlackHook;
  runId: string;
  ciBuildId: string;
  runSummary: RunSummary;
  hookEvent: HookEvent;
  branch: string
}) {
  if (!shouldHookHandleEvent(hookEvent, hook, runSummary, branch)) {
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
  // Add Pending tests, and mark them as Skipped
  // Skipped should be marked as failed according to
  // https://github.com/cypress-io/cypress/issues/3092

  if (hookEvent === HookEvent.RUN_START) {
    title = '🚀 Started Run';
  }

  if (hookEvent === HookEvent.INSTANCE_FINISH) {
    title = 'Test suite finished';
  }

  if (hookEvent === HookEvent.RUN_FINISH) {
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
