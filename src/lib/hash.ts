import md5 = require('md5');
import uuid = require('uuid');
import { CreateRunParameters, PlatformData } from 'types/run.types';

export const generateRunIdHash = ({
  ciBuildId,
  commit,
  projectId,
  specs
}: CreateRunParameters): string =>
  md5(ciBuildId + commit.sha + projectId + specs.join(' '));

// not sure how specific that should be
export const generateGroupId = (
  platform: PlatformData,
  ciBuildId: string
): string => `${platform.osName}-${platform.osVersion}-${ciBuildId}`;

export const generateUUID = () => uuid();
