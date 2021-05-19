import { createClient, RedisClient } from 'redis';
import { promisify } from 'util';
import { ILogger, ICache, SetAsyncMode, Config } from './definitions';

let retryConnectAttempt = 0;

export class RedisCache implements ICache {
  client: RedisClient;
  logger: ILogger;

  getAsync: (key: string) => Promise<string | null>;

  setAsync: (
    key: string,
    value: string,
    mode?: SetAsyncMode,
    duration?: number
  ) => Promise<unknown>;
  delAsync: (key: string) => Promise<number>;
  expireAsync: (key: string, second: number) => Promise<number>;
  incrByAsync: (key: string, increment: number) => Promise<number>;
  decrByAsync: (key: string, decrement: number) => Promise<number>;

  constructor({ host = '0.0.0.0', port = 6379, password = '' }: Config, logger?: ILogger) {
    this.client = createClient({
      host,
      port,
      password
    });
    this.logger = logger || console;
    this.listen();

    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);
    this.incrByAsync = promisify(this.client.incrby).bind(this.client);
    this.decrByAsync = promisify(this.client.decrby).bind(this.client);
    this.expireAsync = promisify(this.client.expire).bind(this.client);
  }

  private listen() {
    this.client.on('error', (error: any) => {
      this.logger.error(error.message);
    });

    this.client.on('ready', () => {
      this.logger.info('Connected to Redis');
      retryConnectAttempt = 0;
    });

    this.client.on('connect', () => {
      this.logger.info('Connecting to Redis');
      retryConnectAttempt = 0;
    });

    this.client.on('reconnecting', () => {
      this.logger.info('Reconnecting to Redis');

      if (retryConnectAttempt > 10) {
        process.exit(1);
      }
      retryConnectAttempt++;
    });
  }
}
