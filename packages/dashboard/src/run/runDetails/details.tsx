import {
  RenderOnInterval,
  SpecStateTag,
  TestFailureBadge,
  TestSkippedBadge,
  TestSuccessBadge,
} from '@src/components/';
import { getSpecState } from '@src/components/common/executionState';
import {
  GetRunQuery,
  RunDetailSpecFragment,
  useGetSpecStatsQuery,
} from '@src/generated/graphql';
import { useHideSuccessfulSpecs } from '@src/hooks/';
import { getSecondsDuration } from '@src/lib/duration';
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
                name: 'skipped',
                header: '',
                sortable: false,
                render: getSkippedCell,
              },
            ]}
          />
        </VFlow>
      </Cell>
    </Grid>
  );
}

const getSkippedCell = (spec: RunDetailSpecFragment) => {
  if (!spec.results?.stats?.pending) {
    return null;
  }
  return <TestSkippedBadge value={spec.results?.stats?.pending} />;
};

const getPassesCell = (spec: RunDetailSpecFragment) => {
  if (!spec.results?.stats?.passes) {
    return null;
  }
  return <TestSuccessBadge value={spec.results?.stats?.passes} />;
};

const getFailuresCell = (spec: RunDetailSpecFragment) => {
  if (!spec.results?.stats?.failures) {
    return null;
  }
  return <TestFailureBadge value={spec.results?.stats?.failures} />;
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
  if (spec.results?.stats?.wallClockDuration) {
    return (
      <Tooltip text={`Started at ${spec.results.stats.wallClockStartedAt}`}>
        <Text>
          {getSecondsDuration(spec.results.stats.wallClockDuration / 1000)}
        </Text>
      </Tooltip>
    );
  } else if (spec.claimedAt) {
    return (
      <Tooltip text={`Started at ${spec.claimedAt}`}>
        <Text>
          <RenderOnInterval
            render={() =>
              getSecondsDuration(
                (Date.now() - new Date(spec.claimedAt!).getTime()) / 1000
              )
            }
          />
        </Text>
      </Tooltip>
    );
  } else {
    return null;
  }
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
      {getSecondsDuration(
        data.specStats?.avgWallClockDuration
          ? data?.specStats?.avgWallClockDuration / 1000
          : 0
      )}
    </>
  );
};
