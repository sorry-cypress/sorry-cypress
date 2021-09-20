import { Box, Toolbar, useMediaQuery } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
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
    <Box sx={{ display: 'flex' }}>
      <WithMaterial>
        <Sidebar open={open} onToggleSidebar={toggleSidebar} />
        <Header open={open} onMenuClick={toggleSidebar} />
      </WithMaterial>
      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 0 }}>
        <WithMaterial>
          <Toolbar />
        </WithMaterial>
        {children}
      </Box>
    </Box>
  );
};
