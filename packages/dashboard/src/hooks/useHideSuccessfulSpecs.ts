import { useLocalStorage } from './useLocalStorage';

export const useHideSuccessfulSpecs = () =>
  useLocalStorage<boolean>('shouldHideSuccessfulSpecs', false);
