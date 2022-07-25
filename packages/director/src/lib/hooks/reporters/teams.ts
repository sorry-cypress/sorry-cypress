import {
  HookEvent,
  isRunGroupSuccessful,
  Run,
  RunGroupProgress,
  TeamsHook,
} from '@sorry-cypress/common';
import { getDashboardRunURL } from '@sorry-cypress/director/lib/urls';
import { getLogger } from '@sorry-cypress/logger';
import axios from 'axios';
import { truncate } from 'lodash';

interface TeamsReporterEventPayload {
  eventType: HookEvent;
  run: Run;
  groupId: string;
  groupProgress: RunGroupProgress;
  spec: string;
}

export async function reportToTeams(
  hook: TeamsHook,
  event: TeamsReporterEventPayload
) {
  if (!shouldReportTeamsHook(event.eventType, hook)) {
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
        isRunGroupSuccessful(event.groupProgress) ? '&#x2705;' : '&#x274C;'
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
      type: 'message',
      attachments: [
        {
          contentType: 'application/vnd.microsoft.card.adaptive',
          contentUrl: null,
          content: {
            $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
            type: 'AdaptiveCard',
            version: '1.0',
            body: [
              {
                type: 'ColumnSet',
                columns: [
                  {
                    type: 'Column',
                    padding: 'None',
                    width: 'auto',
                    items: [
                      {
                        type: 'Image',
                        url:
                          'https://gblobscdn.gitbook.com/spaces%2F-MS6gDAYECuzpKjjzrdc%2Favatar-1611996755562.png?alt=media',
                        altText: 'Sorry-Cypress',
                        size: 'Large',
                        style: 'Person',
                      },
                    ],
                    style: 'emphasis',
                  },
                  {
                    type: 'Column',
                    padding: 'None',
                    width: 'auto',
                    items: [
                      {
                        type: 'TextBlock',
                        text: `${title}`,
                        wrap: true,
                      },
                      {
                        type: 'TextBlock',
                        text: `${commitDescription}`,
                        wrap: true,
                      },
                    ],
                    style: 'emphasis',
                  },
                ],
                padding: 'None',
                style: 'emphasis',
              },
              {
                type: 'FactSet',
                facts: [
                  {
                    title: 'Passes',
                    value: `${passes}`,
                  },
                  {
                    title: 'Failures',
                    value: `${failures}`,
                  },
                  {
                    title: 'Skipped',
                    value: `${skipped}`,
                  },
                  {
                    title: 'Ignored',
                    value: `${pending}`,
                  },
                  {
                    title: 'Flaky',
                    value: `${flaky}`,
                  },
                ],
              },
              {
                type: 'ActionSet',
                actions: [
                  {
                    type: 'Action.OpenUrl',
                    title: 'View in Sorry-Cypress',
                    url: `${getDashboardRunURL(event.run.runId)}`,
                    style: 'positive',
                    isPrimary: true,
                  },
                ],
              },
            ],
            padding: 'None',
          },
        },
      ],
    },
  }).catch((error) => {
    getLogger().error(
      { error, ...hook },
      `Error while posting MSTeams message to ${hook.url}`
    );
  });
}

export function shouldReportTeamsHook(event: HookEvent, hook: TeamsHook) {
  return isTeamsEventFilterPassed(event, hook);
}

export function isTeamsEventFilterPassed(event: HookEvent, hook: TeamsHook) {
  if (!hook.hookEvents || !hook.hookEvents.length) {
    return true;
  }

  return hook.hookEvents.includes(event);
}

const successColor = '#0E8A16';
const failureColor = '#AB1616';
