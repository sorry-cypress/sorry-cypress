export const isRunPendingInactivityTimeout = (
  _specs: Array<{ claimed: boolean } & { results: any }>
) => {
  const claimed = _specs.filter((s) => !!s.claimed);
  const reported = _specs.filter((s) => !!s.results);
  return claimed.length === reported.length;
};
