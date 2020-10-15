export interface AggregationFilter {
  key: string;
  value?: string;
  like?: string;
};

export const filtersToAggregations = (filters?: AggregationFilter[]) => {
  if (!filters) {
    return [];
  }
  return filters.map((filter) => ({
    $match: {
      [filter.key]: buildFilterExpression(filter),
    },
  }));
};

const buildFilterExpression = ({ like, value }: AggregationFilter) => {
  if (value !== undefined) {
    return value;
  }
  if (like !== undefined) {
    return {
      '$regex': RegExp(like.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i')
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
