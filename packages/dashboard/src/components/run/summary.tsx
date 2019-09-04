import React from 'react';
import { Link } from 'react-router-dom';
import { SpecSummary } from '../spec/summary';

export function RunSummary({ run }) {
  const { meta, runId, specs } = run;
  const { commit } = meta;
  return (
    <div>
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
        <strong>Commit details: </strong>
        {commit.remoteOrigin} ({commit.branch}) by {commit.authorName} (
        {commit.authorEmail})
      </div>

      <ul>
        {specs.map(spec => (
          <li key={spec.instanceId}>
            <SpecSummary spec={spec} />
          </li>
        ))}
      </ul>
    </div>
  );
}
