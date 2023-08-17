import {
  AccessTime as AccessTimeIcon,
  Code as CodeIcon,
  GroupWorkOutlined,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { Alert, Grid, Link, Stack, Tooltip, Typography } from '@mui/material';
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
import { getDurationMs } from '@sorry-cypress/dashboard/lib/time';
import React, { FunctionComponent } from 'react';

export const InstanceSummary: InstanceSummaryComponent = (props) => {
  const { instance } = props;

  if (!instance?.results) {
    return <Alert severity="info">No results for the instance</Alert>;
  }
  const stats: InstanceStats = instance.results.stats;
  const flaky = instance.results.tests?.filter(isTestFlaky).length ?? 0;
  const platform = instance.run.meta.platform;

  return (
    <Paper>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12}>
          <Typography component="h1" variant="h6" color="text.secondary">
            Test Details
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Grid item>
              <SpecStateChip
                state={getInstanceState({
                  claimedAt: null,
                  stats: instance.results.stats,
                })}
              />
            </Grid>
            <Grid item xs>
              <Typography component="h2" variant="subtitle1">
                {instance.spec}
              </Typography>
            </Grid>
          </Stack>
        </Grid>
        <Grid item xs={3}>
          <Stack direction="row" alignItems="center" gap={1}>
            <AccessTimeIcon fontSize="small" />
            <Typography variant="overline">Duration</Typography>
          </Stack>
          <Typography variant="body2">
            {getDurationMs(stats.wallClockDuration)}
          </Typography>
        </Grid>
        {instance.ciRunURL && (
          <Grid item xs={6}>
            <Stack direction="row" alignItems="center" gap={1}>
              <CodeIcon fontSize="small" />
              <Typography variant="overline">CI Run URL</Typography>
            </Stack>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={instance.ciRunURL}
              underline="hover"
            >
              {instance.ciRunURL.length > 60
                ? `${instance.ciRunURL.substring(0, 60)}...`
                : instance.ciRunURL}
            </Link>
          </Grid>
        )}
        <Grid item xs={3}>
          <Stack direction="row" alignItems="center" gap={1}>
            <LanguageIcon fontSize="small" />
            <Typography variant="overline">Browser</Typography>
          </Stack>
          <Typography variant="body2">
            {platform?.browserName} {platform?.browserVersion}
          </Typography>
        </Grid>
        <Grid item container spacing={1}>
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
