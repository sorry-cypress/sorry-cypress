import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type Commit = {
   __typename?: 'Commit';
  sha?: Maybe<Scalars['String']>;
  branch?: Maybe<Scalars['String']>;
  authorName?: Maybe<Scalars['String']>;
  authorEmail?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  remoteOrigin?: Maybe<Scalars['String']>;
};

export type CypressConfig = {
   __typename?: 'CypressConfig';
  video: Scalars['Boolean'];
  videoUploadOnPasses: Scalars['Boolean'];
};


export type DeleteProjectResponse = {
   __typename?: 'DeleteProjectResponse';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  projectIds: Array<Maybe<Scalars['ID']>>;
};

export type DeleteRunResponse = {
   __typename?: 'DeleteRunResponse';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  runIds: Array<Maybe<Scalars['ID']>>;
};

export type Filters = {
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
};

export type FullRunSpec = {
   __typename?: 'FullRunSpec';
  spec: Scalars['String'];
  instanceId: Scalars['String'];
  claimed: Scalars['Boolean'];
  claimedAt?: Maybe<Scalars['String']>;
  results?: Maybe<InstanceResults>;
};

export type Instance = {
   __typename?: 'Instance';
  runId: Scalars['ID'];
  run: PartialRun;
  spec: Scalars['String'];
  instanceId: Scalars['ID'];
  results?: Maybe<InstanceResults>;
};

export type InstanceResults = {
   __typename?: 'InstanceResults';
  stats: InstanceStats;
  tests?: Maybe<Array<Maybe<InstanceTest>>>;
  error?: Maybe<Scalars['String']>;
  stdout?: Maybe<Scalars['String']>;
  screenshots: Array<InstanceScreeshot>;
  cypressConfig?: Maybe<CypressConfig>;
  reporterStats?: Maybe<ReporterStats>;
  videoUrl?: Maybe<Scalars['String']>;
};

export type InstanceScreeshot = {
   __typename?: 'InstanceScreeshot';
  screenshotId: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  testId: Scalars['String'];
  takenAt: Scalars['String'];
  height: Scalars['Int'];
  width: Scalars['Int'];
  screenshotURL?: Maybe<Scalars['String']>;
};

export type InstanceStats = {
   __typename?: 'InstanceStats';
  suites?: Maybe<Scalars['Int']>;
  tests?: Maybe<Scalars['Int']>;
  passes?: Maybe<Scalars['Int']>;
  pending?: Maybe<Scalars['Int']>;
  skipped?: Maybe<Scalars['Int']>;
  failures?: Maybe<Scalars['Int']>;
  wallClockStartedAt?: Maybe<Scalars['String']>;
  wallClockEndedAt?: Maybe<Scalars['String']>;
  wallClockDuration?: Maybe<Scalars['Int']>;
};

export type InstanceTest = {
   __typename?: 'InstanceTest';
  testId: Scalars['String'];
  title?: Maybe<Array<Maybe<Scalars['String']>>>;
  state?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['String']>;
  stack?: Maybe<Scalars['String']>;
  error?: Maybe<Scalars['String']>;
  wallClockStartedAt?: Maybe<Scalars['String']>;
  wallClockDuration?: Maybe<Scalars['Int']>;
};

export type Mutation = {
   __typename?: 'Mutation';
  deleteRun: DeleteRunResponse;
  deleteRuns: DeleteRunResponse;
  deleteRunsInDateRange: DeleteRunResponse;
  deleteProject: DeleteProjectResponse;
  createProject: Project;
  updateProject: Project;
};


export type MutationDeleteRunArgs = {
  runId: Scalars['ID'];
};


export type MutationDeleteRunsArgs = {
  runIds: Array<Maybe<Scalars['ID']>>;
};


export type MutationDeleteRunsInDateRangeArgs = {
  startDate: Scalars['DateTime'];
  endDate: Scalars['DateTime'];
};


export type MutationDeleteProjectArgs = {
  projectId: Scalars['ID'];
};


export type MutationCreateProjectArgs = {
  project?: Maybe<ProjectInput>;
};


export type MutationUpdateProjectArgs = {
  project?: Maybe<ProjectInput>;
};

export enum OrderingOptions {
  Desc = 'DESC',
  Asc = 'ASC'
}

