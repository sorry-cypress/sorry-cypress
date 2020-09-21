import { makeVar } from '@apollo/client';

interface NavItem {
  label?: string | null;
  link: string;
}
export const navStructure = makeVar<NavItem[]>([]);
