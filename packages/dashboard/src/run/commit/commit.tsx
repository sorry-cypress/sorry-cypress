import { Commit as CommitDef } from '@sorry-cypress/dashboard/generated/graphql';
import {
  getGithubBranchURL,
  getGithubCommitURL,
  handleSshURL,
} from '@sorry-cypress/dashboard/lib/github';
import React from 'react';

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
              href={handleSshURL(commit.remoteOrigin)}
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
