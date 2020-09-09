import { RunsAPI } from './runs';
import { InstancesAPI } from './instances';
import { ProjectsAPI } from './projects';

export interface AppDatasources {
  runsAPI: RunsAPI;
  instancesAPI: InstancesAPI;
  projectsAPI: ProjectsAPI;
}
