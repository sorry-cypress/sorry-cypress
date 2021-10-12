import { Paper as UIPaper, PaperProps } from '@mui/material';
import { useStyles } from 'bold-ui';
import React from 'react';

export const Paper = (props: PaperProps) => {
  const { css } = useStyles();
  return (
    <UIPaper
      elevation={0}
      className={css`
         {
          margin: 12px 0;
          padding: 12px;
          background-color: #fff;
        }
      `}
      {...props}
    />
  );
};
