import { Filters } from '../generated/graphql';

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
