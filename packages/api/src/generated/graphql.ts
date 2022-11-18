import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = {
  [X in Exclude<keyof T, K>]?: T[X];
} &
  { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BitbucketHookType: any;
  DateTime: any;
  GChatHookType: any;
  GenericHookType: any;
  GithubHookType: any;
  SlackHookType: any;
  SlackResultFilter: any;
  TeamsHookType: any;
};

export type BitbucketHook = {
  __typename?: 'BitbucketHook';
  bitbucketBuildName?: Maybe<Scalars['String']>;
  bitbucketToken?: Maybe<Scalars['String']>;
  bitbucketUsername?: Maybe<Scalars['String']>;
  hookId: Scalars['ID'];
  hookType: Scalars['BitbucketHookType'];
  projectId: Scalars['ID'];
  url: Scalars['String'];
};

export type CiBuild = {
  __typename?: 'CiBuild';
  ciBuildId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  runs: Array<Run>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type Commit = {
  __typename?: 'Commit';
  authorEmail?: Maybe<Scalars['String']>;
  authorName?: Maybe<Scalars['String']>;
  branch?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  remoteOrigin?: Maybe<Scalars['String']>;
  sha?: Maybe<Scalars['String']>;
};

export type CreateBitbucketHookInput = {
  projectId: Scalars['ID'];
};

export type CreateGChatHookInput = {
  projectId: Scalars['ID'];
};

export type CreateGenericHookInput = {
  projectId: Scalars['ID'];
};

export type CreateGithubHookInput = {
  projectId: Scalars['ID'];
};

export type CreateProjectInput = {
  inactivityTimeoutSeconds: Scalars['Int'];
  projectColor?: InputMaybe<Scalars['String']>;
  projectId: Scalars['ID'];
};

export type CreateSlackHookInput = {
  projectId: Scalars['ID'];
  slackResultFilter?: InputMaybe<Scalars['SlackResultFilter']>;
};

export type CreateTeamsHookInput = {
  projectId: Scalars['ID'];
};

export type CypressConfig = {
  __typename?: 'CypressConfig';
  video: Scalars['Boolean'];
  videoUploadOnPasses: Scalars['Boolean'];
};

export type DeleteHookInput = {
  hookId: Scalars['ID'];
  projectId: Scalars['String'];
};

export type DeleteHookResponse = {
  __typename?: 'DeleteHookResponse';
  hookId: Scalars['ID'];
  projectId: Scalars['String'];
};

export type DeleteProjectResponse = {
  __typename?: 'DeleteProjectResponse';
  message: Scalars['String'];
  projectIds: Array<Maybe<Scalars['ID']>>;
  success: Scalars['Boolean'];
};

export type DeleteRunResponse = {
  __typename?: 'DeleteRunResponse';
  message: Scalars['String'];
  runIds: Array<Maybe<Scalars['ID']>>;
  success: Scalars['Boolean'];
};

export type Filters = {
  key?: InputMaybe<Scalars['String']>;
  like?: InputMaybe<Scalars['String']>;
  value?: InputMaybe<Scalars['String']>;
};

export type GChatHook = {
  __typename?: 'GChatHook';
  hookEvents: Array<Scalars['String']>;
  hookId: Scalars['ID'];
  hookType: Scalars['GChatHookType'];
  projectId: Scalars['ID'];
  url: Scalars['String'];
};

export type GenericHook = {
  __typename?: 'GenericHook';
  headers?: Maybe<Scalars['String']>;
  hookEvents: Array<Scalars['String']>;
  hookId: Scalars['ID'];
  hookType: Scalars['GenericHookType'];
  projectId: Scalars['ID'];
  url: Scalars['String'];
};

export type GithubHook = {
  __typename?: 'GithubHook';
  githubAppId?: Maybe<Scalars['String']>;
  githubAppInstallationId?: Maybe<Scalars['String']>;
  githubAppPrivateKey?: Maybe<Scalars['String']>;
  githubAuthType?: Maybe<Scalars['String']>;
  githubContext?: Maybe<Scalars['String']>;
  githubToken?: Maybe<Scalars['String']>;
  hookId: Scalars['ID'];
  hookType: Scalars['GithubHookType'];
  projectId: Scalars['ID'];
  url: Scalars['String'];
};

export type Hook = {
  __typename?: 'Hook';
  bitbucketBuildName?: Maybe<Scalars['String']>;
  bitbucketToken?: Maybe<Scalars['String']>;
  bitbucketUsername?: Maybe<Scalars['String']>;
  githubAppId?: Maybe<Scalars['String']>;
  githubAppInstallationId?: Maybe<Scalars['String']>;
  githubAppPrivateKey?: Maybe<Scalars['String']>;
  githubAuthType?: Maybe<Scalars['String']>;
  githubContext?: Maybe<Scalars['String']>;
  githubToken?: Maybe<Scalars['String']>;
  headers?: Maybe<Scalars['String']>;
  hookEvents?: Maybe<Array<Maybe<Scalars['String']>>>;
  hookId?: Maybe<Scalars['String']>;
  hookType?: Maybe<Scalars['String']>;
  slackBranchFilter?: Maybe<Array<Maybe<Scalars['String']>>>;
  slackResultFilter?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type HookInput = {
  bitbucketBuildName?: InputMaybe<Scalars['String']>;
  bitbucketToken?: InputMaybe<Scalars['String']>;
  bitbucketUsername?: InputMaybe<Scalars['String']>;
  githubAppId?: InputMaybe<Scalars['String']>;
  githubAppInstallationId?: InputMaybe<Scalars['String']>;
  githubAppPrivateKey?: InputMaybe<Scalars['String']>;
  githubAuthType?: InputMaybe<Scalars['String']>;
  githubContext?: InputMaybe<Scalars['String']>;
  githubToken?: InputMaybe<Scalars['String']>;
  headers?: InputMaybe<Scalars['String']>;
  hookEvents?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  hookId?: InputMaybe<Scalars['String']>;
  hookType?: InputMaybe<Scalars['String']>;
  slackBranchFilter?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  slackResultFilter?: InputMaybe<Scalars['String']>;
  url: Scalars['String'];
};

export type Instance = {
  __typename?: 'Instance';
  groupId: Scalars['String'];
  instanceId: Scalars['ID'];
  projectId: Scalars['String'];
  results?: Maybe<InstanceResults>;
  run: Run;
  runId: Scalars['ID'];
  spec: Scalars['String'];
};

export type InstanceResults = {
  __typename?: 'InstanceResults';
  cypressConfig?: Maybe<CypressConfig>;
  error?: Maybe<Scalars['String']>;
  reporterStats?: Maybe<ReporterStats>;
  screenshots: Array<InstanceScreeshot>;
  stats: InstanceStats;
  stdout?: Maybe<Scalars['String']>;
  tests?: Maybe<Array<InstanceTest>>;
  videoUrl?: Maybe<Scalars['String']>;
};

export type InstanceScreeshot = {
  __typename?: 'InstanceScreeshot';
  height: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  screenshotId: Scalars['String'];
  screenshotURL?: Maybe<Scalars['String']>;
  takenAt: Scalars['String'];
  testId: Scalars['String'];
  width: Scalars['Int'];
};

export type InstanceStats = {
  __typename?: 'InstanceStats';
  failures: Scalars['Int'];
  passes: Scalars['Int'];
  pending: Scalars['Int'];
  skipped: Scalars['Int'];
  suites: Scalars['Int'];
  tests: Scalars['Int'];
  wallClockDuration: Scalars['Int'];
  wallClockEndedAt: Scalars['String'];
  wallClockStartedAt: Scalars['String'];
};

export type InstanceTest = {
  __typename?: 'InstanceTest';
  attempts: Array<TestAttempt>;
  body?: Maybe<Scalars['String']>;
  displayError?: Maybe<Scalars['String']>;
  state: TestState;
  testId: Scalars['String'];
  title: Array<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createBitbucketHook: BitbucketHook;
  createGChatHook: GChatHook;
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
  updateGChatHook: GChatHook;
  updateGenericHook: GenericHook;
  updateGithubHook: GithubHook;
  updateProject: Project;
  updateSlackHook: SlackHook;
  updateTeamsHook: TeamsHook;
};

export type MutationCreateBitbucketHookArgs = {
  input: CreateBitbucketHookInput;
};

export type MutationCreateGChatHookArgs = {
  input: CreateGChatHookInput;
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
  runIds: Array<InputMaybe<Scalars['ID']>>;
};

export type MutationDeleteRunsInDateRangeArgs = {
  endDate: Scalars['DateTime'];
  startDate: Scalars['DateTime'];
};

export type MutationResetInstanceArgs = {
  instanceId: Scalars['ID'];
};

export type MutationUpdateBitbucketHookArgs = {
  input: UpdateBitbucketHookInput;
};

export type MutationUpdateGChatHookArgs = {
  input: UpdateGChatHookInput;
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

export enum OrderingOptions {
  Asc = 'ASC',
  Desc = 'DESC',
}

export type Project = {
  __typename?: 'Project';
  hooks: Array<Hook>;
  inactivityTimeoutSeconds?: Maybe<Scalars['Int']>;
  projectColor?: Maybe<Scalars['String']>;
  projectId: Scalars['ID'];
};

export type ProjectInput = {
  hooks?: InputMaybe<Array<InputMaybe<HookInput>>>;
  inactivityTimeoutSeconds?: InputMaybe<Scalars['Int']>;
  projectColor?: InputMaybe<Scalars['String']>;
  projectId: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  ciBuilds: Array<Maybe<CiBuild>>;
  instance?: Maybe<Instance>;
  project?: Maybe<Project>;
  projects: Array<Project>;
  run?: Maybe<Run>;
  runFeed: RunFeed;
  runs: Array<Maybe<Run>>;
  specStats?: Maybe<SpecStats>;
};

export type QueryCiBuildsArgs = {
  filters?: InputMaybe<Array<InputMaybe<Filters>>>;
};

export type QueryInstanceArgs = {
  id: Scalars['ID'];
};

export type QueryProjectArgs = {
  id: Scalars['ID'];
};

export type QueryProjectsArgs = {
  filters?: InputMaybe<Array<InputMaybe<Filters>>>;
  orderDirection?: InputMaybe<OrderingOptions>;
};

export type QueryRunArgs = {
  id: Scalars['ID'];
};

export type QueryRunFeedArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<Array<InputMaybe<Filters>>>;
};

export type QueryRunsArgs = {
  cursor?: InputMaybe<Scalars['String']>;
  filters?: InputMaybe<Array<InputMaybe<Filters>>>;
  orderDirection?: InputMaybe<OrderingOptions>;
};

export type QuerySpecStatsArgs = {
  filters?: InputMaybe<Array<InputMaybe<Filters>>>;
  spec: Scalars['String'];
};

export type ReporterStats = {
  __typename?: 'ReporterStats';
  duration?: Maybe<Scalars['Int']>;
  end?: Maybe<Scalars['String']>;
  failures?: Maybe<Scalars['Int']>;
  passes?: Maybe<Scalars['Int']>;
  pending?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['String']>;
  suites?: Maybe<Scalars['Int']>;
  tests?: Maybe<Scalars['Int']>;
};

export type ResetInstanceResponse = {
  __typename?: 'ResetInstanceResponse';
  instanceId: Scalars['ID'];
  message: Scalars['String'];
  success?: Maybe<Scalars['Boolean']>;
};

export type Run = {
  __typename?: 'Run';
  completion?: Maybe<RunCompletion>;
  createdAt: Scalars['DateTime'];
  meta: RunMeta;
  progress?: Maybe<RunProgress>;
  runId: Scalars['ID'];
  specs: Array<RunSpec>;
};

export type RunCompletion = {
  __typename?: 'RunCompletion';
  completed: Scalars['Boolean'];
  inactivityTimeoutMs?: Maybe<Scalars['Int']>;
};

export type RunFeed = {
  __typename?: 'RunFeed';
  cursor: Scalars['String'];
  hasMore: Scalars['Boolean'];
  runs: Array<Run>;
};

export type RunGroupProgress = {
  __typename?: 'RunGroupProgress';
  groupId: Scalars['String'];
  instances: RunGroupProgressInstances;
  tests: RunGroupProgressTests;
};

export type RunGroupProgressInstances = {
  __typename?: 'RunGroupProgressInstances';
  claimed: Scalars['Int'];
  complete: Scalars['Int'];
  failures: Scalars['Int'];
  overall: Scalars['Int'];
  passes: Scalars['Int'];
};

export type RunGroupProgressTests = {
  __typename?: 'RunGroupProgressTests';
  failures: Scalars['Int'];
  flaky: Scalars['Int'];
  overall: Scalars['Int'];
  passes: Scalars['Int'];
  pending: Scalars['Int'];
  skipped: Scalars['Int'];
};

export type RunMeta = {
  __typename?: 'RunMeta';
  ciBuildId: Scalars['String'];
  commit?: Maybe<Commit>;
  projectId: Scalars['String'];
};

export type RunProgress = {
  __typename?: 'RunProgress';
  groups: Array<RunGroupProgress>;
  updatedAt?: Maybe<Scalars['DateTime']>;
};

export type RunSpec = {
  __typename?: 'RunSpec';
  claimedAt?: Maybe<Scalars['String']>;
  completedAt?: Maybe<Scalars['String']>;
  groupId?: Maybe<Scalars['String']>;
  instanceId: Scalars['String'];
  machineId?: Maybe<Scalars['String']>;
  results?: Maybe<RunSpecResults>;
  spec: Scalars['String'];
};

export type RunSpecResults = {
  __typename?: 'RunSpecResults';
  error?: Maybe<Scalars['String']>;
  flaky?: Maybe<Scalars['Int']>;
  stats: InstanceStats;
};

export type SlackHook = {
  __typename?: 'SlackHook';
  hookEvents: Array<Scalars['String']>;
  hookId: Scalars['ID'];
  hookType: Scalars['SlackHookType'];
  projectId: Scalars['ID'];
  slackBranchFilter?: Maybe<Array<Scalars['String']>>;
  slackResultFilter?: Maybe<Scalars['SlackResultFilter']>;
  url: Scalars['String'];
};

export type SpecStats = {
  __typename?: 'SpecStats';
  avgWallClockDuration: Scalars['Int'];
  count: Scalars['Int'];
  spec: Scalars['String'];
};

export type TeamsHook = {
  __typename?: 'TeamsHook';
  hookEvents: Array<Scalars['String']>;
  hookId: Scalars['ID'];
  hookType: Scalars['TeamsHookType'];
  projectId: Scalars['ID'];
  url: Scalars['String'];
};

export type TestAttempt = {
  __typename?: 'TestAttempt';
  error?: Maybe<TestError>;
  state?: Maybe<Scalars['String']>;
  wallClockDuration?: Maybe<Scalars['Int']>;
  wallClockStartedAt?: Maybe<Scalars['String']>;
};

export type TestError = {
  __typename?: 'TestError';
  message: Scalars['String'];
  name: Scalars['String'];
  stack: Scalars['String'];
};

export enum TestState {
  Failed = 'failed',
  Passed = 'passed',
  Pending = 'pending',
  Skipped = 'skipped',
}

export type UpdateBitbucketHookInput = {
  bitbucketBuildName?: InputMaybe<Scalars['String']>;
  bitbucketToken?: InputMaybe<Scalars['String']>;
  bitbucketUsername: Scalars['String'];
  hookId: Scalars['ID'];
  projectId: Scalars['ID'];
  url?: InputMaybe<Scalars['String']>;
};

export type UpdateGChatHookInput = {
  hookEvents: Array<Scalars['String']>;
  hookId: Scalars['ID'];
  projectId: Scalars['ID'];
  url: Scalars['String'];
};

export type UpdateGenericHookInput = {
  headers?: InputMaybe<Scalars['String']>;
  hookEvents: Array<Scalars['String']>;
  hookId: Scalars['ID'];
  projectId: Scalars['ID'];
  url: Scalars['String'];
};

export type UpdateGithubHookInput = {
  githubAppId?: InputMaybe<Scalars['String']>;
  githubAppInstallationId?: InputMaybe<Scalars['String']>;
  githubAppPrivateKey?: InputMaybe<Scalars['String']>;
  githubAuthType?: InputMaybe<Scalars['String']>;
  githubContext?: InputMaybe<Scalars['String']>;
  githubToken?: InputMaybe<Scalars['String']>;
  hookId: Scalars['ID'];
  projectId: Scalars['ID'];
  url: Scalars['String'];
};

export type UpdateProjectInput = {
  inactivityTimeoutSeconds: Scalars['Int'];
  projectColor?: InputMaybe<Scalars['String']>;
  projectId: Scalars['ID'];
};

export type UpdateSlackHookInput = {
  hookEvents: Array<Scalars['String']>;
  hookId: Scalars['ID'];
  projectId: Scalars['ID'];
  slackBranchFilter?: InputMaybe<Array<Scalars['String']>>;
  slackResultFilter?: InputMaybe<Scalars['SlackResultFilter']>;
  url: Scalars['String'];
};

export type UpdateTeamsHookInput = {
  hookEvents: Array<Scalars['String']>;
  hookId: Scalars['ID'];
  projectId: Scalars['ID'];
  url: Scalars['String'];
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  BitbucketHook: ResolverTypeWrapper<BitbucketHook>;
  BitbucketHookType: ResolverTypeWrapper<Scalars['BitbucketHookType']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CiBuild: ResolverTypeWrapper<CiBuild>;
  Commit: ResolverTypeWrapper<Commit>;
  CreateBitbucketHookInput: CreateBitbucketHookInput;
  CreateGChatHookInput: CreateGChatHookInput;
  CreateGenericHookInput: CreateGenericHookInput;
  CreateGithubHookInput: CreateGithubHookInput;
  CreateProjectInput: CreateProjectInput;
  CreateSlackHookInput: CreateSlackHookInput;
  CreateTeamsHookInput: CreateTeamsHookInput;
  CypressConfig: ResolverTypeWrapper<CypressConfig>;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>;
  DeleteHookInput: DeleteHookInput;
  DeleteHookResponse: ResolverTypeWrapper<DeleteHookResponse>;
  DeleteProjectResponse: ResolverTypeWrapper<DeleteProjectResponse>;
  DeleteRunResponse: ResolverTypeWrapper<DeleteRunResponse>;
  Filters: Filters;
  GChatHook: ResolverTypeWrapper<GChatHook>;
  GChatHookType: ResolverTypeWrapper<Scalars['GChatHookType']>;
  GenericHook: ResolverTypeWrapper<GenericHook>;
  GenericHookType: ResolverTypeWrapper<Scalars['GenericHookType']>;
  GithubHook: ResolverTypeWrapper<GithubHook>;
  GithubHookType: ResolverTypeWrapper<Scalars['GithubHookType']>;
  Hook: ResolverTypeWrapper<Hook>;
  HookInput: HookInput;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Instance: ResolverTypeWrapper<Instance>;
  InstanceResults: ResolverTypeWrapper<InstanceResults>;
  InstanceScreeshot: ResolverTypeWrapper<InstanceScreeshot>;
  InstanceStats: ResolverTypeWrapper<InstanceStats>;
  InstanceTest: ResolverTypeWrapper<InstanceTest>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  OrderingOptions: OrderingOptions;
  Project: ResolverTypeWrapper<Project>;
  ProjectInput: ProjectInput;
  Query: ResolverTypeWrapper<{}>;
  ReporterStats: ResolverTypeWrapper<ReporterStats>;
  ResetInstanceResponse: ResolverTypeWrapper<ResetInstanceResponse>;
  Run: ResolverTypeWrapper<Run>;
  RunCompletion: ResolverTypeWrapper<RunCompletion>;
  RunFeed: ResolverTypeWrapper<RunFeed>;
  RunGroupProgress: ResolverTypeWrapper<RunGroupProgress>;
  RunGroupProgressInstances: ResolverTypeWrapper<RunGroupProgressInstances>;
  RunGroupProgressTests: ResolverTypeWrapper<RunGroupProgressTests>;
  RunMeta: ResolverTypeWrapper<RunMeta>;
  RunProgress: ResolverTypeWrapper<RunProgress>;
  RunSpec: ResolverTypeWrapper<RunSpec>;
  RunSpecResults: ResolverTypeWrapper<RunSpecResults>;
  SlackHook: ResolverTypeWrapper<SlackHook>;
  SlackHookType: ResolverTypeWrapper<Scalars['SlackHookType']>;
  SlackResultFilter: ResolverTypeWrapper<Scalars['SlackResultFilter']>;
  SpecStats: ResolverTypeWrapper<SpecStats>;
  String: ResolverTypeWrapper<Scalars['String']>;
  TeamsHook: ResolverTypeWrapper<TeamsHook>;
  TeamsHookType: ResolverTypeWrapper<Scalars['TeamsHookType']>;
  TestAttempt: ResolverTypeWrapper<TestAttempt>;
  TestError: ResolverTypeWrapper<TestError>;
  TestState: TestState;
  UpdateBitbucketHookInput: UpdateBitbucketHookInput;
  UpdateGChatHookInput: UpdateGChatHookInput;
  UpdateGenericHookInput: UpdateGenericHookInput;
  UpdateGithubHookInput: UpdateGithubHookInput;
  UpdateProjectInput: UpdateProjectInput;
  UpdateSlackHookInput: UpdateSlackHookInput;
  UpdateTeamsHookInput: UpdateTeamsHookInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  BitbucketHook: BitbucketHook;
  BitbucketHookType: Scalars['BitbucketHookType'];
  Boolean: Scalars['Boolean'];
  CiBuild: CiBuild;
  Commit: Commit;
  CreateBitbucketHookInput: CreateBitbucketHookInput;
  CreateGChatHookInput: CreateGChatHookInput;
  CreateGenericHookInput: CreateGenericHookInput;
  CreateGithubHookInput: CreateGithubHookInput;
  CreateProjectInput: CreateProjectInput;
  CreateSlackHookInput: CreateSlackHookInput;
  CreateTeamsHookInput: CreateTeamsHookInput;
  CypressConfig: CypressConfig;
  DateTime: Scalars['DateTime'];
  DeleteHookInput: DeleteHookInput;
  DeleteHookResponse: DeleteHookResponse;
  DeleteProjectResponse: DeleteProjectResponse;
  DeleteRunResponse: DeleteRunResponse;
  Filters: Filters;
  GChatHook: GChatHook;
  GChatHookType: Scalars['GChatHookType'];
  GenericHook: GenericHook;
  GenericHookType: Scalars['GenericHookType'];
  GithubHook: GithubHook;
  GithubHookType: Scalars['GithubHookType'];
  Hook: Hook;
  HookInput: HookInput;
  ID: Scalars['ID'];
  Instance: Instance;
  InstanceResults: InstanceResults;
  InstanceScreeshot: InstanceScreeshot;
  InstanceStats: InstanceStats;
  InstanceTest: InstanceTest;
  Int: Scalars['Int'];
  Mutation: {};
  Project: Project;
  ProjectInput: ProjectInput;
  Query: {};
  ReporterStats: ReporterStats;
  ResetInstanceResponse: ResetInstanceResponse;
  Run: Run;
  RunCompletion: RunCompletion;
  RunFeed: RunFeed;
  RunGroupProgress: RunGroupProgress;
  RunGroupProgressInstances: RunGroupProgressInstances;
  RunGroupProgressTests: RunGroupProgressTests;
  RunMeta: RunMeta;
  RunProgress: RunProgress;
  RunSpec: RunSpec;
  RunSpecResults: RunSpecResults;
  SlackHook: SlackHook;
  SlackHookType: Scalars['SlackHookType'];
  SlackResultFilter: Scalars['SlackResultFilter'];
  SpecStats: SpecStats;
  String: Scalars['String'];
  TeamsHook: TeamsHook;
  TeamsHookType: Scalars['TeamsHookType'];
  TestAttempt: TestAttempt;
  TestError: TestError;
  UpdateBitbucketHookInput: UpdateBitbucketHookInput;
  UpdateGChatHookInput: UpdateGChatHookInput;
  UpdateGenericHookInput: UpdateGenericHookInput;
  UpdateGithubHookInput: UpdateGithubHookInput;
  UpdateProjectInput: UpdateProjectInput;
  UpdateSlackHookInput: UpdateSlackHookInput;
  UpdateTeamsHookInput: UpdateTeamsHookInput;
};

export type BitbucketHookResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['BitbucketHook'] = ResolversParentTypes['BitbucketHook']
> = {
  bitbucketBuildName?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  bitbucketToken?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  bitbucketUsername?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  hookId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  hookType?: Resolver<
    ResolversTypes['BitbucketHookType'],
    ParentType,
    ContextType
  >;
  projectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface BitbucketHookTypeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['BitbucketHookType'], any> {
  name: 'BitbucketHookType';
}

export type CiBuildResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CiBuild'] = ResolversParentTypes['CiBuild']
> = {
  ciBuildId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  runs?: Resolver<Array<ResolversTypes['Run']>, ParentType, ContextType>;
  updatedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommitResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Commit'] = ResolversParentTypes['Commit']
> = {
  authorEmail?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  authorName?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  branch?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  remoteOrigin?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  sha?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CypressConfigResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CypressConfig'] = ResolversParentTypes['CypressConfig']
> = {
  video?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  videoUploadOnPasses?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type DeleteHookResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DeleteHookResponse'] = ResolversParentTypes['DeleteHookResponse']
> = {
  hookId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteProjectResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DeleteProjectResponse'] = ResolversParentTypes['DeleteProjectResponse']
> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  projectIds?: Resolver<
    Array<Maybe<ResolversTypes['ID']>>,
    ParentType,
    ContextType
  >;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteRunResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['DeleteRunResponse'] = ResolversParentTypes['DeleteRunResponse']
> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  runIds?: Resolver<
    Array<Maybe<ResolversTypes['ID']>>,
    ParentType,
    ContextType
  >;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GChatHookResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['GChatHook'] = ResolversParentTypes['GChatHook']
> = {
  hookEvents?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  hookId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  hookType?: Resolver<ResolversTypes['GChatHookType'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface GChatHookTypeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['GChatHookType'], any> {
  name: 'GChatHookType';
}

export type GenericHookResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['GenericHook'] = ResolversParentTypes['GenericHook']
> = {
  headers?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hookEvents?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  hookId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  hookType?: Resolver<
    ResolversTypes['GenericHookType'],
    ParentType,
    ContextType
  >;
  projectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface GenericHookTypeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['GenericHookType'], any> {
  name: 'GenericHookType';
}

export type GithubHookResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['GithubHook'] = ResolversParentTypes['GithubHook']
> = {
  githubAppId?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  githubAppInstallationId?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  githubAppPrivateKey?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  githubAuthType?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  githubContext?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  githubToken?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  hookId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  hookType?: Resolver<
    ResolversTypes['GithubHookType'],
    ParentType,
    ContextType
  >;
  projectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface GithubHookTypeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['GithubHookType'], any> {
  name: 'GithubHookType';
}

export type HookResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Hook'] = ResolversParentTypes['Hook']
> = {
  bitbucketBuildName?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  bitbucketToken?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  bitbucketUsername?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  githubAppId?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  githubAppInstallationId?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  githubAppPrivateKey?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  githubAuthType?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  githubContext?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  githubToken?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  headers?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hookEvents?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType
  >;
  hookId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hookType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  slackBranchFilter?: Resolver<
    Maybe<Array<Maybe<ResolversTypes['String']>>>,
    ParentType,
    ContextType
  >;
  slackResultFilter?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InstanceResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Instance'] = ResolversParentTypes['Instance']
> = {
  groupId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  instanceId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  results?: Resolver<
    Maybe<ResolversTypes['InstanceResults']>,
    ParentType,
    ContextType
  >;
  run?: Resolver<ResolversTypes['Run'], ParentType, ContextType>;
  runId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  spec?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InstanceResultsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['InstanceResults'] = ResolversParentTypes['InstanceResults']
> = {
  cypressConfig?: Resolver<
    Maybe<ResolversTypes['CypressConfig']>,
    ParentType,
    ContextType
  >;
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reporterStats?: Resolver<
    Maybe<ResolversTypes['ReporterStats']>,
    ParentType,
    ContextType
  >;
  screenshots?: Resolver<
    Array<ResolversTypes['InstanceScreeshot']>,
    ParentType,
    ContextType
  >;
  stats?: Resolver<ResolversTypes['InstanceStats'], ParentType, ContextType>;
  stdout?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tests?: Resolver<
    Maybe<Array<ResolversTypes['InstanceTest']>>,
    ParentType,
    ContextType
  >;
  videoUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InstanceScreeshotResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['InstanceScreeshot'] = ResolversParentTypes['InstanceScreeshot']
> = {
  height?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  screenshotId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  screenshotURL?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  takenAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  testId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  width?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InstanceStatsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['InstanceStats'] = ResolversParentTypes['InstanceStats']
> = {
  failures?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  passes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pending?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  skipped?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  suites?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tests?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  wallClockDuration?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  wallClockEndedAt?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  wallClockStartedAt?: Resolver<
    ResolversTypes['String'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InstanceTestResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['InstanceTest'] = ResolversParentTypes['InstanceTest']
> = {
  attempts?: Resolver<
    Array<ResolversTypes['TestAttempt']>,
    ParentType,
    ContextType
  >;
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  displayError?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  state?: Resolver<ResolversTypes['TestState'], ParentType, ContextType>;
  testId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = {
  createBitbucketHook?: Resolver<
    ResolversTypes['BitbucketHook'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateBitbucketHookArgs, 'input'>
  >;
  createGChatHook?: Resolver<
    ResolversTypes['GChatHook'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateGChatHookArgs, 'input'>
  >;
  createGenericHook?: Resolver<
    ResolversTypes['GenericHook'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateGenericHookArgs, 'input'>
  >;
  createGithubHook?: Resolver<
    ResolversTypes['GithubHook'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateGithubHookArgs, 'input'>
  >;
  createProject?: Resolver<
    ResolversTypes['Project'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateProjectArgs, 'project'>
  >;
  createSlackHook?: Resolver<
    ResolversTypes['SlackHook'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateSlackHookArgs, 'input'>
  >;
  createTeamsHook?: Resolver<
    ResolversTypes['TeamsHook'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateTeamsHookArgs, 'input'>
  >;
  deleteHook?: Resolver<
    ResolversTypes['DeleteHookResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteHookArgs, 'input'>
  >;
  deleteProject?: Resolver<
    ResolversTypes['DeleteProjectResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteProjectArgs, 'projectId'>
  >;
  deleteRun?: Resolver<
    ResolversTypes['DeleteRunResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteRunArgs, 'runId'>
  >;
  deleteRuns?: Resolver<
    ResolversTypes['DeleteRunResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteRunsArgs, 'runIds'>
  >;
  deleteRunsInDateRange?: Resolver<
    ResolversTypes['DeleteRunResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteRunsInDateRangeArgs, 'endDate' | 'startDate'>
  >;
  resetInstance?: Resolver<
    ResolversTypes['ResetInstanceResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationResetInstanceArgs, 'instanceId'>
  >;
  updateBitbucketHook?: Resolver<
    ResolversTypes['BitbucketHook'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateBitbucketHookArgs, 'input'>
  >;
  updateGChatHook?: Resolver<
    ResolversTypes['GChatHook'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateGChatHookArgs, 'input'>
  >;
  updateGenericHook?: Resolver<
    ResolversTypes['GenericHook'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateGenericHookArgs, 'input'>
  >;
  updateGithubHook?: Resolver<
    ResolversTypes['GithubHook'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateGithubHookArgs, 'input'>
  >;
  updateProject?: Resolver<
    ResolversTypes['Project'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateProjectArgs, 'input'>
  >;
  updateSlackHook?: Resolver<
    ResolversTypes['SlackHook'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateSlackHookArgs, 'input'>
  >;
  updateTeamsHook?: Resolver<
    ResolversTypes['TeamsHook'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateTeamsHookArgs, 'input'>
  >;
};

export type ProjectResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Project'] = ResolversParentTypes['Project']
> = {
  hooks?: Resolver<Array<ResolversTypes['Hook']>, ParentType, ContextType>;
  inactivityTimeoutSeconds?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >;
  projectColor?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  projectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
  ciBuilds?: Resolver<
    Array<Maybe<ResolversTypes['CiBuild']>>,
    ParentType,
    ContextType,
    RequireFields<QueryCiBuildsArgs, 'filters'>
  >;
  instance?: Resolver<
    Maybe<ResolversTypes['Instance']>,
    ParentType,
    ContextType,
    RequireFields<QueryInstanceArgs, 'id'>
  >;
  project?: Resolver<
    Maybe<ResolversTypes['Project']>,
    ParentType,
    ContextType,
    RequireFields<QueryProjectArgs, 'id'>
  >;
  projects?: Resolver<
    Array<ResolversTypes['Project']>,
    ParentType,
    ContextType,
    RequireFields<QueryProjectsArgs, 'filters' | 'orderDirection'>
  >;
  run?: Resolver<
    Maybe<ResolversTypes['Run']>,
    ParentType,
    ContextType,
    RequireFields<QueryRunArgs, 'id'>
  >;
  runFeed?: Resolver<
    ResolversTypes['RunFeed'],
    ParentType,
    ContextType,
    RequireFields<QueryRunFeedArgs, 'filters'>
  >;
  runs?: Resolver<
    Array<Maybe<ResolversTypes['Run']>>,
    ParentType,
    ContextType,
    RequireFields<QueryRunsArgs, 'cursor' | 'filters' | 'orderDirection'>
  >;
  specStats?: Resolver<
    Maybe<ResolversTypes['SpecStats']>,
    ParentType,
    ContextType,
    RequireFields<QuerySpecStatsArgs, 'filters' | 'spec'>
  >;
};

export type ReporterStatsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ReporterStats'] = ResolversParentTypes['ReporterStats']
> = {
  duration?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  end?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  failures?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  passes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  pending?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  start?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  suites?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  tests?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ResetInstanceResponseResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ResetInstanceResponse'] = ResolversParentTypes['ResetInstanceResponse']
> = {
  instanceId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RunResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Run'] = ResolversParentTypes['Run']
> = {
  completion?: Resolver<
    Maybe<ResolversTypes['RunCompletion']>,
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  meta?: Resolver<ResolversTypes['RunMeta'], ParentType, ContextType>;
  progress?: Resolver<
    Maybe<ResolversTypes['RunProgress']>,
    ParentType,
    ContextType
  >;
  runId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  specs?: Resolver<Array<ResolversTypes['RunSpec']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RunCompletionResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RunCompletion'] = ResolversParentTypes['RunCompletion']
> = {
  completed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  inactivityTimeoutMs?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RunFeedResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RunFeed'] = ResolversParentTypes['RunFeed']
> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasMore?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  runs?: Resolver<Array<ResolversTypes['Run']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RunGroupProgressResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RunGroupProgress'] = ResolversParentTypes['RunGroupProgress']
> = {
  groupId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  instances?: Resolver<
    ResolversTypes['RunGroupProgressInstances'],
    ParentType,
    ContextType
  >;
  tests?: Resolver<
    ResolversTypes['RunGroupProgressTests'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RunGroupProgressInstancesResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RunGroupProgressInstances'] = ResolversParentTypes['RunGroupProgressInstances']
> = {
  claimed?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  complete?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  failures?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  overall?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  passes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RunGroupProgressTestsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RunGroupProgressTests'] = ResolversParentTypes['RunGroupProgressTests']
> = {
  failures?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  flaky?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  overall?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  passes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pending?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  skipped?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RunMetaResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RunMeta'] = ResolversParentTypes['RunMeta']
> = {
  ciBuildId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  commit?: Resolver<Maybe<ResolversTypes['Commit']>, ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RunProgressResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RunProgress'] = ResolversParentTypes['RunProgress']
> = {
  groups?: Resolver<
    Array<ResolversTypes['RunGroupProgress']>,
    ParentType,
    ContextType
  >;
  updatedAt?: Resolver<
    Maybe<ResolversTypes['DateTime']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RunSpecResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RunSpec'] = ResolversParentTypes['RunSpec']
> = {
  claimedAt?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  completedAt?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  groupId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  instanceId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  machineId?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  results?: Resolver<
    Maybe<ResolversTypes['RunSpecResults']>,
    ParentType,
    ContextType
  >;
  spec?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RunSpecResultsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['RunSpecResults'] = ResolversParentTypes['RunSpecResults']
> = {
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  flaky?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  stats?: Resolver<ResolversTypes['InstanceStats'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SlackHookResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SlackHook'] = ResolversParentTypes['SlackHook']
> = {
  hookEvents?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  hookId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  hookType?: Resolver<ResolversTypes['SlackHookType'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  slackBranchFilter?: Resolver<
    Maybe<Array<ResolversTypes['String']>>,
    ParentType,
    ContextType
  >;
  slackResultFilter?: Resolver<
    Maybe<ResolversTypes['SlackResultFilter']>,
    ParentType,
    ContextType
  >;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface SlackHookTypeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['SlackHookType'], any> {
  name: 'SlackHookType';
}

export interface SlackResultFilterScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['SlackResultFilter'], any> {
  name: 'SlackResultFilter';
}

export type SpecStatsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['SpecStats'] = ResolversParentTypes['SpecStats']
> = {
  avgWallClockDuration?: Resolver<
    ResolversTypes['Int'],
    ParentType,
    ContextType
  >;
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  spec?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TeamsHookResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TeamsHook'] = ResolversParentTypes['TeamsHook']
> = {
  hookEvents?: Resolver<
    Array<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  hookId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  hookType?: Resolver<ResolversTypes['TeamsHookType'], ParentType, ContextType>;
  projectId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface TeamsHookTypeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['TeamsHookType'], any> {
  name: 'TeamsHookType';
}

export type TestAttemptResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TestAttempt'] = ResolversParentTypes['TestAttempt']
> = {
  error?: Resolver<Maybe<ResolversTypes['TestError']>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  wallClockDuration?: Resolver<
    Maybe<ResolversTypes['Int']>,
    ParentType,
    ContextType
  >;
  wallClockStartedAt?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TestErrorResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['TestError'] = ResolversParentTypes['TestError']
> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  stack?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  BitbucketHook?: BitbucketHookResolvers<ContextType>;
  BitbucketHookType?: GraphQLScalarType;
  CiBuild?: CiBuildResolvers<ContextType>;
  Commit?: CommitResolvers<ContextType>;
  CypressConfig?: CypressConfigResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  DeleteHookResponse?: DeleteHookResponseResolvers<ContextType>;
  DeleteProjectResponse?: DeleteProjectResponseResolvers<ContextType>;
  DeleteRunResponse?: DeleteRunResponseResolvers<ContextType>;
  GChatHook?: GChatHookResolvers<ContextType>;
  GChatHookType?: GraphQLScalarType;
  GenericHook?: GenericHookResolvers<ContextType>;
  GenericHookType?: GraphQLScalarType;
  GithubHook?: GithubHookResolvers<ContextType>;
  GithubHookType?: GraphQLScalarType;
  Hook?: HookResolvers<ContextType>;
  Instance?: InstanceResolvers<ContextType>;
  InstanceResults?: InstanceResultsResolvers<ContextType>;
  InstanceScreeshot?: InstanceScreeshotResolvers<ContextType>;
  InstanceStats?: InstanceStatsResolvers<ContextType>;
  InstanceTest?: InstanceTestResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Project?: ProjectResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  ReporterStats?: ReporterStatsResolvers<ContextType>;
  ResetInstanceResponse?: ResetInstanceResponseResolvers<ContextType>;
  Run?: RunResolvers<ContextType>;
  RunCompletion?: RunCompletionResolvers<ContextType>;
  RunFeed?: RunFeedResolvers<ContextType>;
  RunGroupProgress?: RunGroupProgressResolvers<ContextType>;
  RunGroupProgressInstances?: RunGroupProgressInstancesResolvers<ContextType>;
  RunGroupProgressTests?: RunGroupProgressTestsResolvers<ContextType>;
  RunMeta?: RunMetaResolvers<ContextType>;
  RunProgress?: RunProgressResolvers<ContextType>;
  RunSpec?: RunSpecResolvers<ContextType>;
  RunSpecResults?: RunSpecResultsResolvers<ContextType>;
  SlackHook?: SlackHookResolvers<ContextType>;
  SlackHookType?: GraphQLScalarType;
  SlackResultFilter?: GraphQLScalarType;
  SpecStats?: SpecStatsResolvers<ContextType>;
  TeamsHook?: TeamsHookResolvers<ContextType>;
  TeamsHookType?: GraphQLScalarType;
  TestAttempt?: TestAttemptResolvers<ContextType>;
  TestError?: TestErrorResolvers<ContextType>;
};
