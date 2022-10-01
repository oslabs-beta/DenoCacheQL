import { Router, Context } from "https://deno.land/x/oak@v10.6.0/mod.ts"
import { makeExecutableSchema } from 'https://deno.land/x/graphql_tools@0.0.2/mod.ts';
// import typeDefs from "./schema.ts";
// import resolvers from "./schema.ts";
import { graphql } from 'https://deno.land/x/graphql_deno@v15.0.0/mod.ts';
import ReactDOMServer from 'https://esm.sh/react-dom@18.2.0/server';
import App from '../client/App.tsx';
import { React } from '../deps.ts';
import { connect } from 'https://deno.land/x/redis@v0.26.0/mod.ts';
//import { redis } from '../server/redis.ts';
// import resolvers from "./schema.ts"
// import typeDefs from "./schema.ts"

export default class DenoCache {
  router: Router;
  route: string;
  typeDefs: any;
  resolvers: any;
  schema: any;
  jsBundle: any;
  js: any;
  html: any;
  redis: any

  constructor(args: any) {
   const {
    typeDefs,
    resolvers,
    redisInfo,
   } =args

   this.setSchema(typeDefs, resolvers);
   this.router = new Router();
   this.route = '/graphql';
   this.redisConnect(redisInfo)
  }

  async redisConnect(redisInfo): any {
     this.redis = await connect(redisInfo)
     console.log(await this.redis.ping())
  }

  setSchema(typeDefs, resolvers): any {
    this.schema = makeExecutableSchema({typeDefs: typeDefs.typeDefs, resolvers: resolvers.resolvers || {}})
  }

  routes(): any {
    //serving our graphql IDE

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
      <div id="app"></div>  
      <script type="module" src="${jsBundle}"></script>
       <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-u1OknCvxWvY5kfmNBILK2hRnQC3Pr17a+RTT6rIHI7NnikvbZlHgTPOOmMi466C8" crossorigin="anonymous"></script>
    </body>
  </html>`;





    this.router.get(this.route, (context) => {
      context.response.type = 'text/html';
      context.response.body = html;
  })
  this.router.get(jsBundle, (context) => {
    context.response.type = 'application/javascript';
    context.response.body = js;
          })

    //graphql post request
    this.router.post(this.route, async (ctx) => {
      const { response, request } = ctx;
      const start = Date.now()
      try {
        const { query, variables } = await request.body().value;
        const redisKey = JSON.stringify(query);
        const data = await this.redis.exists(redisKey)
        if (data) {
          const formatThis = await this.redis.get(redisKey);
          response.headers.set('Source', 'cache');
          if (typeof formatThis !== 'string') {
            let format = JSON.stringify(formatThis);
            let formattedResponse = JSON.parse(format)
            response.status = 200;
            response.body = formattedResponse;
            const end = Date.now() - start;
            response.headers.set("X-Response-Time", `${end}ms`)
            return;
          } else {
            let formattedResponse = JSON.parse(formatThis)
            response.status = 200;
            response.body = formattedResponse;
            const end = Date.now() - start;
            response.headers.set("X-Response-Time", `${end}ms`)
            return;
          }
        } else {
          const results= await graphql({
            schema: this.schema,
            source: query,
            variableValues: variables,
            contextValue: {response, request}
          });
          await this.redis.set(redisKey, JSON.stringify(results))
          response.status = results.errors ? 500 : 200;
          response.body = results;
          const end = Date.now() - start;
          response.headers.set("Source", "database")
          response.headers.set("X-Response-Time", `${end}ms`)
          return;
        }
        

      } catch (err) {
        console.error(`${err}`);
        throw err;
      }

    });
    return this.router.routes();
  }

  allowedMethods(): any {
    return this.router.allowedMethods();
  }
}