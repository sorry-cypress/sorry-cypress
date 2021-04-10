import { capitalize } from 'lodash';

export const enumToString = (item: string | null) => {
  if (!item) {
    return "";
  }
  return capitalize(item).replace(/_/g, ' ');
};
