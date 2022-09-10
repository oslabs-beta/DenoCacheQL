//testing git settings
//using Oak a middleware framework for Deno
import { Application, Context, Router } from 'https://deno.land/x/oak/mod.ts';
import { Client } from 'https://deno.land/x/postgres@v0.16.1/mod.ts';
import { redis } from '../server/redis.ts';
import { applyGraphQL, gql } from "https://deno.land/x/oak_graphql@0.6.4/mod.ts";
import { typeDefs, resolvers, usePlayground } from '../server/schema/graphql.ts';
import staticFiles from 'https://deno.land/x/static_files@1.1.6/mod.ts';
import ReactDOMServer from 'https://esm.sh/react-dom@18.2.0/server';
import App from '../client/App.tsx';
import { React } from '../deps.ts';
import init from "./routes/index.ts";

const app = new Application();
// const router = new Router();
const PORT = 3000;

// const GraphQLService = await applyGraphQL<Router>({
//   Router,
//   typeDefs,
//   resolvers,
//   usePlayground,
//   context: (ctx) => {},
// });

// const jsBundle = '/main.js';
// const js = `import React from "https://esm.sh/react@18.2.0";
//  import ReactDOM from "https://esm.sh/react-dom@18.2.0";
//  const App = ${App};
//  ReactDOM.hydrate(React.createElement(App), document.getElementById('app'));`;

// const html = `<html>
//     <head>
//       <link rel="stylesheet" type="text/css" href="/static/style.css">
//       </head>
//       <body>
//       <div id="app">${ReactDOMServer.renderToString(<App />)}</div>  
//       <script type="module" src="${jsBundle}"></script>
//     </body>
//   </html>`;

// router
//   .get('/', (context: Context) => {
//     context.response.type = 'text/html';
//     context.response.body = html;
//   })
//   .get(jsBundle, (context: Context) => {
//     context.response.type = 'application/javascript';
//     context.response.body = js;
//   });

//redis
console.log(await redis.ping());

//database
const databaseURL =
  'postgres://cdfnqalb:5M9CGQwdkSUEnyyRy7xTU5tixqFkVDaH@drona.db.elephantsql.com/cdfnqalb';
const client = new Client(databaseURL);
await client.connect();

// app.use(GraphQLService.routes(), GraphQLService.allowedMethods());
// app.use(staticFiles('/client/'));

// app.use(router.routes());
// app.use(router.allowedMethods());

//checking server connection
app.addEventListener('listen', ({ secure, hostname, port}) => {
  const protocol = secure ? 'https://' : 'http://';
  const url = `${protocol}${hostname ?? "localhost"}: ${port}`;
  console.log(`Listening on: ${port}`);
});

await app.listen( {port: PORT});

export { client }
