import {
  getRedisValue,
  redis,
  redisExpirationListener,
  setInactivityTimeout,
} from '../redis';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

afterAll(() => {
  redisExpirationListener.end(true);
  redis.end(true);
});

test('reschedules redis event', async () => {
  const runId = 'some2';
  await setInactivityTimeout(runId, 500);
  await wait(400);
  await setInactivityTimeout(runId, 500);
  await wait(300);

  expect(await getRedisValue(runId)).toBe(runId);
});

test('gets notification on expiration', async () => {
  const runId = 'expired';
  setInactivityTimeout(runId, 500);

  const onMessage = new Promise((resolve) => {
    redisExpirationListener.on('message', function (channel, message) {
      if (runId !== message) {
        return;
      }
      resolve(message);
    });
  });

  expect(await onMessage).toBe(runId);
});
