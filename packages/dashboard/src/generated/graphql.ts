import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type Query = {
  projects: Array<Project>;
  project?: Maybe<Project>;
  runs: Array<Maybe<Run>>;
  runFeed: RunFeed;
  run?: Maybe<Run>;
  instance?: Maybe<Instance>;
  specStats?: Maybe<SpecStats>;
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


export type QuerySpecStatsArgs = {
  spec: Scalars['String'];
  filters?: Maybe<Array<Maybe<Filters>>>;
};

export type Mutation = {
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

export type DeleteRunResponse = {
  success: Scalars['Boolean'];
  message: Scalars['String'];
  runIds: Array<Maybe<Scalars['ID']>>;
};

export type SpecStats = {
  spec: Scalars['String'];
  avgWallClockDuration: Scalars['Int'];
  count: Scalars['Int'];
};

export type Hook = {
  hookId?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  headers?: Maybe<Scalars['String']>;
  hookEvents?: Maybe<Array<Maybe<Scalars['String']>>>;
  hookType?: Maybe<Scalars['String']>;
  githubToken?: Maybe<Scalars['String']>;
  githubContext?: Maybe<Scalars['String']>;
};

export type Project = {
  projectId: Scalars['String'];
  hooks?: Maybe<Array<Hook>>;
  inactivityTimeoutSeconds?: Maybe<Scalars['Int']>;
};

export type HookInput = {
  hookId?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
  headers?: Maybe<Scalars['String']>;
  hookEvents?: Maybe<Array<Maybe<Scalars['String']>>>;
  hookType?: Maybe<Scalars['String']>;
  githubToken?: Maybe<Scalars['String']>;
  githubContext?: Maybe<Scalars['String']>;
};

export type ProjectInput = {
  projectId: Scalars['String'];
  inactivityTimeoutSeconds?: Maybe<Scalars['Int']>;
  hooks?: Maybe<Array<Maybe<HookInput>>>;
};

export type DeleteProjectResponse = {
  success: Scalars['Boolean'];
  message: Scalars['String'];
  projectIds: Array<Maybe<Scalars['ID']>>;
};

export type Run = {
  runId: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  meta: RunMeta;
  specs: Array<FullRunSpec>;
  inactivityTimeout?: Maybe<RunInactivityTimeout>;
};

export type RunInactivityTimeout = {
  timeoutMs: Scalars['Int'];
};

export type FullRunSpec = {
  spec: Scalars['String'];
  instanceId: Scalars['String'];
  claimed: Scalars['Boolean'];
  claimedAt?: Maybe<Scalars['String']>;
  machineId?: Maybe<Scalars['String']>;
  groupId?: Maybe<Scalars['String']>;
  results?: Maybe<InstanceResults>;
};

export type Commit = {
  sha?: Maybe<Scalars['String']>;
  branch?: Maybe<Scalars['String']>;
  authorName?: Maybe<Scalars['String']>;
  authorEmail?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  remoteOrigin?: Maybe<Scalars['String']>;
};

export type RunMeta = {
  ciBuildId: Scalars['String'];
  projectId: Scalars['String'];
  commit?: Maybe<Commit>;
};

export type RunFeed = {
  cursor: Scalars['String'];
  hasMore: Scalars['Boolean'];
  runs: Array<Run>;
};

export type Instance = {
  runId: Scalars['ID'];
  run: PartialRun;
  spec: Scalars['String'];
  instanceId: Scalars['ID'];
  results?: Maybe<InstanceResults>;
};

export type PartialRun = {
  runId: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  meta?: Maybe<RunMeta>;
  specs: Array<Maybe<RunSpec>>;
};

export type RunSpec = {
  spec: Scalars['String'];
  instanceId: Scalars['String'];
  claimed: Scalars['Boolean'];
  claimedAt?: Maybe<Scalars['String']>;
  groupId?: Maybe<Scalars['String']>;
  machineId?: Maybe<Scalars['String']>;
};

export type InstanceResults = {
  stats: InstanceStats;
  tests?: Maybe<Array<Maybe<InstanceTestUnion>>>;
  error?: Maybe<Scalars['String']>;
  stdout?: Maybe<Scalars['String']>;
  screenshots: Array<InstanceScreeshot>;
  cypressConfig?: Maybe<CypressConfig>;
  reporterStats?: Maybe<ReporterStats>;
  videoUrl?: Maybe<Scalars['String']>;
};

export type InstanceStats = {
  suites: Scalars['Int'];
  tests: Scalars['Int'];
  passes: Scalars['Int'];
  pending: Scalars['Int'];
  skipped: Scalars['Int'];
  failures: Scalars['Int'];
  wallClockStartedAt: Scalars['String'];
  wallClockEndedAt: Scalars['String'];
  wallClockDuration: Scalars['Int'];
};

export type CypressConfig = {
  video: Scalars['Boolean'];
  videoUploadOnPasses: Scalars['Boolean'];
};

export type InstanceScreeshot = {
  screenshotId: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  testId: Scalars['String'];
  takenAt: Scalars['String'];
  height: Scalars['Int'];
  width: Scalars['Int'];
  screenshotURL?: Maybe<Scalars['String']>;
};

export type ReporterStats = {
  suites?: Maybe<Scalars['Int']>;
  tests?: Maybe<Scalars['Int']>;
  passes?: Maybe<Scalars['Int']>;
  pending?: Maybe<Scalars['Int']>;
  failures?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['String']>;
  end?: Maybe<Scalars['String']>;
  duration?: Maybe<Scalars['Int']>;
};

export type InstanceTestUnion = InstanceTest | InstanceTestV5;

export type InstanceTest = {
  testId: Scalars['String'];
  title?: Maybe<Array<Maybe<Scalars['String']>>>;
  state?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['String']>;
  stack?: Maybe<Scalars['String']>;
  error?: Maybe<Scalars['String']>;
  wallClockStartedAt?: Maybe<Scalars['String']>;
  wallClockDuration?: Maybe<Scalars['Int']>;
};

export type InstanceTestV5 = {
  testId: Scalars['String'];
  title?: Maybe<Array<Maybe<Scalars['String']>>>;
  state?: Maybe<Scalars['String']>;
  body?: Maybe<Scalars['String']>;
  displayError?: Maybe<Scalars['String']>;
  attempts: Array<TestAttempt>;
};

export type TestError = {
  name: Scalars['String'];
  message: Scalars['String'];
  stack: Scalars['String'];
};

export type TestAttempt = {
  state?: Maybe<Scalars['String']>;
  error?: Maybe<TestError>;
  wallClockStartedAt?: Maybe<Scalars['String']>;
  wallClockDuration?: Maybe<Scalars['Int']>;
};


export enum OrderingOptions {
  Desc = 'DESC',
  Asc = 'ASC'
}

export type Filters = {
  key?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['String']>;
  like?: Maybe<Scalars['String']>;
};

export type GetInstanceQueryVariables = Exact<{
  instanceId: Scalars['ID'];
}>;


export type GetInstanceQuery = { instance?: Maybe<{ instanceId: string, runId: string, spec: string, run: { meta?: Maybe<{ ciBuildId: string, projectId: string, commit?: Maybe<{ sha?: Maybe<string>, branch?: Maybe<string>, authorName?: Maybe<string>, authorEmail?: Maybe<string>, remoteOrigin?: Maybe<string>, message?: Maybe<string> }> }> }, results?: Maybe<{ videoUrl?: Maybe<string>, stats: { suites: number, tests: number, passes: number, pending: number, skipped: number, failures: number, wallClockDuration: number, wallClockStartedAt: string, wallClockEndedAt: string }, tests?: Maybe<Array<Maybe<{ testId: string, title?: Maybe<Array<Maybe<string>>>, state?: Maybe<string>, wallClockDuration?: Maybe<number>, wallClockStartedAt?: Maybe<string>, error?: Maybe<string>, stack?: Maybe<string> } | { testId: string, title?: Maybe<Array<Maybe<string>>>, state?: Maybe<string>, displayError?: Maybe<string>, attempts: Array<{ state?: Maybe<string>, wallClockDuration?: Maybe<number>, wallClockStartedAt?: Maybe<string>, error?: Maybe<{ name: string, message: string, stack: string }> }> }>>>, screenshots: Array<{ testId: string, screenshotId: string, height: number, width: number, screenshotURL?: Maybe<string> }>, cypressConfig?: Maybe<{ video: boolean, videoUploadOnPasses: boolean }> }> }> };

export type CreateProjectMutationVariables = Exact<{
  project?: Maybe<ProjectInput>;
}>;


export type CreateProjectMutation = { createProject: { projectId: string, hooks?: Maybe<Array<{ hookId?: Maybe<string>, url?: Maybe<string>, headers?: Maybe<string>, hookEvents?: Maybe<Array<Maybe<string>>>, hookType?: Maybe<string>, githubContext?: Maybe<string> }>> } };

export type DeleteProjectMutationVariables = Exact<{
  projectId: Scalars['ID'];
}>;


export type DeleteProjectMutation = { deleteProject: { success: boolean, message: string, projectIds: Array<Maybe<string>> } };

export type GetProjectQueryVariables = Exact<{
  projectId: Scalars['ID'];
}>;


export type GetProjectQuery = { project?: Maybe<{ projectId: string, inactivityTimeoutSeconds?: Maybe<number>, hooks?: Maybe<Array<{ hookId?: Maybe<string>, url?: Maybe<string>, headers?: Maybe<string>, hookEvents?: Maybe<Array<Maybe<string>>>, hookType?: Maybe<string>, githubContext?: Maybe<string> }>> }> };

export type GetProjectsQueryVariables = Exact<{
  orderDirection?: Maybe<OrderingOptions>;
  filters?: Maybe<Array<Maybe<Filters>> | Maybe<Filters>>;
}>;


export type GetProjectsQuery = { projects: Array<{ projectId: string }> };

export type UpdateProjectMutationVariables = Exact<{
  project: ProjectInput;
}>;


export type UpdateProjectMutation = { updateProject: { projectId: string, hooks?: Maybe<Array<{ hookId?: Maybe<string>, url?: Maybe<string>, headers?: Maybe<string>, hookEvents?: Maybe<Array<Maybe<string>>>, hookType?: Maybe<string>, githubContext?: Maybe<string> }>> } };

export type DeleteRunMutationVariables = Exact<{
  runId: Scalars['ID'];
}>;


export type DeleteRunMutation = { deleteRun: { success: boolean, message: string, runIds: Array<Maybe<string>> } };

export type GetRunQueryVariables = Exact<{
  runId: Scalars['ID'];
}>;


export type GetRunQuery = { run?: Maybe<{ runId: string, createdAt: any, meta: { ciBuildId: string, projectId: string, commit?: Maybe<{ sha?: Maybe<string>, branch?: Maybe<string>, remoteOrigin?: Maybe<string>, message?: Maybe<string>, authorEmail?: Maybe<string>, authorName?: Maybe<string> }> }, specs: Array<{ spec: string, instanceId: string, claimed: boolean, claimedAt?: Maybe<string>, machineId?: Maybe<string>, groupId?: Maybe<string>, results?: Maybe<{ videoUrl?: Maybe<string>, cypressConfig?: Maybe<{ video: boolean, videoUploadOnPasses: boolean }>, tests?: Maybe<Array<Maybe<{ title?: Maybe<Array<Maybe<string>>>, state?: Maybe<string>, wallClockDuration?: Maybe<number>, wallClockStartedAt?: Maybe<string> } | { title?: Maybe<Array<Maybe<string>>>, state?: Maybe<string>, attempts: Array<{ state?: Maybe<string>, wallClockDuration?: Maybe<number>, wallClockStartedAt?: Maybe<string>, error?: Maybe<{ name: string, message: string, stack: string }> }> }>>>, stats: { tests: number, pending: number, passes: number, failures: number, skipped: number, suites: number, wallClockDuration: number, wallClockStartedAt: string, wallClockEndedAt: string } }> }> }> };

export type GetSpecStatsQueryVariables = Exact<{
  spec: Scalars['String'];
}>;


export type GetSpecStatsQuery = { specStats?: Maybe<{ spec: string, count: number, avgWallClockDuration: number }> };

export type RunSummaryInstanceStatsFragment = { tests: number, pending: number, passes: number, failures: number, skipped: number, suites: number, wallClockDuration: number, wallClockStartedAt: string, wallClockEndedAt: string };

export type RunSummaryMetaFragment = { ciBuildId: string, projectId: string, commit?: Maybe<{ sha?: Maybe<string>, branch?: Maybe<string>, remoteOrigin?: Maybe<string>, message?: Maybe<string>, authorEmail?: Maybe<string>, authorName?: Maybe<string> }> };

export type RunSummarySpecFragment = { claimed: boolean, results?: Maybe<{ stats: RunSummaryInstanceStatsFragment }> };

export type GetRunsFeedQueryVariables = Exact<{
  cursor?: Maybe<Scalars['String']>;
  filters?: Maybe<Array<Maybe<Filters>> | Maybe<Filters>>;
}>;


export type GetRunsFeedQuery = { runFeed: { cursor: string, hasMore: boolean, runs: Array<{ runId: string, createdAt: any, meta: RunSummaryMetaFragment, inactivityTimeout?: Maybe<{ timeoutMs: number }>, specs: Array<RunSummarySpecFragment> }> } };

export const RunSummaryMetaFragmentDoc = gql`
    fragment RunSummaryMeta on RunMeta {
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
    `;
export const RunSummaryInstanceStatsFragmentDoc = gql`
    fragment RunSummaryInstanceStats on InstanceStats {
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
    `;
export const RunSummarySpecFragmentDoc = gql`
    fragment RunSummarySpec on FullRunSpec {
  claimed
  results {
    stats {
      ...RunSummaryInstanceStats
    }
  }
}
    ${RunSummaryInstanceStatsFragmentDoc}`;
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
        ... on InstanceTest {
          testId
          title
          state
          wallClockDuration
          wallClockStartedAt
          error
          stack
        }
        ... on InstanceTestV5 {
          testId
          title
          state
          displayError
          attempts {
            state
            wallClockDuration
            wallClockStartedAt
            error {
              name
              message
              stack
            }
          }
        }
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
export function useGetInstanceQuery(baseOptions: Apollo.QueryHookOptions<GetInstanceQuery, GetInstanceQueryVariables>) {
        return Apollo.useQuery<GetInstanceQuery, GetInstanceQueryVariables>(GetInstanceDocument, baseOptions);
      }
export function useGetInstanceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetInstanceQuery, GetInstanceQueryVariables>) {
          return Apollo.useLazyQuery<GetInstanceQuery, GetInstanceQueryVariables>(GetInstanceDocument, baseOptions);
        }
export type GetInstanceQueryHookResult = ReturnType<typeof useGetInstanceQuery>;
export type GetInstanceLazyQueryHookResult = ReturnType<typeof useGetInstanceLazyQuery>;
export type GetInstanceQueryResult = Apollo.QueryResult<GetInstanceQuery, GetInstanceQueryVariables>;
export const CreateProjectDocument = gql`
    mutation createProject($project: ProjectInput) {
  createProject(project: $project) {
    projectId
    hooks {
      hookId
      url
      headers
      hookEvents
      hookType
      githubContext
    }
  }
}
    `;
export type CreateProjectMutationFn = Apollo.MutationFunction<CreateProjectMutation, CreateProjectMutationVariables>;

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
export function useCreateProjectMutation(baseOptions?: Apollo.MutationHookOptions<CreateProjectMutation, CreateProjectMutationVariables>) {
        return Apollo.useMutation<CreateProjectMutation, CreateProjectMutationVariables>(CreateProjectDocument, baseOptions);
      }
export type CreateProjectMutationHookResult = ReturnType<typeof useCreateProjectMutation>;
export type CreateProjectMutationResult = Apollo.MutationResult<CreateProjectMutation>;
export type CreateProjectMutationOptions = Apollo.BaseMutationOptions<CreateProjectMutation, CreateProjectMutationVariables>;
export const DeleteProjectDocument = gql`
    mutation deleteProject($projectId: ID!) {
  deleteProject(projectId: $projectId) {
    success
    message
    projectIds
  }
}
    `;
export type DeleteProjectMutationFn = Apollo.MutationFunction<DeleteProjectMutation, DeleteProjectMutationVariables>;

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
export function useDeleteProjectMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProjectMutation, DeleteProjectMutationVariables>) {
        return Apollo.useMutation<DeleteProjectMutation, DeleteProjectMutationVariables>(DeleteProjectDocument, baseOptions);
      }
