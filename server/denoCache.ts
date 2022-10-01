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
  jsBundle: any;
  js: any;
  html: any;

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