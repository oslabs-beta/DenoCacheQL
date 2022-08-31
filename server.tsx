//using Oak a middleware framework for Deno
import {  Application, Router } from 'https://deno.land/x/oak/mod.ts';
//Deno and postgress middleware
import { Client } from "https://deno.land/x/postgres@v0.16.1/mod.ts";
//Redis connection
import { redis } from './server/redis.ts'
//GraphQl definitions and deno middlesware
import { applyGraphQL, gql } from 'https://deno.land/x/oak_graphql/mod.ts';
import { typeDefs, resolvers } from './server/graphql.ts';
//Serving frontend
import staticFiles from 'https://deno.land/x/static_files@1.1.6/mod.ts';
import ReactDOMServer from "https://esm.sh/react-dom@18.2.0/server";
import App from './client/App.tsx';
import {React} from "./deps.ts";



const app = new Application();
const router = new Router();
const PORT = 3000;

app.use(router.routes());
app.use(router.allowedMethods());

//serving frontend
router.get('/', handlePage);
app.use(staticFiles("/client/"));

function handlePage(ctx:any){
  try{
    const body = (ReactDOMServer).renderToString(<App/>);
  ctx.response.body = `<!DOCTYPE html>
 <html lang="en">
   <head>
   <meta charset="UTF-8">
   <link rel="stylesheet" type="text/css" href="/static/style.css">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">   
   <title>DenoCacheQL Demo</title>
   </head>
 <body >
   <div id="root">${body}</div>
 </body>
 </html>`;
 } catch (error) {
   console.error(error);
  }
}

//GraphQl
const GraphQLService = await applyGraphQL<Router>({
  Router,
  typeDefs,
  resolvers,
  context: (ctx) => {}
  });

app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

//redis
console.log(await redis.ping());

//database
const databaseURL = 'postgres://cdfnqalb:5M9CGQwdkSUEnyyRy7xTU5tixqFkVDaH@drona.db.elephantsql.com/cdfnqalb';
const client = new Client(databaseURL)
await client.connect();

//checking server connection
app.addEventListener('listen', ({ secure, hostname, port}) => {
  const protocol = secure ? 'https://' : 'http://';
  const url = `${protocol}${hostname ?? "localhost"}: ${port}`;
  console.log(`Listening on: ${port}`);
});

await app.listen( {port: PORT});


export { client }


