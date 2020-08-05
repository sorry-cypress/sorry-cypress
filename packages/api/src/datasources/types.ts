import { RunsAPI } from './runs';
import { InstancesAPI } from './instances';

export interface AppDatasources {
  runsAPI: RunsAPI;
  instancesAPI: InstancesAPI;
}
