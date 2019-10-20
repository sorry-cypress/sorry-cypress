import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  /** 
 * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the
   * `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO
   * 8601 standard for representation of dates and times using the Gregorian calendar.
 **/
  DateTime: any,
  /** The `Upload` scalar type represents a file upload. */
  Upload: any,
};


export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

export type Commit = {
   __typename?: 'Commit',
  sha?: Maybe<Scalars['String']>,
  branch?: Maybe<Scalars['String']>,
  authorName?: Maybe<Scalars['String']>,
  authorEmail?: Maybe<Scalars['String']>,
  message?: Maybe<Scalars['String']>,
  remoteOrigin?: Maybe<Scalars['String']>,
};


export type FullRunSpec = {
   __typename?: 'FullRunSpec',
  spec: Scalars['String'],
  instanceId: Scalars['String'],
  claimed: Scalars['Boolean'],
  results?: Maybe<InstanceResults>,
};

export type Instance = {
   __typename?: 'Instance',
  runId: Scalars['ID'],
  run: PartialRun,
  spec: Scalars['String'],
  instanceId: Scalars['ID'],
  results: InstanceResults,
};

export type InstanceResults = {
   __typename?: 'InstanceResults',
  stats: InstanceStats,
  tests: Array<InstanceTest>,
  error?: Maybe<Scalars['String']>,
  stdout?: Maybe<Scalars['String']>,
  screenshots: Array<InstanceScreeshot>,
  reporterStats?: Maybe<ReporterStats>,
};

export type InstanceScreeshot = {
   __typename?: 'InstanceScreeshot',
  screenshotId: Scalars['String'],
  name?: Maybe<Scalars['String']>,
  testId: Scalars['String'],
  takenAt: Scalars['String'],
  height: Scalars['Int'],
  width: Scalars['Int'],
  screenshotURL?: Maybe<Scalars['String']>,
};

export type InstanceStats = {
   __typename?: 'InstanceStats',
  suites?: Maybe<Scalars['Int']>,
  tests?: Maybe<Scalars['Int']>,
  passes?: Maybe<Scalars['Int']>,
  pending?: Maybe<Scalars['Int']>,
  skipped?: Maybe<Scalars['Int']>,
  failures?: Maybe<Scalars['Int']>,
  wallClockStartedAt?: Maybe<Scalars['String']>,
  wallClockEndedAt?: Maybe<Scalars['String']>,
  wallClockDuration?: Maybe<Scalars['Int']>,
};

export type InstanceTest = {
   __typename?: 'InstanceTest',
  testId: Scalars['String'],
  title?: Maybe<Array<Maybe<Scalars['String']>>>,
  state?: Maybe<Scalars['String']>,
  body?: Maybe<Scalars['String']>,
  stack?: Maybe<Scalars['String']>,
  error?: Maybe<Scalars['String']>,
  wallClockStartedAt?: Maybe<Scalars['String']>,
  wallClockDuration?: Maybe<Scalars['Int']>,
};

export enum OrderingOptions {
  Desc = 'DESC',
  Asc = 'ASC'
}

export type PartialRun = {
   __typename?: 'PartialRun',
  runId: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  meta?: Maybe<RunMeta>,
  specs: Array<Maybe<RunSpec>>,
};

export type Query = {
   __typename?: 'Query',
  runs: Array<Maybe<Run>>,
  runFeed: RunFeed,
  run?: Maybe<Run>,
  instance?: Maybe<Instance>,
};


export type QueryRunsArgs = {
  orderDirection?: Maybe<OrderingOptions>,
  cursor?: Maybe<Scalars['String']>
};


export type QueryRunFeedArgs = {
  cursor?: Maybe<Scalars['String']>
};


export type QueryRunArgs = {
  id: Scalars['ID']
};


export type QueryInstanceArgs = {
  id: Scalars['ID']
};

export type ReporterStats = {
   __typename?: 'ReporterStats',
  suites?: Maybe<Scalars['Int']>,
  tests?: Maybe<Scalars['Int']>,
  passes?: Maybe<Scalars['Int']>,
  pending?: Maybe<Scalars['Int']>,
  failures?: Maybe<Scalars['Int']>,
  start?: Maybe<Scalars['String']>,
  end?: Maybe<Scalars['String']>,
  duration?: Maybe<Scalars['Int']>,
};

export type Run = {
   __typename?: 'Run',
  runId: Scalars['ID'],
  createdAt: Scalars['DateTime'],
  meta?: Maybe<RunMeta>,
  specs: Array<Maybe<FullRunSpec>>,
};

export type RunFeed = {
   __typename?: 'RunFeed',
  cursor: Scalars['String'],
  hasMore: Scalars['Boolean'],
  runs: Array<Run>,
};

