import React from 'react';
import { Link } from 'react-router-dom';
import { getRunTestsOverall } from '../../lib/run';
import { Run } from '../../generated/graphql';
import { Paper, Heading, Cell, Grid } from 'bold-ui';
import { Commit } from '../commit/commit';

export function RunSummary({ run }: { run: Run }) {
  const { meta, runId, specs } = run;
  const { commit } = meta;
  const overall = getRunTestsOverall(run);
  return (
    <Paper style={{ padding: 12, margin: '12px 0' }}>
      <Heading level={1}>
        <strong>Build </strong>
        <Link to={`/run/${runId}`}>{meta.ciBuildId}</Link>
      </Heading>
      <Grid>
        <Cell xs={12} md={6}>
          <div>
            <strong>Spec files</strong>
            <ul>
              <li>Overall: {specs.length}</li>
              <li>Claimed: {specs.filter(s => s.claimed).length}</li>
            </ul>
          </div>

          <div>
            <strong>Test details</strong>
            <ul>
              <li>Tests: {overall.tests}</li>
              <li>Failures: {overall.failures}</li>
              <li>Passes: {overall.passes}</li>
              <li>Pending: {overall.pending}</li>
              <li>Skipped: {overall.skipped}</li>
            </ul>
          </div>
        </Cell>
        <Cell xs={12} md={6}>
          <Commit commit={commit} />
        </Cell>
      </Grid>
    </Paper>
  );
}
