import React from 'react';
import capitalize from 'lodash.capitalize';
import { Heading, Cell, Grid, HFlow } from 'bold-ui';
import { Paper, TestState } from '../common/';
import { getSpecState } from '../../lib/spec';
import { FullRunSpec } from '../../generated/graphql';

export const InstanceSummary: React.FC<{ instance: FullRunSpec }> = ({
  instance
}) => {
  if (!instance.results) {
    return <p>No results for the instance</p>;
  }
  const stats = instance.results.stats;

  return (
    <Paper>
      <Grid>
        <Cell xs={12} lg={6}>
          <HFlow>
            <TestState state={getSpecState(instance)} />
            <Heading level={1}>{instance.spec}</Heading>
          </HFlow>
          <ul>
            {['suites', 'tests', 'passes', 'pending', 'failures'].map(i => (
              <li key={i}>
                <span>{capitalize(i)}: </span> {stats[i]}
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
