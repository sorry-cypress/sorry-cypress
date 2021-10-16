import { Grid, Link, Tooltip } from '@mui/material';
import { DataGrid, GridRenderCellParams, GridRowsProp } from '@mui/x-data-grid';
import {
  Paper,
  RenderOnInterval,
  TestFailureBadge,
  TestRetriesBadge,
  TestSkippedBadge,
  TestSuccessBadge,
} from '@sorry-cypress/dashboard/components/';
import {
  getInstanceState,
  SpecStateTag,
} from '@sorry-cypress/dashboard/components/common/executionState';
import { GetRunQuery } from '@sorry-cypress/dashboard/generated/graphql';
import { getBase } from '@sorry-cypress/dashboard/lib/path';
import {
  getDurationMs,
  getDurationSeconds,
} from '@sorry-cypress/dashboard/lib/time';
import { ResetInstanceButton } from '@sorry-cypress/dashboard/run/runDetails/resetInstance/resetInstanceButton';
import { differenceInSeconds, parseISO } from 'date-fns';
import { isNumber } from 'lodash';
import React, { FunctionComponent } from 'react';
import { generatePath } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';
import stringHash from 'string-hash';

export const RunDetails: RunDetailsComponent = (props) => {
  const { run, hidePassedSpecs } = props;

  const { specs } = run;

  if (!specs) {
    return null;
  }

  const rows: GridRowsProp = run.specs
    .filter((spec) => !!spec)
    .filter((spec) => {
      if (!hidePassedSpecs) {
        return true;
      }
      const state = getInstanceState({
        claimedAt: spec.claimedAt,
        stats: spec.results?.stats,
        retries: spec.results?.retries ?? 0,
      });
      return ['failed', 'pending', 'running'].includes(state);
    });

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
            sortable: false,
            renderCell: getItemStatusCell,
          },
          {
            field: 'machine',
            headerName: 'Machine #',
            sortable: false,
            renderCell: getMachineCell,
          },
          {
            field: 'group',
            headerName: 'Group',
            sortable: false,
            renderCell: getGroupIdCell,
          },
          {
            field: 'specName',
            headerName: 'Spec Name',
            sortable: false,
            renderCell: getSpecNameCell,
            flex: 1,
            minWidth: 150,
          },
          {
            field: 'duration',
            headerName: 'Duration',
            sortable: false,
            renderCell: getDurationCell,
            width: 90,
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
            renderCell: getTestStatsCell,
            minWidth: 280,
          },
          {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            width: 80,
            align: 'center',
            renderCell: getActionsCell(run),
          },
        ]}
      />
    </Paper>
  );
};

const getActionsCell = (run: NonNullable<GetRunQuery['run']>) => {
  const getAction = (params: GridRenderCellParams) => {
    return params.row.claimedAt ? (
      <ResetInstanceButton
        spec={params.row.spec}
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
        <TestSuccessBadge value={params.row.results?.stats?.passes ?? 0} />
      </Grid>
      <Grid item>
        <TestFailureBadge value={params.row.results?.stats?.failures ?? 0} />
      </Grid>
      <Grid item>
        <TestRetriesBadge value={params.row.results?.retries ?? 0} />
      </Grid>
      <Grid item>
        <TestSkippedBadge value={params.row.results?.stats?.pending ?? 0} />
      </Grid>
    </Grid>
  );
};

const getItemStatusCell = (params: GridRenderCellParams) => (
  <SpecStateTag
    state={getInstanceState({
      claimedAt: params.row.claimedAt,
      stats: params.row.results?.stats,
      retries: params.row.results?.retries ?? 0,
    })}
  />
);

const getMachineCell = (params: GridRenderCellParams) => {
  if (params.row.machineId) {
    return getMachineName(params.row.machineId);
  }
  return null;
};
const getGroupIdCell = (params: GridRenderCellParams) => params.row.groupId;
const getSpecNameCell = (params: GridRenderCellParams) => (
  <Tooltip title={params.row.spec}>
    <Link
      component={RouterLink}
      to={generatePath(`/instance/${params.row.instanceId}`)}
      sx={{ width: '100%' }}
      underline="hover"
      noWrap
    >
      {getBase(params.row.spec)}
    </Link>
  </Tooltip>
);

const getDurationCell = (params: GridRenderCellParams) => {
  if (isNumber(params.row.results?.stats?.wallClockDuration)) {
    return (
      <Tooltip
        title={`Started at ${params.row.results?.stats.wallClockStartedAt}`}
      >
        <span>
          {getDurationMs(params.row.results?.stats.wallClockDuration ?? 0)}
        </span>
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
};
type RunDetailsComponent = FunctionComponent<RunDetailsProps>;
