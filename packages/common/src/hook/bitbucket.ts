export const getBitbucketBuildUrl = (url: string, sha: string) => {
  const BITBUCKET_DOMAIN = 'bitbucket.org';
  const BITBUCKET_API_ENDPOINT = 'api.bitbucket.org';

  const [bitbucketProtocol, restOfBitbucketUrl] = url.split('://');
  const [
    bitBucketDomain,
    bitBucketRepo,
    bitBucketProject,
  ] = restOfBitbucketUrl.split('/');
  const bitBucketProjectStripped = bitBucketProject.replace('.git', '');
  const bitbucketEndpoint =
    bitBucketDomain === BITBUCKET_DOMAIN
      ? BITBUCKET_API_ENDPOINT
      : `${bitBucketDomain}`;
  return `${bitbucketProtocol}://${bitbucketEndpoint}/2.0/repositories/${bitBucketRepo}/${bitBucketProjectStripped}/commit/${sha}/statuses/build`;
};
