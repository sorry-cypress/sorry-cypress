import { Alert, Paper, Skeleton } from '@mui/material';
import { CiBuildSummary } from '@sorry-cypress/dashboard/ciBuild/ciBuildSummary';
import {
  CiBuild,
  useGetCiBuildsQuery,
} from '@sorry-cypress/dashboard/generated/graphql';
import { useAutoRefreshRate } from '@sorry-cypress/dashboard/hooks';
import { range } from 'lodash';
import React, { FunctionComponent } from 'react';

export const CiBuildsFeed: CiBuildsFeedComponent = (props) => {
  const { search = '', compact = false } = props;

  const searchFilters = search
    ? [
        {
          key: 'meta.ciBuildId',
          like: search,
          value: (undefined as unknown) as null,
        },
      ]
    : [];

  const refreshRate = useAutoRefreshRate();
  const { data, loading, error } = useGetCiBuildsQuery({
    variables: { filters: searchFilters },
    pollInterval: refreshRate,
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

  if (!data || error) {
    return (
      <Paper>
        <Alert severity="error" variant="filled">
          Error loading data
        </Alert>
      </Paper>
    );
  }

  if (data.ciBuilds.length === 0) {
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
      {data.ciBuilds.map((ciBuild) => (
        <CiBuildSummary
          key={ciBuild?.ciBuildId}
          ciBuild={ciBuild as CiBuild}
          compact={compact}
        ></CiBuildSummary>
      ))}
    </>
  );
};

type CiBuildsFeedProps = {
  compact?: boolean;
  search?: string;
};
type CiBuildsFeedComponent = FunctionComponent<CiBuildsFeedProps>;
