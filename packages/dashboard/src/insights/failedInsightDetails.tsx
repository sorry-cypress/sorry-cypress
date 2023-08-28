import { Link, Stack, Typography } from '@mui/material';
import { DataGrid, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid';
import { Paper } from '@sorry-cypress/dashboard/components/';
import { FailedTestAggregate } from '@sorry-cypress/dashboard/generated/graphql';
import { differenceInDays } from 'date-fns';
import React, { FunctionComponent, useMemo } from 'react';
import { generatePath } from 'react-router';
import stringHash from 'string-hash';

export const FailedInsightDetails: FailedInsightDetailsComponent = (props) => {
  const { failedTests, numberOfTotalRuns } = props;

  if (!failedTests) {
    return null;
  }

  const rows = useMemo(() => {
    return convertFailedTestsToRows(failedTests);
  }, [failedTests]);

  return (
    <Paper sx={{ p: 0 }}>
      <DataGrid
        style={{ border: 0 }}
        autoHeight
        hideFooter={rows.length <= 5}
        getRowId={(row) => row.instanceId}
        initialState={{
          pagination: { pageSize: 5 },
        }}
        rows={rows}
        loading={false}
        columns={[
          {
            field: 'specName',
            headerName: 'Spec Name',
            flex: 1,
          },
          {
            field: 'firstFailedRun',
            headerName: 'First Failed Run',
            flex: 1,
            renderCell: (params: GridRenderCellParams<any, any, any>) => (
              <DateAndTestRunsAgo
                runDate={params.row.firstFailedRun.firstFailedRun.createdAt}
                numberOfTotalRuns={numberOfTotalRuns}
                runIndex={params.row.firstFailedRun.firstFailedRunIndex}
                runId={params.row.firstFailedRun.firstFailedRun.runId}
              />
            ),
          },
          {
            field: 'lastFailedRun',
            headerName: 'Last Failed Run',
            flex: 1,
            renderCell: (params: GridRenderCellParams<any, any, any>) => (
              <DateAndTestRunsAgo
                runDate={params.row.lastFailedRun.lastFailedRun.createdAt}
                numberOfTotalRuns={numberOfTotalRuns}
                runIndex={params.row.lastFailedRun.lastFailedRunIndex}
                runId={params.row.lastFailedRun.lastFailedRun.runId}
              />
            ),
          },
        ]}
      />
    </Paper>
  );
};

type FailedInsightDetailsProps = {
  failedTests: FailedTestAggregate[];
  numberOfTotalRuns: number;
};

type FailedInsightDetailsComponent = FunctionComponent<
  FailedInsightDetailsProps
>;

function convertFailedTestsToRows(
  failedTests: FailedTestAggregate[]
): GridRowsProp {
  return failedTests.map((test) => {
    return {
      instanceId: stringHash(test.spec).toString(),
      specName: test.spec,
      firstFailedRun: test ? test : 'N/A',
      lastFailedRun: test ? test : 'N/A',
    };
  });
}

function DateAndTestRunsAgo({
  runDate,
  numberOfTotalRuns,
  runIndex,
  runId,
}: {
  runDate: string;
  numberOfTotalRuns: number;
  runIndex: number;
  runId: string;
}) {
  const daysAgo = getNumberOfDaysAgo(runDate);
  const testRunsAgo = getNumberOfTestRunsAgo(numberOfTotalRuns, runIndex);

  return (
    <Stack spacing={1}>
      <Typography variant="body2">{daysAgo}</Typography>
      <Typography variant="body2">
        <Link href={generatePath(`/run/${runId}`)} underline="none">
          {testRunsAgo}
        </Link>
      </Typography>
    </Stack>
  );
}

function getNumberOfDaysAgo(runDate: string) {
  const daysAgo = differenceInDays(new Date(), new Date(runDate || 0)) + 1;
  return `${daysAgo} days ago`;
}

function getNumberOfTestRunsAgo(numberOfTotalRuns: number, runIndex: number) {
  const testRunsAgo = numberOfTotalRuns - runIndex;
  return `${testRunsAgo} test runs ago`;
}
