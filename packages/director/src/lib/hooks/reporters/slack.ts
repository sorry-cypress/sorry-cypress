import {
CommitData,
HookEvent,
RunSummary,
SlackHook
} from '@sorry-cypress/common';
import { getDashboardRunURL } from '@src/lib/urls';
import axios from 'axios';
import { isResultSuccessful,shouldHookHandleEvent } from '../utils';

export async function reportToSlack({
  hook,
  runId,
  ciBuildId,
  runSummary,
  hookEvent,
  commit: { branch, message },
}: {
  hook: SlackHook;
  runId: string;
  ciBuildId: string;
  runSummary: RunSummary;
  hookEvent: HookEvent;
  commit: CommitData;
}) {
  if (!shouldHookHandleEvent(hookEvent, hook, runSummary, branch)) {
    return;
  }

  let title = '';
  switch (hookEvent) {
    case HookEvent.RUN_START:
      title = `:rocket: *Run started* (${ciBuildId})`;
      break;
    case HookEvent.INSTANCE_START:
      title = `*Instance started* (${ciBuildId})`;
      break;
    case HookEvent.INSTANCE_FINISH:
      title = `*Instance finished* (${ciBuildId})`;
      break;
    case HookEvent.RUN_FINISH:
      title = `${
        isResultSuccessful(runSummary) ? ':white_check_mark:' : ':x:'
      } *Run finished* (${ciBuildId})`;
      break;
  }

  const { passes, pending, skipped, failures } = runSummary;
  const resultsDescription =
    `${
      passes > 0 ? ':large_green_circle:' : ':white_circle:'
    } *Passed:* ${passes}\n\n\n` +
    `${
      pending > 0 ? ':large_yellow_circle:' : ':white_circle:'
    } *Skipped:* ${pending}\n\n\n` +
    `${failures + skipped > 0 ? ':red_circle:' : ':white_circle:'} *Failed*: ${
      failures + skipped
    }`;

  const commitDescription = `*Branch:*\n${branch}\n\n*Commit:*\n${
    message.length > 100 ? `${message.substring(0, 100)}...` : message
  }`;

  if (hookEvent === HookEvent.RUN_FINISH) {
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
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `${title}`,
            },
            accessory: {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Results',
                emoji: true,
              },
              value: `view_run_${runId}`,
              url: getDashboardRunURL(runId),
              action_id: `view_run_${runId}`,
            },
          },
        ],
        attachments: [
          {
            color: isResultSuccessful(runSummary) ? '#0E8A16' : '#D93F0B',
            blocks: [
              {
                type: 'section',
                fields: [
                  {
                    type: 'mrkdwn',
                    text: `${resultsDescription}`,
                  },
                  {
                    type: 'mrkdwn',
                    text: `${commitDescription}`,
                  },
                ],
              },
            ],
          },
        ],
        icon_url: 'https://sorry-cypress.s3.amazonaws.com/images/icon-bg.png',
      })
    )
    .catch((err) => {
      console.error(`Error: Hook Post to ${hook.url} responded with `, err);
    });
}
