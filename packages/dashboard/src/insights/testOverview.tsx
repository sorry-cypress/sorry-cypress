import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import React, { FunctionComponent } from 'react';

export const TestOverview: TestOverviewComponent = (props) => {
  const {
    totalFlakyTestsCount,
    totalPassedRunsCount,
    totalFailedTestsCount,
    overallFlakinessPercentage,
    overallFailurePercentage,
  } = props;

  return (
    <Grid container spacing={1} justifyContent="space-between">
      <Grid item xs={12}>
        <Box
          sx={{ backgroundColor: '#fff' }}
          height={50}
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          mb={0}
        >
          <Typography
            sx={{ fontSize: 18, fontWeight: '500' }}
            ml={2}
            color="text.secondary"
          >
            Test Insights Overview
          </Typography>
        </Box>
      </Grid>
      <Grid item textAlign={'center'}>
        <Card sx={{ minWidth: 230, borderRadius: '5px' }}>
          <CardContent>
            <Typography
              sx={{ fontSize: 18, fontWeight: '500' }}
              color="text.secondary"
              gutterBottom
            >
              Overall flakiness
            </Typography>
            <Typography variant="h4" color="text.secondary">
              {overallFlakinessPercentage}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item textAlign={'center'}>
        <Card sx={{ minWidth: 230, borderRadius: '5px' }}>
          <CardContent>
            <Typography
              sx={{ fontSize: 18, fontWeight: '500' }}
              color="text.secondary"
              gutterBottom
            >
              Failure rate
            </Typography>
            <Typography variant="h4" color="text.secondary">
              {overallFailurePercentage}%
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item textAlign={'center'}>
        <Card sx={{ minWidth: 230, borderRadius: '5px' }}>
          <CardContent>
            <Typography
              sx={{ fontSize: 18, fontWeight: '500' }}
              color="green"
              gutterBottom
            >
              Passed runs
            </Typography>
            <Typography variant="h4" color="text.secondary">
              {totalPassedRunsCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item textAlign={'center'}>
        <Card sx={{ minWidth: 230, borderRadius: '5px' }}>
          <CardContent>
            <Typography
              sx={{ fontSize: 18, fontWeight: '500' }}
              color="burlywood"
              gutterBottom
            >
              Flaky tests
            </Typography>
            <Typography variant="h4" color="text.secondary">
              {totalFlakyTestsCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item textAlign={'center'}>
        <Card sx={{ minWidth: 230, borderRadius: '5px' }}>
          <CardContent>
            <Typography
              sx={{ fontSize: 18, fontWeight: '500' }}
              color="red"
              gutterBottom
            >
              Failed tests
            </Typography>
            <Typography variant="h4" color="text.secondary">
              {totalFailedTestsCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

type TestOverviewProps = {
  totalFlakyTestsCount: string | number;
  totalPassedRunsCount: string | number;
  totalFailedTestsCount: string | number;
  overallFlakinessPercentage: string | number;
  overallFailurePercentage: string | number;
};
type TestOverviewComponent = FunctionComponent<TestOverviewProps>;
