import { addSeconds, formatDuration, intervalToDuration } from 'date-fns';

export function getSecondsDuration(seconds: number) {
  const start = new Date();
  const end = addSeconds(start, seconds);

  return formatDuration(
    intervalToDuration({
      start,
      end,
    })
  );
}
