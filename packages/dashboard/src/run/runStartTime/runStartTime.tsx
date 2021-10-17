import { AccessTime as AccessTimeIcon } from '@mui/icons-material';
import { Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { Chip, FormattedDate } from '@sorry-cypress/dashboard/components';
import { parseISO } from 'date-fns';
import React, { FunctionComponent } from 'react';

export const RunStartTime: RunStartTimeComponent = (props) => {
  const { runCreatedAt } = props;

  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'), {
    noSsr: true,
  });

  const creationDate = parseISO(runCreatedAt);
  return (
    <Tooltip title={<>Started At: {creationDate.toUTCString()}</>} arrow>
      <Chip
        size="small"
        color="grey"
        shade={600}
        label={
          <FormattedDate
            short={smallScreen}
            showTooltip={false}
            value={creationDate}
          />
        }
        icon={AccessTimeIcon}
      />
    </Tooltip>
  );
};

type RunStartTimeProps = {
  runCreatedAt: string;
};
type RunStartTimeComponent = FunctionComponent<RunStartTimeProps>;
