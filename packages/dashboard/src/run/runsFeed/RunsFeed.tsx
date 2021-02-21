import { CenteredContent } from '@src/components';
import { useGetRunsFeedQuery } from '@src/generated/graphql';
import { RunSummary } from '@src/run/runSummary/summary';
import { Button } from 'bold-ui';
import React from 'react';

type RunListProps = {
  projectId: string;
  search?: string;
};

export const RunsFeed = ({ projectId, search = '' }: RunListProps) => {
  const { fetchMore, loading, error, data } = useGetRunsFeedQuery({
    variables: {
      filters: getFilters(projectId, search),
      cursor: '',
    },
  });

  if (loading) {
    return <CenteredContent>Loading ...</CenteredContent>;
  }

  if (!data || error) {
    return (
      <CenteredContent>
        {(error && error.toString()) || 'Oups an error occured'}
      </CenteredContent>
    );
  }

  const { runFeed } = data;
  const { runs, cursor } = runFeed;
  const loadMore = () => {
    return fetchMore({
      variables: {
        filters: getFilters(projectId, search),
        cursor: cursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        return {
          runFeed: {
            __typename: prev.runFeed.__typename,
            hasMore: fetchMoreResult?.runFeed.hasMore,
            cursor: fetchMoreResult?.runFeed.cursor,
            runs: [...prev.runFeed.runs, ...fetchMoreResult?.runFeed.runs],
          },
        };
      },
    });
  };

  if (runs.length === 0) {
    if (search) {
      return (
        <CenteredContent>
          <p>No runs found</p>
        </CenteredContent>
      );
    }

    return (
      <CenteredContent>
        <p>No runs have started on this project.</p>
      </CenteredContent>
    );
  }

  return (
    <>
      {runs.map((run) => (
        <RunSummary
          runCreatedAt={run.createdAt}
          runSpecs={run.specs}
          runId={run.runId}
          runMeta={run.meta}
          key={run.runId}
        />
      ))}
      {runFeed.hasMore && <Button onClick={loadMore}>Load More</Button>}
    </>
  );
};

function getFilters(projectId: string, search?: string) {
  const searchFilters = search
    ? [
        {
          key: 'meta.ciBuildId',
          like: search,
        },
      ]
    : [];
  return [
    {
      key: 'meta.projectId',
      value: projectId,
    },
    ...searchFilters,
  ];
}
