import { CardContent, Collapse, Grid, Typography } from '@mui/material';
import {
  getRunClaimedSpecsCount,
  getRunDurationSeconds,
  getRunOverallSpecsCount,
  getRunTestsProgress,
  getRunTestsProgressReducer,
} from '@sorry-cypress/common';
import { CiBuildSummaryProject } from '@sorry-cypress/dashboard/ciBuild/ciBuildSummaryProject';
import { Card, CiUrl, getCiData } from '@sorry-cypress/dashboard/components/';
import {
  CiBuild,
  RunProgress,
} from '@sorry-cypress/dashboard/generated/graphql';
import { parseISO } from 'date-fns';
import { every, isEmpty, property, size, sortBy, sum } from 'lodash';
import React, { FunctionComponent } from 'react';
import { Commit } from '../run/commit';
import { RunDuration } from '../run/runDuration';
import { RunningStatus } from '../run/runningStatus';
import { RunSpecs } from '../run/runSpecs';
import { RunStartTime } from '../run/runStartTime';
import { RunSummaryTestResults } from '../run/runSummaryTestResults';
import { RunTimeoutChip } from '../run/runTimeoutChip';

export const CiBuildSummary: CiBuildSummaryComponent = (props) => {
  const { ciBuild, brief = false, compact = false } = props;

  const getInactivityTimeoutMs = () => {
    const inactivityTimeoutMs = sum(
      ciBuild.runs.map(property('completion.inactivityTimeoutMs'))
    );
    return inactivityTimeoutMs === 0 ? undefined : inactivityTimeoutMs;
  };

  if (!ciBuild || isEmpty(ciBuild.runs)) {
    return null;
  }

  const firstRun = ciBuild.runs[0];
  const firstRunMeta = firstRun.meta;

  const runsCount = size(ciBuild.runs);
  const linkToRun = runsCount === 1 ? `/run/${firstRun.runId}` : undefined;

  const runCreatedAt = ciBuild.createdAt;
  const hasCompletion = every(ciBuild.runs, (run) => !!run.completion);
  const completed = every(ciBuild.runs, (run) => !!run.completion?.completed);
  const inactivityTimeoutMs = getInactivityTimeoutMs();

  const overallSpecsCount = ciBuild.runs.reduce(
    (acc, run) => acc + getRunOverallSpecsCount(run.progress as RunProgress),
    0
  );
  const claimedSpecsCount = ciBuild.runs.reduce(
    (acc, run) => acc + getRunClaimedSpecsCount(run.progress as RunProgress),
    0
  );

  const durationSeconds = getRunDurationSeconds(
    parseISO(ciBuild.createdAt),
    ciBuild.updatedAt ? parseISO(ciBuild.updatedAt) : null,
    inactivityTimeoutMs ?? null
  );

  const testsProgress = ciBuild.runs.reduce(
    (acc, run) =>
      getRunTestsProgressReducer(
        acc,
        getRunTestsProgress(run.progress as RunProgress)
      ),
    {
      overall: 0,
      passes: 0,
      failures: 0,
      pending: 0,
      flaky: 0,
      skipped: 0,
    }
  );

  const ciData = getCiData({
    ciBuildId: firstRunMeta?.ciBuildId,
    projectId: firstRunMeta?.projectId,
  });

  const runsSortedByProject = sortBy(ciBuild.runs, (x) => x.meta.projectId);

  return (
    <Card linkTo={linkToRun}>
      <CardContent sx={{ py: '8px !important' }}>
        <Grid
          container
          alignItems="flex-start"
          flexDirection={{ xs: 'column', md: 'row' }}
        >
          <Grid item container xs zeroMinWidth spacing={1}>
            <Grid item container>
              <Grid item>
                {hasCompletion && !completed && <RunningStatus />}
              </Grid>
              <Grid item xs zeroMinWidth>
                <Typography
                  component="h1"
                  variant="h6"
                  noWrap
                  color="text.secondary"
                >
                  {firstRunMeta.ciBuildId}
                </Typography>
              </Grid>
            </Grid>
            {!compact && (
              <Grid item container spacing={1} mb={1}>
                <Grid item>
                  <RunStartTime runCreatedAt={runCreatedAt} />
                </Grid>
                <Grid item>
                  <RunDuration
                    completed={firstRun.completion?.completed}
                    createdAtISO={runCreatedAt}
                    wallClockDurationSeconds={durationSeconds}
                  />
                </Grid>
                <Grid item>
                  <RunSpecs
                    claimedSpecsCount={claimedSpecsCount}
                    overallSpecsCount={overallSpecsCount}
                  />
                </Grid>
                <Grid item>
                  {hasCompletion && completed && inactivityTimeoutMs && (
                    <RunTimeoutChip inactivityTimeoutMs={inactivityTimeoutMs} />
                  )}
                </Grid>
              </Grid>
            )}
          </Grid>
          <Grid item my={1}>
            {firstRun.progress && (
              <RunSummaryTestResults testsStats={testsProgress} />
            )}
          </Grid>
        </Grid>
        <Collapse in={!compact}>
          <Grid item container spacing={1}>
            {runsSortedByProject.map((run) => (
              <CiBuildSummaryProject key={run.runId} run={run} />
            ))}
          </Grid>
          <Grid container>
            {ciData && (
              <Grid item sm={12} md={6} lg={6} xl={4}>
                <CiUrl {...ciData} disableLink={true} />
              </Grid>
            )}
            <Commit
              brief={brief}
              noLinks={true}
              commit={firstRunMeta?.commit}
            />
          </Grid>
        </Collapse>
      </CardContent>
    </Card>
  );
};

type CiBuildSummaryProps = {
  brief?: boolean;
  compact?: boolean;
  ciBuild: CiBuild;
};
type CiBuildSummaryComponent = FunctionComponent<CiBuildSummaryProps>;
