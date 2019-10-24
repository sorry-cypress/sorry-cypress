import React from 'react';
import { useCss } from 'bold-ui';

export const Content: React.FC = ({ children }) => {
  const { css, theme } = useCss();
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
