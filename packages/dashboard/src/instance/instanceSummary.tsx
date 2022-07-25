import { GroupWorkOutlined } from '@mui/icons-material';
import { Alert, Grid, Tooltip, Typography } from '@mui/material';
import { isTestFlaky } from '@sorry-cypress/common';
import {
  Chip,
  Pad,
  Paper,
  TestFailureChip,
  TestFlakyChip,
  TestOverallChip,
  TestPendingChip,
  TestSkippedChip,
  TestSuccessChip,
} from '@sorry-cypress/dashboard/components';
import {
  getInstanceState,
  SpecStateChip,
} from '@sorry-cypress/dashboard/components/common/specState';
import {
  GetInstanceQuery,
  InstanceStats,
} from '@sorry-cypress/dashboard/generated/graphql';
import React, { FunctionComponent } from 'react';
import { getBase } from '../lib/path';

export const InstanceSummary: InstanceSummaryComponent = (props) => {
  const { instance } = props;

  if (!instance?.results) {
    return <Alert severity="info">No results for the instance</Alert>;
  }
  const stats: InstanceStats = instance.results.stats;
  const flaky = instance.results.tests?.filter(isTestFlaky).length ?? 0;

  return (
    <Paper>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Typography component="h1" variant="h6" color="text.secondary">
            {getBase(instance.spec)}
          </Typography>
        </Grid>
        <Grid item>
          <Typography component="h2" variant="subtitle1">
            {instance.spec}
          </Typography>
        </Grid>
        <Grid item container spacing={1}>
          <Grid item>
            <SpecStateChip
              state={getInstanceState({
                claimedAt: null,
                stats: instance.results.stats,
              })}
            />
          </Grid>
          <Grid item>
            <Tooltip title="Suites" arrow>
              <Chip
                color={stats['suites'] ? 'deepPurple' : 'grey'}
                shade={!stats['suites'] ? 300 : undefined}
                label={<Pad number={stats['suites']} />}
                icon={GroupWorkOutlined}
              />
            </Tooltip>
          </Grid>
          <Grid item>
            <TestOverallChip value={stats['tests']} />
          </Grid>
          <Grid item>
            <TestSuccessChip value={stats['passes']} />
          </Grid>
          <Grid item>
            <TestFailureChip value={stats['failures']} />
          </Grid>
          <Grid item>
            <TestFlakyChip value={flaky} />
          </Grid>
          <Grid item>
            <TestSkippedChip value={stats['skipped']} />
          </Grid>
          <Grid item>
            <TestPendingChip value={stats['pending']} />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

type InstanceSummaryProps = {
  instance: GetInstanceQuery['instance'];
};
type InstanceSummaryComponent = FunctionComponent<InstanceSummaryProps>;
