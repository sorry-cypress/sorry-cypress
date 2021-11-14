import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme, ThemeOptions } from '@mui/material';

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
    h6: {
      fontWeight: 'normal',
    },
    fontWeightBold: 700,
    fontWeightMedium: 500,
    fontWeightRegular: 400,
    button: { textTransform: 'none' },
  },
  spacing: 8,
  shape: {
    borderRadius: 4,
  },
};

export const theme = createTheme(themeOptions);
