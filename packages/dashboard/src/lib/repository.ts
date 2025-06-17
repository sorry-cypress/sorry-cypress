import {
  getBitbucketCloudBranchURL,
  getBitbucketCloudCommitURL,
  handleBitbucketCloudSshURL,
} from '@sorry-cypress/dashboard/lib/bitbucketCloud';
import {
  getGithubBranchURL,
  getGithubCommitURL,
  handleGithubSshURL,
} from '@sorry-cypress/dashboard/lib/github';

export const getCommitURL = (repo: string, sha: string) =>
  repo.includes('bitbucket.org')
    ? getBitbucketCloudCommitURL(repo, sha)
    : getGithubCommitURL(repo, sha); // github is default

export const getBranchURL = (repo: string, branch: string) =>
  repo.includes('bitbucket.org')
    ? getBitbucketCloudBranchURL(repo, branch)
    : getGithubBranchURL(repo, branch); // github is default

export const handleSshURL = (sshUrl: string) =>
  sshUrl.includes('bitbucket.org')
    ? handleBitbucketCloudSshURL(sshUrl)
    : handleGithubSshURL(sshUrl); // github is default