export type DeleteProjectMutationHookResult = ReturnType<typeof useDeleteProjectMutation>;
export type DeleteProjectMutationResult = Apollo.MutationResult<DeleteProjectMutation>;
export type DeleteProjectMutationOptions = Apollo.BaseMutationOptions<DeleteProjectMutation, DeleteProjectMutationVariables>;
export const GetProjectDocument = gql`
    query getProject($projectId: ID!) {
  project(id: $projectId) {
    projectId
    inactivityTimeoutSeconds
    hooks {
      hookId
      url
      headers
      hookEvents
      hookType
      githubContext
    }
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
export function useGetProjectQuery(baseOptions: Apollo.QueryHookOptions<GetProjectQuery, GetProjectQueryVariables>) {
        return Apollo.useQuery<GetProjectQuery, GetProjectQueryVariables>(GetProjectDocument, baseOptions);
      }
export function useGetProjectLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProjectQuery, GetProjectQueryVariables>) {
          return Apollo.useLazyQuery<GetProjectQuery, GetProjectQueryVariables>(GetProjectDocument, baseOptions);
        }
export type GetProjectQueryHookResult = ReturnType<typeof useGetProjectQuery>;
export type GetProjectLazyQueryHookResult = ReturnType<typeof useGetProjectLazyQuery>;
export type GetProjectQueryResult = Apollo.QueryResult<GetProjectQuery, GetProjectQueryVariables>;
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
export function useGetProjectsQuery(baseOptions?: Apollo.QueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>) {
        return Apollo.useQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, baseOptions);
      }
export function useGetProjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>) {
          return Apollo.useLazyQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, baseOptions);
        }
export type GetProjectsQueryHookResult = ReturnType<typeof useGetProjectsQuery>;
export type GetProjectsLazyQueryHookResult = ReturnType<typeof useGetProjectsLazyQuery>;
export type GetProjectsQueryResult = Apollo.QueryResult<GetProjectsQuery, GetProjectsQueryVariables>;
export const UpdateProjectDocument = gql`
    mutation updateProject($project: ProjectInput!) {
  updateProject(project: $project) {
    projectId
    hooks {
      hookId
      url
      headers
      hookEvents
      hookType
      githubContext
    }
  }
}
    `;
export type UpdateProjectMutationFn = Apollo.MutationFunction<UpdateProjectMutation, UpdateProjectMutationVariables>;

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
export function useUpdateProjectMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProjectMutation, UpdateProjectMutationVariables>) {
        return Apollo.useMutation<UpdateProjectMutation, UpdateProjectMutationVariables>(UpdateProjectDocument, baseOptions);
      }
export type UpdateProjectMutationHookResult = ReturnType<typeof useUpdateProjectMutation>;
export type UpdateProjectMutationResult = Apollo.MutationResult<UpdateProjectMutation>;
export type UpdateProjectMutationOptions = Apollo.BaseMutationOptions<UpdateProjectMutation, UpdateProjectMutationVariables>;
export const DeleteRunDocument = gql`
    mutation deleteRun($runId: ID!) {
  deleteRun(runId: $runId) {
    success
    message
    runIds
  }
}
    `;
export type DeleteRunMutationFn = Apollo.MutationFunction<DeleteRunMutation, DeleteRunMutationVariables>;

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
export function useDeleteRunMutation(baseOptions?: Apollo.MutationHookOptions<DeleteRunMutation, DeleteRunMutationVariables>) {
        return Apollo.useMutation<DeleteRunMutation, DeleteRunMutationVariables>(DeleteRunDocument, baseOptions);
      }
export type DeleteRunMutationHookResult = ReturnType<typeof useDeleteRunMutation>;
export type DeleteRunMutationResult = Apollo.MutationResult<DeleteRunMutation>;
export type DeleteRunMutationOptions = Apollo.BaseMutationOptions<DeleteRunMutation, DeleteRunMutationVariables>;
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
      machineId
      groupId
      results {
        cypressConfig {
          video
          videoUploadOnPasses
        }
        videoUrl
        tests {
          ... on InstanceTest {
            title
            state
            wallClockDuration
            wallClockStartedAt
          }
          ... on InstanceTestV5 {
            title
            state
            attempts {
              state
              wallClockDuration
              wallClockStartedAt
              error {
                name
                message
                stack
              }
            }
          }
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
export function useGetRunQuery(baseOptions: Apollo.QueryHookOptions<GetRunQuery, GetRunQueryVariables>) {
        return Apollo.useQuery<GetRunQuery, GetRunQueryVariables>(GetRunDocument, baseOptions);
      }
export function useGetRunLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRunQuery, GetRunQueryVariables>) {
          return Apollo.useLazyQuery<GetRunQuery, GetRunQueryVariables>(GetRunDocument, baseOptions);
        }
export type GetRunQueryHookResult = ReturnType<typeof useGetRunQuery>;
export type GetRunLazyQueryHookResult = ReturnType<typeof useGetRunLazyQuery>;
export type GetRunQueryResult = Apollo.QueryResult<GetRunQuery, GetRunQueryVariables>;
export const GetSpecStatsDocument = gql`
    query getSpecStats($spec: String!) {
  specStats(spec: $spec) {
    spec
    count
    avgWallClockDuration
  }
}
    `;

/**
 * __useGetSpecStatsQuery__
 *
 * To run a query within a React component, call `useGetSpecStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSpecStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSpecStatsQuery({
 *   variables: {
 *      spec: // value for 'spec'
 *   },
 * });
 */
