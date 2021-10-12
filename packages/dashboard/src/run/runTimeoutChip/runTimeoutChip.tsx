import { HourglassBottom } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { Chip } from '@sorry-cypress/dashboard/components';
import { getDurationMs } from '@sorry-cypress/dashboard/lib/time';
import React, { FunctionComponent } from 'react';

export const RunTimeoutChip: RunTimeoutChipComponent = (props) => {
  const { inactivityTimeoutMs } = props;

  return (
    <Tooltip
      title={`Timed out after ${getDurationMs(
        inactivityTimeoutMs
      )}. You can change the timeout value in project settings.`}
      arrow
    >
      <Chip size="small" color="red" label="timed out" icon={HourglassBottom} />
    </Tooltip>
  );
};

type RunTimeoutChipProps = {
  inactivityTimeoutMs: number;
};
type RunTimeoutChipComponent = FunctionComponent<RunTimeoutChipProps>;
