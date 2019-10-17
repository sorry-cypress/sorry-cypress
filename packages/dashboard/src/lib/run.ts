export const getRunTestsOverall = run => {
  return run.specs.reduce(
    (agg, spec) => {
      if (!spec.results) {
        return agg;
      }

      return {
        tests: agg.tests + spec.results.stats.tests,
        failures: agg.failures + spec.results.stats.failures,
        passes: agg.passes + spec.results.stats.passes,
        pending: agg.pending + spec.results.stats.pending,
        skipped: agg.skipped + spec.results.stats.skipped
      };
    },
    { failures: 0, passes: 0, skipped: 0, tests: 0, pending: 0 }
  );
};
