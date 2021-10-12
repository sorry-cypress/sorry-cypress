import { Timer as TimerIcon } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { Chip, RenderOnInterval } from '@sorry-cypress/dashboard/components';
import { getDurationSeconds, isIdle } from '@sorry-cypress/dashboard/lib/time';
import { differenceInSeconds, parseISO } from 'date-fns/esm';
import React, { FunctionComponent } from 'react';

export const RunDuration: RunDurationComponent = (props) => {
  const { completed, createdAtISO, wallClockDurationSeconds } = props;

  const duration =
    completed || isIdle(createdAtISO) ? (
      getDurationSeconds(wallClockDurationSeconds)
    ) : (
      <RenderOnInterval
        render={() =>
          getDurationSeconds(
            differenceInSeconds(Date.now(), parseISO(createdAtISO))
          )
        }
      />
    );

  return (
    <Tooltip title={<>Duration: {duration}</>} arrow>
      <Chip
        size="small"
        color="grey"
        shade={600}
        label={duration}
        icon={TimerIcon}
      />
    </Tooltip>
  );
};

type RunDurationProps = {
  completed?: boolean;
  createdAtISO: string;
  wallClockDurationSeconds: number;
};
type RunDurationComponent = FunctionComponent<RunDurationProps>;
