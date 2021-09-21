import { createTheme, lightTheme, Theme } from 'bold-ui';
interface ThemeExtra {
  sizes: Theme['typography']['sizes'] & Record<string, any>;
}
const originalTheme = createTheme({
  typography: {
    ...lightTheme.typography,
  },
});

export const theme: Theme & ThemeExtra = {
  ...originalTheme,
  sizes: {
    ...lightTheme.typography.sizes,
    ...{ text: '1rem', button: '1rem' },
  },
};
