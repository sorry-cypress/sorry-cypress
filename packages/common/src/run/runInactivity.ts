export const isRunPendingInactivityTimeout = (
  _specs: Array<{ claimedAt: string | null } & { results: any }>
) => {
  const claimed = _specs.filter((s) => !!s.claimedAt);
  const reported = _specs.filter((s) => !!s.results);
  return claimed.length === reported.length;
};
