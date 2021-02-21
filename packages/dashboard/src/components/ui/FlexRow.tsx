import { useCss } from 'bold-ui';
import React, { PropsWithChildren } from 'react';

type FlexRowProps = {
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

        & > * + * {
          margin-left: 1em;
        }
      `}
    >
      {children}
    </div>
  );
};

export { FlexRow };
