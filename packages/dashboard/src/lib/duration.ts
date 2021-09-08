import prettyMs from 'pretty-ms';
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