export type PartialRun = {
   __typename?: 'PartialRun';
  runId: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  meta?: Maybe<RunMeta>;
  specs: Array<Maybe<RunSpec>>;
};

export type Project = {
   __typename?: 'Project';
  projectId: Scalars['String'];
};

export type ProjectInput = {
  projectId: Scalars['String'];
};

export type Query = {
   __typename?: 'Query';
  projects: Array<Maybe<Project>>;
  project?: Maybe<Project>;
  runs: Array<Maybe<Run>>;
  runFeed: RunFeed;
  run?: Maybe<Run>;
  instance?: Maybe<Instance>;
};


export type QueryProjectsArgs = {
  orderDirection?: Maybe<OrderingOptions>;
  filters?: Maybe<Array<Maybe<Filters>>>;
};


export type QueryProjectArgs = {
  id: Scalars['ID'];
};


export type QueryRunsArgs = {
  orderDirection?: Maybe<OrderingOptions>;
  cursor?: Maybe<Scalars['String']>;
  filters?: Maybe<Array<Maybe<Filters>>>;
};


export type QueryRunFeedArgs = {
  cursor?: Maybe<Scalars['String']>;
  filters?: Maybe<Array<Maybe<Filters>>>;
};


export type QueryRunArgs = {
  id: Scalars['ID'];
};


export type QueryInstanceArgs = {
  id: Scalars['ID'];
};

export type ReporterStats = {
   __typename?: 'ReporterStats';
  suites?: Maybe<Scalars['Int']>;
  tests?: Maybe<Scalars['Int']>;
  passes?: Maybe<Scalars['Int']>;
  pending?: Maybe<Scalars['Int']>;
  failures?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['String']>;
  end?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['Int']>;
};

export type Run = {
   __typename?: 'Run';
  runId: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  meta?: Maybe<RunMeta>;
  specs: Array<Maybe<FullRunSpec>>;
};

export type RunFeed = {
   __typename?: 'RunFeed';
  cursor: Scalars['String'];
  hasMore: Scalars['Boolean'];
  runs: Array<Run>;
};

export type RunMeta = {
   __typename?: 'RunMeta';
  groupId?: Maybe<Scalars['String']>;
  ciBuildId?: Maybe<Scalars['String']>;
  projectId?: Maybe<Scalars['String']>;
  commit?: Maybe<Commit>;
};

export type RunSpec = {
   __typename?: 'RunSpec';
  spec: Scalars['String'];
  instanceId: Scalars['String'];
  claimed: Scalars['Boolean'];
  claimedAt?: Maybe<Scalars['String']>;
};

export type CreateProjectMutationVariables = {
  project?: Maybe<ProjectInput>;
};


export type CreateProjectMutation = (
  { __typename?: 'Mutation' }
  & { createProject: (
    { __typename?: 'Project' }
    & Pick<Project, 'projectId'>
  ) }
);

export type DeleteProjectMutationVariables = {
  projectId: Scalars['ID'];
};


export type DeleteProjectMutation = (
  { __typename?: 'Mutation' }
  & { deleteProject: (
    { __typename?: 'DeleteProjectResponse' }
    & Pick<DeleteProjectResponse, 'success' | 'message' | 'projectIds'>
  ) }
);

export type DeleteRunMutationVariables = {
  runId: Scalars['ID'];
};


export type DeleteRunMutation = (
  { __typename?: 'Mutation' }
  & { deleteRun: (
    { __typename?: 'DeleteRunResponse' }
    & Pick<DeleteRunResponse, 'success' | 'message' | 'runIds'>
  ) }
);

export type GetInstanceQueryVariables = {
  instanceId: Scalars['ID'];
};


