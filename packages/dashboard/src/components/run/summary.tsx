import React from 'react';
import { Link } from 'react-router-dom';
import { getRunTestsOverall } from '../../lib/run';
import { Run } from '../../generated/graphql';
import { Paper } from 'bold-ui';

export function RunSummary({ run }: { run: Run }) {
  const { meta, runId, specs } = run;
  const { commit } = meta;
  const overalll = getRunTestsOverall(run);
  return (
    <Paper style={{ padding: 12, margin: '12px 0' }}>
      <div>
        <span>
          <strong>Build: </strong>
          <Link to={`/run/${runId}`}>{meta.ciBuildId}</Link>
        </span>
      </div>

      <div>
        <span>
          <strong>ProjectId: </strong>
          {meta.projectId}
        </span>
      </div>

      <div>
        <span>
          <strong>Overall: </strong>
          {specs.length}
        </span>{' '}
        <span>
          <strong>Claimed: </strong>
          {specs.filter(s => s.claimed).length}
        </span>
      </div>

      <div>
        <strong>Commit details:</strong> {commit.remoteOrigin} ({commit.branch})
        by {commit.authorName} ({commit.authorEmail})
      </div>

      <div>
        <strong>Test details:</strong>
        <ul>
          <li>Tests: {overalll.tests}</li>
          <li>Failures: {overalll.failures}</li>
          <li>Passes: {overalll.passes}</li>
          <li>Pending: {overalll.pending}</li>
          <li>Skipped: {overalll.skipped}</li>
        </ul>
      </div>
    </Paper>
  );
}
