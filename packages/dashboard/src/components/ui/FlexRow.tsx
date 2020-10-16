import React, { PropsWithChildren } from 'react';
import { useCss } from 'bold-ui';

export type FlexRowProps = {
  alignItems?: 'center' | 'flex-start' | 'flex-end';
};

const FlexRow = ({
  children,
  alignItems = 'center',
}: PropsWithChildren<FlexRowProps>) => {
  const { css } = useCss();

  return (
    <div
      className={css`
        display: flex;
        flex-direction: row;
        align-items: ${alignItems};
      `}
    >
      {children}
    </div>
  );
};

export default FlexRow;
