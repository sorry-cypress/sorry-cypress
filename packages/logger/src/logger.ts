import pino from 'pino';

const pinoLogger = pino({
  base: null,
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  prettyPrint:
    process.env.NODE_ENV === 'production'
      ? false
      : {
          translateTime: true,
          singleLine: true,
        },
  serializers: {
    error: pino.stdSerializers.err,
    err: pino.stdSerializers.err,
  },
});

export const createLogger = (requestId?: string) => {
  const logger = pinoLogger.child(
    requestId
      ? {
          requestId,
        }
      : {}
  );
  logger.log = logger.info;
  // logger.error = pinoLogger[Symbol.for(pino.stdSerializers.err)];
  return logger;
};
