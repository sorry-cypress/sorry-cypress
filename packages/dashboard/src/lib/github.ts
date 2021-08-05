export const getGithubCommitURL = (repo: string, sha: string) =>
    handleSshURL(repo.replace(/.git$/, '') + `/commit/${sha}`);

export const getGithubBranchURL = (repo: string, branch: string) =>
    handleSshURL(repo.replace(/.git$/, '') + `/tree/${branch}`);

export const handleSshURL = (sshUrl: string) =>
    sshUrl.replace(/git@([\w.]+):(.+)/, 'https://$1/$2');
