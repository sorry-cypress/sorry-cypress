import { Box, Container } from '@mui/material';
import React, { PropsWithChildren } from 'react';

interface ContainerProps {
  children: React.ReactNodeArray;
}

export const Paper: React.FC<PropsWithChildren<ContainerProps>> = ({
  children,
}) => {
  return (
    <Container>
      <Box sx={{ backgroundColor: '#fff', margin: '12px 0', padding: '12px' }}>
        {children}
      </Box>
    </Container>
  );
};
