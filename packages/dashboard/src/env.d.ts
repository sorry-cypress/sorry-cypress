import { Environment } from './state/environment';

declare global {
  interface Window {
    __sorryCypressEnvironment: Environment;
  }
}
