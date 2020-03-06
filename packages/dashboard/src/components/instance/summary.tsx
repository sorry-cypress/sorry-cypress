import React from 'react';
import capitalize from 'lodash.capitalize';
import { Heading, Cell, Grid, HFlow, Text} from 'bold-ui';
import { Paper, TestState } from '../common/';
import { getSpecState } from '../../lib/spec';
import { FullRunSpec, InstanceStats } from '../../generated/graphql';

const getInstanceStatLabel = (statusItem: keyof InstanceStats): string =>  statusItem === "pending" ? "skipped" : statusItem

export const InstanceSummary: React.FC<{ instance: FullRunSpec }> = ({
  instance
}) => {
  if (!instance.results) {
    return <p>No results for the instance</p>;
  }
  const stats: InstanceStats = instance.results.stats;

  return (
    <Paper>
      <Grid>
        <Cell xs={12} lg={6}>
          <HFlow>
            <TestState state={getSpecState(instance)} />
            <Heading level={1}>{instance.spec}</Heading>
          </HFlow>
          <ul>
            {(['suites', 'tests', 'passes',  'failures', 'pending'] as Array<keyof InstanceStats>).map(i  => (
              <li key={i}>
                <Text color={i === "pending" ? 'disabled' : i === "failures" && stats[i] ? 'danger' : 'normal'}>
                  {capitalize(getInstanceStatLabel(i))}:  {stats[i]}
                </Text>
                
              </li>
            ))}
          </ul>
        </Cell>
        {instance.results.videoUrl && (
          <Cell xs={12} lg={6}>
            <video controls autoPlay muted width="100%">
              <source src={instance.results.videoUrl} type="video/mp4" />
              Sorry, your browser doesn't support embedded videos.
            </video>
          </Cell>
        )}
      </Grid>
    </Paper>
  );
};
