import { Grid } from '@mui/material';
import {
  TestFailureBadge,
  TestOverallBadge,
  TestRetriesBadge,
  TestSkippedBadge,
  TestSuccessBadge,
} from '@sorry-cypress/dashboard/components';
import React, { FunctionComponent } from 'react';

export const RunSummaryTestResults: RunSummaryTestResultsComponent = (
  props
) => {
  const { testsStats } = props;

  return (
    <Grid container spacing={1}>
      <Grid item>
        <TestOverallBadge value={testsStats.overall} />
      </Grid>
      <Grid item>
        <TestSuccessBadge value={testsStats.passes} />
      </Grid>
      <Grid item>
        <TestFailureBadge value={testsStats.failures} />
      </Grid>
      <Grid item>
        <TestRetriesBadge value={testsStats.retries} />
      </Grid>
      <Grid item>
        <TestSkippedBadge value={testsStats.pending} />
      </Grid>
    </Grid>
  );
};

type TestStats = {
  overall: number;
  passes: number;
  failures: number;
  pending: number;
  skipped: number;
  retries: number;
};
type RunSummaryTestResultsProps = {
  testsStats: TestStats;
};
type RunSummaryTestResultsComponent = FunctionComponent<
  RunSummaryTestResultsProps
>;
