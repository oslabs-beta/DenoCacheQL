export type AppProps = {
  responseTimes: Array<string>
}

// export declare class Chart {
//   id: string;
// }
export type queryResponse = {
  response?: Record<string, unknown>;
  source?: string | null;
  time?: string | null;
};

export type latency = Array<string | null>;

export type RedisInfo = {
    hostname: string,
    port: number,
    password?: string
}

export type DenoCacheArgs = {
    typeDefs: Record<string, unknown>,
    resolvers: Record<string, unknown>,
    redisInfo: RedisInfo,
}