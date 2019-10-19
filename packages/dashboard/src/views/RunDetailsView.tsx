import React from 'react';
import { RunDetails } from '../components/run/details';
import { RunSummary } from '../components/run/summary';
import { useGetRunQuery } from '../generated/graphql';

export function RunDetailsView({
  match: {
    params: { id }
  }
}) {
  const { loading, error, data } = useGetRunQuery({
    variables: { runId: id }
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( </p>;
  if (!data) return <p>No data</p>;

  return (
    <>
      <RunSummary run={data.run} />
      <RunDetails run={data.run} />
    </>
  );
}
