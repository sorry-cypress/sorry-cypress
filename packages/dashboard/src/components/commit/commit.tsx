import React from 'react';
import { getGithubCommitURL, getGithubBranchURL } from '../../lib/github';
import { Commit as CommitDef } from '../../generated/graphql';

export const Commit: React.FC<{ commit: CommitDef }> = ({ commit }) => (
  <div>
    <strong>Commit details</strong>
    <ul>
      <li>
        Origin:{' '}
        <a target="_blank" href={commit.remoteOrigin}>
          {commit.remoteOrigin}
        </a>
      </li>
      <li>
        Commit:{' '}
        <a
          target="_blank"
          href={getGithubCommitURL(commit.remoteOrigin, commit.sha)}
        >
          {commit.message}
        </a>
      </li>
      <li>
        Branch:{' '}
        <a
          target="_blank"
          href={getGithubBranchURL(commit.remoteOrigin, commit.branch)}
        >
          {commit.branch}
        </a>
      </li>
      <li>
        Author: {commit.authorName} ({commit.authorEmail})
      </li>
    </ul>
  </div>
);
