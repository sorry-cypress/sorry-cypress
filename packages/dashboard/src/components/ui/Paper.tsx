import { Paper as UIPaper, useStyles } from 'bold-ui';
import React from 'react';

export const Paper = (props: any) => {
  const { css } = useStyles();
  return (
    <UIPaper
      style={css`
         {
          margin: 12px 0;
          padding: 12px;
        }
      `}
      {...props}
    />
  );
};
