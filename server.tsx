//using Oak a middleware framework for Deno
import {  Application, Context, Router } from 'https://deno.land/x/oak/mod.ts';
import { Client } from "https://deno.land/x/postgres@v0.16.1/mod.ts";
import { redis } from './server/redis.ts'
import { applyGraphQL, gql } from 'https://deno.land/x/oak_graphql/mod.ts';
import { typeDefs, resolvers } from './server/graphql.ts';
import staticFiles from 'https://deno.land/x/static_files@1.1.6/mod.ts';
import ReactDOMServer from 'https://esm.sh/react-dom/server';
import App from './client/App.tsx';
import React from "https://esm.sh/v92/@types/react@18.0.17/index";

const app = new Application();
const router = new Router();
const PORT = 3000;

const GraphQLService = await applyGraphQL<Router>({
  Router,
  typeDefs,
  resolvers,
  context: (ctx) => {}
  });

 router.get('/', handlePage);
 
 //bundle client-side code
 const [_,clientJS] = await Deno.bundle('./client/client.tsx')

 //router for bundle
 const serverrouter = new Router();
serverrouter.get('/static/client.js', (context) =>{
  context.response.headers.set('Content-Type', 'text/html');
  context.response.body = clientJS;
})

app.use(staticFiles("src/client/"));
app.use(router.routes());
app.use(serverrouter.routes());
app.use(router.allowedMethods());
app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

app.addEventListener('listen', ({ secure, hostname, port}) => {
    const protocol = secure ? 'https://' : 'http://';
    const url = `${protocol}${hostname ?? "localhost"}: ${port}`;
    console.log(`Listening on: ${port}`);
});

console.log(await redis.ping());

const databaseURL = 'postgres://cdfnqalb:5M9CGQwdkSUEnyyRy7xTU5tixqFkVDaH@drona.db.elephantsql.com/cdfnqalb';
const client = new Client(databaseURL)
await client.connect();

await app.listen( {port: PORT});

function handlePage(ctx:any){
  try{
    const body = (ReactDOMServer as any).renderToString(<App/>);
  ctx.response.body = `<!DOCTYPE html>
 <html lang="en">
   <head>
   <meta charset="UTF-8">
   <link rel="stylesheet" href="/static/style.css">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">   
   <title>DenoCacheQL Demo</title>
   </head>
 <body >
   <div id="root">${body}</div>

 

   <script  src="/static/client.js" defer></script>

 </body>

 </html>`;

 } catch (error) {

   console.error(error);

  }
}

export { client }


