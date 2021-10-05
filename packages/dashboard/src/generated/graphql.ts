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
  GenericHookType: any;
  SlackHookType: any;
  SlackResultFilter: any;
  GithubHookType: any;
  BitbucketHookType: any;
  TeamsHookType: any;
  DateTime: string;
};

export type Mutation = {
  __typename?: 'Mutation';
  createBitbucketHook: BitbucketHook;
  createGenericHook: GenericHook;
  createGithubHook: GithubHook;
  createProject: Project;
  createSlackHook: SlackHook;
  createTeamsHook: TeamsHook;
  deleteHook: DeleteHookResponse;
  deleteProject: DeleteProjectResponse;
  deleteRun: DeleteRunResponse;
  deleteRuns: DeleteRunResponse;
  deleteRunsInDateRange: DeleteRunResponse;
  resetInstance: ResetInstanceResponse;
  updateBitbucketHook: BitbucketHook;
  updateGenericHook: GenericHook;
  updateGithubHook: GithubHook;
  updateProject: Project;
  updateSlackHook: SlackHook;
  updateTeamsHook: TeamsHook;
};


export type MutationCreateBitbucketHookArgs = {
  input: CreateBitbucketHookInput;
};


export type MutationCreateGenericHookArgs = {
  input: CreateGenericHookInput;
};


export type MutationCreateGithubHookArgs = {
  input: CreateGithubHookInput;
};


export type MutationCreateProjectArgs = {
  project: CreateProjectInput;
};


export type MutationCreateSlackHookArgs = {
  input: CreateSlackHookInput;
};


export type MutationCreateTeamsHookArgs = {
  input: CreateTeamsHookInput;
};


export type MutationDeleteHookArgs = {
  input: DeleteHookInput;
};


