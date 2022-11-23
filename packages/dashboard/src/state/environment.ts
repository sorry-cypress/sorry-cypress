export interface Environment {
  GRAPHQL_CLIENT_CREDENTIALS: string;
  GRAPHQL_SCHEMA_URL: string;
  CI_URL: string;
  USE_SSL_FOR_LINKS: boolean;
}

export const environment: Environment = {
  ...{
    GRAPHQL_CLIENT_CREDENTIALS: '',
    GRAPHQL_SCHEMA_URL: 'http://localhost:4000',
    CI_URL: '',
    USE_SSL_FOR_LINKS: 'true',
  },
  ...((window.__sorryCypressEnvironment as Environment) || {}),
};
