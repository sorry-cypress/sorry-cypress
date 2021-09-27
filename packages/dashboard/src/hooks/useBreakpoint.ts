import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export const useBreakpoint = () => {
  const theme = useTheme();
  const keys = [...theme.breakpoints.keys];
  let matchedBreakpoint = null;
  for (const key of keys) {
    const matches = useMediaQuery(theme.breakpoints.only(key), { noSsr: true });
    if (matches && !matchedBreakpoint) {
      matchedBreakpoint = key;
    }
  }
  return matchedBreakpoint;
};