export type MutationDeleteProjectArgs = {
  projectId: Scalars['ID'];
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


export type MutationResetInstanceArgs = {
  instanceId: Scalars['ID'];
};


export type MutationUpdateBitbucketHookArgs = {
  input: UpdateBitbucketHookInput;
};


export type MutationUpdateGenericHookArgs = {
  input: UpdateGenericHookInput;
};


export type MutationUpdateGithubHookArgs = {
  input: UpdateGithubHookInput;
};


export type MutationUpdateProjectArgs = {
  input: UpdateProjectInput;
};


export type MutationUpdateSlackHookArgs = {
  input: UpdateSlackHookInput;
};


export type MutationUpdateTeamsHookArgs = {
  input: UpdateTeamsHookInput;
};

export type DeleteHookInput = {
  projectId: Scalars['String'];
  hookId: Scalars['ID'];
};

export type DeleteHookResponse = {
  __typename?: 'DeleteHookResponse';
  projectId: Scalars['String'];
  hookId: Scalars['ID'];
};

export type SlackHook = {
  __typename?: 'SlackHook';
  projectId: Scalars['ID'];
  hookId: Scalars['ID'];
  url: Scalars['String'];
  hookType: Scalars['SlackHookType'];
  hookEvents: Array<Scalars['String']>;
  slackResultFilter: Maybe<Scalars['SlackResultFilter']>;
  slackBranchFilter: Maybe<Array<Scalars['String']>>;
};

export type CreateSlackHookInput = {
  projectId: Scalars['ID'];
  slackResultFilter: Maybe<Scalars['SlackResultFilter']>;
};

export type UpdateSlackHookInput = {
  projectId: Scalars['ID'];
  hookId: Scalars['ID'];
  url: Scalars['String'];
  hookEvents: Array<Scalars['String']>;
  slackResultFilter: Maybe<Scalars['SlackResultFilter']>;
  slackBranchFilter: Maybe<Array<Scalars['String']>>;
};

export type GithubHook = {
  __typename?: 'GithubHook';
  projectId: Scalars['ID'];
  hookId: Scalars['ID'];
  url: Scalars['String'];
  hookType: Scalars['GithubHookType'];
  githubToken: Maybe<Scalars['String']>;
  githubContext: Maybe<Scalars['String']>;
};

export type CreateGithubHookInput = {
  projectId: Scalars['ID'];
};

export type UpdateGithubHookInput = {
  projectId: Scalars['ID'];
  hookId: Scalars['ID'];
  url: Scalars['String'];
  githubToken: Maybe<Scalars['String']>;
  githubContext: Maybe<Scalars['String']>;
};

export type BitbucketHook = {
  __typename?: 'BitbucketHook';
  projectId: Scalars['ID'];
  hookId: Scalars['ID'];
  url: Scalars['String'];
  hookType: Scalars['BitbucketHookType'];
  bitbucketUsername: Maybe<Scalars['String']>;
  bitbucketToken: Maybe<Scalars['String']>;
  bitbucketBuildName: Maybe<Scalars['String']>;
};

export type CreateBitbucketHookInput = {
  projectId: Scalars['ID'];
};

export type UpdateBitbucketHookInput = {
  projectId: Scalars['ID'];
  hookId: Scalars['ID'];
  url: Maybe<Scalars['String']>;
  bitbucketUsername: Scalars['String'];
  bitbucketToken: Maybe<Scalars['String']>;
  bitbucketBuildName: Maybe<Scalars['String']>;
};

export type TeamsHook = {
  __typename?: 'TeamsHook';
  projectId: Scalars['ID'];
  hookId: Scalars['ID'];
  url: Scalars['String'];
  hookType: Scalars['TeamsHookType'];
  hookEvents: Array<Scalars['String']>;
};

export type CreateTeamsHookInput = {
  projectId: Scalars['ID'];
};

export type UpdateTeamsHookInput = {
  projectId: Scalars['ID'];
  hookId: Scalars['ID'];
  url: Scalars['String'];
  hookEvents: Array<Scalars['String']>;
};

export type GenericHook = {
  __typename?: 'GenericHook';
  projectId: Scalars['ID'];
  hookId: Scalars['ID'];
  url: Scalars['String'];
  headers: Maybe<Scalars['String']>;
  hookType: Scalars['GenericHookType'];
  hookEvents: Array<Scalars['String']>;
};

export type CreateGenericHookInput = {
  projectId: Scalars['ID'];
};

export type UpdateGenericHookInput = {
  projectId: Scalars['ID'];
  hookId: Scalars['ID'];
  url: Scalars['String'];
  headers: Maybe<Scalars['String']>;
  hookEvents: Array<Scalars['String']>;
};

export type Hook = {
  __typename?: 'Hook';
  hookId: Maybe<Scalars['String']>;
  url: Maybe<Scalars['String']>;
  headers: Maybe<Scalars['String']>;
  hookEvents: Maybe<Array<Maybe<Scalars['String']>>>;
  hookType: Maybe<Scalars['String']>;
  githubToken: Maybe<Scalars['String']>;
  githubContext: Maybe<Scalars['String']>;
  bitbucketUsername: Maybe<Scalars['String']>;
  bitbucketToken: Maybe<Scalars['String']>;
  bitbucketBuildName: Maybe<Scalars['String']>;
  slackResultFilter: Maybe<Scalars['String']>;
  slackBranchFilter: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type HookInput = {
  hookId: Maybe<Scalars['String']>;
  url: Scalars['String'];
  headers: Maybe<Scalars['String']>;
  hookEvents: Maybe<Array<Maybe<Scalars['String']>>>;
  hookType: Maybe<Scalars['String']>;
  githubToken: Maybe<Scalars['String']>;
  githubContext: Maybe<Scalars['String']>;
  bitbucketUsername: Maybe<Scalars['String']>;
  bitbucketToken: Maybe<Scalars['String']>;
  bitbucketBuildName: Maybe<Scalars['String']>;
  slackResultFilter: Maybe<Scalars['String']>;
  slackBranchFilter: Maybe<Array<Maybe<Scalars['String']>>>;
};







export type Query = {
  __typename?: 'Query';
  projects: Array<Project>;
  project: Maybe<Project>;
  runs: Array<Maybe<Run>>;
  runFeed: RunFeed;
  run: Maybe<Run>;
  instance: Maybe<Instance>;
  specStats: Maybe<SpecStats>;
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
  cursor: Maybe<Scalars['String']>;
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

export type DeleteRunResponse = {
  __typename?: 'DeleteRunResponse';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  runIds: Array<Maybe<Scalars['ID']>>;
};

export type SpecStats = {
  __typename?: 'SpecStats';
  spec: Scalars['String'];
  avgWallClockDuration: Scalars['Int'];
  count: Scalars['Int'];
};

export type Project = {
  __typename?: 'Project';
  projectId: Scalars['ID'];
  hooks: Array<Hook>;
  inactivityTimeoutSeconds: Maybe<Scalars['Int']>;
  projectColor: Maybe<Scalars['String']>;
};

export type CreateProjectInput = {
  projectId: Scalars['ID'];
  inactivityTimeoutSeconds: Scalars['Int'];
  projectColor: Maybe<Scalars['String']>;
};

export type UpdateProjectInput = {
  projectId: Scalars['ID'];
  inactivityTimeoutSeconds: Scalars['Int'];
  projectColor: Maybe<Scalars['String']>;
};

export type ProjectInput = {
  projectId: Scalars['String'];
  inactivityTimeoutSeconds: Maybe<Scalars['Int']>;
  projectColor: Maybe<Scalars['String']>;
  hooks: Maybe<Array<Maybe<HookInput>>>;
};

export type DeleteProjectResponse = {
  __typename?: 'DeleteProjectResponse';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  projectIds: Array<Maybe<Scalars['ID']>>;
};

export type Run = {
  __typename?: 'Run';
  runId: Scalars['ID'];
  createdAt: Scalars['DateTime'];
  meta: RunMeta;
  specs: Array<RunSpec>;
  completion: Maybe<RunCompletion>;
  progress: Maybe<RunProgress>;
};

export type RunCompletion = {
  __typename?: 'RunCompletion';
  completed: Scalars['Boolean'];
  inactivityTimeoutMs: Maybe<Scalars['Int']>;
};

export type RunSpec = {
  __typename?: 'RunSpec';
  spec: Scalars['String'];
  instanceId: Scalars['String'];
  claimedAt: Maybe<Scalars['String']>;
  completedAt: Maybe<Scalars['String']>;
  machineId: Maybe<Scalars['String']>;
  groupId: Maybe<Scalars['String']>;
  results: Maybe<RunSpecResults>;
};

export type RunSpecResults = {
  __typename?: 'RunSpecResults';
  error: Maybe<Scalars['String']>;
  retries: Maybe<Scalars['Int']>;
  stats: InstanceStats;
};

export type RunProgress = {
  __typename?: 'RunProgress';
  updatedAt: Maybe<Scalars['DateTime']>;
  groups: Array<RunGroupProgress>;
};

export type RunGroupProgress = {
  __typename?: 'RunGroupProgress';
  groupId: Scalars['String'];
  instances: RunGroupProgressInstances;
  tests: RunGroupProgressTests;
};

export type RunGroupProgressInstances = {
  __typename?: 'RunGroupProgressInstances';
  overall: Scalars['Int'];
  claimed: Scalars['Int'];
  complete: Scalars['Int'];
  passes: Scalars['Int'];
  failures: Scalars['Int'];
};

export type RunGroupProgressTests = {
  __typename?: 'RunGroupProgressTests';
  overall: Scalars['Int'];
  passes: Scalars['Int'];
  failures: Scalars['Int'];
  skipped: Scalars['Int'];
  pending: Scalars['Int'];
  retries: Scalars['Int'];
};

export type Commit = {
  __typename?: 'Commit';
  sha: Maybe<Scalars['String']>;
  branch: Maybe<Scalars['String']>;
  authorName: Maybe<Scalars['String']>;
  authorEmail: Maybe<Scalars['String']>;
  message: Maybe<Scalars['String']>;
  remoteOrigin: Maybe<Scalars['String']>;
};

export type RunMeta = {
  __typename?: 'RunMeta';
  ciBuildId: Scalars['String'];
  projectId: Scalars['String'];
  commit: Maybe<Commit>;
};

export type ResetInstanceResponse = {
  __typename?: 'ResetInstanceResponse';
  instanceId: Scalars['ID'];
  message: Scalars['String'];
  success: Maybe<Scalars['Boolean']>;
};

export type RunFeed = {
  __typename?: 'RunFeed';
  cursor: Scalars['String'];
  hasMore: Scalars['Boolean'];
  runs: Array<Run>;
};

export type Instance = {
  __typename?: 'Instance';
  runId: Scalars['ID'];
  run: Run;
  spec: Scalars['String'];
  groupId: Scalars['String'];
  projectId: Scalars['String'];
  instanceId: Scalars['ID'];
  results: Maybe<InstanceResults>;
};

export type InstanceResults = {
  __typename?: 'InstanceResults';
  stats: InstanceStats;
  tests: Maybe<Array<InstanceTest>>;
  error: Maybe<Scalars['String']>;
  stdout: Maybe<Scalars['String']>;
  screenshots: Array<InstanceScreeshot>;
  cypressConfig: Maybe<CypressConfig>;
  reporterStats: Maybe<ReporterStats>;
  videoUrl: Maybe<Scalars['String']>;
};

export type InstanceStats = {
  __typename?: 'InstanceStats';
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
  __typename?: 'CypressConfig';
  video: Scalars['Boolean'];
  videoUploadOnPasses: Scalars['Boolean'];
};

export type InstanceScreeshot = {
  __typename?: 'InstanceScreeshot';
  screenshotId: Scalars['String'];
  name: Maybe<Scalars['String']>;
  testId: Scalars['String'];
  takenAt: Scalars['String'];
  height: Scalars['Int'];
  width: Scalars['Int'];
  screenshotURL: Maybe<Scalars['String']>;
};

export type ReporterStats = {
  __typename?: 'ReporterStats';
  suites: Maybe<Scalars['Int']>;
  tests: Maybe<Scalars['Int']>;
  passes: Maybe<Scalars['Int']>;
  pending: Maybe<Scalars['Int']>;
  failures: Maybe<Scalars['Int']>;
  start: Maybe<Scalars['String']>;
  end: Maybe<Scalars['String']>;
  duration: Maybe<Scalars['Int']>;
};

export enum TestState {
  Failed = 'failed',
  Passed = 'passed',
  Pending = 'pending',
  Skipped = 'skipped'
}

export type InstanceTest = {
  __typename?: 'InstanceTest';
  testId: Scalars['String'];
  title: Array<Scalars['String']>;
  state: TestState;
  body: Maybe<Scalars['String']>;
  displayError: Maybe<Scalars['String']>;
  attempts: Array<TestAttempt>;
};

export type TestError = {
  __typename?: 'TestError';
  name: Scalars['String'];
  message: Scalars['String'];
  stack: Scalars['String'];
};

export type TestAttempt = {
  __typename?: 'TestAttempt';
  state: Maybe<Scalars['String']>;
  error: Maybe<TestError>;
  wallClockStartedAt: Maybe<Scalars['String']>;
  wallClockDuration: Maybe<Scalars['Int']>;
};


export enum OrderingOptions {
  Desc = 'DESC',
  Asc = 'ASC'
}

export type Filters = {
  key: Maybe<Scalars['String']>;
  value: Maybe<Scalars['String']>;
  like: Maybe<Scalars['String']>;
};

export type GetInstanceQueryVariables = Exact<{
  instanceId: Scalars['ID'];
}>;


export type GetInstanceQuery = { __typename?: 'Query', instance: Maybe<{ __typename?: 'Instance', instanceId: string, runId: string, spec: string, projectId: string, run: { __typename?: 'Run', runId: string, meta: { __typename?: 'RunMeta', ciBuildId: string } }, results: Maybe<{ __typename?: 'InstanceResults', error: Maybe<string>, videoUrl: Maybe<string>, stats: (
        { __typename?: 'InstanceStats' }
        & AllInstanceStatsFragment
      ), tests: Maybe<Array<{ __typename?: 'InstanceTest', testId: string, title: Array<string>, state: TestState, body: Maybe<string>, displayError: Maybe<string>, attempts: Array<{ __typename?: 'TestAttempt', state: Maybe<string>, wallClockDuration: Maybe<number>, wallClockStartedAt: Maybe<string>, error: Maybe<{ __typename?: 'TestError', name: string, message: string, stack: string }> }> }>>, screenshots: Array<{ __typename?: 'InstanceScreeshot', testId: string, screenshotId: string, height: number, width: number, screenshotURL: Maybe<string> }>, cypressConfig: Maybe<{ __typename?: 'CypressConfig', video: boolean, videoUploadOnPasses: boolean }> }> }> };

export type CreateProjectMutationVariables = Exact<{
  project: CreateProjectInput;
}>;


export type CreateProjectMutation = { __typename?: 'Mutation', createProject: { __typename?: 'Project', projectId: string, inactivityTimeoutSeconds: Maybe<number>, projectColor: Maybe<string> } };

export type DeleteProjectMutationVariables = Exact<{
  projectId: Scalars['ID'];
}>;


export type DeleteProjectMutation = { __typename?: 'Mutation', deleteProject: { __typename?: 'DeleteProjectResponse', success: boolean, message: string, projectIds: Array<Maybe<string>> } };

export type GetProjectQueryVariables = Exact<{
  projectId: Scalars['ID'];
}>;


export type GetProjectQuery = { __typename?: 'Query', project: Maybe<{ __typename?: 'Project', projectId: string, inactivityTimeoutSeconds: Maybe<number>, projectColor: Maybe<string>, hooks: Array<{ __typename?: 'Hook', hookId: Maybe<string>, url: Maybe<string>, headers: Maybe<string>, hookEvents: Maybe<Array<Maybe<string>>>, hookType: Maybe<string>, slackResultFilter: Maybe<string>, slackBranchFilter: Maybe<Array<Maybe<string>>>, githubContext: Maybe<string>, githubToken: Maybe<string>, bitbucketUsername: Maybe<string>, bitbucketToken: Maybe<string>, bitbucketBuildName: Maybe<string> }> }> };

export type GetProjectsQueryVariables = Exact<{
  orderDirection: Maybe<OrderingOptions>;
  filters: Array<Filters> | Filters;
}>;


export type GetProjectsQuery = { __typename?: 'Query', projects: Array<{ __typename?: 'Project', projectId: string, projectColor: Maybe<string> }> };

export type CreateBitbucketHookMutationVariables = Exact<{
  input: CreateBitbucketHookInput;
}>;


export type CreateBitbucketHookMutation = { __typename?: 'Mutation', createBitbucketHook: { __typename?: 'BitbucketHook', projectId: string, hookId: string, hookType: any, url: string, bitbucketUsername: Maybe<string>, bitbucketBuildName: Maybe<string> } };

export type CreateGenericHookMutationVariables = Exact<{
  input: CreateGenericHookInput;
}>;


export type CreateGenericHookMutation = { __typename?: 'Mutation', createGenericHook: { __typename?: 'GenericHook', hookId: string, hookType: any, url: string, hookEvents: Array<string>, headers: Maybe<string> } };

export type CreateGithubHookMutationVariables = Exact<{
  input: CreateGithubHookInput;
}>;


export type CreateGithubHookMutation = { __typename?: 'Mutation', createGithubHook: { __typename?: 'GithubHook', projectId: string, hookId: string, hookType: any, url: string, githubToken: Maybe<string>, githubContext: Maybe<string> } };

export type CreateSlackHookMutationVariables = Exact<{
  input: CreateSlackHookInput;
}>;


export type CreateSlackHookMutation = { __typename?: 'Mutation', createSlackHook: { __typename?: 'SlackHook', hookId: string, hookType: any, url: string, hookEvents: Array<string>, slackResultFilter: Maybe<any>, slackBranchFilter: Maybe<Array<string>> } };

export type CreateTeamsHookMutationVariables = Exact<{
  input: CreateTeamsHookInput;
}>;


export type CreateTeamsHookMutation = { __typename?: 'Mutation', createTeamsHook: { __typename?: 'TeamsHook', hookId: string, hookType: any, url: string, hookEvents: Array<string> } };

export type DeleteHookMutationVariables = Exact<{
  input: DeleteHookInput;
}>;


export type DeleteHookMutation = { __typename?: 'Mutation', deleteHook: { __typename?: 'DeleteHookResponse', hookId: string, projectId: string } };

export type UpdateBitbucketHookMutationVariables = Exact<{
  input: UpdateBitbucketHookInput;
}>;


export type UpdateBitbucketHookMutation = { __typename?: 'Mutation', updateBitbucketHook: { __typename?: 'BitbucketHook', hookId: string } };

export type UpdateGenericHookMutationVariables = Exact<{
  input: UpdateGenericHookInput;
}>;


export type UpdateGenericHookMutation = { __typename?: 'Mutation', updateGenericHook: { __typename?: 'GenericHook', hookId: string } };

export type UpdateGithubHookMutationVariables = Exact<{
  input: UpdateGithubHookInput;
}>;


export type UpdateGithubHookMutation = { __typename?: 'Mutation', updateGithubHook: { __typename?: 'GithubHook', hookId: string } };

export type UpdateSlackHookMutationVariables = Exact<{
  input: UpdateSlackHookInput;
}>;


export type UpdateSlackHookMutation = { __typename?: 'Mutation', updateSlackHook: { __typename?: 'SlackHook', hookId: string } };

export type UpdateTeamsHookMutationVariables = Exact<{
  input: UpdateTeamsHookInput;
}>;


export type UpdateTeamsHookMutation = { __typename?: 'Mutation', updateTeamsHook: { __typename?: 'TeamsHook', hookId: string } };

export type UpdateProjectMutationVariables = Exact<{
  input: UpdateProjectInput;
}>;


export type UpdateProjectMutation = { __typename?: 'Mutation', updateProject: { __typename?: 'Project', projectId: string, inactivityTimeoutSeconds: Maybe<number>, projectColor: Maybe<string> } };

export type DeleteRunMutationVariables = Exact<{
  runId: Scalars['ID'];
}>;


export type DeleteRunMutation = { __typename?: 'Mutation', deleteRun: { __typename?: 'DeleteRunResponse', success: boolean, message: string, runIds: Array<Maybe<string>> } };

export type GetSpecStatsQueryVariables = Exact<{
  spec: Scalars['String'];
}>;


export type GetSpecStatsQuery = { __typename?: 'Query', specStats: Maybe<{ __typename?: 'SpecStats', spec: string, count: number, avgWallClockDuration: number }> };

export type GetRunQueryVariables = Exact<{
  runId: Scalars['ID'];
}>;


export type GetRunQuery = { __typename?: 'Query', run: Maybe<{ __typename?: 'Run', runId: string, createdAt: string, completion: Maybe<(
      { __typename?: 'RunCompletion' }
      & RunSummaryCompletionFragment
    )>, meta: (
      { __typename?: 'RunMeta' }
      & RunSummaryMetaFragment
    ), specs: Array<(
      { __typename?: 'RunSpec' }
      & RunDetailSpecFragment
    )>, progress: Maybe<(
      { __typename?: 'RunProgress' }
      & RunProgressFragment
    )> }> };

export type ResetInstanceMutationVariables = Exact<{
  instanceId: Scalars['ID'];
}>;


export type ResetInstanceMutation = { __typename?: 'Mutation', resetInstance: { __typename?: 'ResetInstanceResponse', success: Maybe<boolean>, message: string, instanceId: string } };

export type RunDetailSpecFragment = { __typename?: 'RunSpec', instanceId: string, spec: string, claimedAt: Maybe<string>, machineId: Maybe<string>, groupId: Maybe<string>, results: Maybe<{ __typename?: 'RunSpecResults', error: Maybe<string>, retries: Maybe<number>, stats: (
      { __typename?: 'InstanceStats' }
      & AllInstanceStatsFragment
    ) }> };

export type AllInstanceStatsFragment = { __typename?: 'InstanceStats', suites: number, tests: number, pending: number, passes: number, failures: number, skipped: number, wallClockDuration: number, wallClockStartedAt: string, wallClockEndedAt: string };

export type RunSummaryCompletionFragment = { __typename?: 'RunCompletion', completed: boolean, inactivityTimeoutMs: Maybe<number> };

export type RunSummaryMetaFragment = { __typename?: 'RunMeta', ciBuildId: string, projectId: string, commit: Maybe<{ __typename?: 'Commit', sha: Maybe<string>, branch: Maybe<string>, remoteOrigin: Maybe<string>, message: Maybe<string>, authorEmail: Maybe<string>, authorName: Maybe<string> }> };

export type RunSummarySpecFragment = { __typename?: 'RunSpec', claimedAt: Maybe<string>, results: Maybe<{ __typename?: 'RunSpecResults', stats: (
      { __typename?: 'InstanceStats' }
      & AllInstanceStatsFragment
    ) }> };

export type GetRunsFeedQueryVariables = Exact<{
  cursor: Maybe<Scalars['String']>;
  filters: Array<Filters> | Filters;
}>;


export type GetRunsFeedQuery = { __typename?: 'Query', runFeed: { __typename?: 'RunFeed', cursor: string, hasMore: boolean, runs: Array<{ __typename?: 'Run', runId: string, createdAt: string, completion: Maybe<(
        { __typename?: 'RunCompletion' }
        & RunSummaryCompletionFragment
      )>, meta: (
        { __typename?: 'RunMeta' }
        & RunSummaryMetaFragment
      ), progress: Maybe<(
        { __typename?: 'RunProgress' }
        & RunProgressFragment
      )> }> } };

export type RunProgressFragment = { __typename?: 'RunProgress', updatedAt: Maybe<string>, groups: Array<{ __typename?: 'RunGroupProgress', groupId: string, instances: (
      { __typename?: 'RunGroupProgressInstances' }
      & RunGroupProgressInstancesFragment
    ), tests: (
      { __typename?: 'RunGroupProgressTests' }
      & RunGroupProgressTestsFragment
    ) }> };

export type RunGroupProgressInstancesFragment = { __typename?: 'RunGroupProgressInstances', overall: number, claimed: number, complete: number, failures: number, passes: number };

export type RunGroupProgressTestsFragment = { __typename?: 'RunGroupProgressTests', overall: number, passes: number, failures: number, pending: number, skipped: number, retries: number };

export const AllInstanceStatsFragmentDoc = gql`
    fragment AllInstanceStats on InstanceStats {
  suites
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
export const RunDetailSpecFragmentDoc = gql`
    fragment RunDetailSpec on RunSpec {
  instanceId
  spec
  claimedAt
  machineId
  groupId
  results {
    error
    retries
    stats {
      ...AllInstanceStats
    }
  }
}
    ${AllInstanceStatsFragmentDoc}`;
export const RunSummaryCompletionFragmentDoc = gql`
    fragment RunSummaryCompletion on RunCompletion {
  completed
  inactivityTimeoutMs
}
    `;
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
export const RunSummarySpecFragmentDoc = gql`
    fragment RunSummarySpec on RunSpec {
  claimedAt
  results {
    stats {
      ...AllInstanceStats
    }
  }
}
    ${AllInstanceStatsFragmentDoc}`;
export const RunGroupProgressInstancesFragmentDoc = gql`
    fragment RunGroupProgressInstances on RunGroupProgressInstances {
  overall
  claimed
  complete
  failures
  passes
}
    `;
export const RunGroupProgressTestsFragmentDoc = gql`
    fragment RunGroupProgressTests on RunGroupProgressTests {
  overall
  passes
  failures
  pending
  skipped
  retries
}
    `;
export const RunProgressFragmentDoc = gql`
    fragment RunProgress on RunProgress {
  updatedAt
  groups {
    groupId
    instances {
      ...RunGroupProgressInstances
    }
    tests {
      ...RunGroupProgressTests
    }
  }
}
    ${RunGroupProgressInstancesFragmentDoc}
${RunGroupProgressTestsFragmentDoc}`;
export const GetInstanceDocument = gql`
    query getInstance($instanceId: ID!) {
  instance(id: $instanceId) {
    instanceId
    runId
    spec
    projectId
    run {
      runId
      meta {
        ciBuildId
      }
    }
    results {
      error
      stats {
        ...AllInstanceStats
      }
      tests {
        ... on InstanceTest {
          testId
          title
          state
          body
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
    ${AllInstanceStatsFragmentDoc}`;

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
    mutation createProject($project: CreateProjectInput!) {
  createProject(project: $project) {
    projectId
    inactivityTimeoutSeconds
    projectColor
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
    projectColor
    hooks {
      hookId
      url
      headers
      hookEvents
      hookType
      slackResultFilter
      slackBranchFilter
      githubContext
      githubToken
      bitbucketUsername
      bitbucketToken
      bitbucketBuildName
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
    query getProjects($orderDirection: OrderingOptions, $filters: [Filters!]!) {
  projects(orderDirection: $orderDirection, filters: $filters) {
    projectId
    projectColor
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
export function useGetProjectsQuery(baseOptions: Apollo.QueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>) {
        return Apollo.useQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, baseOptions);
      }
export function useGetProjectsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProjectsQuery, GetProjectsQueryVariables>) {
          return Apollo.useLazyQuery<GetProjectsQuery, GetProjectsQueryVariables>(GetProjectsDocument, baseOptions);
        }
export type GetProjectsQueryHookResult = ReturnType<typeof useGetProjectsQuery>;
export type GetProjectsLazyQueryHookResult = ReturnType<typeof useGetProjectsLazyQuery>;
export type GetProjectsQueryResult = Apollo.QueryResult<GetProjectsQuery, GetProjectsQueryVariables>;
export const CreateBitbucketHookDocument = gql`
    mutation createBitbucketHook($input: CreateBitbucketHookInput!) {
  createBitbucketHook(input: $input) {
    projectId
    hookId
    hookType
    url
    bitbucketUsername
    bitbucketBuildName
  }
}
    `;
export type CreateBitbucketHookMutationFn = Apollo.MutationFunction<CreateBitbucketHookMutation, CreateBitbucketHookMutationVariables>;

/**
 * __useCreateBitbucketHookMutation__
 *
 * To run a mutation, you first call `useCreateBitbucketHookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBitbucketHookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBitbucketHookMutation, { data, loading, error }] = useCreateBitbucketHookMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateBitbucketHookMutation(baseOptions?: Apollo.MutationHookOptions<CreateBitbucketHookMutation, CreateBitbucketHookMutationVariables>) {
        return Apollo.useMutation<CreateBitbucketHookMutation, CreateBitbucketHookMutationVariables>(CreateBitbucketHookDocument, baseOptions);
      }
export type CreateBitbucketHookMutationHookResult = ReturnType<typeof useCreateBitbucketHookMutation>;
export type CreateBitbucketHookMutationResult = Apollo.MutationResult<CreateBitbucketHookMutation>;
export type CreateBitbucketHookMutationOptions = Apollo.BaseMutationOptions<CreateBitbucketHookMutation, CreateBitbucketHookMutationVariables>;
export const CreateGenericHookDocument = gql`
    mutation createGenericHook($input: CreateGenericHookInput!) {
  createGenericHook(input: $input) {
    hookId
    hookType
    url
    hookEvents
    headers
  }
}
    `;
export type CreateGenericHookMutationFn = Apollo.MutationFunction<CreateGenericHookMutation, CreateGenericHookMutationVariables>;

/**
 * __useCreateGenericHookMutation__
 *
 * To run a mutation, you first call `useCreateGenericHookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGenericHookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGenericHookMutation, { data, loading, error }] = useCreateGenericHookMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateGenericHookMutation(baseOptions?: Apollo.MutationHookOptions<CreateGenericHookMutation, CreateGenericHookMutationVariables>) {
        return Apollo.useMutation<CreateGenericHookMutation, CreateGenericHookMutationVariables>(CreateGenericHookDocument, baseOptions);
      }
export type CreateGenericHookMutationHookResult = ReturnType<typeof useCreateGenericHookMutation>;
export type CreateGenericHookMutationResult = Apollo.MutationResult<CreateGenericHookMutation>;
export type CreateGenericHookMutationOptions = Apollo.BaseMutationOptions<CreateGenericHookMutation, CreateGenericHookMutationVariables>;
export const CreateGithubHookDocument = gql`
    mutation createGithubHook($input: CreateGithubHookInput!) {
  createGithubHook(input: $input) {
    projectId
    hookId
    hookType
    url
    githubToken
    githubContext
  }
}
    `;
export type CreateGithubHookMutationFn = Apollo.MutationFunction<CreateGithubHookMutation, CreateGithubHookMutationVariables>;

/**
 * __useCreateGithubHookMutation__
 *
 * To run a mutation, you first call `useCreateGithubHookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGithubHookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGithubHookMutation, { data, loading, error }] = useCreateGithubHookMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateGithubHookMutation(baseOptions?: Apollo.MutationHookOptions<CreateGithubHookMutation, CreateGithubHookMutationVariables>) {
        return Apollo.useMutation<CreateGithubHookMutation, CreateGithubHookMutationVariables>(CreateGithubHookDocument, baseOptions);
      }
export type CreateGithubHookMutationHookResult = ReturnType<typeof useCreateGithubHookMutation>;
export type CreateGithubHookMutationResult = Apollo.MutationResult<CreateGithubHookMutation>;
export type CreateGithubHookMutationOptions = Apollo.BaseMutationOptions<CreateGithubHookMutation, CreateGithubHookMutationVariables>;
export const CreateSlackHookDocument = gql`
    mutation createSlackHook($input: CreateSlackHookInput!) {
  createSlackHook(input: $input) {
    hookId
    hookType
    url
    hookEvents
    slackResultFilter
    slackBranchFilter
  }
}
    `;
export type CreateSlackHookMutationFn = Apollo.MutationFunction<CreateSlackHookMutation, CreateSlackHookMutationVariables>;

/**
 * __useCreateSlackHookMutation__
 *
 * To run a mutation, you first call `useCreateSlackHookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSlackHookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSlackHookMutation, { data, loading, error }] = useCreateSlackHookMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSlackHookMutation(baseOptions?: Apollo.MutationHookOptions<CreateSlackHookMutation, CreateSlackHookMutationVariables>) {
        return Apollo.useMutation<CreateSlackHookMutation, CreateSlackHookMutationVariables>(CreateSlackHookDocument, baseOptions);
      }
export type CreateSlackHookMutationHookResult = ReturnType<typeof useCreateSlackHookMutation>;
export type CreateSlackHookMutationResult = Apollo.MutationResult<CreateSlackHookMutation>;
export type CreateSlackHookMutationOptions = Apollo.BaseMutationOptions<CreateSlackHookMutation, CreateSlackHookMutationVariables>;
export const CreateTeamsHookDocument = gql`
    mutation createTeamsHook($input: CreateTeamsHookInput!) {
  createTeamsHook(input: $input) {
    hookId
    hookType
    url
    hookEvents
  }
}
    `;
export type CreateTeamsHookMutationFn = Apollo.MutationFunction<CreateTeamsHookMutation, CreateTeamsHookMutationVariables>;

/**
 * __useCreateTeamsHookMutation__
 *
 * To run a mutation, you first call `useCreateTeamsHookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTeamsHookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTeamsHookMutation, { data, loading, error }] = useCreateTeamsHookMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTeamsHookMutation(baseOptions?: Apollo.MutationHookOptions<CreateTeamsHookMutation, CreateTeamsHookMutationVariables>) {
        return Apollo.useMutation<CreateTeamsHookMutation, CreateTeamsHookMutationVariables>(CreateTeamsHookDocument, baseOptions);
      }
export type CreateTeamsHookMutationHookResult = ReturnType<typeof useCreateTeamsHookMutation>;
export type CreateTeamsHookMutationResult = Apollo.MutationResult<CreateTeamsHookMutation>;
export type CreateTeamsHookMutationOptions = Apollo.BaseMutationOptions<CreateTeamsHookMutation, CreateTeamsHookMutationVariables>;
export const DeleteHookDocument = gql`
    mutation deleteHook($input: DeleteHookInput!) {
  deleteHook(input: $input) {
    hookId
    projectId
  }
}
    `;
export type DeleteHookMutationFn = Apollo.MutationFunction<DeleteHookMutation, DeleteHookMutationVariables>;

/**
 * __useDeleteHookMutation__
 *
 * To run a mutation, you first call `useDeleteHookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteHookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteHookMutation, { data, loading, error }] = useDeleteHookMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useDeleteHookMutation(baseOptions?: Apollo.MutationHookOptions<DeleteHookMutation, DeleteHookMutationVariables>) {
        return Apollo.useMutation<DeleteHookMutation, DeleteHookMutationVariables>(DeleteHookDocument, baseOptions);
      }
export type DeleteHookMutationHookResult = ReturnType<typeof useDeleteHookMutation>;
export type DeleteHookMutationResult = Apollo.MutationResult<DeleteHookMutation>;
export type DeleteHookMutationOptions = Apollo.BaseMutationOptions<DeleteHookMutation, DeleteHookMutationVariables>;
export const UpdateBitbucketHookDocument = gql`
    mutation updateBitbucketHook($input: UpdateBitbucketHookInput!) {
  updateBitbucketHook(input: $input) {
    hookId
  }
}
    `;
export type UpdateBitbucketHookMutationFn = Apollo.MutationFunction<UpdateBitbucketHookMutation, UpdateBitbucketHookMutationVariables>;

/**
 * __useUpdateBitbucketHookMutation__
 *
 * To run a mutation, you first call `useUpdateBitbucketHookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBitbucketHookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBitbucketHookMutation, { data, loading, error }] = useUpdateBitbucketHookMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateBitbucketHookMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBitbucketHookMutation, UpdateBitbucketHookMutationVariables>) {
        return Apollo.useMutation<UpdateBitbucketHookMutation, UpdateBitbucketHookMutationVariables>(UpdateBitbucketHookDocument, baseOptions);
      }
export type UpdateBitbucketHookMutationHookResult = ReturnType<typeof useUpdateBitbucketHookMutation>;
export type UpdateBitbucketHookMutationResult = Apollo.MutationResult<UpdateBitbucketHookMutation>;
export type UpdateBitbucketHookMutationOptions = Apollo.BaseMutationOptions<UpdateBitbucketHookMutation, UpdateBitbucketHookMutationVariables>;
export const UpdateGenericHookDocument = gql`
    mutation updateGenericHook($input: UpdateGenericHookInput!) {
  updateGenericHook(input: $input) {
    hookId
  }
}
    `;
export type UpdateGenericHookMutationFn = Apollo.MutationFunction<UpdateGenericHookMutation, UpdateGenericHookMutationVariables>;

/**
 * __useUpdateGenericHookMutation__
 *
 * To run a mutation, you first call `useUpdateGenericHookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateGenericHookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateGenericHookMutation, { data, loading, error }] = useUpdateGenericHookMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateGenericHookMutation(baseOptions?: Apollo.MutationHookOptions<UpdateGenericHookMutation, UpdateGenericHookMutationVariables>) {
        return Apollo.useMutation<UpdateGenericHookMutation, UpdateGenericHookMutationVariables>(UpdateGenericHookDocument, baseOptions);
      }
export type UpdateGenericHookMutationHookResult = ReturnType<typeof useUpdateGenericHookMutation>;
export type UpdateGenericHookMutationResult = Apollo.MutationResult<UpdateGenericHookMutation>;
export type UpdateGenericHookMutationOptions = Apollo.BaseMutationOptions<UpdateGenericHookMutation, UpdateGenericHookMutationVariables>;
export const UpdateGithubHookDocument = gql`
    mutation updateGithubHook($input: UpdateGithubHookInput!) {
  updateGithubHook(input: $input) {
    hookId
  }
}
    `;
export type UpdateGithubHookMutationFn = Apollo.MutationFunction<UpdateGithubHookMutation, UpdateGithubHookMutationVariables>;

/**
 * __useUpdateGithubHookMutation__
 *
 * To run a mutation, you first call `useUpdateGithubHookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateGithubHookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateGithubHookMutation, { data, loading, error }] = useUpdateGithubHookMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateGithubHookMutation(baseOptions?: Apollo.MutationHookOptions<UpdateGithubHookMutation, UpdateGithubHookMutationVariables>) {
        return Apollo.useMutation<UpdateGithubHookMutation, UpdateGithubHookMutationVariables>(UpdateGithubHookDocument, baseOptions);
      }
export type UpdateGithubHookMutationHookResult = ReturnType<typeof useUpdateGithubHookMutation>;
export type UpdateGithubHookMutationResult = Apollo.MutationResult<UpdateGithubHookMutation>;
export type UpdateGithubHookMutationOptions = Apollo.BaseMutationOptions<UpdateGithubHookMutation, UpdateGithubHookMutationVariables>;
export const UpdateSlackHookDocument = gql`
    mutation updateSlackHook($input: UpdateSlackHookInput!) {
  updateSlackHook(input: $input) {
    hookId
  }
}
    `;
export type UpdateSlackHookMutationFn = Apollo.MutationFunction<UpdateSlackHookMutation, UpdateSlackHookMutationVariables>;

/**
 * __useUpdateSlackHookMutation__
 *
 * To run a mutation, you first call `useUpdateSlackHookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSlackHookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSlackHookMutation, { data, loading, error }] = useUpdateSlackHookMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateSlackHookMutation(baseOptions?: Apollo.MutationHookOptions<UpdateSlackHookMutation, UpdateSlackHookMutationVariables>) {
        return Apollo.useMutation<UpdateSlackHookMutation, UpdateSlackHookMutationVariables>(UpdateSlackHookDocument, baseOptions);
      }
export type UpdateSlackHookMutationHookResult = ReturnType<typeof useUpdateSlackHookMutation>;
export type UpdateSlackHookMutationResult = Apollo.MutationResult<UpdateSlackHookMutation>;
export type UpdateSlackHookMutationOptions = Apollo.BaseMutationOptions<UpdateSlackHookMutation, UpdateSlackHookMutationVariables>;
export const UpdateTeamsHookDocument = gql`
    mutation updateTeamsHook($input: UpdateTeamsHookInput!) {
  updateTeamsHook(input: $input) {
    hookId
  }
}
    `;
export type UpdateTeamsHookMutationFn = Apollo.MutationFunction<UpdateTeamsHookMutation, UpdateTeamsHookMutationVariables>;

/**
 * __useUpdateTeamsHookMutation__
 *
 * To run a mutation, you first call `useUpdateTeamsHookMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTeamsHookMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTeamsHookMutation, { data, loading, error }] = useUpdateTeamsHookMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTeamsHookMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTeamsHookMutation, UpdateTeamsHookMutationVariables>) {
        return Apollo.useMutation<UpdateTeamsHookMutation, UpdateTeamsHookMutationVariables>(UpdateTeamsHookDocument, baseOptions);
      }
export type UpdateTeamsHookMutationHookResult = ReturnType<typeof useUpdateTeamsHookMutation>;
export type UpdateTeamsHookMutationResult = Apollo.MutationResult<UpdateTeamsHookMutation>;
export type UpdateTeamsHookMutationOptions = Apollo.BaseMutationOptions<UpdateTeamsHookMutation, UpdateTeamsHookMutationVariables>;
export const UpdateProjectDocument = gql`
    mutation updateProject($input: UpdateProjectInput!) {
  updateProject(input: $input) {
    projectId
    inactivityTimeoutSeconds
    projectColor
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
 *      input: // value for 'input'
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
export const GetRunDocument = gql`
    query getRun($runId: ID!) {
  run(id: $runId) {
    runId
    createdAt
    completion {
      ...RunSummaryCompletion
    }
    meta {
      ...RunSummaryMeta
    }
    specs {
      ...RunDetailSpec
    }
    progress {
      ...RunProgress
    }
  }
}
    ${RunSummaryCompletionFragmentDoc}
${RunSummaryMetaFragmentDoc}
${RunDetailSpecFragmentDoc}
${RunProgressFragmentDoc}`;

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
export const ResetInstanceDocument = gql`
    mutation resetInstance($instanceId: ID!) {
  resetInstance(instanceId: $instanceId) {
    success
    message
    instanceId
  }
}
    `;
export type ResetInstanceMutationFn = Apollo.MutationFunction<ResetInstanceMutation, ResetInstanceMutationVariables>;

/**
 * __useResetInstanceMutation__
 *
 * To run a mutation, you first call `useResetInstanceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResetInstanceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resetInstanceMutation, { data, loading, error }] = useResetInstanceMutation({
 *   variables: {
 *      instanceId: // value for 'instanceId'
 *   },
 * });
 */
export function useResetInstanceMutation(baseOptions?: Apollo.MutationHookOptions<ResetInstanceMutation, ResetInstanceMutationVariables>) {
        return Apollo.useMutation<ResetInstanceMutation, ResetInstanceMutationVariables>(ResetInstanceDocument, baseOptions);
      }
export type ResetInstanceMutationHookResult = ReturnType<typeof useResetInstanceMutation>;
export type ResetInstanceMutationResult = Apollo.MutationResult<ResetInstanceMutation>;
export type ResetInstanceMutationOptions = Apollo.BaseMutationOptions<ResetInstanceMutation, ResetInstanceMutationVariables>;
export const GetRunsFeedDocument = gql`
    query getRunsFeed($cursor: String, $filters: [Filters!]!) {
  runFeed(cursor: $cursor, filters: $filters) {
    cursor
    hasMore
    runs {
      runId
      createdAt
      completion {
        ...RunSummaryCompletion
      }
      meta {
        ...RunSummaryMeta
      }
      progress {
        ...RunProgress
      }
    }
  }
}
    ${RunSummaryCompletionFragmentDoc}
${RunSummaryMetaFragmentDoc}
${RunProgressFragmentDoc}`;

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
export function useGetRunsFeedQuery(baseOptions: Apollo.QueryHookOptions<GetRunsFeedQuery, GetRunsFeedQueryVariables>) {
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
  "possibleTypes": {}
};
      export default result;
