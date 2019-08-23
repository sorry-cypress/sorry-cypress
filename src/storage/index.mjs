import uuid from 'uuid/v4';

const runs = {};
export const getRunById = async id => {
  return runs[id];
};

export const createRun = async (id, specs = []) => {
  if (runs[id]) {
    throw new Error('Cannot create already existing run');
  }
  runs[id] = [];
  specs.forEach(spec =>
    runs[id].push({
      spec,
      instanceId: uuid(),
      claimed: false
    })
  );
  return runs[id];
};

export const updateRun = async (id, run) => {
  runs[id] = run;
  return runs[id];
};
