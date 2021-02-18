import { hookEvents } from '@src/lib/hooks/hooksEnums';
import axios from 'axios';
import { getDashboardRunURL } from '@src/lib/urls';
import { BitBucketHook } from '@src/types/project.types';

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

export async function reportStatusToBitbucket({
  hook,
  reportData,
  hookEvent,
}: {
  hook: BitBucketHook;
  reportData: any;
  hookEvent: string;
}) {
  const fullStatusPostUrl = getBitbucketUrl(
    hook.url,
    reportData.run.meta.commit.sha
  );

  const data = {
    state: '',
    key: '123',
    name: hook.bitbucketBuildName || 'Sorry-Cypress-Tests',
    url: getDashboardRunURL(
      reportData?.run?.runId || reportData.instance.runId
    ),
  };

  if (hookEvent === hookEvents.RUN_START) {
    data.state = 'INPROGRESS';
  }

  if (hookEvent === hookEvents.INSTANCE_FINISH) {
    data.state = 'INPROGRESS';
  }

  if (hookEvent === hookEvents.RUN_FINISH) {
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, 5000);
    });

    data.state = 'SUCCESSFUL';
    if (reportData.currentResults.failures > 0) {
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
