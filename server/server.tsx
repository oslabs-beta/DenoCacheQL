//using Oak a middleware framework for Deno
import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { Client } from 'https://deno.land/x/postgres@v0.16.1/mod.ts';
import { redis } from '../server/redis.ts';
import  DenoCache  from './denoCache.ts'
import resolvers from "./schema.ts"
import typeDefs from "./schema.ts"
import schema from "./schema.ts"

const app = new Application();

const PORT = 3000;

const dc = new DenoCache({
  route: '/graphql',
  schema: schema,
})

//redis
console.log(await redis.ping());

//database
const databaseURL =
  'postgres://cdfnqalb:5M9CGQwdkSUEnyyRy7xTU5tixqFkVDaH@drona.db.elephantsql.com/cdfnqalb';
const client = new Client(databaseURL);
await client.connect();

app.use(dc.routes());
app.use(dc.allowedMethods());

//checking server connection

app.addEventListener('listen', ({ secure, hostname, port}) => {
  const protocol = secure ? 'https://' : 'http://';
  const url = `${protocol}${hostname ?? "localhost"}: ${port}`;
  console.log(`Listening on: ${port}`);
});

await app.listen( {port: PORT});

export { client }
