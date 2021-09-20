import { useLocalStorage } from './useLocalStorage';

export const useMenuIsOpen = () => useLocalStorage<boolean>('menuOpen', true);
