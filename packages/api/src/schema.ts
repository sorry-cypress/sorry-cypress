import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    runs: [Run]!
    run(id: ID!): Run
  }

  type Run {
    runId: ID!
    meta: RunMeta
    specs: [RunSpec]
  }

  type RunSpec {
    spec: String!
    instanceId: String!
    claimed: Boolean!
  }

  type RunMeta {
    groupId: String
    ciBuildId: String
    projectId: String
    commit: Commit
  }

  type Commit {
    sha: String
    branch: String
    authorName: String
    authorEmail: String
    message: String
    remoteOrigin: String
  }
`;
