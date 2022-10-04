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
    <>
      {!brief && commit.remoteOrigin && (
        <Grid
          item
          container
          sm={12}
          md={6}
          lg={6}
          xl={4}
          alignItems="flex-start"
        >
          <Grid item mt={0.4} mr={1}>
            <Tooltip title="Origin">
              <PlaceOutlined fontSize="small" />
            </Tooltip>
          </Grid>
          <Grid item flex={1} zeroMinWidth>
            <Tooltip title="Origin">
              <Typography component="p" variant="subtitle1" noWrap>
                {!noLinks && (
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    href={handleSshURL(commit.remoteOrigin)}
                    underline="hover"
                  >
                    {handleSshURL(commit.remoteOrigin)}
                  </Link>
                )}
                {noLinks && commit.remoteOrigin}
              </Typography>
            </Tooltip>
          </Grid>
        </Grid>
      )}

      {commit.branch && (
        <Grid
          item
          container
          sm={12}
          md={6}
          lg={6}
          xl={4}
          alignItems="flex-start"
        >
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

      <Grid item container sm={12} md={6} lg={6} xl={4} alignItems="flex-start">
        <Grid item mt={0.4} mr={1}>
          <Tooltip title="Commit Author">
            <PersonOutline fontSize="small" />
          </Tooltip>
        </Grid>
        <Grid item>
          <Tooltip
            title={
              <>
                Commit Author{' '}
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

      <Grid item container sm={12} md={6} lg={6} xl={4} alignItems="flex-start">
        <Grid item mt={0.4} mr={1}>
          <Tooltip title="Commit Message ">
            <Code fontSize="small" />
          </Tooltip>
        </Grid>
        <Grid item flex={1}>
          <Typography component="p" variant="subtitle1">
            {!noLinks && commit.remoteOrigin && (
              <Tooltip title="Commit Message">
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={getGithubCommitURL(commit.remoteOrigin, commit.sha)}
                  underline="hover"
                >
                  <CommitMessage brief={brief} message={commit.message} />
                </Link>
              </Tooltip>
            )}
            {(noLinks || !commit.remoteOrigin) && (
              <CommitMessage brief={brief} message={commit.message} />
            )}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};

type CommitProps = {
  commit: CommitDef | null | undefined;
  brief?: boolean;
  noLinks?: boolean;
};
type CommitComponent = FunctionComponent<CommitProps>;
