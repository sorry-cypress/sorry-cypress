import { RunsAPI } from './runs';
import { InstancesAPI } from './instances';
import { ProjectsAPI } from './projects';
import { SpecsAPI } from './specs';

export interface AppDatasources {
  runsAPI: RunsAPI;
  instancesAPI: InstancesAPI;
  projectsAPI: ProjectsAPI;
  specsAPI: SpecsAPI;
}

export interface SpecStats {
  spec: string;
  avgWallClockDuration: number;
  count: number;
}
