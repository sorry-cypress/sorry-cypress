import {
  AccessTime,
  CheckCircleOutline,
  ErrorOutline,
  Flaky,
  GroupWorkOutlined,
  NextPlanOutlined,
  RadioButtonUnchecked,
} from '@mui/icons-material';
import { Alert, Grid, Tooltip, Typography } from '@mui/material';
import { getTestListRetries } from '@sorry-cypress/common';
import { Chip, Pad, Paper } from '@sorry-cypress/dashboard/components';
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
  const retries = getTestListRetries(instance.results.tests ?? []);

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
                retries,
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
            <Tooltip title="Total Tests" arrow>
              <Chip
                color={stats['tests'] ? 'cyan' : 'grey'}
                shade={!stats['tests'] ? 300 : undefined}
                label={<Pad number={stats['tests']} />}
                icon={RadioButtonUnchecked}
              />
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Passed Tests" arrow>
              <Chip
                color={stats['passes'] ? 'green' : 'grey'}
                shade={!stats['passes'] ? 300 : undefined}
                label={<Pad number={stats['passes']} />}
                icon={CheckCircleOutline}
              />
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Failed Tests" arrow>
              <Chip
                color={stats['failures'] ? 'red' : 'grey'}
                shade={!stats['failures'] ? 300 : undefined}
                label={<Pad number={stats['failures']} />}
                icon={ErrorOutline}
              />
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Flaky Tests" arrow>
              <Chip
                color={retries ? 'pink' : 'grey'}
                shade={!retries ? 300 : undefined}
                label={<Pad number={retries} />}
                icon={Flaky}
              />
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Skipped Tests" arrow>
              <Chip
                color={stats['skipped'] ? 'orange' : 'grey'}
                shade={!stats['skipped'] ? 300 : undefined}
                label={<Pad number={stats['skipped']} />}
                icon={NextPlanOutlined}
              />
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Pending Tests" arrow>
              <Chip
                color={stats['pending'] ? 'cyan' : 'grey'}
                shade={!stats['pending'] ? 300 : undefined}
                label={<Pad number={stats['pending']} />}
                icon={AccessTime}
              />
            </Tooltip>
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
