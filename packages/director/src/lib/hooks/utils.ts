import { RunSummary } from '@sorry-cypress/common';

export function isResultSuccessful(runSummary: RunSummary) {
  // Cypress is based on Mocha framework which has a not obvious results naming:
  // Pending: tests you don't plan to run (it.skip(), for example)
  // Skipped: tests you have planned to run, but, for example, before hook was failed
  // Therefore we mark skipped tests as failed
  // See details here: https://github.com/cypress-io/cypress/issues/3092
  return !(runSummary.failures > 0 || runSummary.skipped > 0);
}
