import React, { PropsWithChildren } from 'react';
import { FlexRow } from './flexRow';

const PageControls = ({ children }: PropsWithChildren<unknown>) => (
  <FlexRow>{children}</FlexRow>
);

export { PageControls };
