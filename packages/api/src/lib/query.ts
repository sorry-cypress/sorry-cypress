export interface AggregationFilter {
  key: string;
  value?: string;
  like?: string | null;
}

export const filtersToAggregations = (filters?: AggregationFilter[]) => {
  if (!filters) {
    return [];
  }
  const match = {};
  filters
    .filter(({ like, value }) => like !== undefined || value !== undefined)
    .forEach((filter) => {
      match[filter.key] = buildFilterExpression(filter);
    });
  return [
    {
      $match: match,
    },
  ];
};

const buildFilterExpression = ({ like, value }: AggregationFilter) => {
  if (value !== undefined) {
    return value;
  }
  if (like !== undefined && like !== null) {
    return {
      $regex: RegExp(like.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i'),
    };
  }
  return '';
};

export type OrderDirection = 'ASC' | 'DESC';
export const getSortByAggregation = (direction: OrderDirection = 'DESC') => ({
  $sort: {
    _id: direction === 'DESC' ? -1 : 1,
  },
});
