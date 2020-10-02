export interface AggregationFilter {
  key: string;
  value: unknown;
}
export const filtersToAggregations = (filters?: AggregationFilter[]) => {
  if (!filters) {
    return [];
  }
  return filters.map((filter) => ({
    $match: {
      [filter.key]: filter.value,
    },
  }));
};

export type OrderDirection = 'ASC' | 'DESC';
export const getSortByAggregation = (direction: OrderDirection = 'DESC') => ({
  $sort: {
    _id: direction === 'DESC' ? -1 : 1,
  },
});
