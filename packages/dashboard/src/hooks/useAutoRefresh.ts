import { useLocalStorage } from './useLocalStorage';

export const useAutoRefresh = () =>
  useLocalStorage<boolean>('shouldAutoRefresh', false);
