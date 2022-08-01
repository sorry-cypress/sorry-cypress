import { useGetCiBuildId } from '@sorry-cypress/dashboard/run/runsFeed/useGetCiBuildId';
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

export function RunRedirect() {
  const { projectId, buildId } = useParams();

  const [runsFeed, , loading] = useGetCiBuildId({
    projectId: projectId!,
    ciBuildId: buildId!,
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
