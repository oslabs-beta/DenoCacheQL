//using Oak a middleware framework for Deno
import { Application } from 'https://deno.land/x/oak@v11.1.0/mod.ts';
//Postgres connection
import { Client } from 'https://deno.land/x/postgres@v0.16.1/mod.ts';
//importing DenoCache, resolvers, and typedefs
import  {DenoCacheQL}  from 'https://deno.land/x/denocacheql@v0.0.1/mod.ts'
import resolvers from "./schema.ts"
import typeDefs from "./schema.ts"

//starting our server
const app = new Application();

const PORT = 3000;

//importing DenoCache
const dc = new DenoCacheQL({
  typeDefs,
  resolvers, 
  redisInfo: {
    hostname: "redis-15210.c91.us-east-1-3.ec2.cloud.redislabs.com",
    port: 15210,
    password: "1eyX8AGHDPj961FSiCaaNrcG4a995swi",
  }
})

//database
const databaseURL =
  'postgres://cdfnqalb:5M9CGQwdkSUEnyyRy7xTU5tixqFkVDaH@drona.db.elephantsql.com/cdfnqalb';
const client = new Client(databaseURL);
await client.connect();


//methods so that our function works
app.use(dc.routes());
app.use(dc.allowedMethods());


//checking server connection
app.addEventListener('listen', ({ secure, hostname, port }) => {
  const protocol = secure ? 'https://' : 'http://';
  const url = `${protocol}${hostname ?? 'localhost'}: ${port}`;
  console.log(`Listening on: ${port}`);
});

await app.listen({ port: PORT });

export { client, dc };
