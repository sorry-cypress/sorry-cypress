import { Box, Typography } from '@mui/material';
import React, { FunctionComponent, useMemo, useState } from 'react';
import {
  FailedTestAggregate,
  FlakyTestAggregate,
  useGetTestInsightsQuery,
} from '../generated/graphql';
import { FailedInsightDetails } from './failedInsightDetails';
import { FlakyInsightDetails } from './flakyInsightDetails';
import { InsightsMenu } from './insightsMenu';
import { TestOverview } from './testOverview';
import { buildFilters, getDateRange } from './utils';

export const InsightDetails: InsightDetailsComponent = (props) => {
  const { projectId } = props;
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('');

  const filters = buildFilters(projectId, selectedEnvironment);

  const dateRangeVariables = useMemo(() => {
    if (selectedDateRange) {
      return getDateRange(selectedDateRange);
    }
    return null;
  }, [selectedDateRange]);

  const variables: any = { filters: filters };

  if (dateRangeVariables) {
    variables.startDate = dateRangeVariables.startDate;
    variables.endDate = dateRangeVariables.endDate;
  }

  const { data, loading, error } = useGetTestInsightsQuery({
    variables,
  });

  const totalFlakyTestsCount = data?.testInsights.numberOfFlakyTests || 0;
  const totalPassedTestsCount = data?.testInsights.numberOfPassedTests || 0;
  const totalFailedTestsCount = data?.testInsights.numberOfFailedTests || 0;
  const numberOfTotalRuns = data?.testInsights.numberOfTotalRuns || 0;

  const overallFlakinessPercentage =
    totalFlakyTestsCount > 0
      ? ((totalFlakyTestsCount / totalPassedTestsCount) * 100).toFixed(2)
      : 0;

  const overallFailurePercentage =
    totalFailedTestsCount > 0
      ? ((totalFailedTestsCount / totalPassedTestsCount) * 100).toFixed(2)
      : 0;

  const flakyTests = data?.testInsights.flakyTests;
  const failedTests = data?.testInsights.failedTests;

  return (
    <Box
      m={6}
      mt={2}
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <InsightsMenu
        selectedEnvironment={selectedEnvironment}
        setSelectedEnvironment={setSelectedEnvironment}
        selectedDateRange={selectedDateRange}
        setSelectedDateRange={setSelectedDateRange}
      />
      <TestOverview
        totalFlakyTestsCount={totalFlakyTestsCount}
        totalPassedTestsCount={totalPassedTestsCount}
        totalFailedTestsCount={totalFailedTestsCount}
        overallFlakinessPercentage={overallFlakinessPercentage}
        overallFailurePercentage={overallFailurePercentage}
      />

      {totalFailedTestsCount > 0 && (
        <>
          <Box
            sx={{ backgroundColor: '#fff' }}
            height={50}
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            mt={5}
          >
            <Typography
              sx={{ fontSize: 18, fontWeight: '500' }}
              ml={2}
              color="text.secondary"
            >
              Failed Tests
            </Typography>
          </Box>
          <FailedInsightDetails
            failedTests={failedTests as FailedTestAggregate[]}
            numberOfTotalRuns={numberOfTotalRuns}
          />
        </>
      )}

      {totalFlakyTestsCount > 0 && (
        <>
          <Box
            sx={{ backgroundColor: '#fff' }}
            height={50}
            display="flex"
            justifyContent="flex-start"
            alignItems="center"
            mt={5}
          >
            <Typography
              sx={{ fontSize: 18, fontWeight: '500' }}
              ml={2}
              color="text.secondary"
            >
              Flaky Tests
            </Typography>
          </Box>
          <FlakyInsightDetails
            flakyTests={flakyTests as FlakyTestAggregate[]}
            numberOfTotalRuns={numberOfTotalRuns}
          />
        </>
      )}

      {totalFlakyTestsCount === 0 && totalFailedTestsCount === 0 && (
        <Box
          sx={{ backgroundColor: '#fff' }}
          height={80}
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt={5}
        >
          <Typography
            sx={{ fontSize: 18, fontWeight: '500' }}
            ml={2}
            color="green"
          >
            Status: Healthy
          </Typography>
        </Box>
      )}
    </Box>
  );
};

type InsightDetailsProps = {
  projectId: string;
};
type InsightDetailsComponent = FunctionComponent<InsightDetailsProps>;
