import {
  Code,
  LinearScale,
  PersonOutline,
  PlaceOutlined,
} from '@mui/icons-material';
import { Grid, Link, Tooltip, Typography } from '@mui/material';
import { Commit as CommitDef } from '@sorry-cypress/dashboard/generated/graphql';
import {
  getGithubBranchURL,
  getGithubCommitURL,
  handleSshURL,
} from '@sorry-cypress/dashboard/lib/github';
import React, { FunctionComponent } from 'react';
import { CommitMessage } from '../commitMessage';

export const Commit: CommitComponent = (props) => {
  const { commit, noLinks, brief = false } = props;
  if (!commit || !commit.sha) {
    return null;
  }

  return (
    <Grid container>
      {!brief && commit.remoteOrigin && (
        <Grid item container alignItems="flex-start" mb={0.5}>
          <Grid item mt={0.4} mr={1}>
            <Tooltip title="Origin">
              <PlaceOutlined fontSize="small" />
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Origin">
              <Typography component="p" variant="subtitle1">
                {!noLinks && (
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={handleSshURL(commit.remoteOrigin)}
                    underline="hover"
                  >
                    Origin
                  </Link>
                )}
                {noLinks && commit.remoteOrigin}
              </Typography>
            </Tooltip>
          </Grid>
        </Grid>
      )}
      {commit.branch && (
        <Grid item container alignItems="flex-start" mb={0.5}>
          <Grid item mt={0.4} mr={1}>
            <Tooltip title="Branch">
              <LinearScale fontSize="small" />
            </Tooltip>
          </Grid>
          <Grid item>
            <Tooltip title="Branch">
              <Typography component="p" variant="subtitle1">
                {!noLinks && commit.remoteOrigin && commit.branch && (
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={getGithubBranchURL(
                      commit.remoteOrigin,
                      commit.branch
                    )}
                    underline="hover"
                  >
                    {commit.branch}
                  </Link>
                )}
                {(noLinks || !commit.remoteOrigin) && commit.branch}
              </Typography>
            </Tooltip>
          </Grid>
        </Grid>
      )}
      <Grid item container alignItems="flex-start" mb={0.5}>
        <Grid item mt={0.4} mr={1}>
          <Tooltip title="Author of latest commit">
            <PersonOutline fontSize="small" />
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip
            title={
              <>
                Author of latest commit{' '}
                {commit.authorName && commit.authorEmail && (
                  <Typography component="span" variant="caption">
                    {commit.authorEmail}
                  </Typography>
                )}
              </>
            }
          >
            <Typography
              component={!noLinks && commit.authorEmail ? Link : 'p'}
              underline="hover"
              href={`mailto:${commit.authorEmail}`}
              variant="subtitle1"
            >
              {commit.authorName || commit.authorEmail}
            </Typography>
          </Tooltip>
        </Grid>
      </Grid>
      <Grid item container alignItems="flex-start">
        <Grid item mt={0.4} mr={1}>
          <Tooltip title="Message of latest commit">
            <Code fontSize="small" />
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip title="Message of latest commit">
            <Typography component="p" variant="subtitle1">
              {!noLinks && commit.remoteOrigin && (
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={getGithubCommitURL(commit.remoteOrigin, commit.sha)}
                  underline="hover"
                >
                  <CommitMessage brief={brief} message={commit.message} />
                </Link>
              )}
              {(noLinks || !commit.remoteOrigin) && (
                <CommitMessage brief={brief} message={commit.message} />
              )}
            </Typography>
          </Tooltip>
        </Grid>
      </Grid>
    </Grid>
  );
};

type CommitProps = {
  commit: CommitDef | null | undefined;
  brief?: boolean;
  noLinks?: boolean;
};
type CommitComponent = FunctionComponent<CommitProps>;
