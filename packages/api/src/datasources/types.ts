import { InstancesAPI } from './instances';
import { ProjectsAPI } from './projects';
import { RunsAPI } from './runs';
import { RunTimeoutAPI } from './runTimeout';
import { SpecsAPI } from './specs';

export interface AppDatasources {
  runsAPI: RunsAPI;
  instancesAPI: InstancesAPI;
  projectsAPI: ProjectsAPI;
  specsAPI: SpecsAPI;
  runTimeoutAPI: RunTimeoutAPI;
}

export interface SpecStats {
  spec: string;
  avgWallClockDuration: number;
  count: number;
}
