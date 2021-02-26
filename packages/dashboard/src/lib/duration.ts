import prettyMs from 'pretty-ms';
export function getSecondsDuration(seconds: number) {
  return prettyMs(seconds * 1000, {
    secondsDecimalDigits: 0,
  });
}
