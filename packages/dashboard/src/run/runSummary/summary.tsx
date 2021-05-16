import {
  getRunSummary,
  isRunPendingInactivityTimeout,
  RunSummary as RunSummaryType,
} from '@sorry-cypress/common';
import {
  CenteredContent,
  CiUrl,
  FormattedDate,
  HeaderLink,
  Paper,
  TestFailureBadge,
  TestRetriesBadge,
  TestOverallBadge,
  TestSkippedBadge,
  TestSuccessBadge,
} from '@src/components/';
import { Duration } from '@src/components/common/duration';
import { GetRunQuery, GetRunSummaryQuery } from '@src/generated/graphql';
import { getSecondsDuration } from '@src/lib/duration';
import { Cell, Grid, HFlow, Icon, Text, Tooltip } from 'bold-ui';
import { parseISO } from 'date-fns';
import { compact } from 'lodash';
import React from 'react';
import { Commit } from '../commit';
import { DeleteRunButton } from '../deleteRun/deleteRunButton';
import { useGetRunSummary } from './useGetRunSummary';

type RunSummaryProps = {
  runId: string;
};

export function RunSummary({ runId }: RunSummaryProps) {
  const [run, loading, error] = useGetRunSummary(runId);
  if (loading) {
    return null;
  }
  if (!run) {
    return <CenteredContent>No run found</CenteredContent>;
  }
  if (error) {
    return (
      <CenteredContent>Error loading run {error.toString()}</CenteredContent>
    );
  }

  return <RunSummaryComponent run={run} runId={runId} />;
}

export function RunSummaryComponent({
  run,
  runId,
}: {
  run: GetRunQuery['run'] | GetRunSummaryQuery['run'];
  runId: string;
}) {
  if (!run) {
    return null;
  }
  const runMeta = run.meta;
  const runSpecs = run.specs;
  const runCreatedAt = run.createdAt;

  const runSummary = getRunSummary(
    compact(runSpecs.map((s) => s.results))
  );

  const hasCompletion = !!run.completion;
  const completed = !!run.completion?.completed;
  const inactivityTimeoutMs = run.completion?.inactivityTimeoutMs;
  const pendingInactivity = isRunPendingInactivityTimeout(runSpecs);

  return (
    <Paper>
      <HFlow alignItems="center" justifyContent="space-between">
        <div style={{ flex: 1 }}>
          <HFlow alignItems="center">
            {hasCompletion && (
              <RunStatus
                pendingInactivity={pendingInactivity}
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
                hasCompletion={hasCompletion}
                pendingInactivity={pendingInactivity}
                completed={completed}
                createdAtISO={runCreatedAt}
                wallClockDurationSeconds={runSummary.wallClockDurationSeconds}
              />
            </li>
            <li>
              <Text>Spec Files: </Text>
              <Text>
                claimed {runSpecs.filter((s) => s.claimed).length} out of{' '}
                {runSpecs.length}
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

      <RunSummaryTestResults runSummary={runSummary} />
    </Paper>
  );
}
function RunSummaryTestResults({ runSummary }: { runSummary: RunSummaryType }) {
  return (
    <HFlow>
      <TestOverallBadge value={runSummary.tests} />
      <TestSuccessBadge value={runSummary.passes} />
      <TestFailureBadge value={runSummary.failures} />
      <TestSkippedBadge value={runSummary.pending} />
      <TestRetriesBadge value={runSummary.retries} />
    </HFlow>
  );
}

function RunStatus({
  completed,
  inactivityTimeoutMs,
  pendingInactivity,
}: {
  pendingInactivity: boolean;
  completed: boolean;
  inactivityTimeoutMs?: number | null;
}) {
  if (!completed && !pendingInactivity) {
    return (
      <Tooltip text={`Run is being executed`}>
        <Icon icon="rocket" fill="info" stroke="info" size={1} />
      </Tooltip>
    );
  }
  if (!completed && pendingInactivity) {
    return (
      <Tooltip text={`Run has been waiting for inactivity timeout`}>
        <Icon icon="clockOutline" stroke="info" size={1} />
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
      text={`The run has been marked as timed out after ${getSecondsDuration(
        inactivityTimeoutMs / 1000
      )} of inactiviy`}
    >
      <Icon icon="clockOutline" fill="danger" stroke="danger" size={0.9} />
    </Tooltip>
  );
}
