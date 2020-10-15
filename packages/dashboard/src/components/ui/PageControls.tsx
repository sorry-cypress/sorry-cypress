import React, { FC, PropsWithChildren } from "react";
import { useCss } from "bold-ui";

export type PageControlsProps = PropsWithChildren<unknown>;

const PageControls: FC<PageControlsProps> = ({ children }: PageControlsProps) => {
  const { css } = useCss();

  return (
    <div
      className={ css`
          display: flex;
          flex-direction: row;
        ` }
    >
      { children }
    </div>
  )
};

export default PageControls;
