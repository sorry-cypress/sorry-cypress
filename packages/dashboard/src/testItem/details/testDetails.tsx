import { Box, Grid, Typography } from '@mui/material';
import {
  FlakyTestBadge,
  TestAttemptsState,
  VisualTestState,
} from '@sorry-cypress/dashboard/components/common/testState';
import {
  InstanceScreeshot,
  InstanceTest,
} from '@sorry-cypress/dashboard/generated/graphql';
import React, { FunctionComponent } from 'react';
import { TestDetailsV5 } from './testDetailsV5';

export const TestDetails: TestDetailsComponent = (props) => {
  const { test, screenshots } = props;

  const title = test.title[test.title.length - 1];

  return (
    <>
      <Typography component="h1" variant="h6" color="text.secondary" mb={0.5}>
        {title}
      </Typography>
      <Grid container spacing={1}>
        <Grid item>
          <VisualTestState state={test.state} />
        </Grid>
        {test.state === 'passed' && test.attempts.length > 1 && (
          <Grid item>
            <FlakyTestBadge />
          </Grid>
        )}
        <Grid item>
          <TestAttemptsState attempts={test.attempts.length} />
        </Grid>
      </Grid>
      <Box mt={4}>
        <TestDetailsV5 test={test} screenshots={screenshots} />
      </Box>
    </>
  );
};

type TestDetailsProps = {
  test: InstanceTest;
  screenshots: Partial<InstanceScreeshot>[];
};
type TestDetailsComponent = FunctionComponent<TestDetailsProps>;
