export const getBitbucketCloudCommitURL = (repo: string, sha: string) =>
  handleBitbucketCloudSshURL(repo + `/commits/${sha}`);

export const getBitbucketCloudBranchURL = (repo: string, branch: string) =>
  handleBitbucketCloudSshURL(
    repo + `/pull-requests/${branch.replace(/PR-/, '')}`
  );

export const handleBitbucketCloudSshURL = (sshUrl: string) =>
  sshUrl.replace(/git@([\w.]+):(.+).git/, 'https://$1/$2');
