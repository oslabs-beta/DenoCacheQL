export type AppProps = {
  responseTimes: Array<number>
}

export type Canvas = {
  
}

export type queryResponse = {
  response?: object;
  source?: string | null;
  time?: string | null;
}

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