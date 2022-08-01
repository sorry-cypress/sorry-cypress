import {
  GChatHook,
  HookEvent,
  isRunGroupSuccessful,
  Run,
  RunGroupProgress,
} from '@sorry-cypress/common';
import { getDashboardRunURL } from '@sorry-cypress/director/lib/urls';
import { getLogger } from '@sorry-cypress/logger';
import axios from 'axios';
import { truncate } from 'lodash';

interface GChatReporterEventPayload {
  eventType: HookEvent;
  run: Run;
  groupId: string;
  groupProgress: RunGroupProgress;
  spec: string;
}

export async function reportToGChat(
  hook: GChatHook,
  event: GChatReporterEventPayload
) {
  if (!shouldReportGChatHook(event.eventType, hook)) {
    return;
  }
  const ciBuildId = event.run.meta.ciBuildId;
  let groupLabel = '';

  if (event.groupId !== event.run.meta.ciBuildId) {
    groupLabel = `, group ${event.groupId}`;
  }

  let title = '';

  switch (event.eventType) {
    case HookEvent.RUN_START:
      title = `🚀 Run started (${ciBuildId}${groupLabel})`;
      break;
    case HookEvent.INSTANCE_START:
      title = `Instance started - ${event.spec} (${ciBuildId}${groupLabel})`;
      break;
    case HookEvent.INSTANCE_FINISH:
      title = `Instance finished - ${event.spec} (${ciBuildId}${groupLabel})`;
      break;
    case HookEvent.RUN_FINISH:
      title = `${
        isRunGroupSuccessful(event.groupProgress) ? '&#x2705;' : '&#x274C;'
      } Run finished (${ciBuildId}${groupLabel})`;
      break;
    case HookEvent.RUN_TIMEOUT:
      title = `⏳ Run timedout (${ciBuildId})`;
      break;
  }

  const { passes, skipped, failures, flaky } = event.groupProgress.tests;

  axios({
    method: 'post',
    url: hook.url,
    data: {
      cards: [
        {
          sections: [
            {
              widgets: [
                {
                  textParagraph: {
                    text: `${title}`,
                  },
                },
              ],
            },
            ((event.run.meta.commit?.branch ||
              event.run.meta.commit?.message) && {
              widgets: [
                {
                  keyValue: {
                    topLabel: 'Branch',
                    content: `${event.run.meta.commit.branch}`,
                  },
                },
                {
                  keyValue: {
                    topLabel: 'Commit',
                    content: `${truncate(event.run.meta.commit.message, {
                      length: 100,
                    })}`,
                  },
                },
              ],
            }) ||
              null,
            {
              widgets: [
                {
                  keyValue: {
                    topLabel: 'Passes',
                    content: `${passes}`,
                  },
                },
                {
                  keyValue: {
                    topLabel: 'Failures',
                    content: `${failures + skipped}`,
                  },
                },
                {
                  keyValue: {
                    topLabel: 'Flaky',
                    content: `${flaky}`,
                  },
                },
                {
                  buttons: [
                    {
                      textButton: {
                        text: 'View in Sorry Cypress',
                        onClick: {
                          openLink: {
                            url: `${getDashboardRunURL(event.run.runId)}`,
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
          header: {
            title: 'Sorry Cypress',
            subtitle: '',
            imageUrl:
              'https://gblobscdn.gitbook.com/spaces%2F-MS6gDAYECuzpKjjzrdc%2Favatar-1611996755562.png?alt=media',
            imageStyle: 'AVATAR',
          },
        },
      ],
    },
  }).catch((error) => {
    getLogger().error(
      { error, ...hook },
      `Error while posting GChat message to ${hook.url}`
    );
  });
}

export function shouldReportGChatHook(event: HookEvent, hook: GChatHook) {
  return isGChatEventFilterPassed(event, hook);
}

export function isGChatEventFilterPassed(event: HookEvent, hook: GChatHook) {
  if (!hook.hookEvents || !hook.hookEvents.length) {
    return true;
  }

  return hook.hookEvents.includes(event);
}
