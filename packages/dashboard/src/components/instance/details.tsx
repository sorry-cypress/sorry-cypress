import { areTestsGteV5 } from '@src/lib/version';
import { DataTable, Link, Text, Tooltip, useCss } from 'bold-ui';
import { truncate } from 'lodash';
import React from 'react';
import { generatePath, useParams } from 'react-router';
import {
  GetInstanceQuery,
  InstanceTest,
  InstanceTestV5,
} from '../../generated/graphql';
import { shortEnglishHumanizerWithMsIfNeeded } from '../../lib/utis';
import { VisualState } from '../common';

function TestStatus(test: InstanceTest) {
  return <VisualState state={test.state} />;
}
function TestDuration(test: InstanceTest) {
  if (test?.wallClockDuration) {
    return (
      <Tooltip text={`Started at ${test.wallClockStartedAt}`}>
        <Text>
          {shortEnglishHumanizerWithMsIfNeeded(test.wallClockDuration)}
        </Text>
      </Tooltip>
    );
  } else {
    return '';
  }
}
function TestLink(test: InstanceTest) {
  const { id } = useParams<{ id: string }>();
  return (
    <Link href={generatePath(`/instance/${id}/test/${test.testId}`)}>
      {test.title?.join(' > ')}
    </Link>
  );
}

function TestAttempts(test: InstanceTestV5) {
  return test.attempts.length;
}

function TestDisplayError(test: InstanceTestV5) {
  if (!test.displayError) {
    return null;
  }
  return (
    <Tooltip text={test.displayError}>
      <Text>{truncate(test.displayError, { length: 128 })}</Text>
    </Tooltip>
  );
}

const statusColumn = {
  name: 'status',
  header: 'Status',
  sortable: false,
  render: TestStatus,
};
const durationColumn = {
  name: 'duration',
  header: 'Duration',
  sortable: false,
  render: TestDuration,
};
const linkColumn = {
  name: 'link',
  header: '',
  sortable: false,
  render: TestLink,
};
const attemptsColumn = {
  name: 'attempts',
  header: 'Attempts',
  sortable: false,
  render: TestAttempts,
};
const errorColumn = {
  name: 'error',
  header: 'Error',
  sortable: false,
  render: TestDisplayError,
};

const ltV5Columns = [statusColumn, durationColumn, linkColumn];
const gteV5Columns = [
  statusColumn,
  errorColumn,
  durationColumn,
  attemptsColumn,
  linkColumn,
];

export const InstanceDetails = ({
  instance,
}: {
  instance: GetInstanceQuery['instance'];
}) => {
  const { css } = useCss();

  if (!instance?.results) {
    return <p>No results yet for the spec</p>;
  }

  const tests = instance.results.tests;

  if (!tests) {
    return <div>No tests reported for spec</div>;
  }

  const columns = areTestsGteV5(tests) ? gteV5Columns : ltV5Columns;

  return (
    <div>
      <strong>Tests</strong>
      <div
        className={css`
          {
            margin: 12px 0;
          }
        `}
      >
        <DataTable rows={tests} loading={false} columns={columns} />
      </div>
    </div>
  );
};
