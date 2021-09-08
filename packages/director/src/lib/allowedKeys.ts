import { ALLOWED_KEYS } from '@sorry-cypress/director/config';

export const isKeyAllowed = (recordKey: string) =>
  ALLOWED_KEYS ? ALLOWED_KEYS.includes(recordKey) : true;
