import uuid from 'uuid/v4';
import { RUN_EXISTS } from './errors.mjs';

const runs = {};
export const getRunById = async id => {
  return runs[id];
};

export const createRun = async (id, { specs = [] }) => {
  if (runs[id]) {
    throw new Error(RUN_EXISTS);
  }
  const newRun = {
    runId: id,
    spec: []
  };
  specs.forEach(spec =>
    newRun.specs.push({
      spec,
      instanceId: uuid(),
      claimed: false
    })
  );
  runs[id] = newRun;
  return runs[id];
};

export const updateRun = async (id, run) => {
  runs[id] = run;
  return runs[id];
};
