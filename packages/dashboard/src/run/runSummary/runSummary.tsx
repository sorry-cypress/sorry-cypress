import { CardContent, Collapse, Grid, Typography } from '@mui/material';
import {
  ArrayItemType,
  getRunClaimedSpecsCount,
  getRunDurationSeconds,
  getRunOverallSpecsCount,
  getRunTestsProgress,
} from '@sorry-cypress/common';
import { Card, CiUrl } from '@sorry-cypress/dashboard/components/';
import {
  GetRunQuery,
  GetRunsFeedQuery,
} from '@sorry-cypress/dashboard/generated/graphql';
import { WithMaterial } from '@sorry-cypress/dashboard/lib/material';
import { parseISO } from 'date-fns';
import React, { FunctionComponent } from 'react';
import { Commit } from '../commit';
import { DeleteRunButton } from '../deleteRun/deleteRunButton';
import { LegacyRunChip } from '../legacyRunChip';
import { RunDuration } from '../runDuration';
import { RunningStatus } from '../runningStatus';
import { RunSpecs } from '../runSpecs';
import { RunStartTime } from '../runStartTime';
import { RunSummaryTestResults } from '../runSummaryTestResults';
import { RunTimeoutChip } from '../runTimeoutChip';

export const RunSummary: RunSummaryComponent = (props) => {
  const {
    run,
    linkToRun,
    brief = false,
    compact = false,
    showActions = false,
  } = props;

  if (!run) {
    return null;
  }

  const runId = run.runId;
  const runMeta = run.meta;
  const runCreatedAt = run.createdAt;
  const hasCompletion = !!run.completion;
  const completed = !!run.completion?.completed;
  const inactivityTimeoutMs = run.completion?.inactivityTimeoutMs;

  if (!run.progress) {
    return (
      <Pre_2_0_0_Run
        linkToRun={linkToRun}
        brief={brief}
        run={run}
        showActions={showActions}
        compact={compact}
      />
    );
  }

  const overallSpecsCount = getRunOverallSpecsCount(run.progress);
  const claimedSpecsCount = getRunClaimedSpecsCount(run.progress);
  const durationSeconds = getRunDurationSeconds(
    parseISO(run.createdAt),
    run.progress?.updatedAt ? parseISO(run.progress?.updatedAt) : null,
    run.completion?.inactivityTimeoutMs ?? null
  );

  const testsProgress = run.progress && getRunTestsProgress(run.progress);

  return (
    <WithMaterial>
      <Card
        linkTo={linkToRun ? `/run/${runId}` : undefined}
        showActions={showActions}
        actions={
          <>
            <DeleteRunButton runId={runId} ciBuildId={runMeta.ciBuildId} />
          </>
        }
      >
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
                    {runMeta.ciBuildId}
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
                      completed={run.completion?.completed}
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
                      <RunTimeoutChip
                        inactivityTimeoutMs={inactivityTimeoutMs}
                      />
                    )}
                  </Grid>
                </Grid>
              )}
            </Grid>
            <Grid item my={1}>
              {run.progress && (
                <RunSummaryTestResults testsStats={testsProgress} />
              )}
            </Grid>
          </Grid>
          <Collapse in={!compact}>
            <Grid container flexDirection="column">
              <Grid item mb={0.5}>
                <CiUrl
                  ciBuildId={runMeta?.ciBuildId}
                  projectId={runMeta?.projectId}
                  disableLink={linkToRun}
                />
              </Grid>
              <Grid item>
                <Commit
                  brief={brief}
                  noLinks={linkToRun}
                  commit={runMeta?.commit}
                />
              </Grid>
            </Grid>
          </Collapse>
        </CardContent>
      </Card>
    </WithMaterial>
  );
};

const Pre_2_0_0_Run: LegacyRunSummaryComponent = (props) => {
  const {
    run,
    linkToRun,
    brief = false,
    showActions = false,
    compact = false,
  } = props;

  if (!run) {
    return null;
  }

  const runId = run.runId;
  const runMeta = run.meta;

  return (
    <WithMaterial>
      <Card
        linkTo={linkToRun ? `/run/${runId}` : undefined}
        showActions={showActions}
        actions={
          <>
            <DeleteRunButton runId={runId} ciBuildId={runMeta.ciBuildId} />
          </>
        }
      >
        <CardContent>
          <Grid
            direction="column"
            container
            alignItems="flex-start"
            spacing={1}
          >
            <Grid item xs zeroMinWidth>
              <Typography
                component="h1"
                variant="h6"
                noWrap
                color="text.secondary"
              >
                {runMeta.ciBuildId}
              </Typography>
            </Grid>
            <Grid item mb={1}>
              <LegacyRunChip />
            </Grid>
          </Grid>
          <Collapse in={!compact}>
            <Grid container flexDirection="column">
              <Grid item mb={0.5}>
                <CiUrl
                  ciBuildId={runMeta?.ciBuildId}
                  projectId={runMeta?.projectId}
                  disableLink={linkToRun}
                />
              </Grid>
              <Grid item>
                <Commit
                  brief={brief}
                  noLinks={linkToRun}
                  commit={runMeta?.commit}
                />
              </Grid>
            </Grid>
          </Collapse>
        </CardContent>
      </Card>
    </WithMaterial>
  );
};

type RunSummaryProps = {
  brief?: boolean;
  compact?: boolean;
  run: GetRunQuery['run'] | ArrayItemType<GetRunsFeedQuery['runFeed']['runs']>;
  linkToRun?: boolean;
  showActions?: boolean;
};
type RunSummaryComponent = FunctionComponent<RunSummaryProps>;

type LegacyRunSummaryProps = RunSummaryProps & {
  // nothing yet
};
type LegacyRunSummaryComponent = FunctionComponent<LegacyRunSummaryProps>;
