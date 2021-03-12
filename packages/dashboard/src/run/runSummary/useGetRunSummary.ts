import { ApolloError } from '@apollo/client';
import {
  GetRunSummaryQuery,
  useGetRunSummaryQuery,
} from '@src/generated/graphql';
import { useAutoRefreshRate } from '@src/hooks';

export const useGetRunSummary = (
  runId: string
): [GetRunSummaryQuery['run'], boolean, ApolloError | undefined] => {
  const autoRefreshRate = useAutoRefreshRate();
  const { loading, error, data, stopPolling } = useGetRunSummaryQuery({
    variables: {
      runId,
    },
    pollInterval: autoRefreshRate,
  });

  if (data?.run?.completion?.completed) {
    stopPolling();
  }

  return [data?.run, loading, error];
};
