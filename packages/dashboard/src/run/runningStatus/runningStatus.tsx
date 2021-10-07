import { Circle as CircleIcon } from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';
import { red } from '@mui/material/colors';
import React, { FunctionComponent } from 'react';

export const RunningStatus: RunningStatusComponent = () => {
  return (
    <Tooltip title={`Recording test results`}>
      <Box mt="6px" mr="4px">
        <CircleIcon
          fontSize="small"
          sx={{
            color: red[400],
            animation: (theme) =>
              `pulsate 1200ms ${theme.transitions.easing.easeInOut} 0ms infinite`,
            '@keyframes pulsate': {
              '0%': {
                transform: 'scale(0.85)',
                color: red[400],
              },
              '50%': {
                transform: 'scale(1)',
                color: red[600],
              },
              '100%': {
                transform: 'scale(0.85)',
                color: red[400],
              },
            },
          }}
        />
      </Box>
    </Tooltip>
  );
};

type RunningStatusProps = {
  // Nothing yet
};
type RunningStatusComponent = FunctionComponent<RunningStatusProps>;
