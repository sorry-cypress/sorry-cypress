import { Paper as UIPaper, PaperProps } from '@mui/material';
import React from 'react';

export const Paper = (props: PaperProps) => {
  return (
    <UIPaper
      elevation={0}
      {...props}
      sx={{
        my: 1.5,
        p: 1.5,
        ...props.sx,
      }}
    />
  );
};