export type GetInstanceQuery = (
  { __typename?: 'Query' }
  & { instance?: Maybe<(
    { __typename?: 'Instance' }
    & Pick<Instance, 'instanceId' | 'runId' | 'spec'>
    & { run: (
      { __typename?: 'PartialRun' }
      & { meta?: Maybe<(
        { __typename?: 'RunMeta' }
        & Pick<RunMeta, 'ciBuildId' | 'projectId'>
        & { commit?: Maybe<(
          { __typename?: 'Commit' }
          & Pick<Commit, 'sha' | 'branch' | 'authorName' | 'authorEmail' | 'remoteOrigin' | 'message'>
        )> }
      )> }
    ), results?: Maybe<(
      { __typename?: 'InstanceResults' }
      & Pick<InstanceResults, 'videoUrl'>
      & { stats: (
        { __typename?: 'InstanceStats' }
        & Pick<InstanceStats, 'suites' | 'tests' | 'passes' | 'pending' | 'skipped' | 'failures' | 'wallClockDuration' | 'wallClockStartedAt' | 'wallClockEndedAt'>
      ), tests?: Maybe<Array<Maybe<(
        { __typename?: 'InstanceTest' }
        & Pick<InstanceTest, 'testId' | 'wallClockDuration' | 'wallClockStartedAt' | 'state' | 'error' | 'stack' | 'title'>
      )>>>, screenshots: Array<(
        { __typename?: 'InstanceScreeshot' }
        & Pick<InstanceScreeshot, 'testId' | 'screenshotId' | 'height' | 'width' | 'screenshotURL'>
      )>, cypressConfig?: Maybe<(
        { __typename?: 'CypressConfig' }
        & Pick<CypressConfig, 'video' | 'videoUploadOnPasses'>
      )> }
    )> }
  )> }
);

export type GetProjectQueryVariables = {
  projectId: Scalars['ID'];
};


export type GetProjectQuery = (
  { __typename?: 'Query' }
  & { project?: Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'projectId'>
  )> }
);

export type GetProjectsQueryVariables = {
  orderDirection?: Maybe<OrderingOptions>;
  filters?: Maybe<Array<Maybe<Filters>>>;
};


export type GetProjectsQuery = (
  { __typename?: 'Query' }
  & { projects: Array<Maybe<(
    { __typename?: 'Project' }
    & Pick<Project, 'projectId'>
  )>> }
);

export type GetRunQueryVariables = {
  runId: Scalars['ID'];
};


export type GetRunQuery = (
  { __typename?: 'Query' }
  & { run?: Maybe<(
    { __typename?: 'Run' }
    & Pick<Run, 'runId' | 'createdAt'>
    & { meta?: Maybe<(
      { __typename?: 'RunMeta' }
      & Pick<RunMeta, 'ciBuildId' | 'projectId'>
      & { commit?: Maybe<(
        { __typename?: 'Commit' }
        & Pick<Commit, 'sha' | 'branch' | 'remoteOrigin' | 'message' | 'authorEmail' | 'authorName'>
      )> }
    )>, specs: Array<Maybe<(
      { __typename?: 'FullRunSpec' }
      & Pick<FullRunSpec, 'spec' | 'instanceId' | 'claimed' | 'claimedAt'>
      & { results?: Maybe<(
        { __typename?: 'InstanceResults' }
        & Pick<InstanceResults, 'videoUrl'>
        & { cypressConfig?: Maybe<(
          { __typename?: 'CypressConfig' }
          & Pick<CypressConfig, 'video' | 'videoUploadOnPasses'>
        )>, tests?: Maybe<Array<Maybe<(
          { __typename?: 'InstanceTest' }
          & Pick<InstanceTest, 'title' | 'state' | 'wallClockDuration' | 'wallClockStartedAt'>
        )>>>, stats: (
          { __typename?: 'InstanceStats' }
          & Pick<InstanceStats, 'tests' | 'pending' | 'passes' | 'failures' | 'skipped' | 'suites' | 'wallClockDuration' | 'wallClockStartedAt' | 'wallClockEndedAt'>
        ) }
      )> }
    )>> }
  )> }
);

export type GetRunsByProjectIdLimitedToTimingQueryVariables = {
  orderDirection?: Maybe<OrderingOptions>;
  filters?: Maybe<Array<Maybe<Filters>>>;
};


export type GetRunsByProjectIdLimitedToTimingQuery = (
  { __typename?: 'Query' }
  & { runs: Array<Maybe<(
    { __typename?: 'Run' }
    & Pick<Run, 'runId' | 'createdAt'>
    & { meta?: Maybe<(
      { __typename?: 'RunMeta' }
      & Pick<RunMeta, 'ciBuildId' | 'projectId'>
    )>, specs: Array<Maybe<(
      { __typename?: 'FullRunSpec' }
      & Pick<FullRunSpec, 'spec'>
      & { results?: Maybe<(
        { __typename?: 'InstanceResults' }
        & { stats: (
          { __typename?: 'InstanceStats' }
          & Pick<InstanceStats, 'wallClockDuration'>
        ) }
      )> }
    )>> }
  )>> }
);

