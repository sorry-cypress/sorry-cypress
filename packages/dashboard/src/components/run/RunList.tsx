import { CenteredContent } from '@src/components/common';
import { RunSummary } from '@src/components/run/summary';
import { useGetRunsFeedQuery } from '@src/generated/graphql';
import { Button } from 'bold-ui';
import React, { FC } from 'react';

type RunListProps = {
  projectId: string;
  search?: string;
};

const RunList: FC<RunListProps> = ({
  projectId,
  search = '',
}: RunListProps) => {
  const searchFilters = search
    ? [
        {
          key: 'meta.ciBuildId',
          like: search,
        },
      ]
    : [];
  const filters = [
    {
      key: 'meta.projectId',
      value: projectId,
    },
    ...searchFilters,
  ];
  const { fetchMore, loading, error, data } = useGetRunsFeedQuery({
    variables: {
      filters,
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
  const { runs } = runFeed;

  const loadMore = () => {
    return fetchMore({
      variables: {
        filters,
        cursor: runFeed.cursor,
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
          <p>No runs found </p>
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
        <RunSummary run={run} key={run.runId} />
      ))}
      {runFeed.hasMore && <Button onClick={loadMore}>Load More</Button>}
    </>
  );
};

export default RunList;
