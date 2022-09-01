//using Oak a middleware framework for Deno
import {  Application, Context, Router } from 'https://deno.land/x/oak/mod.ts';
import { Client } from "https://deno.land/x/postgres@v0.16.1/mod.ts";
import { redis } from './server/redis.ts'
import { applyGraphQL, gql } from 'https://deno.land/x/oak_graphql/mod.ts';
import { typeDefs, resolvers } from './server/graphql.ts';
import staticFiles from 'https://deno.land/x/static_files@1.1.6/mod.ts';
import ReactDOMServer from "https://esm.sh/react-dom@18.2.0/server";
import App from './client/App.tsx';
import {React} from "./deps.ts";
// import './client/client.tsx';
import { emit } from "https://deno.land/x/emit@0.8.0/mod.ts";

const app = new Application();
const PORT = 3000;

const GraphQLService = await applyGraphQL<Router>({
  Router,
  typeDefs,
  resolvers,
  context: (ctx) => {}
  });

const jsBundle = '/main.js';

const js = `import React from "https://jspm.dev/react@16.13.1";
 import ReactDOM from "https://jspm.dev/react-dom@16.13.1";
 const App = ${App};
 ReactDOM.hydrate(React.createElement(App), document.getElementById('app'));`;

const html = `<html>
    <head>
      <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.3/build/pure-min.css">
      <script type="module" src="${jsBundle}"></script>
    </head>
    <body>
      <div id="app">${ReactDOMServer.renderToString(<App />)}</div>  
    </body>
  </html>`;

const router = new Router();
router
  .get('/', (context: Context) => {
    context.response.type = 'text/html';
    context.response.body = html;
  })
  .get(jsBundle, (context: Context) => {
    context.response.type = 'application/javascript';
    context.response.body = js;
  });

   //bundle client-side code
//  const files =  await emit('./client/client.tsx');
//  console.log(files)

// router.get('/static/client.js', (context) =>{
//     context.response.headers.set('Content-Type', 'application/json');
//     context.response.body =files
//   })
// router.get('/', handlePage);
 


// const js = './client/client.tsx';
// router.get('/', () => {
//   const body = 
// })
app.use(staticFiles("/client/"));
app.use(router.routes());
app.use(router.allowedMethods());
app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

app.addEventListener('listen', ({ secure, hostname, port}) => {
    const protocol = secure ? 'https://' : 'http://';
    const url = `${protocol}${hostname ?? "localhost"}: ${port}`;
    console.log(`Listening on: ${port}`);
});

console.log(await redis.ping());
// const jsBundlePath = "/main.js"
const databaseURL = 'postgres://cdfnqalb:5M9CGQwdkSUEnyyRy7xTU5tixqFkVDaH@drona.db.elephantsql.com/cdfnqalb';
const client = new Client(databaseURL)
await client.connect();

await app.listen( {port: PORT});

// function handlePage(ctx:any){
//   try{
//     const body = ReactDOMServer.renderToString(<App/>);
//   ctx.response.body = `<!DOCTYPE html>
//  <html lang="en">
//    <head>
//    <meta charset="UTF-8">
//    <link rel="stylesheet" type="text/css" href="/static/style.css">
//    <meta name="viewport" content="width=device-width, initial-scale=1.0">   
//    <title>DenoCacheQL Demo</title>
//    </head>
//  <body >
//    <div id="root">${body}</div> 
//  </body>

//  </html>`;

//  } catch (error) {

//    console.error(error);

//   }
// }

export { client }