export type GetRunsFeedQueryVariables = {
  cursor?: Maybe<Scalars['String']>;
  filters?: Maybe<Array<Maybe<Filters>>>;
};


export type GetRunsFeedQuery = (
  { __typename?: 'Query' }
  & { runFeed: (
    { __typename?: 'RunFeed' }
    & Pick<RunFeed, 'cursor' | 'hasMore'>
    & { runs: Array<(
      { __typename?: 'Run' }
      & Pick<Run, 'runId' | 'createdAt'>
      & { meta?: Maybe<(
        { __typename?: 'RunMeta' }
        & Pick<RunMeta, 'ciBuildId' | 'projectId'>
        & { commit?: Maybe<(
          { __typename?: 'Commit' }
          & Pick<Commit, 'sha' | 'branch' | 'remoteOrigin' | 'message' | 'authorEmail' | 'authorName'>
        )> }
      )>, specs: Array<Maybe<(
        { __typename?: 'FullRunSpec' }
        & Pick<FullRunSpec, 'spec' | 'instanceId' | 'claimed'>
        & { results?: Maybe<(
          { __typename?: 'InstanceResults' }
          & Pick<InstanceResults, 'videoUrl'>
          & { cypressConfig?: Maybe<(
            { __typename?: 'CypressConfig' }
            & Pick<CypressConfig, 'video' | 'videoUploadOnPasses'>
          )>, tests?: Maybe<Array<Maybe<(
            { __typename?: 'InstanceTest' }
            & Pick<InstanceTest, 'title' | 'state'>
          )>>>, stats: (
            { __typename?: 'InstanceStats' }
            & Pick<InstanceStats, 'tests' | 'pending' | 'passes' | 'failures' | 'skipped' | 'suites' | 'wallClockDuration' | 'wallClockStartedAt' | 'wallClockEndedAt'>
          ) }
        )> }
      )>> }
    )> }
  ) }
);

export type UpdateProjectMutationVariables = {
  project: ProjectInput;
};


export type UpdateProjectMutation = (
  { __typename?: 'Mutation' }
  & { updateProject: (
    { __typename?: 'Project' }
    & Pick<Project, 'projectId'>
  ) }
);


export const CreateProjectDocument = gql`
    mutation createProject($project: ProjectInput) {
  createProject(project: $project) {
    projectId
  }
}
    `;
export type CreateProjectMutationFn = ApolloReactCommon.MutationFunction<CreateProjectMutation, CreateProjectMutationVariables>;

/**
 * __useCreateProjectMutation__
 *
 * To run a mutation, you first call `useCreateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProjectMutation, { data, loading, error }] = useCreateProjectMutation({
 *   variables: {
 *      project: // value for 'project'
 *   },
 * });
 */
export function useCreateProjectMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<CreateProjectMutation, CreateProjectMutationVariables>) {
        return ApolloReactHooks.useMutation<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, baseOptions);
      }
export type CreateProjectMutationHookResult = ReturnType<typeof useCreateProjectMutation>;
export type CreateProjectMutationResult = ApolloReactCommon.MutationResult<CreateProjectMutation>;
export type CreateProjectMutationOptions = ApolloReactCommon.BaseMutationOptions<CreateProjectMutation, CreateProjectMutationVariables>;
export const DeleteProjectDocument = gql`
    mutation deleteProject($projectId: ID!) {
  deleteProject(projectId: $projectId) {
    success
    message
    projectIds
  }
}
    `;
export type DeleteProjectMutationFn = ApolloReactCommon.MutationFunction<DeleteProjectMutation, DeleteProjectMutationVariables>;

