import { ALLOWED_KEYS } from '@src/config';

export const isKeyAllowed = (recordKey: string) =>
  ALLOWED_KEYS ? ALLOWED_KEYS.includes(recordKey) : true;
