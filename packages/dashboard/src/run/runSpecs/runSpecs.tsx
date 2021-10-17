import { Radar as RadarIcon } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { Chip } from '@sorry-cypress/dashboard/components';
import React, { FunctionComponent } from 'react';

export const RunSpecs: RunSpecsComponent = (props) => {
  const { claimedSpecsCount, overallSpecsCount } = props;

  return (
    <Tooltip
      title={
        <>
          Spec Files: {claimedSpecsCount} / {overallSpecsCount}
        </>
      }
      arrow
    >
      <Chip
        size="small"
        color="grey"
        shade={600}
        label={`${claimedSpecsCount} / ${overallSpecsCount}`}
        icon={RadarIcon}
      />
    </Tooltip>
  );
};

type RunSpecsProps = {
  claimedSpecsCount: number;
  overallSpecsCount: number;
};
type RunSpecsComponent = FunctionComponent<RunSpecsProps>;
