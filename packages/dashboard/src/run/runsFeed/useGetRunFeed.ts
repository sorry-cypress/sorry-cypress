import { ApolloError, ApolloQueryResult } from '@apollo/client';
import {
  Filters,
  GetRunsFeedQuery,
  useGetRunsFeedQuery,
} from '@sorry-cypress/dashboard/generated/graphql';
import { useAutoRefreshRate } from '@sorry-cypress/dashboard/hooks';

interface UseGetRunsFeed {
  projectId: string;
  search?: string;
}
export const useGetRunsFeed = ({
  projectId,
  search,
}: UseGetRunsFeed): [
  GetRunsFeedQuery['runFeed'] | undefined,
  () => Promise<ApolloQueryResult<GetRunsFeedQuery>>,
  boolean,
  ApolloError | undefined
] => {
  const refreshRate = useAutoRefreshRate();
  const { fetchMore, loading, error, data } = useGetRunsFeedQuery({
    variables: {
      filters: getFilters(projectId, search),
      cursor: '',
    },
    pollInterval: refreshRate,
  });

  function loadMore() {
    return fetchMore({
      variables: {
        filters: getFilters(projectId, search),
        cursor: data?.runFeed?.cursor,
      },
      updateQuery: (prev: GetRunsFeedQuery, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          return prev;
        }
        return {
          runFeed: {
            // @ts-ignore
            __typename: prev.runFeed.__typename,
            hasMore: fetchMoreResult?.runFeed.hasMore,
            cursor: fetchMoreResult?.runFeed.cursor,
            runs: [...prev.runFeed.runs, ...fetchMoreResult?.runFeed.runs],
          },
        };
      },
    });
  }

  return [data?.runFeed, loadMore, loading, error];
};

function getFilters(projectId: string, search?: string): Filters[] {
  const searchFilters = search
    ? [
        {
          key: 'meta.ciBuildId',
          like: search,
          value: (undefined as unknown) as null,
        },
      ]
    : [];
  return [
    {
      key: 'meta.projectId',
      value: projectId,
      like: null,
    },
    ...searchFilters,
  ];
}
