import React from 'react';
import { Link } from 'react-router-dom';
import { Heading, Cell, Grid, Text, HFlow } from 'bold-ui';
import { getRunTestsOverall } from '../../lib/run';
import { Run } from '../../generated/graphql';
import { Commit } from '../commit/commit';
import { Paper } from '../common/';

export const RunSummary: React.FC<{ run: Run }> = ({ run }) => {
  const { meta, runId, specs } = run;
  const { commit } = meta;
  const overall = getRunTestsOverall(run);
  return (
    <Paper>
      {/* <HFlow> */}
      <Heading level={1}>
        <Link to={`/run/${runId}`}>{meta.ciBuildId}</Link>
      </Heading>
      {/* </HFlow> */}
      <Grid>
        <Cell xs={12} md={6}>
          <ul>
            <li>
              <Text>Tests: {overall.tests}</Text>
            </li>
            <li>
              <Text>Passes: {overall.passes}</Text>
            </li>
            <li>
              <Text color={overall.failures ? 'danger' : 'normal'}>
                Failures: {overall.failures}
              </Text>
            </li>
            <li>
              <Text>Pending: {overall.pending}</Text>
            </li>
            <li>
              <Text color={overall.skipped ? 'disabled' : 'normal'}>
                Skipped: {overall.skipped}
              </Text>
            </li>
          </ul>
        </Cell>
        <Cell xs={12} md={6}>
          <div>
            <strong>Spec files</strong>
            <ul>
              <li>Overall: {specs.length}</li>
              <li>Claimed: {specs.filter(s => s.claimed).length}</li>
            </ul>
          </div>
          <Commit commit={commit} />
        </Cell>
      </Grid>
    </Paper>
  );
};
