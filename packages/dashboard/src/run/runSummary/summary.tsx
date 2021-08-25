import {
  CiUrl,
  FormattedDate,
  HeaderLink,
  Paper,
  TestFailureBadge,
  TestOverallBadge,
  TestRetriesBadge,
  TestSkippedBadge,
  TestSuccessBadge,
} from '@src/components/';
import { Duration } from '@src/components/common/duration';
import { Run, RunProgressFragment } from '@src/generated/graphql';
import { getSecondsDuration } from '@src/lib/duration';
import { Cell, Grid, HFlow, Icon, Text, Tooltip } from 'bold-ui';
import { parseISO } from 'date-fns';
import React from 'react';
import { Commit } from '../commit';
import { DeleteRunButton } from '../deleteRun/deleteRunButton';
import {
  getRunClaimedSpecsCount,
  getRunDurationSeconds,
  getRunOverallSpecsCount,
  getRunTestsProgress,
} from '../progress';

export function RunSummary({ run }: { run: Run }) {
  // const [run, loading, error] = useGetRunSummary(runId);
  // if (loading) {
  //   return null;
  // }
  // if (!run) {
  //   return <CenteredContent>No run found</CenteredContent>;
  // }
  // if (error) {
  //   return (
  //     <CenteredContent>Error loading run {error.toString()}</CenteredContent>
  //   );
  // }

  return <RunSummaryComponent run={run} />;
}

export function RunSummaryComponent({ run }: { run: Run }) {
  if (!run) {
    return null;
  }
  const runId = run.runId;
  const runMeta = run.meta;
  const runCreatedAt = run.createdAt;
  const hasCompletion = !!run.completion;
  const completed = !!run.completion?.completed;
  const inactivityTimeoutMs = run.completion?.inactivityTimeoutMs;

  const overallSpecsCount = getRunOverallSpecsCount(run.progress);
  const claimedSpecsCount = getRunClaimedSpecsCount(run.progress);
  const durationSeconds = getRunDurationSeconds(
    run.createdAt,
    run.progress,
    run.completion
  );

  return (
    <Paper>
      <HFlow alignItems="center" justifyContent="space-between">
        <div style={{ flex: 1 }}>
          <HFlow alignItems="center">
            {hasCompletion && (
              <RunStatus
                completed={completed}
                inactivityTimeoutMs={inactivityTimeoutMs}
              />
            )}
            <HeaderLink to={`/run/${runId}`}>{runMeta.ciBuildId}</HeaderLink>
          </HFlow>
        </div>
        <DeleteRunButton runId={runId} ciBuildId={runMeta.ciBuildId} />
      </HFlow>
      <Grid>
        <Cell xs={12} md={6}>
          <div>
            <strong>Execution details</strong>
          </div>
          <ul>
            <li>
              <Text>
                Started At: <FormattedDate value={parseISO(runCreatedAt)} />
              </Text>
            </li>
            <li>
              <Text>Duration: </Text>
              <Duration
                completion={run.completion ?? undefined}
                createdAtISO={runCreatedAt}
                wallClockDurationSeconds={durationSeconds}
              />
            </li>
            <li>
              <Text>Spec Files: </Text>
              <Text>
                {claimedSpecsCount} / {overallSpecsCount}
              </Text>
            </li>
          </ul>
        </Cell>
        <Cell xs={12} md={6}>
          <Commit commit={runMeta?.commit} />
          <CiUrl
            ciBuildId={runMeta?.ciBuildId}
            projectId={runMeta?.projectId}
          />
        </Cell>
      </Grid>

      {run.progress && <RunSummaryTestResults runProgress={run.progress} />}
    </Paper>
  );
}
function RunSummaryTestResults({
  runProgress,
}: {
  runProgress: RunProgressFragment;
}) {
  const testsProgress = getRunTestsProgress(runProgress);
  return (
    <HFlow>
      <TestOverallBadge value={testsProgress.overall} />
      <TestSuccessBadge value={testsProgress.passes} />
      <TestFailureBadge value={testsProgress.failures} />
      <TestSkippedBadge value={testsProgress.pending} />
      <TestRetriesBadge value={testsProgress.retries} />
    </HFlow>
  );
}

function RunStatus({
  completed,
  inactivityTimeoutMs,
}: {
  completed: boolean;
  inactivityTimeoutMs?: number | null;
}) {
  if (!completed) {
    return (
      <Tooltip text={`Run is being executed`}>
        <Icon icon="rocket" fill="info" stroke="info" size={1} />
      </Tooltip>
    );
  }
  if (inactivityTimeoutMs) {
    return <Timedout inactivityTimeoutMs={inactivityTimeoutMs} />;
  }
  return null;
}

function Timedout({ inactivityTimeoutMs }: { inactivityTimeoutMs: number }) {
  return (
    <Tooltip
      text={`Timed out after ${getSecondsDuration(
        inactivityTimeoutMs / 1000
      )}. Set the timeout value in project settings.`}
    >
      <Icon icon="clockOutline" fill="danger" stroke="danger" size={0.9} />
    </Tooltip>
  );
}
