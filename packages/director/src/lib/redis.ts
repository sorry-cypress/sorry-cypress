import Redis from 'redis';
import { promisify } from 'util';

console.log('Connecting to redis...');
export const createClient = () =>
  Redis.createClient({
    host: '127.0.0.1',
    port: 6379,
  });

export const redisExpirationListener = createClient();

redisExpirationListener.on('ready', () => {
  redisExpirationListener.config('SET', 'notify-keyspace-events', 'Ex');
  redisExpirationListener.subscribe('__keyevent@0__:expired');
});

export const redis = createClient();
const psetex = promisify(redis.psetex).bind(redis);

export const getRedisValue = promisify(redis.get).bind(redis);
export const setInactivityTimeout = async (
  runId: string,
  expirationMs: number
) => {
  console.log('REDIS: setting inactivity timeout');
  psetex(runId, expirationMs, runId);
};
