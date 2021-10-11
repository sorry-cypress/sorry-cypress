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
      main: '#1976d2',
      contrastText: '#ebecf1',
    },
    secondary: {
      main: '#3c708a',
      contrastText: '#EBECF1',
    },
    text: {
      primary: '#3d4752cc',
      secondary: '#4a4646',
      disabled: 'rgba(121,121,121,0.67)',
    },
  },
  typography: {
    fontWeightBold: 700,
    fontWeightMedium: 500,
    fontFamily: 'IBM Plex Sans',
    fontWeightRegular: 400,
    button: { textTransform: 'none' },
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
