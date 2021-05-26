import { RunTimeout } from '@sorry-cypress/common';
import { Cursor, ObjectID, WithId } from 'mongodb';
import { Collection } from './db';

interface CreateRunTimeoutParams {
  runId: string;
  timeoutSeconds: number;
  timeoutAfter: Date;
}
export const createRunTimeout = async (params: CreateRunTimeoutParams) => {
  return Collection.runTimeout().insertOne({ ...params, checkedOn: null });
};

export const getUncheckedRunTimeouts = async () => {
  return Collection.runTimeout().find({
    timeoutAfter: {
      $lt: new Date(),
    },
    checkedOn: null,
  }) as Cursor<WithId<RunTimeout>>;
};

export const setRunTimeoutChecked = async (_id: ObjectID) => {
  Collection.runTimeout().updateOne(
    { _id, checkedOn: null },
    {
      $set: { checkedOn: new Date() },
    }
  );
};
