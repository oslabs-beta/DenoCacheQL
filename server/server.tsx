//using Oak a middleware framework for Deno
import {
  Application,
  Context,
  Router,
} from 'https://deno.land/x/oak@v11.1.0/mod.ts';
import { Client } from 'https://deno.land/x/postgres@v0.16.1/mod.ts';
import { redis } from '../server/redis.ts';
import DenoCache from './denoCache.ts';
import resolvers from './schema.ts';
import typeDefs from './schema.ts';
import schema from './schema.ts';

const app = new Application();
const router = new Router();

const PORT = 8080;

const dc = new DenoCache({
  //route: '/graphql',
  typeDefs,
  resolvers,
});

//redis
console.log(await redis.ping());

//database
const databaseURL =
  'postgres://cdfnqalb:5M9CGQwdkSUEnyyRy7xTU5tixqFkVDaH@drona.db.elephantsql.com/cdfnqalb';
const client = new Client(databaseURL);
await client.connect();

// ---------server demo html page-----------
const demoHTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1>Welcome to the Demo Page</h1>
  </body>
</html>`;

router.get('/', (context: Context) => {
  context.response.type = 'text/html';
  context.response.body = demoHTML;
});

app.use(router.routes());
//------end serve demo html page ------

app.use(dc.routes());
app.use(dc.allowedMethods());

//checking server connection

app.addEventListener('listen', ({ secure, hostname, port }) => {
  const protocol = secure ? 'https://' : 'http://';
  const url = `${protocol}${hostname ?? 'localhost'}: ${port}`;
  console.log(`Listening on: ${port}`);
});

await app.listen({ port: PORT });

export { client };
