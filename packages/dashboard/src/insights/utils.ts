import { GridRowsProp } from '@mui/x-data-grid';
import { differenceInDays } from 'date-fns';
import stringHash from 'string-hash';
import {
  FailedTestAggregate,
  Filters,
  FlakyTestAggregate,
} from '../generated/graphql';

export const getDateRange = (days: string) => {
  if (days === '0') return;
  const dayNumber = Number(days);
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - dayNumber);

  return {
    startDate: startDate,
    endDate: endDate,
  };
};

export const buildFilters = (
  projectId: string,
  selectedEnvironment?: string
) => {
  const filters: Filters[] = [
    { key: 'meta.projectId', value: projectId, like: null },
  ];

  if (selectedEnvironment) {
    filters.push({
      key: 'meta.buildEnvironment',
      value: selectedEnvironment,
      like: null,
    });
  }

  return filters;
};

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function convertTestsToRows(
  tests: FailedTestAggregate[] | FlakyTestAggregate[]
): GridRowsProp {
  return tests.map((test) => {
    return {
      instanceId: stringHash(test.spec).toString(),
      specName: test.spec,
      firstFailedRun: test ? test : 'N/A',
      lastFailedRun: test ? test : 'N/A',
    };
  });
}

export function getNumberOfDaysAgo(runDate: string) {
  const daysAgo = differenceInDays(new Date(), new Date(runDate || 0)) + 1;
  return `${daysAgo} days ago`;
}

export function getNumberOfTestRunsAgo(
  numberOfTotalRuns: number,
  runIndex: number
) {
  const testRunsAgo = numberOfTotalRuns - runIndex;
  return `${testRunsAgo} test runs ago`;
}
