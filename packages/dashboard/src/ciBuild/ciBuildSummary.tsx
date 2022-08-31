import { BookOutlined } from '@mui/icons-material';
import {
  CardContent,
  Collapse,
  Grid,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  getRunClaimedSpecsCount,
  getRunDurationSeconds,
  getRunOverallSpecsCount,
  getRunTestsProgress,
  getRunTestsProgressReducer,
} from '@sorry-cypress/common';
import {
  Card,
  Chip,
  CiUrl,
  getCiData,
} from '@sorry-cypress/dashboard/components/';
import {
  CiBuild,
  RunProgress,
} from '@sorry-cypress/dashboard/generated/graphql';
import { parseISO } from 'date-fns';
import { every, isEmpty, property, sortBy, sum } from 'lodash';
import React, { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Commit } from '../run/commit';
import { RunDuration } from '../run/runDuration';
import { RunningStatus } from '../run/runningStatus';
import { RunSpecs } from '../run/runSpecs';
import { RunStartTime } from '../run/runStartTime';
import { RunSummaryTestResults } from '../run/runSummaryTestResults';
import { RunTimeoutChip } from '../run/runTimeoutChip';

export const CiBuildSummary: CiBuildSummaryComponent = (props) => {
  const { ciBuild, brief = false, compact = false } = props;
  const navigate = useNavigate();

  const getInactivityTimeoutMs = () => {
    const inactivityTimeoutMs = sum(
      ciBuild.runs.map(property('completion.inactivityTimeoutMs'))
    );
    return inactivityTimeoutMs === 0 ? undefined : inactivityTimeoutMs;
  };

  if (!ciBuild || isEmpty(ciBuild.runs)) {
    return null;
  }

  const run = ciBuild.runs[0];

  const runMeta = run.meta;
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
    run.completion?.inactivityTimeoutMs ?? null
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
    ciBuildId: runMeta?.ciBuildId,
    projectId: runMeta?.projectId,
  });

  const runsSortedByProjectId = sortBy(ciBuild.runs, (x) => x.meta.projectId);

  return (
    <Card>
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
                    <RunTimeoutChip inactivityTimeoutMs={inactivityTimeoutMs} />
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
          <Grid item container spacing={1}>
            {runsSortedByProjectId.map((run) => (
              <Tooltip
                key={run.meta.projectId}
                title={<>Project: {run.meta.projectId}</>}
                arrow
              >
                <Grid item>
                  <Chip
                    size="small"
                    color="grey"
                    shade={600}
                    label={run.meta.projectId}
                    icon={BookOutlined}
                    onClick={() => navigate(`/run/${run.runId}`)}
                  />
                </Grid>
              </Tooltip>
            ))}
          </Grid>
          <Grid container>
            {ciData && (
              <Grid item sm={12} md={6} lg={6} xl={4}>
                <CiUrl {...ciData} disableLink={true} />
              </Grid>
            )}
            <Commit brief={brief} noLinks={true} commit={runMeta?.commit} />
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
