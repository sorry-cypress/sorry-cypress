import { Grid } from '@mui/material';
import {
  TestFailureChip,
  TestFlakyChip,
  TestOverallChip,
  TestPendingChip,
  TestSkippedChip,
  TestSuccessChip,
} from '@sorry-cypress/dashboard/components';
import { RunGroupProgressTests } from '@sorry-cypress/dashboard/generated/graphql';
import React, { FunctionComponent } from 'react';

export const RunSummaryTestResults: RunSummaryTestResultsComponent = (
  props
) => {
  const { testsStats } = props;

  return (
    <Grid container spacing={{ xs: 0.5, sm: 1 }}>
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
        <TestFlakyChip value={testsStats.flaky} />
      </Grid>
      <Grid item>
        <TestSkippedChip value={testsStats.skipped} />
      </Grid>
      <Grid item>
        <TestPendingChip value={testsStats.pending} />
      </Grid>
    </Grid>
  );
};

type RunSummaryTestResultsProps = {
  testsStats: RunGroupProgressTests;
  totalCount?: number;
};
type RunSummaryTestResultsComponent = FunctionComponent<
  RunSummaryTestResultsProps
>;
