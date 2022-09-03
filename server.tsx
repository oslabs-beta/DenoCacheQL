//testing git settings
//using Oak a middleware framework for Deno
<<<<<<< HEAD
import { Application, Context, Router } from 'https://deno.land/x/oak/mod.ts';
import { Client } from 'https://deno.land/x/postgres@v0.16.1/mod.ts';
import { redis } from './server/redis.ts';
import { applyGraphQL, gql } from 'https://deno.land/x/oak_graphql/mod.ts';
import { typeDefs, resolvers, usePlayground } from './server/graphql.ts';
=======
import {  Application, Router } from 'https://deno.land/x/oak/mod.ts';
//Deno and postgress middleware
import { Client } from "https://deno.land/x/postgres@v0.16.1/mod.ts";
//Redis connection
import { redis } from './server/redis.ts'
//GraphQl definitions and deno middlesware
import { applyGraphQL, gql } from 'https://deno.land/x/oak_graphql/mod.ts';
import { typeDefs, resolvers } from './server/graphql.ts';
//Serving frontend
>>>>>>> dev
import staticFiles from 'https://deno.land/x/static_files@1.1.6/mod.ts';
import ReactDOMServer from 'https://esm.sh/react-dom@18.2.0/server';
import App from './client/App.tsx';
import { React } from './deps.ts';
// import './client/client.tsx';
import { emit } from 'https://deno.land/x/emit@0.8.0/mod.ts';
import data from 'https://deno.land/std@0.141.0/_wasm_crypto/crypto.wasm.mjs';



const app = new Application();
const router = new Router();
const PORT = 3000;

<<<<<<< HEAD
interface ApplyGraphQLOptions<T> {
  context?: (ctx: any) => any;
  path?: string;
  resolvers: ResolversProps;
  Router: Constructable<T>;
  settings?: ISettings;
  typeDefs: any;
  usePlayground?: boolean;
}

const GraphQLService = await applyGraphQL<Router>({
  Router,
  typeDefs,
  resolvers,
  usePlayground,
  context: (ctx) => {},
});

const jsBundle = '/main.js';
//"https://jspm.dev/react@16.13.1" react "https://jspm.dev/react-dom@16.13.1" reactDOM
const js = `import React from "https://esm.sh/react@18.2.0";
 import ReactDOM from "https://esm.sh/react-dom@18.2.0";
 const App = ${App};
 ReactDOM.hydrate(React.createElement(App), document.getElementById('app'));`;

const html = `<html>
    <head>
      <link rel="stylesheet" type="text/css" href="/static/style.css">
      </head>
      <body>
      <div id="app">${ReactDOMServer.renderToString(<App />)}</div>  
      <script type="module" src="${jsBundle}"></script>
    </body>
  </html>`;

router.post('/graphql', (context: Context) => {
  let decoder = new TextDecoder();
  let decodeData = decoder.decode(data);
  context.response.body = decodeData;
  console.log(context.response.body);
});
router
  .get('/', (context: Context) => {
    context.response.type = 'text/html';
    context.response.body = html;
  })
  .get(jsBundle, (context: Context) => {
    context.response.type = 'application/javascript';
    context.response.body = js;
  });

app.use(staticFiles('/client/'));
=======
>>>>>>> dev
app.use(router.routes());
app.use(router.allowedMethods());

<<<<<<< HEAD
app.addEventListener('listen', ({ secure, hostname, port }) => {
  const protocol = secure ? 'https://' : 'http://';
  const url = `${protocol}${hostname ?? 'localhost'}: ${port}`;
  console.log(`Listening on: ${port}`);
});

console.log(await redis.ping());

const databaseURL =
  'postgres://cdfnqalb:5M9CGQwdkSUEnyyRy7xTU5tixqFkVDaH@drona.db.elephantsql.com/cdfnqalb';
const client = new Client(databaseURL);
await client.connect();

await app.listen({ port: PORT });
=======
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

>>>>>>> dev

export { client };
