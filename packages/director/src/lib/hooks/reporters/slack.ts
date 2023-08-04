import {
  HookEvent,
  isRunGroupSuccessful,
  ResultFilter,
  Run,
  RunGroupProgress,
  SlackHook,
} from '@sorry-cypress/common';
import { getDashboardRunURL } from '@sorry-cypress/director/lib/urls';
import { getLogger } from '@sorry-cypress/logger';
import axios from 'axios';
import { truncate } from 'lodash';

interface SlackReporterEventPayload {
  eventType: HookEvent;
  run: Run;
  groupId: string;
  groupProgress: RunGroupProgress;
  spec: string;
}

export async function reportToSlack(
  hook: SlackHook,
  event: SlackReporterEventPayload
) {
  if (
    !shouldReportSlackHook(
      event.eventType,
      hook,
      event.groupProgress,
      event.run.meta.commit?.branch
    )
  ) {
    return;
  }
  const ciBuildId = event.run.meta.ciBuildId;
  let groupLabel = '';

  if (event.groupId !== event.run.meta.ciBuildId) {
    groupLabel = `, group ${event.groupId}`;
  }

  let title = '';
  let color = isRunGroupSuccessful(event.groupProgress)
    ? successColor
    : failureColor;

  switch (event.eventType) {
    case HookEvent.RUN_START:
      title = `:rocket: *Run started* (${ciBuildId}${groupLabel})`;
      break;
    case HookEvent.INSTANCE_START:
      title = `*Instance started* ${event.spec} (${ciBuildId}${groupLabel})`;
      break;
    case HookEvent.INSTANCE_FINISH:
      title = `*Instance finished* ${event.spec} (${ciBuildId}${groupLabel})`;
      break;
    case HookEvent.RUN_FINISH:
      title = `${
        isRunGroupSuccessful(event.groupProgress) ? ':white_check_mark:' : ':x:'
      } *Run finished* (${ciBuildId}${groupLabel})`;
      break;
    case HookEvent.RUN_TIMEOUT:
      title = `:hourglass_flowing_sand: *Run timedout* (${ciBuildId})`;
      color = failureColor;
      break;
  }

  const {
    passes,
    pending,
    skipped,
    failures,
    flaky,
  } = event.groupProgress.tests;
  const resultsDescription =
    `${
      passes > 0 ? ':large_green_circle:' : ':white_circle:'
    } *Passed:* ${passes}\n\n\n` +
    `${
      failures > 0 ? ':red_circle:' : ':white_circle:'
    } *Failed*: ${failures}` +
    `${skipped > 0 ? ':red_circle:' : ':white_circle:'} *Skipped*: ${skipped}` +
    `${
      pending > 0 ? ':large_yellow_circle:' : ':white_circle:'
    } *Ignored:* ${pending}\n\n\n` +
    `${flaky > 0 ? `\n\n\n:large_yellow_circle: *Flaky*: ${flaky}` : ''}`;

  const commitDescription =
    (event.run.meta.commit?.branch || event.run.meta.commit?.message) &&
    `*Branch:*\n${event.run.meta.commit.branch}\n\n*Commit:*\n${truncate(
      event.run.meta.commit.message,
      {
        length: 100,
      }
    )}`;

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
            value: `view_run_${event.run.runId}`,
            url: getDashboardRunURL(event.run.runId),
            action_id: `view_run_${event.run.runId}`,
          },
        },
      ],
      attachments: [
        {
          color,
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
      icon_url: 'https://sorry-cypress.s3.amazonaws.com/images/logo-bg.png',
    },
  }).catch((error) => {
    getLogger().error(
      { error, ...hook },
      `Error while posting Slack message to ${hook.url}`
    );
  });
}

export function shouldReportSlackHook(
  event: HookEvent,
  hook: SlackHook,
  groupProgress: RunGroupProgress,
  branch?: string
) {
  return (
    isSlackEventFilterPassed(event, hook) &&
    isSlackResultFilterPassed(hook, groupProgress) &&
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
  groupProgress: RunGroupProgress
) {
  switch (hook.slackResultFilter) {
    case ResultFilter.ONLY_FAILED:
      if (!isRunGroupSuccessful(groupProgress)) return true;
      break;
    case ResultFilter.ONLY_SUCCESSFUL:
      if (isRunGroupSuccessful(groupProgress)) return true;
      break;
    case ResultFilter.ALL:
      return true;
    default:
      getLogger().error({ ...hook }, `Unexpected Slack filter type`);
      return false;
  }

  return false;
}

export function isSlackBranchFilterPassed(hook: SlackHook, branch?: string) {
  if (!hook.slackBranchFilter?.length) return true;

  // if slackBranchFilter is defined, not no branch known - skip
  if (!branch) return false;

  return !hook.slackBranchFilter
    // Branch filter supports only '!', '*' and '?' wildcard symbols, not full regex syntax,
    // so first we escape all special symbols except '!'(at the beginning), '*' and '?'
    // and then replace '*' with '.*' and '?' with '.' before passing this string to regex.
    // If filter begins with `!` we will match only the branches that do not match with the provided regex.
    // We shouldn't warn about handling branch names having '*' or '?' symbols
    // as such names are prohibited (see 'man git-check-ref-format')
    .map((filter: string) => {
      const negative = filter[0] === '!';
      const formattedFilter = filter
        .replace(/^!/g, '')
        .replace(/[!\-[]\/\{\}\(\)\+\.\\\^\$\|]/g, '\\$&')
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.');
      return {
        negative,
        filter: formattedFilter,
      };
    })
    // Then we just check all filters for a mach with a users' branch,
    // and if all filters don't matched (returned -1)
    // we return inverted value to set isBranchInFilter to 'false'
    .every(({ filter, negative }: { filter: string; negative: boolean }) => {
      return (
        branch.search(new RegExp(`^${filter}$`, 'i')) === (negative ? 0 : -1)
      );
    });
}

const successColor = '#0E8A16';
const failureColor = '#AB1616';
