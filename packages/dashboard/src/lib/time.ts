import { differenceInHours, parseISO } from 'date-fns/esm';
import prettyMs from 'pretty-ms';
import { IDLE_TIMEOUT_HOURS } from '../constants';

export function getDurationSeconds(seconds: number) {
  return prettyMs(seconds * 1000, {
    secondsDecimalDigits: 0,
  });
}

export function getDurationMs(ms: number) {
  return prettyMs(ms ?? 0, {
    secondsDecimalDigits: 0,
  });
}

export function isIdle(isoDate: string) {
  return differenceInHours(new Date(), parseISO(isoDate)) > IDLE_TIMEOUT_HOURS;
}