/**
 * __useDeleteProjectMutation__
 *
 * To run a mutation, you first call `useDeleteProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProjectMutation, { data, loading, error }] = useDeleteProjectMutation({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useDeleteProjectMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteProjectMutation, DeleteProjectMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteProjectMutation, DeleteProjectMutationVariables>(DeleteProjectDocument, baseOptions);
      }
export type DeleteProjectMutationHookResult = ReturnType<typeof useDeleteProjectMutation>;
export type DeleteProjectMutationResult = ApolloReactCommon.MutationResult<DeleteProjectMutation>;
export type DeleteProjectMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteProjectMutation, DeleteProjectMutationVariables>;
export const DeleteRunDocument = gql`
    mutation deleteRun($runId: ID!) {
  deleteRun(runId: $runId) {
    success
    message
    runIds
  }
}
    `;
export type DeleteRunMutationFn = ApolloReactCommon.MutationFunction<DeleteRunMutation, DeleteRunMutationVariables>;

/**
 * __useDeleteRunMutation__
 *
 * To run a mutation, you first call `useDeleteRunMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteRunMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteRunMutation, { data, loading, error }] = useDeleteRunMutation({
 *   variables: {
 *      runId: // value for 'runId'
 *   },
 * });
 */
export function useDeleteRunMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<DeleteRunMutation, DeleteRunMutationVariables>) {
        return ApolloReactHooks.useMutation<DeleteRunMutation, DeleteRunMutationVariables>(DeleteRunDocument, baseOptions);
      }
export type DeleteRunMutationHookResult = ReturnType<typeof useDeleteRunMutation>;
export type DeleteRunMutationResult = ApolloReactCommon.MutationResult<DeleteRunMutation>;
export type DeleteRunMutationOptions = ApolloReactCommon.BaseMutationOptions<DeleteRunMutation, DeleteRunMutationVariables>;
export const GetInstanceDocument = gql`
    query getInstance($instanceId: ID!) {
  instance(id: $instanceId) {
    instanceId
    runId
    spec
    run {
      meta {
        ciBuildId
        projectId
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
        wallClockStartedAt
        wallClockEndedAt
      }
      tests {
        testId
        wallClockDuration
        wallClockStartedAt
        state
        error
        stack
        title
      }
      screenshots {
        testId
        screenshotId
        height
        width
        screenshotURL
      }
      cypressConfig {
        video
        videoUploadOnPasses
      }
      videoUrl
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
export const GetProjectDocument = gql`
    query getProject($projectId: ID!) {
  project(id: $projectId) {
    projectId
  }
}
    `;

/**
 * __useGetProjectQuery__
 *
 * To run a query within a React component, call `useGetProjectQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectQuery({
 *   variables: {
 *      projectId: // value for 'projectId'
 *   },
 * });
 */
export function useGetProjectQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetProjectQuery, GetProjectQueryVariables>) {
        return ApolloReactHooks.useQuery<GetProjectQuery, GetProjectQueryVariables>(GetProjectDocument, baseOptions);
      }
export function useGetProjectLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetProjectQuery, GetProjectQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetProjectQuery, GetProjectQueryVariables>(GetProjectDocument, baseOptions);
        }
export type GetProjectQueryHookResult = ReturnType<typeof useGetProjectQuery>;
export type GetProjectLazyQueryHookResult = ReturnType<typeof useGetProjectLazyQuery>;
export type GetProjectQueryResult = ApolloReactCommon.QueryResult<GetProjectQuery, GetProjectQueryVariables>;
export const GetProjectsDocument = gql`
    query getProjects($orderDirection: OrderingOptions, $filters: [Filters]) {
  projects(orderDirection: $orderDirection, filters: $filters) {
    projectId
  }
}
    `;

