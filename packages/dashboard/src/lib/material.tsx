import {
  createTheme,
  StyledEngineProvider,
  ThemeOptions,
  ThemeProvider,
} from '@mui/material';
import React, { PropsWithChildren } from 'react';

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#093c52',
      contrastText: '#ebecf1',
    },
    secondary: {
      main: '#3c708a',
      contrastText: '#EBECF1',
    },
    text: {
      primary: 'rgba(56,59,65,0.99)',
      secondary: '#4a4646',
      disabled: 'rgba(121,121,121,0.67)',
    },
  },
  typography: {
    fontWeightBold: 700,
    fontWeightMedium: 500,
    fontFamily: 'IBM Plex Sans',
    fontWeightRegular: 400,
    button: { textTransform: 'unset' },
  },
  spacing: 8,
  shape: {
    borderRadius: 4,
  },
};
const materialTheme = createTheme(themeOptions);

export const WithMaterial = ({ children }: PropsWithChildren<any>) => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={materialTheme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  );
};
