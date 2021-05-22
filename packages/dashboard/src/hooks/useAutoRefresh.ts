import { useLocalStorage } from './useLocalStorage';

export const useAutoRefresh = () =>
  useLocalStorage<boolean>('shouldAutoRefresh', false);

export const useAutoRefreshRate = () => {
  const [shouldRefresh] = useAutoRefresh();
  if (shouldRefresh) {
    return 5_000 as number;
  }
  return undefined;
};
