import { URL } from 'url';

export const getRedisConnection = (uri: string) => {
  const parsed = new URL(uri);
  
  return {
    host: parsed.hostname || 'localhost',
    port: Number(parsed.port || 6379),
    db: Number((parsed.pathname || '/0').substr(1) || '0'),
    password: parsed.password ? decodeURIComponent(parsed.password) : null,
  };
};
