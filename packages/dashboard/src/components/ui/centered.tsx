import { useCss } from 'bold-ui';
import React, { PropsWithChildren } from 'react';

export const CenteredContent = ({ children }: PropsWithChildren<unknown>) => {
  const { css } = useCss();

  return (
    <div
      className={css`
        text-align: center;
        padding: 2rem 0;
      `}
    >
      {children}
    </div>
  );
};
