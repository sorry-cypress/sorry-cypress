import { GetInstanceQuery } from '@src/generated/graphql';
import {
  getInstancePath,
  getProjectPath,
  getRunPath,
  getTestPath,
  setNav,
} from '@src/lib/navigation';
import { useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';

export const useUpdateTestNav = (data: GetInstanceQuery | undefined) => {
  const { instanceId, testId } = useParams<{
    instanceId: string;
    testId: string;
  }>();
  useLayoutEffect(() => {
    if (!data?.instance) {
      return;
    }
    const test = data.instance?.results?.tests?.find(
      (t) => t?.testId === testId
    );
    if (!test) {
      return;
    }
    setNav([
      {
        label: data.instance?.run?.meta?.projectId,
        link: getProjectPath(data.instance?.run?.meta?.projectId),
      },
      {
        label: data.instance.run?.meta?.ciBuildId,
        link: getRunPath(data.instance.runId),
      },
      {
        label: data.instance.spec,
        link: getInstancePath(instanceId),
      },
      {
        label: test.title && test.title.join(' | '),
        link: getTestPath(data.instance.instanceId, testId),
      },
    ]);
  }, [data]);
};
