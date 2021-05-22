import {
  CommitData,
  HookEvent,
  ResultFilter,
  RunSummary,
  SlackHook,
} from '@sorry-cypress/common';
import { getDashboardRunURL } from '@src/lib/urls';
import axios from 'axios';
import { truncate } from 'lodash';
import { isResultSuccessful } from '../utils';

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
  if (!isShouldReportSlackHook(hookEvent, hook, runSummary, branch)) {
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

  const commitDescription =
    (branch || message) &&
    `*Branch:*\n${branch}\n\n*Commit:*\n${truncate(message, {
      length: 100,
    })}`;

  axios({
    method: 'post',
    url: hook.url,
    data: {
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
                ...(commitDescription
                  ? [
                      {
                        type: 'mrkdwn',
                        text: `${commitDescription}`,
                      },
                    ]
                  : []),
              ],
            },
          ],
        },
      ],
      icon_url: 'https://sorry-cypress.s3.amazonaws.com/images/icon-bg.png',
    },
  }).catch((err) => {
    console.error(`Error: Hook Post to ${hook.url} responded with `, err);
  });
}

export function isShouldReportSlackHook(
  event: HookEvent,
  hook: SlackHook,
  runSummary: RunSummary,
  branch: string
) {
  return (
    isSlackEventFilterPassed(event, hook) &&
    isSlackResultFilterPassed(hook, runSummary) &&
    isSlackBranchFilterPassed(hook, branch)
  );
}

export function isSlackEventFilterPassed(event: HookEvent, hook: SlackHook) {
  if (!hook.hookEvents || !hook.hookEvents.length) {
    return true;
  }

  return hook.hookEvents.includes(event);
}

export function isSlackResultFilterPassed(
  hook: SlackHook,
  runSummary: RunSummary
) {
  switch (hook.slackResultFilter) {
    case ResultFilter.ONLY_FAILED:
      if (!isResultSuccessful(runSummary)) return true;
      break;
    case ResultFilter.ONLY_SUCCESSFUL:
      if (isResultSuccessful(runSummary)) return true;
      break;
    case ResultFilter.ALL:
      return true;
    default:
      console.log(`Unexpected Slack filter type: ${hook.slackResultFilter}`);
      return false;
  }

  return false;
}

export function isSlackBranchFilterPassed(hook: SlackHook, branch: string) {
  if (!hook.slackBranchFilter || hook.slackBranchFilter.length === 0)
    return true;

  return !hook.slackBranchFilter
    // Branch filter supports only '*' and '?' wildcard symbols, not full regex syntax,
    // so first we escape all special symbols except '*' and '?'
    // and then replace '*' with '.*' and '?' with '.' before passing this string to regex.
    // We shouldn't warn about handling branch names having '*' or '?' symbols
    // as such names are prohibited (see 'man git-check-ref-format')
    .map((filter: string) =>
      filter
        .replace(/[\-\[\]\/\{\}\(\)\+\.\\\^\$\|]/g, '\\$&')
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.')
    )
    // Then we just check all filters for a mach with a users' branch,
    // and if all filters don't matched (returned -1)
    // we return inverted value to set isBranchInFilter to 'false'
    .every(
      (filter: string) => branch.search(new RegExp(`^${filter}$`, 'i')) === -1
    );
}
