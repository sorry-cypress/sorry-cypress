import { BitBucketHook, HookEvent, RunSummary } from '@sorry-cypress/common';
import { getDashboardRunURL } from '@src/lib/urls';
import axios from 'axios';

export async function reportStatusToBitbucket({
  hook,
  runId,
  runSummary,
  sha,
  hookEvent,
}: {
  hook: BitBucketHook;
  runId: string;
  sha: string;
  runSummary: RunSummary;
  hookEvent: string;
}) {
  const fullStatusPostUrl = getBitbucketUrl(hook.url, sha);

  const data = {
    state: 'INPROGRESS',
    key: sha,
    name: hook.bitbucketBuildName || 'sorry-cypress',
    url: getDashboardRunURL(runId),
  };

  if (hookEvent === HookEvent.RUN_FINISH) {
    data.state = 'SUCCESSFUL';
    if (runSummary.failures > 0) {
      data.state = 'FAILED';
    }
  }

  return (
    (data.state &&
      axios({
        method: 'post',
        url: fullStatusPostUrl,
        auth: {
          username: hook.bitbucketUsername,
          password: hook.bitbucketToken,
        },
        headers: {
          Accept: 'application/json',
        },
        data,
      }).catch((err) => {
        console.error(
          `Error: Hook post to ${fullStatusPostUrl} responded with `,
          err
        );
      })) ||
    Promise.resolve()
  );
}

const getBitbucketUrl = (url: string, sha: string) => {
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
