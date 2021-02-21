import React, { PropsWithChildren } from 'react';
import { FlexRow } from './FlexRow';

const PageControls = ({ children }: PropsWithChildren<unknown>) => (
  <FlexRow>{children}</FlexRow>
);

export { PageControls };
