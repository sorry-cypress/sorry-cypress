import { useCss } from 'bold-ui';
import React, { PropsWithChildren } from 'react';

export const Layout = ({ children }: PropsWithChildren<{}>) => {
  const { css } = useCss();
  const className = css`
    height: 100vh;
    display: grid;
    grid-template-rows: 80px auto 50px;
    grid-template-columns: 1fr;
  `;
  return <main className={className}>{children}</main>;
};
