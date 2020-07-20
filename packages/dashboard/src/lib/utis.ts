import humanizeDuration from 'humanize-duration';
import { cloneDeep } from 'lodash';

export const miniutesAndSecondsOptions = { round: true, units: ["m","s"] };

export const shortEnglishHumanizer = humanizeDuration.humanizer({
  language: "shortEn",
  languages: {
    shortEn: {
      y: () => "y",
      mo: () => "mo",
      w: () => "w",
      d: () => "d",
      h: () => "h",
      m: () => "min",
      s: () => "sec",
      ms: () => "ms",
    },
  },
});

export function shortEnglishHumanizerWithMsIfNeeded(milliseconds:number) {
  const options = cloneDeep(miniutesAndSecondsOptions);
  if (milliseconds < 1000) {
    options.units.push('ms');
  }
  return shortEnglishHumanizer(milliseconds, options)
}
