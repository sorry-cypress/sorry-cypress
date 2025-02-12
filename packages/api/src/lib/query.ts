export interface AggregationFilter {
  key: string;
  value: string | number | Date;
  operator?: 'gte' | 'gt' | 'lte' | 'lt'; // Make sure operator is included as an optional field
  like?: string;
}

export const filtersToAggregations = (filters?: AggregationFilter[]) => {
  if (!filters) {
    return [];
  }
  const match: any = {}; // 'any' type because we are dynamically adding keys

  filters
    .filter(({ like, value }) => like !== undefined || value !== undefined)
    .forEach((filter) => {
      match[filter.key] = buildFilterExpression(filter); // Apply the filter expression
    });

  return [
    {
      $match: match,
    },
  ];
};

// This is the function where we handle the operators
const buildFilterExpression = ({
  like,
  value,
  operator,
}: AggregationFilter) => {
  // Handle the operator case
  if (operator) {
    const operatorMap: { [key: string]: string } = {
      gte: '$gte',
      gt: '$gt',
      lte: '$lte',
      lt: '$lt',
    };

    if (operatorMap[operator]) {
      // If the operator exists in our map, return the corresponding MongoDB expression
      return {
        [operatorMap[operator]]: value,
      };
    }
  }

  // If there's no operator, fallback to the value
  if (value !== undefined) {
    return value;
  }

  // Handle 'like' if present (for text searches)
  if (like !== undefined && like !== null) {
    return {
      $regex: RegExp(like.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i'),
    };
  }

  return ''; // Default to empty if no filter is applied
};

export type OrderDirection = 'ASC' | 'DESC';

export const getSortByAggregation = (direction: OrderDirection = 'DESC') => ({
  $sort: {
    _id: direction === 'DESC' ? -1 : 1,
  },
});
