import { ApolloError } from '@apollo/client';
import {
  GetRunsFeedQuery,
  useGetRunsFeedQuery,
} from '@sorry-cypress/dashboard/generated/graphql';

interface UseGetCiBuildId {
  projectId: string;
  ciBuildId: string;
}
export const useGetCiBuildId = ({
  projectId,
  ciBuildId,
}: UseGetCiBuildId): [
  GetRunsFeedQuery['runFeed'] | undefined,
  boolean,
  ApolloError | undefined
] => {
  const { loading, error, data } = useGetRunsFeedQuery({
    variables: {
      filters: [
        {
          key: 'meta.ciBuildId',
          like: null,
          value: ciBuildId,
        },
        {
          key: 'meta.projectId',
          like: null,
          value: projectId,
        },
      ],
      cursor: '',
    },
  });

  return [data?.runFeed, loading, error];
};
