import React from 'react';
import { getGithubCommitURL, getGithubBranchURL } from '../../lib/github';
import { Commit as CommitDef } from '../../generated/graphql';

type CommitProps = {
  commit: CommitDef | null | undefined;
};
export const Commit: React.FunctionComponent<CommitProps> = ({
  commit,
}: CommitProps) => {
  if (!commit) {
    return null;
  }
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
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={commit.remoteOrigin}
            >
              {commit.remoteOrigin}
            </a>
          )}
        </li>
        <li>
          Commit:{' '}
          {commit.remoteOrigin && (
            <a
              target="_blank"
              rel="noopener noreferrer"
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
              rel="noopener noreferrer"
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
