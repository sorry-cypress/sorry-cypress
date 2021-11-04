import { Grid } from '@mui/material';
import {
  TestFailureChip,
  TestOverallChip,
  TestRetriesChip,
  TestSkippedChip,
  TestSuccessChip,
} from '@sorry-cypress/dashboard/components';
import React, { FunctionComponent } from 'react';

export const RunSummaryTestResults: RunSummaryTestResultsComponent = (
  props
) => {
  const { testsStats } = props;

  return (
    <Grid container spacing={1}>
      <Grid item>
        <TestOverallChip value={testsStats.overall} />
      </Grid>
      <Grid item>
        <TestSuccessChip value={testsStats.passes} />
      </Grid>
      <Grid item>
        <TestFailureChip value={testsStats.failures} />
      </Grid>
      <Grid item>
        <TestRetriesChip value={testsStats.retries} />
      </Grid>
      <Grid item>
        <TestSkippedChip value={testsStats.pending} />
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
