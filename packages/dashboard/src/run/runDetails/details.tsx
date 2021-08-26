import {
  RenderOnInterval,
  SpecStateTag,
  TestFailureBadge,
  TestRetriesBadge,
  TestSkippedBadge,
  TestSuccessBadge,
} from '@sorry-cypress/dashboard/components/';
import { getSpecState } from '@sorry-cypress/dashboard/components/common/executionState';
import {
  GetRunQuery,
  RunDetailSpecFragment,
  useGetSpecStatsQuery,
} from '@sorry-cypress/dashboard/generated/graphql';
import { useHideSuccessfulSpecs } from '@sorry-cypress/dashboard/hooks/';
import { getSecondsDuration } from '@sorry-cypress/dashboard/lib/duration';
import { ResetInstanceButton } from '@sorry-cypress/dashboard/run/runDetails/resetInstance/resetInstanceButton';
import {
  Cell,
  DataTable,
  Grid,
  HFlow,
  Switch,
  Text,
  Tooltip,
  VFlow,
} from 'bold-ui';
import { differenceInSeconds, parseISO } from 'date-fns';
import { isNumber } from 'lodash';
import React from 'react';
import { generatePath, useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import stringHash from 'string-hash';

export function RunDetails({ run }: { run: NonNullable<GetRunQuery['run']> }) {
  const { specs } = run;
  const history = useHistory();

  const [isPassedHidden, setHidePassedSpecs] = useHideSuccessfulSpecs();

  if (!specs) {
    return null;
  }

  function handleRowClick(row: RunDetailSpecFragment) {
    history.push(generatePath(`/instance/${row.instanceId}`));
  }

  const rows = run.specs
    .filter((spec) => !!spec)
    .filter((spec) =>
      isPassedHidden ? getSpecState(spec) !== 'passed' : true
    );

  return (
    <Grid>
      <Cell xs={12}>
        <HFlow justifyContent="space-between" alignItems="center">
          <strong>Spec Files</strong>
          <Switch
            label="Hide successful specs"
            checked={isPassedHidden}
            onChange={() => setHidePassedSpecs(!isPassedHidden)}
          />
        </HFlow>
      </Cell>
      <Cell xs={12}>
        <VFlow>
          <DataTable
            rows={rows}
            loading={false}
            onRowClick={handleRowClick}
            columns={[
              {
                name: 'status',
                header: 'Status',
                sortable: false,
                render: getItemStatusCell,
              },
              {
                name: 'machine',
                header: (
                  <Tooltip text="Random but consistent">
                    <Text>Machine #</Text>
                  </Tooltip>
                ),
                sortable: false,
                render: getMachineCell,
              },
              {
                name: 'group',
                header: 'Group',
                sortable: false,
                render: getGroupIdCell,
              },
              {
                name: 'link',
                header: 'Name',
                sortable: false,
                render: getSpecNameCell,
              },
              {
                name: 'duration',
                header: 'Duration',
                sortable: false,
                render: getDurationCell,
              },
              {
                name: 'average-duration',
                header: 'Avg Duration',
                sortable: false,
                render: getAvgDurationCell,
              },
              {
                name: 'failures',
                header: '',
                sortable: false,
                render: getFailuresCell,
              },
              {
                name: 'passes',
                header: '',
                sortable: false,
                render: getPassesCell,
              },
              {
                name: 'retries',
                header: '',
                sortable: false,
                render: getRetriesCell,
              },
              {
                name: 'skipped',
                header: '',
                sortable: false,
                render: getSkippedCell,
              },
              {
                name: 'actions',
                header: 'Actions',
                sortable: false,
                render: getActionsCell(run),
              },
            ]}
          />
        </VFlow>
      </Cell>
    </Grid>
  );
}

const getActionsCell = (run: NonNullable<GetRunQuery['run']>) => {
  const getAction = (spec: RunDetailSpecFragment) => {
    return spec.claimedAt ? (
      <ResetInstanceButton
        instanceId={spec.instanceId ?? 0}
        runId={run.runId}
      />
    ) : null;
  };
  return getAction;
};

const getPassesCell = (spec: RunDetailSpecFragment) => {
  return <TestSuccessBadge value={spec.results?.stats?.passes ?? 0} />;
};

const getFailuresCell = (spec: RunDetailSpecFragment) => {
  return <TestFailureBadge value={spec.results?.stats?.failures ?? 0} />;
};

const getRetriesCell = (spec: RunDetailSpecFragment) => {
  return <TestRetriesBadge value={spec.results?.retries ?? 0} />;
};

const getSkippedCell = (spec: RunDetailSpecFragment) => {
  return <TestSkippedBadge value={spec.results?.stats?.pending ?? 0} />;
};

const getItemStatusCell = (spec: RunDetailSpecFragment) => (
  <SpecStateTag state={getSpecState(spec)} />
);

const getMachineCell = (spec: RunDetailSpecFragment) => {
  if (spec.machineId) {
    return getMachineName(spec.machineId);
  }
  return null;
};
const getGroupIdCell = (spec: RunDetailSpecFragment) => spec.groupId;
const getSpecNameCell = (spec: RunDetailSpecFragment) => (
  <Link to={generatePath(`/instance/${spec.instanceId}`)}>{spec.spec}</Link>
);

const getDurationCell = (spec: RunDetailSpecFragment) => {
  if (isNumber(spec.results?.stats?.wallClockDuration)) {
    return (
      <Tooltip text={`Started at ${spec.results?.stats.wallClockStartedAt}`}>
        <Text>
          {getSecondsDuration(
            (spec.results?.stats.wallClockDuration ?? 0) / 1000
          )}
        </Text>
      </Tooltip>
    );
  }
  if (!spec.claimedAt) {
    return null;
  }

  return (
    <Tooltip text={`Started at ${spec.claimedAt}`}>
      <Text>
        <RenderOnInterval
          render={() =>
            getSecondsDuration(
              // @ts-ignore
              differenceInSeconds(new Date(), parseISO(spec.claimedAt))
            )
          }
        />
      </Text>
    </Tooltip>
  );
};

const getAvgDurationCell = (spec: RunDetailSpecFragment) => {
  if (!spec.spec) {
    return null;
  }
  return <SpecAvg specName={spec.spec} />;
};

function getMachineName(machineId: string) {
  return (stringHash(machineId) % 10000) + 1;
}

const SpecAvg = ({ specName }: { specName: string }) => {
  const { data, error, loading } = useGetSpecStatsQuery({
    variables: { spec: specName },
  });
  if (loading) {
    return null;
  }
  if (error) {
    console.error(error);
    return null;
  }

  if (!data) {
    return null;
  }
  return (
    <>
      {getSecondsDuration((data.specStats?.avgWallClockDuration ?? 0) / 1000)}
    </>
  );
};
