import { getTestRetries } from '@sorry-cypress/common';
import { VisualTestState } from '@sorry-cypress/dashboard/components/common';
import {
  GetInstanceQuery,
  InstanceTest,
} from '@sorry-cypress/dashboard/generated/graphql';
import { getDurationMs } from '@sorry-cypress/dashboard/lib/time';
import { TestError } from '@sorry-cypress/dashboard/testItem/details/common';
import { DataTable, Text, Tooltip } from 'bold-ui';
import { truncate } from 'lodash';
import React from 'react';
import { generatePath, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Paper } from '../components';
import { getTestDuration, getTestStartedAt } from './util';

function TestStatus(test: InstanceTest) {
  const retries = getTestRetries(test.state, test.attempts.length);
  return <VisualTestState state={test.state} retries={retries} />;
}
function TestDuration(test: InstanceTest) {
  return (
    <Tooltip text={`Started at ${getTestStartedAt(test)}`}>
      <Text>{getDurationMs(getTestDuration(test))}</Text>
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

function TestRetries(test: InstanceTest) {
  return getTestRetries(test.state, test.attempts.length);
}
function TestAttempts(test: InstanceTest) {
  return test.attempts.length;
}

function TestDisplayError(test: InstanceTest) {
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
const retriesColumn = {
  name: 'retries',
  header: 'Retries',
  sortable: false,
  render: TestRetries,
};
const errorColumn = {
  name: 'error',
  header: 'Error',
  sortable: false,
  render: TestDisplayError,
};

const gteV5Columns = [
  statusColumn,
  errorColumn,
  durationColumn,
  attemptsColumn,
  retriesColumn,
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

  return (
    <div>
      <strong>Tests</strong>
      <Paper>
        <DataTable rows={tests} columns={gteV5Columns} />
      </Paper>
    </div>
  );
};