/**
 * __useGetProjectsQuery__
 *
 * To run a query within a React component, call `useGetProjectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProjectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProjectsQuery({
 *   variables: {
 *      orderDirection: // value for 'orderDirection'
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useGetProjectsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>) {
        return ApolloReactHooks.useQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, baseOptions);
      }
export function useGetProjectsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, baseOptions);
        }
export type GetProjectsQueryHookResult = ReturnType<typeof useGetProjectsQuery>;
export type GetProjectsLazyQueryHookResult = ReturnType<typeof useGetProjectsLazyQuery>;
export type GetProjectsQueryResult = ApolloReactCommon.QueryResult<GetProjectsQuery, GetProjectsQueryVariables>;
export const GetRunDocument = gql`
    query getRun($runId: ID!) {
  run(id: $runId) {
    runId
    createdAt
    meta {
      ciBuildId
      projectId
      commit {
        sha
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
      claimedAt
      results {
        cypressConfig {
          video
          videoUploadOnPasses
        }
        videoUrl
        tests {
          title
          state
          wallClockDuration
          wallClockStartedAt
        }
        stats {
          tests
          pending
          passes
          failures
          skipped
          suites
          wallClockDuration
          wallClockStartedAt
          wallClockEndedAt
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
export const GetRunsByProjectIdLimitedToTimingDocument = gql`
    query getRunsByProjectIdLimitedToTiming($orderDirection: OrderingOptions, $filters: [Filters]) {
  runs(orderDirection: $orderDirection, filters: $filters) {
    runId
    createdAt
    meta {
      ciBuildId
      projectId
    }
    specs {
      spec
      results {
        stats {
          wallClockDuration
        }
      }
    }
  }
}
    `;

/**
 * __useGetRunsByProjectIdLimitedToTimingQuery__
 *
 * To run a query within a React component, call `useGetRunsByProjectIdLimitedToTimingQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRunsByProjectIdLimitedToTimingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRunsByProjectIdLimitedToTimingQuery({
 *   variables: {
 *      orderDirection: // value for 'orderDirection'
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useGetRunsByProjectIdLimitedToTimingQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<GetRunsByProjectIdLimitedToTimingQuery, GetRunsByProjectIdLimitedToTimingQueryVariables>) {
        return ApolloReactHooks.useQuery<GetRunsByProjectIdLimitedToTimingQuery, GetRunsByProjectIdLimitedToTimingQueryVariables>(GetRunsByProjectIdLimitedToTimingDocument, baseOptions);
      }
export function useGetRunsByProjectIdLimitedToTimingLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<GetRunsByProjectIdLimitedToTimingQuery, GetRunsByProjectIdLimitedToTimingQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<GetRunsByProjectIdLimitedToTimingQuery, GetRunsByProjectIdLimitedToTimingQueryVariables>(GetRunsByProjectIdLimitedToTimingDocument, baseOptions);
        }
export type GetRunsByProjectIdLimitedToTimingQueryHookResult = ReturnType<typeof useGetRunsByProjectIdLimitedToTimingQuery>;
export type GetRunsByProjectIdLimitedToTimingLazyQueryHookResult = ReturnType<typeof useGetRunsByProjectIdLimitedToTimingLazyQuery>;
export type GetRunsByProjectIdLimitedToTimingQueryResult = ApolloReactCommon.QueryResult<GetRunsByProjectIdLimitedToTimingQuery, GetRunsByProjectIdLimitedToTimingQueryVariables>;
export const GetRunsFeedDocument = gql`
    query getRunsFeed($cursor: String, $filters: [Filters]) {
  runFeed(cursor: $cursor, filters: $filters) {
    cursor
    hasMore
    runs {
      runId
      createdAt
      meta {
        ciBuildId
        projectId
        commit {
          sha
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
          cypressConfig {
            video
            videoUploadOnPasses
          }
          videoUrl
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
            wallClockDuration
            wallClockStartedAt
            wallClockEndedAt
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
 *      filters: // value for 'filters'
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
export const UpdateProjectDocument = gql`
    mutation updateProject($project: ProjectInput!) {
  updateProject(project: $project) {
    projectId
  }
}
    `;
export type UpdateProjectMutationFn = ApolloReactCommon.MutationFunction<UpdateProjectMutation, UpdateProjectMutationVariables>;

/**
 * __useUpdateProjectMutation__
 *
 * To run a mutation, you first call `useUpdateProjectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProjectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProjectMutation, { data, loading, error }] = useUpdateProjectMutation({
 *   variables: {
 *      project: // value for 'project'
 *   },
 * });
 */
export function useUpdateProjectMutation(baseOptions?: ApolloReactHooks.MutationHookOptions<UpdateProjectMutation, UpdateProjectMutationVariables>) {
        return ApolloReactHooks.useMutation<UpdateProjectMutation, UpdateProjectMutationVariables>(UpdateProjectDocument, baseOptions);
      }
export type UpdateProjectMutationHookResult = ReturnType<typeof useUpdateProjectMutation>;
export type UpdateProjectMutationResult = ApolloReactCommon.MutationResult<UpdateProjectMutation>;
export type UpdateProjectMutationOptions = ApolloReactCommon.BaseMutationOptions<UpdateProjectMutation, UpdateProjectMutationVariables>;