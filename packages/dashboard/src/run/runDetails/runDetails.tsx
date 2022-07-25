import { Grid, Link, Tooltip } from '@mui/material';
import { DataGrid, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid';
import {
  Paper,
  RenderOnInterval,
  TestFailureChip,
  TestFlakyChip,
  TestOverallChip,
  TestPendingChip,
  TestSkippedChip,
  TestSuccessChip,
} from '@sorry-cypress/dashboard/components/';
import {
  getInstanceState,
  SpecStateChip,
} from '@sorry-cypress/dashboard/components/common/specState';
import { GetRunQuery } from '@sorry-cypress/dashboard/generated/graphql';
import { ReadableSpecNamesKind } from '@sorry-cypress/dashboard/hooks/useReadableSpecNames';
import { getBase } from '@sorry-cypress/dashboard/lib/path';
import {
  getDurationMs,
  getDurationSeconds,
} from '@sorry-cypress/dashboard/lib/time';
import { ResetInstanceButton } from '@sorry-cypress/dashboard/run/runDetails/resetInstance/resetInstanceButton';
import { differenceInSeconds, parseISO } from 'date-fns';
import { isNumber } from 'lodash';
import React, { FunctionComponent, useMemo } from 'react';
import { generatePath } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import stringHash from 'string-hash';

export const RunDetails: RunDetailsComponent = (props) => {
  const { run, hidePassedSpecs, readableSpecNames } = props;

  const { specs } = run;

  if (!specs) {
    return null;
  }

  const rows = useMemo(
    () => convertToRows(run, hidePassedSpecs, readableSpecNames),
    [run, hidePassedSpecs]
  );

  return (
    <Paper sx={{ p: 0 }}>
      <DataGrid
        style={{ border: 0 }}
        autoHeight
        hideFooter={rows.length <= 100}
        getRowId={(row) => row.instanceId}
        rows={rows}
        loading={false}
        columns={[
          {
            field: 'status',
            headerName: 'Status',
            renderCell: getItemStatusCell,
          },
          {
            field: 'machine',
            headerName: 'Machine #',
          },
          {
            field: 'groupId',
            headerName: 'Group',
          },
          {
            field: 'specName',
            headerName: 'Spec Name',
            renderCell: getSpecNameCell,
            flex: 1,
            minWidth: 150,
          },
          {
            field: 'duration',
            headerName: 'Duration',
            renderCell: getDurationCell,
            width: 90,
            type: 'number',
          },
          // {
          //   field: 'average-duration',
          //   headerName: 'Avg Duration',
          //   sortable: false,
          //   renderCell: getAvgDurationCell,
          //   align:'right',
          // },
          {
            field: 'stats',
            headerName: 'Tests stats',
            sortable: false,
            filterable: false,
            renderCell: getTestStatsCell,
            minWidth: 400,
          },
          {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            filterable: false,
            width: 80,
            align: 'center',
            renderCell: getActionsCell(run),
          },
        ]}
      />
    </Paper>
  );
};

function convertToRows(
  run: NonNullable<GetRunQuery['run']>,
  hidePassedSpecs: boolean,
  readableSpecNames: ReadableSpecNamesKind
): GridRowsProp {
  return run.specs
    .filter((spec) => !!spec)
    .filter((spec) => {
      if (!hidePassedSpecs) {
        return true;
      }
      const state = getInstanceState({
        claimedAt: spec.claimedAt,
        stats: spec.results?.stats,
      });
      return ['failed', 'pending', 'running'].includes(state);
    })
    .map((spec) => {
      return {
        instanceId: spec.instanceId,
        claimedAt: spec.claimedAt,
        status: getInstanceState({
          claimedAt: spec.claimedAt,
          stats: spec.results?.stats,
        }),
        machine: spec.machineId ? getMachineName(spec.machineId) : null,
        groupId: spec.groupId,
        instanceLink: generatePath(`/instance/${spec.instanceId}`),
        specName:
          (readableSpecNames === ReadableSpecNamesKind.FullPath && spec.spec) ||
          (readableSpecNames === ReadableSpecNamesKind.ReadableName &&
            getBase(spec.spec)) ||
          getBase(spec.spec, { easyToRead: false, removeExtension: false }),
        specFullName: spec.spec,
        startedAt: spec.results?.stats.wallClockStartedAt,
        duration: spec.results?.stats.wallClockDuration,
        results: spec.results,
      };
    });
}

const getActionsCell = (run: NonNullable<GetRunQuery['run']>) => {
  const getAction = (params: GridRenderCellParams) => {
    return params.row.claimedAt ? (
      <ResetInstanceButton
        spec={params.row.specName}
        instanceId={params.row.instanceId ?? 0}
        runId={run.runId}
      />
    ) : null;
  };
  return getAction;
};

const getTestStatsCell = (params: GridRenderCellParams) => {
  return (
    <Grid container spacing={1}>
      <Grid item>
        <TestOverallChip value={params.row.results?.stats?.tests ?? 0} />
      </Grid>
      <Grid item>
        <TestSuccessChip value={params.row.results?.stats?.passes ?? 0} />
      </Grid>
      <Grid item>
        <TestFailureChip value={params.row.results?.stats?.failures ?? 0} />
      </Grid>
      <Grid item>
        <TestFlakyChip value={params.row.results?.flaky ?? 0} />
      </Grid>
      <Grid item>
        <TestSkippedChip value={params.row.results?.stats?.skipped ?? 0} />
      </Grid>
      <Grid item>
        <TestPendingChip value={params.row.results?.stats?.pending ?? 0} />
      </Grid>
    </Grid>
  );
};

const getItemStatusCell = (params: GridRenderCellParams) => (
  <SpecStateChip state={params.row.status} />
);

const getSpecNameCell = (params: GridRenderCellParams) => (
  <Link
    component={RouterLink}
    to={params.row.instanceLink}
    sx={{ width: '100%' }}
    underline="hover"
    noWrap
  >
    <Tooltip title={params.row.specFullName}>
      <span>{params.row.specName}</span>
    </Tooltip>
  </Link>
);

const getDurationCell = (params: GridRenderCellParams) => {
  if (isNumber(params.row.duration)) {
    return (
      <Tooltip title={`Started at ${params.row.startedAt}`}>
        <span>{getDurationMs(params.row.duration ?? 0)}</span>
      </Tooltip>
    );
  }
  if (!params.row.claimedAt) {
    return null;
  }

  return (
    <Tooltip title={`Started at ${params.row.claimedAt}`}>
      <span>
        <RenderOnInterval
          render={() =>
            getDurationSeconds(
              // @ts-ignore
              differenceInSeconds(new Date(), parseISO(params.row.claimedAt))
            )
          }
        />
      </span>
    </Tooltip>
  );
};

// const getAvgDurationCell = (params: GridRenderCellParams) => {
//   if (!params.row.spec) {
//     return null;
//   }
//   return <SpecAvg specName={params.row.spec} />;
// };

function getMachineName(machineId: string) {
  return (stringHash(machineId) % 10000) + 1;
}

// const SpecAvg = ({ specName }: { specName: string }) => {
//   const { data, error, loading } = useGetSpecStatsQuery({
//     variables: { spec: specName },
//   });
//   if (loading) {
//     return null;
//   }
//   if (error) {
//     console.error(error);
//     return null;
//   }

//   if (!data) {
//     return null;
//   }
//   return <>{getDurationMs(data.specStats?.avgWallClockDuration ?? 0)}</>;
// };

type RunDetailsProps = {
  run: NonNullable<GetRunQuery['run']>;
  hidePassedSpecs: boolean;
  readableSpecNames: ReadableSpecNamesKind;
};
type RunDetailsComponent = FunctionComponent<RunDetailsProps>;
