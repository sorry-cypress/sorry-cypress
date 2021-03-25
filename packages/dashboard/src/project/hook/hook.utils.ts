import { capitalize } from 'lodash';

export const hookTypeToString = (item: string | null) => {
  if (!item) {
    throw new Error('No item');
  }
  return capitalize(item).replace(/_/g, ' ');
};
