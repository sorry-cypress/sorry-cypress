import { Link, Stack, Typography } from '@mui/material';
import { DataGrid, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid';
import { Paper } from '@sorry-cypress/dashboard/components/';
import { FlakyTestAggregate } from '@sorry-cypress/dashboard/generated/graphql';
import { differenceInDays } from 'date-fns';
import React, { FunctionComponent, useMemo } from 'react';
import { generatePath } from 'react-router';
import stringHash from 'string-hash';

export const FlakyInsightDetails: FlakyInsightDetailsComponent = (props) => {
  const { flakyTests, numberOfTotalRuns } = props;

  if (!flakyTests) {
    return null;
  }

  const rows = useMemo(() => {
    return convertFlakyTestsToRows(flakyTests);
  }, [flakyTests]);

  if (rows.length < 1) {
    return null;
  }

  return (
    <Paper sx={{ p: 0 }}>
      <DataGrid
        style={{ border: 0 }}
        autoHeight
        hideFooter={rows.length <= 5}
        getRowId={(row) => row.instanceId}
        pageSize={5}
        rows={rows}
        loading={false}
        columns={[
          {
            field: 'specName',
            headerName: 'Spec Name',
            flex: 1,
          },
          {
            field: 'firstFlakyRun',
            headerName: 'First Flaky Run',
            flex: 1,
            renderCell: (params: GridRenderCellParams<any, any, any>) => (
              <DateAndTestRunsAgo
                runDate={params.row.firstFlakyRun.firstFlakyRun.createdAt}
                numberOfTotalRuns={numberOfTotalRuns}
                runIndex={params.row.firstFlakyRun.firstFlakyRunIndex}
                runId={params.row.firstFlakyRun.firstFlakyRun.runId}
              />
            ),
          },
          {
            field: 'lastFlakyRun',
            headerName: 'Last Flaky Run',
            flex: 1,
            renderCell: (params: GridRenderCellParams<any, any, any>) => (
              <DateAndTestRunsAgo
                runDate={params.row.lastFlakyRun.lastFlakyRun.createdAt}
                numberOfTotalRuns={numberOfTotalRuns}
                runIndex={params.row.firstFlakyRun.lastFlakyRunIndex}
                runId={params.row.firstFlakyRun.lastFlakyRun.runId}
              />
            ),
          },
        ]}
      />
    </Paper>
  );
};

type FlakyInsightDetailsProps = {
  flakyTests?: FlakyTestAggregate[];
  numberOfTotalRuns: number;
};

type FlakyInsightDetailsComponent = FunctionComponent<FlakyInsightDetailsProps>;

function convertFlakyTestsToRows(
  flakyTests: FlakyTestAggregate[]
): GridRowsProp {
  return flakyTests.map((test) => {
    return {
      instanceId: stringHash(test.spec).toString(),
      specName: test.spec,
      firstFlakyRun: test ? test : 'N/A',
      lastFlakyRun: test ? test : 'N/A',
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
