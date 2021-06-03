import { VisualTestState } from '@src/components/common';
import {
  GetInstanceQuery,
  InstanceTest,
  InstanceTestUnion,
  InstanceTestV5,
} from '@src/generated/graphql';
import { getSecondsDuration } from '@src/lib/duration';
import { areTestsGteV5 } from '@src/lib/version';
import { TestError } from '@src/testItem/details/common';
import { DataTable, Text, Tooltip } from 'bold-ui';
import { truncate } from 'lodash';
import React from 'react';
import { generatePath, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { getTestDuration, getTestStartedAt } from './util';

function TestStatus(test: InstanceTest) {
  return <VisualTestState state={test.state} />;
}
function TestDuration(test: InstanceTestUnion) {
  return (
    <Tooltip text={`Started at ${getTestStartedAt(test)}`}>
      <Text>{getSecondsDuration(getTestDuration(test) / 1000)}</Text>
    </Tooltip>
  );
}
function TestLink(test: InstanceTest) {
  const { id } = useParams<{ id: string }>();
  return (
    <Link to={generatePath(`/instance/${id}/test/${test.testId}`)}>
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
  if (!instance?.results) {
    return <p>No results yet for the spec</p>;
  }

  const tests = instance.results.tests;

  if (instance.results.error) {
    return <TestError error={instance.results.error} />;
  }

  if (!tests?.length) {
    return <div>No tests reported for spec</div>;
  }

  const columns = areTestsGteV5(tests) ? gteV5Columns : ltV5Columns;

  return (
    <div>
      <strong>Tests</strong>
      <DataTable rows={tests} columns={columns} />
    </div>
  );
};
