import { Alert, Button, Paper, Skeleton } from '@mui/material';
import { range } from 'lodash';
import React, { FunctionComponent } from 'react';
import { RunSummary } from '../runSummary/runSummary';
import { useGetRunsFeed } from './useGetRunFeed';

export const RunsFeed: RunsFeedComponent = (props) => {
  const {
    projectId,
    search = '',
    showActions = false,
    compact = false,
  } = props;

  const [runsFeed, loadMore, loading, error] = useGetRunsFeed({
    projectId,
    search,
  });

  if (loading) {
    return (
      <>
        {range(0, 3).map((key) => (
          <Skeleton
            variant="rectangular"
            height={compact ? 100 : 180}
            key={key}
            animation="wave"
            sx={{ my: 2 }}
          />
        ))}
      </>
    );
  }

  if (!runsFeed || error) {
    return (
      <Paper>
        <Alert severity="error" variant="filled">
          Error loading data
        </Alert>
      </Paper>
    );
  }

  if (runsFeed.runs.length === 0) {
    if (search) {
      return (
        <Paper>
          <Alert severity="warning" variant="filled">
            No runs found
          </Alert>
        </Paper>
      );
    }

    return (
      <Paper>
        <Alert severity="info" variant="filled">
          No runs started yet
        </Alert>
      </Paper>
    );
  }

  return (
    <>
      {runsFeed.runs.map((run) => (
        <RunSummary
          brief
          linkToRun
          key={run.runId}
          run={run}
          showActions={showActions}
          compact={compact}
        />
      ))}
      {runsFeed.hasMore && <Button onClick={loadMore}>Load More</Button>}
    </>
  );
};

type RunsFeedProps = {
  compact?: boolean;
  projectId: string;
  showActions?: boolean;
  search?: string;
};
type RunsFeedComponent = FunctionComponent<RunsFeedProps>;
