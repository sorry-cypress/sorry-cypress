import { Box } from '@mui/material';
import { padStart } from 'lodash';
import React, { FunctionComponent } from 'react';

export const Pad: PadComponent = (props) => {
  const { number } = props;

  return (
    <Box
      component="span"
      whiteSpace="pre"
      sx={{
        opacity: !number ? 0.4 : undefined,
      }}
    >
      {padStart(number?.toString(), 4)}
    </Box>
  );
};

type PadProps = {
  number: number;
};
type PadComponent = FunctionComponent<PadProps>;
