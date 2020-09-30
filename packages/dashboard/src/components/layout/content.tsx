import React, { PropsWithChildren } from 'react';
import { useCss } from 'bold-ui';

export const Content = ({ children }: PropsWithChildren<unknown>) => {
  const { css } = useCss();
  return (
    <section
      className={css`
        padding: 32px;
      `}
    >
      {children}
    </section>
  );
};
