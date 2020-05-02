import React from 'react';
import { Link } from 'react-router-dom';
import { Heading, Cell, Grid, Text } from 'bold-ui';
import { getRunTestsOverall } from '../../lib/run';
import { Commit } from '../commit/commit';
import { Paper } from '../common/';
import { Run } from '../../generated/graphql';

type RunSummaryProps = {
  run: Run;
};
export function RunSummary({ run }: RunSummaryProps): React.ReactNode {
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
              <Text color={overall.pending ? 'disabled' : 'normal'}>
                Skipped: {overall.pending}
              </Text>
            </li>
          </ul>
        </Cell>
        <Cell xs={12} md={6}>
          <div>
            <strong>Spec files</strong>
            <ul>
              <li>Overall: {specs.length}</li>
              <li>Claimed: {specs.filter((s) => s.claimed).length}</li>
            </ul>
          </div>
          <Commit commit={commit} />
        </Cell>
      </Grid>
    </Paper>
  );
}
