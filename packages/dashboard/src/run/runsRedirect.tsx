import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useGetRunsFeed } from './runsFeed/useGetRunFeed';

type RunRedirectProps = {
  // nothing yet
};

export function RunRedirect() {
  const { projectId, buildId } = useParams();

  const [runsFeed, , loading] = useGetRunsFeed({
    projectId: projectId!,
    search: buildId,
  });

  return !loading && runsFeed && runsFeed.runs.length > 0 ? (
    <Navigate to={`/run/${runsFeed.runs[0].runId}`} />
  ) : loading ? (
    <div>
      Redirecting to run with build id {buildId} in {projectId}
    </div>
  ) : (
    <div>Associated run not found</div>
  );
}
