import { useLocalStorage } from './useLocalStorage';

export const useStackRuns = () =>
  useLocalStorage<boolean>('shouldStackRuns', false);
