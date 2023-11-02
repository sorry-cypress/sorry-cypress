import { useLocalStorage } from './useLocalStorage';

export const useShowTestsAreRunningOnProjectListItem = () =>
  useLocalStorage<boolean>('shouldShowTestsAreRunningOnProjectListItem', false);
