import React, { FC, PropsWithChildren } from 'react';
import FlexRow from './FlexRow';

const PageControls: FC = ({ children }: PropsWithChildren<unknown>) => <FlexRow>{children}</FlexRow>;

export default PageControls;
