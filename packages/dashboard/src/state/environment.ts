export interface Environment {
  GRAPHQL_CLIENT_CREDENTIALS: string;
  GRAPHQL_SCHEMA_URL: string;
  CI_URL: string;
  COLOR_INDEX: number;
}

export const environment: Environment = {
  ...{
    GRAPHQL_CLIENT_CREDENTIALS: '',
    GRAPHQL_SCHEMA_URL: 'http://localhost:4000',
    CI_URL: '',
    COLOR_INDEX: 0,
  },
  ...((window.__sorryCypressEnvironment as Environment) || {}),
};
