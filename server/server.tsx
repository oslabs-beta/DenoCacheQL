//using Oak a middleware framework for Deno
import { Application, Context, Router } from 'https://deno.land/x/oak/mod.ts';

import { Client } from 'https://deno.land/x/postgres@v0.16.1/mod.ts';
import { redis } from '../server/redis.ts';

//imports for serving FrontEnd
import staticFiles from 'https://deno.land/x/static_files@1.1.6/mod.ts';
import ReactDOMServer from 'https://esm.sh/react-dom@18.2.0/server';
import App from '../client/App.tsx';
import { React } from '../deps.ts';
import init from "./routes/index.ts";

const app = new Application();

const router = new Router();
const PORT = 3000;


const jsBundle = '/main.js';
const js = `import React from "https://esm.sh/react@18.2.0";
 import ReactDOM from "https://esm.sh/react-dom@18.2.0";
 const App = ${App};
 ReactDOM.hydrate(React.createElement(App), document.getElementById('app'));`;

const html = `<html>
    <head>
      <link rel="stylesheet" type="text/css" href="/static/style.css">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-iYQeCzEYFbKjA/T2uDLTpkwGzCiq6soy8tYaI1GyVh/UjpbCx/TYkiZhlZB6+fzT" crossorigin="anonymous">
      </head>
      <body>
      <div id="app">${ReactDOMServer.renderToString(<App />)}</div>  
      <script type="module" src="${jsBundle}"></script>
      <script type="module" src="${jsBundle}"></script>
       <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-u1OknCvxWvY5kfmNBILK2hRnQC3Pr17a+RTT6rIHI7NnikvbZlHgTPOOmMi466C8" crossorigin="anonymous"></script>
    </body>
  </html>`;

router
  .get('/', (context: Context) => {
    context.response.type = 'text/html';
    context.response.body = html;
  })
  .get(jsBundle, (context: Context) => {
    context.response.type = 'application/javascript';
    context.response.body = js;
  });

//redis
console.log(await redis.ping());

//database
const databaseURL =
  'postgres://cdfnqalb:5M9CGQwdkSUEnyyRy7xTU5tixqFkVDaH@drona.db.elephantsql.com/cdfnqalb';
const client = new Client(databaseURL);
await client.connect();

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;

  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

app.use(staticFiles('/client/'));
app.use(router.routes());
app.use(router.allowedMethods());

//checking server connection
init(app);
app.addEventListener('listen', ({ secure, hostname, port}) => {
  const protocol = secure ? 'https://' : 'http://';
  const url = `${protocol}${hostname ?? "localhost"}: ${port}`;
  console.log(`Listening on: ${port}`);
});

await app.listen( {port: PORT});

export { client }
