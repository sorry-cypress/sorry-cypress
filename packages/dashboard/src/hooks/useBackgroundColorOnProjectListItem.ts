import { useLocalStorage } from './useLocalStorage';

export const useBackgroundColorOnProjectListItem = () =>
  useLocalStorage<boolean>('shouldUseBackgroundColorOnProjectListItem', false);
