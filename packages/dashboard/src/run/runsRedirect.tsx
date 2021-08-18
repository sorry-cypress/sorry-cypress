import { useGetRunsFeed } from '@src/run/runsFeed/useGetRunFeed';
import React from 'react';
import { Redirect } from 'react-router';

type RunRedirectProps = {
  match: {
    params: {
      projectId: string;
      buildId: string;
    };
  };
};

export function RunRedirect({
  match: {
    params: { projectId, buildId },
  },
}: RunRedirectProps) {
  const [runsFeed, loadMore, loading, error] = useGetRunsFeed({
    projectId,
    search: buildId,
  });

  return !loading && runsFeed && runsFeed.runs.length > 0 ? (
    <Redirect to={`/run/${runsFeed.runs[0].runId}`} />
  ) : loading ? (
    <div>
      Redirecting to run with build id {buildId} in {projectId}
    </div>
  ) : (
    <div>Associated run not found</div>
  );
}
