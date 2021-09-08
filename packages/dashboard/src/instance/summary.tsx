import { getTestListRetries } from '@sorry-cypress/common';
import { Paper } from '@sorry-cypress/dashboard/components';
import {
  getInstanceState,
  SpecStateTag,
} from '@sorry-cypress/dashboard/components/common/executionState';
import {
  GetInstanceQuery,
  InstanceStats,
} from '@sorry-cypress/dashboard/generated/graphql';
import { Cell, Grid, Heading, HFlow, Text } from 'bold-ui';
import { capitalize } from 'lodash';
import React from 'react';

type InstanceSummaryProps = {
  instance: GetInstanceQuery['instance'];
};
export function InstanceSummary({ instance }: InstanceSummaryProps) {
  if (!instance?.results) {
    return <p>No results for the instance</p>;
  }
  const stats: InstanceStats = instance.results.stats;

  return (
    <Paper>
      <Grid>
        <Cell xs={12} lg={6}>
          <HFlow>
            <SpecStateTag
              state={getInstanceState({
                claimedAt: null,
                stats: instance.results.stats,
                retries: getTestListRetries(instance.results.tests ?? []),
              })}
            />
            <Heading level={2}>{instance.spec}</Heading>
          </HFlow>
          <ul>
            {(['suites', 'tests', 'passes', 'failures', 'pending'] as Array<
              keyof InstanceStats
            >).map((i) => (
              <li key={i}>
                <Text
                  color={
                    i === 'pending'
                      ? 'disabled'
                      : i === 'failures' && stats[i]
                      ? 'danger'
                      : 'normal'
                  }
                >
                  {capitalize(getInstanceStatLabel(i))}: {stats[i]}
                </Text>
              </li>
            ))}
          </ul>
        </Cell>
        {instance.results.videoUrl && (
          <Cell xs={12} lg={6}>
            <video controls autoPlay muted width="100%">
              <source src={instance.results.videoUrl} type="video/mp4" />
              Sorry, your browser doesn&apos;t support embedded videos.
            </video>
          </Cell>
        )}
      </Grid>
    </Paper>
  );
}

const getInstanceStatLabel = (statusItem: keyof InstanceStats): string =>
  statusItem === 'pending' ? 'skipped' : statusItem;
