import { Router, Context } from "https://deno.land/x/oak@v10.6.0/mod.ts"
import { makeExecutableSchema } from 'https://deno.land/x/graphql_tools@0.0.2/mod.ts';
// import typeDefs from "./schema.ts";
// import resolvers from "./schema.ts";
import { graphql } from 'https://deno.land/x/graphql_deno@v15.0.0/mod.ts';
import ReactDOMServer from 'https://esm.sh/react-dom@18.2.0/server';
import App from '../client/App.tsx';
import { React } from '../deps.ts';
// import resolvers from "./schema.ts"
// import typeDefs from "./schema.ts"





export default class DenoCache {
  router: Router;
  route: string;
  typeDefs: any;
  resolvers: any;
  schema: any;

  constructor(args: any) {
   const {
    typeDefs,
    resolvers,
   } =args

   this.setSchema(typeDefs, resolvers);
   this.router = new Router();
   this.route = '/graphql';
  }
 
  setSchema(typeDefs, resolvers): any {
    this.schema = makeExecutableSchema({typeDefs: typeDefs.typeDefs, resolvers: resolvers.resolvers || {}})
  }

  routes(): any {
    //serving our graphql IDE

    const html = `<html>
<head>
  <link rel="stylesheet" type="text/css" href="/static/style.css">
  </head>
  <body>
  <div id="app">${ReactDOMServer.renderToString(<App />)}</div>  
  <script type="module" src="${jsBundle}"></script>
</body>
</html>`;

    const jsBundle = '/main.js';
    const js = `import React from "https://esm.sh/react@18.2.0";
    import ReactDOM from "https://esm.sh/react-dom@18.2.0";
    const App = ${App};
    ReactDOM.hydrate(React.createElement(App), document.getElementById('app'));`;



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

      try {
        const { query, variables } = await request.body().value;
        const results= await graphql({
          schema: this.schema,
          source: query,
          variableValues: variables,
        });
        response.status = results.errors ? 500 : 200;
        response.body = results;
        return;

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