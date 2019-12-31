import React from 'react';
import { getGithubCommitURL, getGithubBranchURL } from '../../lib/github';
import { Commit as CommitDef } from '../../generated/graphql';

export const Commit: React.FC<{ commit: CommitDef }> = ({ commit }) => {
  if (!commit.sha) {
    return null;
  }
  return (
    <div>
      <strong>Commit details</strong>
      <ul>
        <li>
          Origin:{' '}
          {commit.remoteOrigin && (
            <a target="_blank" href={commit.remoteOrigin}>
              {commit.remoteOrigin}
            </a>
          )}
        </li>
        <li>
          Commit:{' '}
          {commit.remoteOrigin && (
            <a
              target="_blank"
              href={getGithubCommitURL(commit.remoteOrigin, commit.sha)}
            >
              {commit.message}
            </a>
          )}
        </li>
        <li>
          Branch:{' '}
          {commit.remoteOrigin && commit.branch && (
            <a
              target="_blank"
              href={getGithubBranchURL(commit.remoteOrigin, commit.branch)}
            >
              {commit.branch}
            </a>
          )}
        </li>
        <li>
          Author: {commit.authorName} ({commit.authorEmail})
        </li>
      </ul>
    </div>
  );
};
