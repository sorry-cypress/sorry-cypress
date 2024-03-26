import { useLocalStorage } from './useLocalStorage';

export const useShowFlakySpecs = () =>
  useLocalStorage<boolean>('shouldShowFlakySpecs', false);