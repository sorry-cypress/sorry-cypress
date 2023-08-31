import { Link, Stack, Typography } from '@mui/material';
import React, { FunctionComponent } from 'react';
import { generatePath } from 'react-router';
import { getNumberOfDaysAgo, getNumberOfTestRunsAgo } from './utils';

export const DateAndTestRunsAgo: DateAndTestRunsAgoComponent = (props) => {
  const { runDate, numberOfTotalRuns, runIndex, runId } = props;

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
};

type DateAndTestRunsAgoProps = {
  runDate: string;
  numberOfTotalRuns: number;
  runIndex: number;
  runId: number;
};

type DateAndTestRunsAgoComponent = FunctionComponent<DateAndTestRunsAgoProps>;
