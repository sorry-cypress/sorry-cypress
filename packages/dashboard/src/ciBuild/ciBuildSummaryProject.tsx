import { BookOutlined } from '@mui/icons-material';
import { colors, Grid, Tooltip } from '@mui/material';
import { getRunTestsProgress } from '@sorry-cypress/common';
import { Chip } from '@sorry-cypress/dashboard/components';
import {
  Run,
  RunGroupProgressTests,
} from '@sorry-cypress/dashboard/generated/graphql';
import React, { FunctionComponent } from 'react';
import { useNavigate } from 'react-router-dom';

export const CiBuildSummaryProject: CiBuildSummaryProjectComponent = (
  props
) => {
  const { run } = props;

  const navigate = useNavigate();
  const testsProgress = run.progress && getRunTestsProgress(run.progress);
  const color = testsProgress
    ? getProjectColorBySeverity(testsProgress)
    : 'grey';

  return (
    <Tooltip
      key={run.meta.projectId}
      title={<>Project: {run.meta.projectId}</>}
      arrow
    >
      <Grid item>
        <Chip
          size="small"
          color={color}
          shade={600}
          label={run.meta.projectId}
          icon={BookOutlined}
          onClick={() => navigate(`/run/${run.runId}`)}
        />
      </Grid>
    </Tooltip>
  );
};

type CiBuildSummaryProjectProps = {
  run: Run;
};
type CiBuildSummaryProjectComponent = FunctionComponent<
  CiBuildSummaryProjectProps
>;

const getProjectColorBySeverity = (
  results: RunGroupProgressTests
): keyof typeof colors => {
  if (results.failures > 0) return 'red';
  if (results.flaky > 0) return 'pink';
  if (results.skipped > 0) return 'orange';
  return 'grey';
};