export function useGetSpecStatsQuery(baseOptions: Apollo.QueryHookOptions<GetSpecStatsQuery, GetSpecStatsQueryVariables>) {
        return Apollo.useQuery<GetSpecStatsQuery, GetSpecStatsQueryVariables>(GetSpecStatsDocument, baseOptions);
      }
export function useGetSpecStatsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetSpecStatsQuery, GetSpecStatsQueryVariables>) {
          return Apollo.useLazyQuery<GetSpecStatsQuery, GetSpecStatsQueryVariables>(GetSpecStatsDocument, baseOptions);
        }
export type GetSpecStatsQueryHookResult = ReturnType<typeof useGetSpecStatsQuery>;
export type GetSpecStatsLazyQueryHookResult = ReturnType<typeof useGetSpecStatsLazyQuery>;
export type GetSpecStatsQueryResult = Apollo.QueryResult<GetSpecStatsQuery, GetSpecStatsQueryVariables>;
export const GetRunsFeedDocument = gql`
    query getRunsFeed($cursor: String, $filters: [Filters]) {
  runFeed(cursor: $cursor, filters: $filters) {
    cursor
    hasMore
    runs {
      runId
      createdAt
      meta {
        ...RunSummaryMeta
      }
      inactivityTimeout {
        timeoutMs
      }
      specs {
        ...RunSummarySpec
      }
    }
  }
}
    ${RunSummaryMetaFragmentDoc}
${RunSummarySpecFragmentDoc}`;

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
export function useGetRunsFeedQuery(baseOptions?: Apollo.QueryHookOptions<GetRunsFeedQuery, GetRunsFeedQueryVariables>) {
        return Apollo.useQuery<GetRunsFeedQuery, GetRunsFeedQueryVariables>(GetRunsFeedDocument, baseOptions);
      }
export function useGetRunsFeedLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRunsFeedQuery, GetRunsFeedQueryVariables>) {
          return Apollo.useLazyQuery<GetRunsFeedQuery, GetRunsFeedQueryVariables>(GetRunsFeedDocument, baseOptions);
        }
export type GetRunsFeedQueryHookResult = ReturnType<typeof useGetRunsFeedQuery>;
export type GetRunsFeedLazyQueryHookResult = ReturnType<typeof useGetRunsFeedLazyQuery>;
export type GetRunsFeedQueryResult = Apollo.QueryResult<GetRunsFeedQuery, GetRunsFeedQueryVariables>;

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "InstanceTestUnion": [
      "InstanceTest",
      "InstanceTestV5"
    ]
  }
};
      export default result;
    