export type RunMeta = {
   __typename?: 'RunMeta',
  groupId?: Maybe<Scalars['String']>,
  ciBuildId?: Maybe<Scalars['String']>,
  projectId?: Maybe<Scalars['String']>,
  commit?: Maybe<Commit>,
};

export type RunSpec = {
   __typename?: 'RunSpec',
  spec: Scalars['String'],
  instanceId: Scalars['String'],
  claimed: Scalars['Boolean'],
};


export type GetInstanceQueryVariables = {
  instanceId: Scalars['ID']
};


export type GetInstanceQuery = (
  { __typename?: 'Query' }
  & { instance: Maybe<(
    { __typename?: 'Instance' }
    & Pick<Instance, 'instanceId' | 'runId' | 'spec'>
    & { run: (
      { __typename?: 'PartialRun' }
      & { meta: Maybe<(
        { __typename?: 'RunMeta' }
        & Pick<RunMeta, 'ciBuildId'>
        & { commit: Maybe<(
          { __typename?: 'Commit' }
          & Pick<Commit, 'sha' | 'branch' | 'authorName' | 'authorEmail' | 'remoteOrigin' | 'message'>
        )> }
      )> }
    ), results: (
      { __typename?: 'InstanceResults' }
      & { stats: (
        { __typename?: 'InstanceStats' }
        & Pick<InstanceStats, 'suites' | 'tests' | 'passes' | 'pending' | 'skipped' | 'failures' | 'wallClockDuration'>
      ), tests: Array<(
        { __typename?: 'InstanceTest' }
        & Pick<InstanceTest, 'testId' | 'wallClockDuration' | 'state' | 'error' | 'title'>
      )>, screenshots: Array<(
        { __typename?: 'InstanceScreeshot' }
        & Pick<InstanceScreeshot, 'testId' | 'screenshotId' | 'height' | 'width' | 'screenshotURL'>
      )> }
    ) }
  )> }
);

export type GetRunQueryVariables = {
  runId: Scalars['ID']
};


export type GetRunQuery = (
  { __typename?: 'Query' }
  & { run: Maybe<(
    { __typename?: 'Run' }
    & Pick<Run, 'runId'>
    & { meta: Maybe<(
      { __typename?: 'RunMeta' }
      & Pick<RunMeta, 'ciBuildId' | 'projectId'>
      & { commit: Maybe<(
        { __typename?: 'Commit' }
        & Pick<Commit, 'branch' | 'remoteOrigin' | 'message' | 'authorEmail' | 'authorName'>
      )> }
    )>, specs: Array<Maybe<(
      { __typename?: 'FullRunSpec' }
      & Pick<FullRunSpec, 'spec' | 'instanceId' | 'claimed'>
      & { results: Maybe<(
        { __typename?: 'InstanceResults' }
        & { tests: Array<(
          { __typename?: 'InstanceTest' }
          & Pick<InstanceTest, 'title' | 'state'>
        )>, stats: (
          { __typename?: 'InstanceStats' }
          & Pick<InstanceStats, 'tests' | 'pending' | 'passes' | 'failures' | 'skipped' | 'suites'>
        ) }
      )> }
    )>> }
  )> }
);

export type GetRunsFeedQueryVariables = {
  cursor?: Maybe<Scalars['String']>
};


export type GetRunsFeedQuery = (
  { __typename?: 'Query' }
  & { runFeed: (
    { __typename?: 'RunFeed' }
    & Pick<RunFeed, 'cursor' | 'hasMore'>
    & { runs: Array<(
      { __typename?: 'Run' }
      & Pick<Run, 'runId' | 'createdAt'>
      & { meta: Maybe<(
        { __typename?: 'RunMeta' }
        & Pick<RunMeta, 'ciBuildId' | 'projectId'>
        & { commit: Maybe<(
          { __typename?: 'Commit' }
          & Pick<Commit, 'branch' | 'remoteOrigin' | 'message' | 'authorEmail' | 'authorName'>
        )> }
      )>, specs: Array<Maybe<(
        { __typename?: 'FullRunSpec' }
        & Pick<FullRunSpec, 'spec' | 'instanceId' | 'claimed'>
        & { results: Maybe<(
          { __typename?: 'InstanceResults' }
          & { tests: Array<(
            { __typename?: 'InstanceTest' }
            & Pick<InstanceTest, 'title' | 'state'>
          )>, stats: (
            { __typename?: 'InstanceStats' }
            & Pick<InstanceStats, 'tests' | 'pending' | 'passes' | 'failures' | 'skipped' | 'suites'>
          ) }
        )> }
      )>> }
    )> }
  ) }
);


