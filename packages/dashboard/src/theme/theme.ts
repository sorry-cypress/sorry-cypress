import { lightTheme, createTheme } from 'bold-ui';

export const theme = createTheme({
  typography: {
    ...lightTheme.typography,
    sizes: {
      ...lightTheme.typography.sizes,
      ...{ text: '1rem', button: '1rem' }
    }
  }
});
