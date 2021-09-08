import React from 'react';
import { Redirect } from 'react-router';
import { useGetRunsFeed } from './runsFeed/useGetRunFeed';

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
  const [runsFeed, , loading] = useGetRunsFeed({
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
