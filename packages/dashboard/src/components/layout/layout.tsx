import { Box, Container, Toolbar, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useLocalStorage } from '@sorry-cypress/dashboard/hooks';
import { WithMaterial } from '@sorry-cypress/dashboard/lib/material';
import React, { PropsWithChildren } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';

export const Layout = ({ children }: PropsWithChildren<any>) => {
  const theme = useTheme();
  const [menuOpen, setMenuOpen] = useLocalStorage<boolean>('menuOpen', true);
  const smallScreen = !useMediaQuery(theme.breakpoints.up('md'), {
    noSsr: true,
  });
  const [open, setOpen] = React.useState(!smallScreen && menuOpen);

  const toggleSidebar = () => {
    setOpen(!open);
    setMenuOpen(!open);
  };

  return (
    <Box
      sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#E8E8EC' }}
    >
      <WithMaterial>
        <Sidebar open={open} onToggleSidebar={toggleSidebar} />
        <Header open={open} onMenuClick={toggleSidebar} />
      </WithMaterial>
      <Container
        maxWidth="xl"
        component="main"
        sx={{
          flex: 1,
          padding: 3,
          backgroundColor: '#E8E8EC',
          width: 'auto',
        }}
      >
        <WithMaterial>
          <Toolbar />
        </WithMaterial>
        {children}
      </Container>
    </Box>
  );
};
