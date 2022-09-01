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
import './client/client.tsx';


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
 // const [_,clientJS] =  Deno.bundle('./client/client.tsx')

 //router for bundle
 const serverrouter = new Router();
// serverrouter.get('/main.js', (context) =>{
//   context.response.headers.set('Content-Type', 'text/html');
//   context.response.body = `
//   <!DOCTYPE html>
//   <html lang="en">
//   <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <link rel="stylesheet" type="text/css" href="client/static/style.css">
//       <title>DenoCachQL</title>
//   </head>
//   <body >
//       <div id="root">${ReactDOMServer.renderToString(<App />)}
//       </div>
//   </body>
//   </html>`
// })
// const js = './client/client.tsx';
// router.get('/', () => {
//   const body = 
// })
app.use(staticFiles("/client/"));
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
const jsBundlePath = "/main.js"
const databaseURL = 'postgres://cdfnqalb:5M9CGQwdkSUEnyyRy7xTU5tixqFkVDaH@drona.db.elephantsql.com/cdfnqalb';
const client = new Client(databaseURL)
await client.connect();

await app.listen( {port: PORT});

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

export { client }