export const GetInstanceDocument = gql`
    query getInstance($instanceId: ID!) {
  instance(id: $instanceId) {
    instanceId
    runId
    spec
    run {
      meta {
        ciBuildId
        commit {
          sha
          branch
          authorName
          authorEmail
          remoteOrigin
          message
        }
      }
    }
    results {
      stats {
        suites
        tests
        passes
        pending
        skipped
        failures
        wallClockDuration
      }
      tests {
        testId
        wallClockDuration
        state
        error
        title
      }
      screenshots {
        testId
        screenshotId
        height
        width
        screenshotURL
      }
    }
  }
}
    `;

/**
 * __useGetInstanceQuery__
 *
 * To run a query within a React component, call `useGetInstanceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInstanceQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInstanceQuery({
 *   variables: {
 *      instanceId: // value for 'instanceId'
 *   },
 * });
 */
export function useGetInstanceQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetInstanceQuery, GetInstanceQueryVariables>) {
        return ApolloReactHooks.useQuery<GetInstanceQuery, GetInstanceQueryVariables>(GetInstanceDocument, baseOptions);
      }
export function useGetInstanceLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetInstanceQuery, GetInstanceQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetInstanceQuery, GetInstanceQueryVariables>(GetInstanceDocument, baseOptions);
        }
export type GetInstanceQueryHookResult = ReturnType<typeof useGetInstanceQuery>;
export type GetInstanceLazyQueryHookResult = ReturnType<typeof useGetInstanceLazyQuery>;
export type GetInstanceQueryResult = ApolloReactCommon.QueryResult<GetInstanceQuery, GetInstanceQueryVariables>;
export const GetRunDocument = gql`
    query getRun($runId: ID!) {
  run(id: $runId) {
    runId
    meta {
      ciBuildId
      projectId
      commit {
        branch
        remoteOrigin
        message
        authorEmail
        authorName
      }
    }
    specs {
      spec
      instanceId
      claimed
      results {
        tests {
          title
          state
        }
        stats {
          tests
          pending
          passes
          failures
          skipped
          suites
        }
      }
    }
  }
}
    `;

/**
 * __useGetRunQuery__
 *
 * To run a query within a React component, call `useGetRunQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRunQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRunQuery({
 *   variables: {
 *      runId: // value for 'runId'
 *   },
 * });
 */
export function useGetRunQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetRunQuery, GetRunQueryVariables>) {
        return ApolloReactHooks.useQuery<GetRunQuery, GetRunQueryVariables>(GetRunDocument, baseOptions);
      }
export function useGetRunLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRunQuery, GetRunQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetRunQuery, GetRunQueryVariables>(GetRunDocument, baseOptions);
        }
export type GetRunQueryHookResult = ReturnType<typeof useGetRunQuery>;
export type GetRunLazyQueryHookResult = ReturnType<typeof useGetRunLazyQuery>;
export type GetRunQueryResult = ApolloReactCommon.QueryResult<GetRunQuery, GetRunQueryVariables>;
export const GetRunsFeedDocument = gql`
    query getRunsFeed($cursor: String) {
  runFeed(cursor: $cursor) {
    cursor
    hasMore
    runs {
      runId
      createdAt
      meta {
        ciBuildId
        projectId
        commit {
          branch
          remoteOrigin
          message
          authorEmail
          authorName
        }
      }
      specs {
        spec
        instanceId
        claimed
        results {
          tests {
            title
            state
          }
          stats {
            tests
            pending
            passes
            failures
            skipped
            suites
          }
        }
      }
    }
  }
}
    `;

/**
 * __useGetRunsFeedQuery__
 *
 * To run a query within a React component, call `useGetRunsFeedQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRunsFeedQuery` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRunsFeedQuery({
 *   variables: {
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useGetRunsFeedQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetRunsFeedQuery, GetRunsFeedQueryVariables>) {
        return ApolloReactHooks.useQuery<GetRunsFeedQuery, GetRunsFeedQueryVariables>(GetRunsFeedDocument, baseOptions);
      }
export function useGetRunsFeedLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRunsFeedQuery, GetRunsFeedQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetRunsFeedQuery, GetRunsFeedQueryVariables>(GetRunsFeedDocument, baseOptions);
        }
export type GetRunsFeedQueryHookResult = ReturnType<typeof useGetRunsFeedQuery>;
export type GetRunsFeedLazyQueryHookResult = ReturnType<typeof useGetRunsFeedLazyQuery>;
export type GetRunsFeedQueryResult = ApolloReactCommon.QueryResult<GetRunsFeedQuery, GetRunsFeedQueryVariables>;