import { DataGrid, GridRenderCellParams } from '@mui/x-data-grid';
import { Paper } from '@sorry-cypress/dashboard/components/';
import {
  FailedTestAggregate,
  FlakyTestAggregate,
} from '@sorry-cypress/dashboard/generated/graphql';
import React, { FunctionComponent, useMemo } from 'react';
import { DateAndTestRunsAgo } from './dateAndTestRunsAgo';
import { capitalizeFirstLetter, convertTestsToRows } from './utils';

export const InsightDetails: InsightDetailsComponent = (props) => {
  const { tests, testType, numberOfTotalRuns } = props;

  if (!tests) {
    return null;
  }

  const rows = useMemo(() => {
    return convertTestsToRows(tests);
  }, [tests]);

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
            field: `${
              testType === 'flaky' ? 'firstFlakyRun' : 'firstFailedRun'
            }`,
            headerName: `First ${capitalizeFirstLetter(testType)} Run`,
            flex: 1,
            renderCell: (params: GridRenderCellParams<any, any, any>) => {
              const runKey =
                testType === 'flaky' ? 'firstFlakyRun' : 'firstFailedRun';
              const runIndexKey =
                testType === 'flaky'
                  ? 'firstFlakyRunIndex'
                  : 'firstFailedRunIndex';
              const { [runKey]: runData } = params.row;
              const { createdAt, runId } = runData;
              const runIndex = params.row[runIndexKey];

              return (
                <DateAndTestRunsAgo
                  runDate={createdAt}
                  numberOfTotalRuns={numberOfTotalRuns}
                  runIndex={runIndex}
                  runId={runId}
                />
              );
            },
          },
          {
            field: `${testType === 'flaky' ? 'lastFlakyRun' : 'lastFailedRun'}`,
            headerName: `Last ${capitalizeFirstLetter(testType)} Run`,
            flex: 1,
            renderCell: (params: GridRenderCellParams<any, any, any>) => {
              const runKey =
                testType === 'flaky' ? 'lastFlakyRun' : 'lastFailedRun';
              const runIndexKey =
                testType === 'flaky'
                  ? 'lastFlakyRunIndex'
                  : 'lastFailedRunIndex';
              const { [runKey]: runData } = params.row;
              const { createdAt, runId } = runData;
              const runIndex = params.row[runIndexKey];

              return (
                <DateAndTestRunsAgo
                  runDate={createdAt}
                  numberOfTotalRuns={numberOfTotalRuns}
                  runIndex={runIndex}
                  runId={runId}
                />
              );
            },
          },
        ]}
      />
    </Paper>
  );
};

type InsightDetailsProps = {
  tests: FailedTestAggregate[] | FlakyTestAggregate[];
  testType: 'flaky' | 'failed';
  numberOfTotalRuns: number;
};

type InsightDetailsComponent = FunctionComponent<InsightDetailsProps>;
